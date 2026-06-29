Ext.define('BIA.header.tool.PerformanceTrackerInterface', {
    singleton: true,
    mixins: (Ext.versions.extjs.major > 4 ? ['Ext.mixin.Observable'] : []),
    requestAjaxTypeIcon: '<span class="BIAPerformanceTrackerRequestTypeIcon BIAPerformanceTrackerRequestAjaxTypeIcon" data-qtip="BIA.Ajax Request">A</span>',
    requestStoreTypeIcon: '<span class="BIAPerformanceTrackerRequestTypeIcon BIAPerformanceTrackerRequestStoreTypeIcon" data-qtip="Store Request">S</span>',
    requestTestTypeIcon: '<span class="BIAPerformanceTrackerRequestTypeIcon BIAPerformanceTrackerRequestTestTypeIcon" data-qtip="SQL Injection Test Request">T</span>'
}, function (me) {
    if (Ext.versions.extjs.major > 4) {
        var SuperHL = me.superclass.HasListeners || me.mixins && me.mixins.observable && me.mixins.observable.HasListeners || Ext.mixin.Observable.HasListeners;
        me.hasListeners = new SuperHL();
    }
    else {
        var utilDate = Ext.Date;
        utilDate.diff = function (min, max, unit) {
            var est, diff = +max - min;
            switch (unit) {
                case utilDate.MILLI:
                    return diff;
                case utilDate.SECOND:
                    return Math.floor(diff / 1000);
                case utilDate.MINUTE:
                    return Math.floor(diff / 60000);
                case utilDate.HOUR:
                    return Math.floor(diff / 3600000);
                case utilDate.DAY:
                    return Math.floor(diff / 86400000);
                case 'w':
                    return Math.floor(diff / 604800000);
                case utilDate.MONTH:
                    est = (max.getFullYear() * 12 + (max.getMonth() + 1)) - (min.getFullYear() * 12 + (min.getMonth() + 1));
                    if (utilDate.add(min, unit, est) > max) {
                        return est - 1;
                    }
                    return est;
                case utilDate.YEAR:
                    est = max.getFullYear() - min.getFullYear();
                    if (utilDate.add(min, unit, est) > max) {
                        return est - 1;
                    } else {
                        return est;
                    }
            }
        };
    }

    var GOOD_REQUEST_TIME_THRESHOLD = 1000;
    var CAUTION_REQUEST_TIME_THRESHOLD = 5000;
    var CRITICAL_REQUEST_TIME_THRESHOLD = 10000;
    var RECORD_COUNT_WARNING = 5000;
    var RECORD_COUNT_CAUTION = 10000;
    var RECORD_COUNT_CRITICAL = 20000;
    var MULTI_CALL_TIME_SECS = 2;
    var MULTI_CALL_TIME_TYPE = Ext.Date.SECOND;
    var MAX_PERFORMANCE_RECORDS = 1000;
    var performanceRecordIncriminter = 0;
    var multicallGroupingIndicator = 0;
    var lastViewedPerformanceRecordId = null;
    var RouteURLErrorMsg = 'Could not determine route';
    var NoPerformanceAnalysisMsg = 'Could not determine performance issue analysis because the app has not been updated with the latest BIACore ' +
        'OR it is not using the recommended data calls BIA.Ajax.request (not Ext.Ajax.request).';

    /*  Example of trackingStores
        storeId: {
            component: component,
            store: store,
            storeId: storeId,
            //  Example of performanceHistory see performanceRecord Example
            performanceHistory: [],
            type: [store, ajax]
        }
    */
    var trackingStores = new Object();
    var nonTrackingStoreIDs = new Array();

    /*
        Example of performanceRecord
        {
            performanceRecordId: [id of performanceRecord for current session of PerformanceTracker], (this.initializeStorePerformanceHistory)
            storeId: [id of PerformanceTrackerInterface trackingStore], (this.initializeStorePerformanceHistory)
            type: [store, ajax], (this.initializeStorePerformanceHistory)
            StartRequest: [date], (this.initializeStorePerformanceHistory)
            EndRequest: [date], (this.completeStorePerformanceHistory)
            Start: [date for beginning of BIA WebAPI section], (JSON debugData)
            End: [date for end of BIA WebAPI section], (JSON debugData)
            AppWebAPIStart: [date for beginning of App WebAPI section], (JSON debugData)
            AppWebAPIEnd: [date for end of App WebAPI section], (JSON debugData)
            WebAPIRoute: [string of url route], (JSON debugData)
            CallString: [string of DB proc call], (JSON debugData)
            ExtraParams: [{} of extraParams and queryString params], (this.initializeStorePerformanceHistory)
            TransactionId: [GUID of Log transaction filter], (JSON debugData)
            RecordsReturned: [# of records return from the WebAPI], (this.getCurrentStoreDebugData)
            TotalRecords: [# of records in the entire dataset for this call], (this.getCurrentStoreDebugData)
            ColumnCount: [# of keys in each returned data record], (this.getCurrentDebugData)
            DataSize: [RecordsReturned * ColumnCount], (this.getCurrentDebugData)
            DataMemory: [Ext.JSON.encode(data).length], (
            DBTime: [# in MS], (JSON debugData)
            DataLoadTime: [# in MS], (JSON debugData)
            BIAWebAPITime: [# in MS], (JSON debugData)
            AppWebAPITime: [# in MS], (this.getDebugDataFromResponse)
            RequestTime: [# in MS], (this.completeStorePerformanceHistory)
            BIAWebAPIOnlyTime: [# in MS], (this.buildDebugDataTimeChunks)
            AppWebAPIOnlyTime: [# in MS], (this.buildDebugDataTimeChunks)
            AppWebAPIStartTime: [# in MS], (this.buildDebugDataTimeChunks)
            AppWebAPIEndTime: [# in MS], (this.buildDebugDataTimeChunks)
            WebAPIOnlyTime: [# in MS], (this.buildDebugDataTimeChunks)
            WebAPIStartTime: [# in MS], (this.buildDebugDataTimeChunks)
            WebAPIEndTime: [# in MS], (this.buildDebugDataTimeChunks)
            NetworkOnlyTime: [# im MS], (this.buildDebugDataTimeChunks)
            InitTime: [# in MS], (this.buildDebugDataTimeChunks)
            NetworkEndTime: [# in MS], (this.buildDebugDataTimeChunks)
            Status: [0/1 for bad or good], (this.applyStorePerformanceAnalysis)
            ProblemLevel: [1/2/3/4 for Warning/Caution/Critical/Error], (this.applyStorePerformanceAnalysis)
            ProblemArea: [Object[] {Type: (WebAPI, Database, Dataload, Network, RecordCount, RepetitiveCalls, Error), Level: (1,2,3,4)}], (this.applyStorePerformanceAnalysis)
            AnalysisDescription: [String[] of analysis descriptions] (this.applyStorePerformanceAnalysis),
            DuplicateCallGroup: [int] (generateMultiCallPerformanceAnalysis)
        }
    */
    var performanceRecords = [];
    var badHistoricalPerformanceRecords = [];


    /* Utility functions */
    var getPerformanceRecordId = Ext.bind(function getPerformanceRecordId() {
        return ++performanceRecordIncriminter;
    }, me);

    var getStoreId = Ext.bind(function getStoreId(store, component) {
        return store.getUniqueId && Ext.isFunction(store.getUniqueId) ? store.getUniqueId() : component.getId();
    }, me);

    var addPerformanceRecord = Ext.bind(function addPerformanceRecord(trackingStore, performanceHistoryRecord) {
        if (performanceRecords.unshift(performanceHistoryRecord) > MAX_PERFORMANCE_RECORDS) {
            var removedPerformanceRecord = performanceRecords.splice(-1, 1);
            if (removedPerformanceRecord.Status == 0) {
                if (badHistoricalPerformanceRecords.unshift(removedPerformanceRecord) > MAX_PERFORMANCE_RECORDS) badHistoricalPerformanceRecords.splice(-1, 1);
            }
        }

        this.fireEvent('performanceupdated', Ext.clone(performanceRecords));
    }, me);

    var performanceHistoryIndex = Ext.bind(function performanceHistoryIndex(store) {
        if (store.proxy && store.proxy.reader && store.proxy.reader.rawData && store.proxy.reader.rawData.debug) return store.proxy.reader.rawData.debug;
        else return null;
    }, me);

    var getDebugDataFromResponse = Ext.bind(function getDebugDataFromResponse(response) {
        var debugData = new Object();

        var headers = response.getAllResponseHeaders && Ext.isFunction(response.getAllResponseHeaders) ? response.getAllResponseHeaders() : null;
        if (headers && headers.debugdatarequestendtime != null && headers.debugdatarequeststarttime != null) {
            debugData.AppWebAPIStart = new Date(headers.debugdatarequeststarttime.toString().replace(' ', 'T') + 'Z');
            debugData.AppWebAPIEnd = new Date(headers.debugdatarequestendtime.toString().replace(' ', 'T') + 'Z');
            debugData.AppWebAPITime = Ext.Date.diff(debugData.AppWebAPIStart, debugData.AppWebAPIEnd, Ext.Date.MILLI);
        }

        var responseBody = '{}';
        try {
            if (response.responseText) responseBody = Ext.JSON.decode(response.responseText, true)
            else if (response.responseJson) responseBody = response.responseJson
            else responseBody = {};
        }
        catch (ex) {
            //Do Nothing! 
        }
        if (responseBody && responseBody.debug) {
            debugData = Ext.apply(debugData, responseBody.debug);
            debugData.End = new Date(debugData.End);
            debugData.Start = new Date(debugData.Start);
        }

        return debugData;
    }, this);

    var buildDebugDataTimeChunks = Ext.bind(function buildDebugDataTimeChunks(debugData) {
        debugData.BIAWebAPIOnlyTime = (debugData.BIAWebAPITime - debugData.DBTime - debugData.DataLoadTime) || 0;
        debugData.AppWebAPIOnlyTime = (debugData.AppWebAPITime - debugData.BIAWebAPITime) || 0;
        debugData.AppWebAPIStartTime = (Ext.Date.diff(debugData.AppWebAPIStart, debugData.Start, Ext.Date.MILLI)) || 0;
        debugData.AppWebAPIEndTime = (Ext.Date.diff(debugData.End, debugData.AppWebAPIEnd, Ext.Date.MILLI)) || 0;
        debugData.WebAPIOnlyTime = (debugData.AppWebAPITime - debugData.DBTime - debugData.DataLoadTime) || 0;
        debugData.WebAPIStartTime = (debugData.AppWebAPIStartTime + calculateWholeMillisecondPercent(debugData.BIAWebAPIOnlyTime, 1)) || 0;
        debugData.WebAPIEndTime = (debugData.AppWebAPIEndTime + (debugData.BIAWebAPIOnlyTime - calculateWholeMillisecondPercent(debugData.BIAWebAPIOnlyTime, 1))) || 0;
        debugData.NetworkOnlyTime = (debugData.RequestTime - debugData.WebAPIOnlyTime - debugData.DataLoadTime - debugData.DBTime) || 0;
        debugData.InitTime = (Ext.Date.diff(debugData.AppWebAPIStart, debugData.StartRequest, Ext.Date.MILLI)) || 0;
        debugData.NetworkEndTime = (Ext.Date.diff(debugData.AppWebAPIEnd, debugData.EndRequest, Ext.Date.MILLI)) || 0;
        if (debugData.InitTime < 0) {
            debugData.NetworkEndTime += (debugData.InitTime * -1) - 1;
            debugData.InitTime = 1;
        }

        var combinedRequestTime = debugData.NetworkOnlyTime + debugData.DBTime + debugData.DataLoadTime + debugData.WebAPIOnlyTime;
        if (combinedRequestTime != debugData.RequestTime) {
            if (combinedRequestTime > debugData.RequestTime) {
                var dif = combinedRequestTime - debugData.RequestTime;
                if (dif > debugData.NetworkOnlyTime) {
                    dif -= debugData.NetworkOnlyTime - 2;
                    debugData.NetworkOnlyTime = 2;
                }
                else {
                    debugData.NetworkOnlyTime = debugData.NetworkOnlyTime - dif;
                }
            }
            else if (combinedRequestTime < debugData.RequestTime) {
                debugData.NetworkOnlyTime += (debugData.RequestTime - combinedRequestTime);
            }
        }

        var combinedNetworkTime = debugData.InitTime + debugData.NetworkEndTime;
        if (combinedNetworkTime != debugData.NetworkOnlyTime) {
            var ndif = debugData.NetworkOnlyTime - combinedNetworkTime;
            if (ndif < 0) {
                ndif = Math.abs(ndif);
                if (ndif > debugData.InitTime) {
                    ndif = ndif - (debugData.InitTime - 1);
                    debugData.InitTime = 1;
                }
                else {
                    debugData.InitTime = debugData.InitTime - ndif;
                    ndif = 0;
                }

                if (ndif > 0) {
                    debugData.NetworkEndTime = debugData.NetworkEndTime - ndif;
                }
            }
            else {
                debugData.NetworkEndTime += ndif;
            }
        }

    }, me);

    var calculateWholeMillisecondPercent = Ext.bind(function calculateWholeMillisecondPercent(milli, percent) {
        var percentDecimal = percent / 100;
        var percentValue = new Number(milli * percentDecimal);
        return parseInt(percentValue.toFixed());

    }, me);

    var updateDebugDataStatusProblemLevel = Ext.bind(function updateDebugDataStatusProblemLevel(debugData, status, level) {
        if (status != null && (debugData.Status == null || debugData.Status < status)) debugData.Status = status;
        if (level != null && (debugData.ProblemLevel == null || debugData.ProblemLevel < level)) debugData.ProblemLevel = level;
    }, me);

    var generateTimePerformanceAnalysis = Ext.bind(function generateTimePerformanceAnalysis(debugData) {
        if (debugData.RequestTime < GOOD_REQUEST_TIME_THRESHOLD) updateDebugDataStatusProblemLevel(debugData, 0, 0);
        else {
            updateDebugDataStatusProblemLevel(debugData, 1);
            if (debugData.RequestTime < CAUTION_REQUEST_TIME_THRESHOLD) updateDebugDataStatusProblemLevel(debugData, null, 1);
            else if (debugData.RequestTime < CRITICAL_REQUEST_TIME_THRESHOLD) updateDebugDataStatusProblemLevel(debugData, null, 2);
            else updateDebugDataStatusProblemLevel(debugData, null, 3);

            var problemAreaDiscovered = false;

            problemAreaDiscovered = analyzeRequestPartsTimePercent(debugData, 50);

            if (!problemAreaDiscovered) {
                //Handle performance issues that are from multiple areas but not over the 50% mark or the Good threshold
                analyzeRequestPartsTimePercent(debugData, 20);
            }

            if (debugData.AnalysisDescription.length == 0 && debugData.TransactionId == null) {
                debugData.AnalysisDescription.push(NoPerformanceAnalysisMsg);
            }
        }

    }, me);

    var analyzeRequestPartsTimePercent = Ext.bind(function analyzeRequestPartsTimePercent(debugData, percent) {
        var databaseAnalysisDescription = 'Database: The database query ran slower than desired. Suggest a performance tuning on the proc and database tables.';
        var dataloadAnalysisDescription = 'Dataload: The database query return took longer than desired to be converted from the SQL return to the WebAPI return object. Check the number of records and/or size of data being returned and attempt to reduce the amount of data returned.';
        var biaWebAPIAnalysisDescription = 'BIAWebAPI: BIACore\'s processing of the database request took longer than expected. If this problem persists, inform Matthew Erdmann or Garrett Hogan.';
        var appWebAPIAnalysisDescription = 'AppWebAPI: The WebAPI code for this route has taken longer than expected to process. Look to trim down the amount of loop logic inside the WebAPI Route functions or in the param filter file.';
        var networkAnalysisDescription = 'Network: The network took longer than desired to consume the data return from the WebAPI. This might be an issue with the User\'s internet connection or a symptom of a BIA Server issue. Additional possible cause could be a delay due to browser\'s ability to handle simultaneous AJAX calls.';
        var problemAreaDiscovered = false;

        if (debugData.DBTime >= calculateWholeMillisecondPercent(debugData.RequestTime, percent) ||
            debugData.DBTime >= GOOD_REQUEST_TIME_THRESHOLD) {
            debugData.ProblemArea.push({ Type: 'Database', Level: 3 });
            debugData.AnalysisDescription.push(databaseAnalysisDescription);
            problemAreaDiscovered = true;
        }

        if (debugData.DataLoadTime >= calculateWholeMillisecondPercent(debugData.RequestTime, percent) ||
            debugData.DataLoadTime >= GOOD_REQUEST_TIME_THRESHOLD) {
            debugData.ProblemArea.push({ Type: 'Dataload', Level: 3 });
            debugData.AnalysisDescription.push(dataloadAnalysisDescription);
            problemAreaDiscovered = true;
        }

        if (debugData.WebAPIOnlyTime >= calculateWholeMillisecondPercent(debugData.RequestTime, percent) ||
            debugData.WebAPIOnlyTime >= GOOD_REQUEST_TIME_THRESHOLD) {
            var webAPIProblemDiscovered = false;
            if (debugData.BIAWebAPIOnlyTime >= calculateWholeMillisecondPercent(debugData.RequestTime, percent) ||
                debugData.BIAWebAPIOnlyTime >= GOOD_REQUEST_TIME_THRESHOLD) {
                debugData.AnalysisDescription.push(biaWebAPIAnalysisDescription);
                webAPIProblemDiscovered = true;
            }

            if (debugData.AppWebAPIOnlyTime >= calculateWholeMillisecondPercent(debugData.RequestTime, percent) ||
                debugData.AppWebAPIOnlyTime >= GOOD_REQUEST_TIME_THRESHOLD) {
                debugData.AnalysisDescription.push(appWebAPIAnalysisDescription);
                webAPIProblemDiscovered = true;
            }

            if (webAPIProblemDiscovered) debugData.ProblemArea.push({ Type: 'WebAPI', Level: 3 });
            problemAreaDiscovered = true;
        }

        if (debugData.NetworkOnlyTime >= calculateWholeMillisecondPercent(debugData.RequestTime, percent) ||
            debugData.NetworkOnlyTime >= GOOD_REQUEST_TIME_THRESHOLD) {
            debugData.ProblemArea.push({ Type: 'Network', Level: 3 });
            debugData.AnalysisDescription.push(networkAnalysisDescription);
            problemAreaDiscovered = true;
        }

        return problemAreaDiscovered;
    }, me);

    var generateRecordCountAnalysis = Ext.bind(function generateRecordCountAnalysis(debugData) {
        if (debugData.DataSize >= RECORD_COUNT_WARNING && debugData.DataSize < RECORD_COUNT_CAUTION) {
            updateDebugDataStatusProblemLevel(debugData, 1, 1);
            debugData.ProblemArea.push({ Type: 'RecordCount', Level: 1 });
            debugData.AnalysisDescription.push('DataSize: Returned record count is a concern. If it gets bigger it could cause issues. WebAPI/Ajax calls should be small returns to optimize performance.');
        }
        else if (debugData.DataSize >= RECORD_COUNT_CAUTION && debugData.DataSize < RECORD_COUNT_CRITICAL) {
            updateDebugDataStatusProblemLevel(debugData, 1, 2);
            debugData.ProblemArea.push({ Type: 'RecordCount', Level: 2 });
            debugData.AnalysisDescription.push('DataSize: Returned record count is getting to the point where it could cause performance issues. Look to use paging to reduce the returned record count. WebAPI/Ajax calls should be small returns to optimize performance.');
        }
        else if (debugData.DataSize >= RECORD_COUNT_CRITICAL) {
            updateDebugDataStatusProblemLevel(debugData, 1, 3);
            debugData.ProblemArea.push({ Type: 'RecordCount', Level: 3 });
            debugData.AnalysisDescription.push('DataSize: Returned record count is too large for BIA\'s AJAX application environment. Need to implement a change to reduce the returned record count. WebAPI/Ajax calls should be small returns to optimize performance.');
        }
        else updateDebugDataStatusProblemLevel(debugData, 0, 0);
    }, me);

    var generateMultiCallPerformanceAnalysis = Ext.bind(function generateMultiCallPerformanceAnalysis(debugData) {
        var performanceHistoryFilter = function (item) {
            return (item.storeId != debugData.storeId || (item.storeId == debugData.storeId && item.performanceRecordId != debugData.performanceRecordId))
                && item.WebAPIRoute == debugData.WebAPIRoute
                && Ext.JSON.encode(item.ExtraParams) == Ext.JSON.encode(debugData.ExtraParams)
                && Ext.Date.diff(item.StartRequest, debugData.StartRequest, MULTI_CALL_TIME_TYPE) <= MULTI_CALL_TIME_SECS;
        };

        var trackingStore = trackingStores[debugData.storeId];
        var matchingPerformanceRecords = new Array();
        if (trackingStore) {
            matchingPerformanceRecords = trackingStore.performanceHistory.filter(performanceHistoryFilter);
        }

        var trackingStoreIDs = Ext.Object.getKeys(trackingStores);
        for (i = 0; i < trackingStoreIDs.length; i++) {
            if (trackingStores[trackingStoreIDs[i]].storeId != debugData.storeId) {
                var matchingStorePerformanceRecords = new Array();
                matchingStorePerformanceRecords = trackingStores[trackingStoreIDs[i]].performanceHistory.filter(performanceHistoryFilter);
                if (matchingStorePerformanceRecords.length > 0) {
                    matchingPerformanceRecords = Ext.Array.merge(matchingPerformanceRecords, matchingStorePerformanceRecords);
                }
            }
        }

        if (matchingPerformanceRecords.length > 0) {
            var multicallGroupId = null;
            if (matchingPerformanceRecords[0].DuplicateCallGroup != null) multicallGroupId = matchingPerformanceRecords[0].DuplicateCallGroup;
            else multicallGroupId = multicallGroupingIndicator++;

            var addAnalysisData = function (item, id) {
                item.DuplicateCallGroup = id;
                if (item.ProblemArea && Ext.isArray(item.ProblemArea) && Ext.Array.findBy(item.ProblemArea, function (pa) { return pa.Type == 'MultiCall'; }) == null) {
                    updateDebugDataStatusProblemLevel(item, 1, 3);
                    item.ProblemArea.push({ Type: 'MultiCall', Level: 3 });
                    item.AnalysisDescription.push('MultiCall: This call is being made in rapid succession within the application. Check for code that would cause successive calls to the exact same WebAPI route and params within ' + MULTI_CALL_TIME_SECS + ' seconds.');
                }
            };

            addAnalysisData(debugData, multicallGroupId);
            for (i = 0; i < matchingPerformanceRecords.length; i++) addAnalysisData(matchingPerformanceRecords[i], multicallGroupId);
        }
    }, me);

    var generateCallFormatAnalysis = Ext.bind(function generateCallFormatAnalysis(debugData) {
        if (debugData.WebAPIRoute == RouteURLErrorMsg) {
            updateDebugDataStatusProblemLevel(debugData, 1, 4);
            debugData.ProblemArea.push({ Type: 'NoRoute', Level: 4 });
            debugData.AnalysisDescription.push('NoRoute: Could not determine the url for the call. This could be due to a mis-configuration of the call or using older versions of Ext and/or BIACore.');
        }
    }, me);

    /* Store Performance Tracking Functions */
    var buildTrackingStoreObject = Ext.bind(function buildTrackingStoreObject(storeId, store, component) {
        trackingStores[storeId] = {
            component: component,
            store: store,
            storeId: storeId,
            type: 'store',
            performanceHistory: []
        }
    }, me);

    var startStoreProcessTracking = function startStoreProcessTracking(storeId, store, operation, eOpts) {
        if (Ext.versions.extjs.major <= 4) {
            eOpts = operation;
            operation = store;
            store = storeId;
            storeId = this.args && this.args.length > 0 ? this.args[0] : null;
        }
        var performanceHistoryIndex = initializeStorePerformanceHistory(storeId, operation) - 1;
        if (performanceHistoryIndex > -1) {
            if (Ext.versions.extjs.major > 4) store.on('load', endStoreProcessTracking, this, { args: [storeId, performanceHistoryIndex], single: true, priority: 999 });
            else store.on('load', endStoreProcessTracking, { scope: this.scope, args: [storeId, performanceHistoryIndex] }, { single: true, priority: 999 });
        }
    };

    var endStoreProcessTracking = function endStoreProcessTracking(storeId, performanceHistoryIndex, store, records, successful, operation, eOpts) {
        //This is to do the same thing from Ext5 where you can pass in args to get prepended
        if (Ext.versions.extjs.major <= 4) {
            eOpts = successful;
            operation = records;
            successful = store;
            records = performanceHistoryIndex;
            store = storeId;
            performanceHistoryIndex = this.args && this.args.length > 1 ? this.args[1] : null;
            storeId = this.args && this.args.length > 0 ? this.args[0] : null;
        }
        if (storeId != null && performanceHistoryIndex != null) completeStorePerformanceHistory(storeId, performanceHistoryIndex, store, operation, successful);
    };

    var addStoreListeners = Ext.bind(function addStoreListeners(storeId) {
        var trackingStore = trackingStores[storeId];
        if (trackingStore) {
            if (Ext.versions.extjs.major > 4) trackingStore.store.on('beforeLoad', startStoreProcessTracking, this, { args: [storeId], priority: -999 });
            else trackingStore.store.on('beforeLoad', startStoreProcessTracking, { scope: this, args: [storeId] }, { priority: -999 });
        }
    }, me);

    var initializeStorePerformanceHistory = Ext.bind(function initializeStorePerformanceHistory(storeId, operation) {
        var trackingStore = trackingStores[storeId];
        if (trackingStore) {
            return trackingStore.performanceHistory.push({
                performanceRecordId: getPerformanceRecordId(),
                storeId: storeId,
                type: 'store',
                StartRequest: new Date(),
                EndRequest: null,
                RequestTime: null,
                RecordCount: null,
                Status: null,
                ProblemLevel: null,
                ProblemArea: new Array(),
                AnalysisDescription: new Array(),
                ExtraParams: Ext.clone(Ext.apply({}, (operation.getProxy ? operation.getProxy().extraParams : {}), (operation.getParams ? operation.getParams() : {})))
            });
        }
        return 0;
    }, me);

    var getCurrentStoreDebugData = Ext.bind(function getCurrentStoreDebugData(store, operation) {
        var debugData = new Object();
        var response = operation.getResponse && Ext.isFunction(operation.getResponse)
            ? (operation.getResponse() == null && !Ext.isEmpty(operation.error) && !Ext.isEmpty(operation.error.response)
                ? operation.error.response
                : operation.getResponse()
                )
            : (operation.getAllResponseHeaders && Ext.isFunction(operation.getAllResponseHeaders)
                ? operation
                : null
                );
        if (!Ext.isEmpty(response)) {
            debugData = getDebugDataFromResponse(response);

            var responseText = response.responseText;
            if (Ext.getVersion().major <= 5) {
                if (!Ext.isEmpty(responseText) && ['[', '{'].indexOf(responseText.trim()[0]) == 0) responseText = Ext.JSON.decode(responseText);
                else responseText = { data: '' };
            }
            else {
                if (!Ext.isEmpty(responseText) && ['[', '{'].indexOf(responseText.trim()[0]) == 0) responseText = Ext.JSON.decode(responseText);
                else if (response.responseJson) responseText = response.responseJson
                else responseText = { data: '' };
            }

            debugData.DataMemory = responseText.length;
        }

        debugData.RecordsReturned = store.count ? store.count() : (store.data ? store.data.length : 0);
        debugData.TotalRecords = store.totalCount != null ? store.totalCount : debugData.RecordsReturned;
        debugData.ColumnCount = store.data != null && store.data.items.length > 0 ? Ext.Object.getKeys(store.data.items[0].data).length - 1 : 1;
        debugData.DataSize = debugData.RecordsReturned * debugData.ColumnCount;

        return debugData;
    }, me);

    var completeStorePerformanceHistory = Ext.bind(function completeStorePerformanceHistory(storeId, performanceHistoryIndex, store, operation, successful) {
        var trackingStore = trackingStores[storeId];
        if (trackingStore) {
            var performanceHistoryRecord = trackingStore.performanceHistory[performanceHistoryIndex];
            if (performanceHistoryRecord) {
                performanceHistoryRecord.EndRequest = new Date();
                performanceHistoryRecord.RequestTime = Ext.Date.diff(performanceHistoryRecord.StartRequest, performanceHistoryRecord.EndRequest, Ext.Date.MILLI);
                var debugData = getCurrentStoreDebugData(store, operation);
                if (debugData) {
                    debugData = Ext.apply(performanceHistoryRecord, debugData);
                    buildDebugDataTimeChunks(debugData);
                    applyStorePerformanceAnalysis(debugData, successful, operation, store);
                    //Add operation.request._jsonData or similar object that includes the sort/start/limit properties to the trackingStore!!
                    trackingStore.store.FullParams = operation && Ext.isObject(operation.request) && !Ext.isEmpty(operation.request._jsonData) ? operation.request._jsonData : trackingStore.store.extraParams;
                    performanceHistoryRecord = debugData;

                    if (BIACore.Header.PerformanceTracker.CheckSQLInjectionToggle() && successful) {
                        buildSQLInjectionTests(trackingStore.store);
                    }
                }

                addPerformanceRecord(trackingStore, performanceHistoryRecord);
            }
        }
    }, me);

    var applyStorePerformanceAnalysis = Ext.bind(function applyStorePerformanceAnalysis(debugData, successful, operation, store) {
        if (debugData.WebAPIRoute == null) {
            if (Ext.versions.major > 4) debugData.WebAPIRoute = operation && operation.request && operation.request._url ? operation.request._url.split('?')[0] : RouteURLErrorMsg;
            else debugData.WebAPIRoute = store && store.proxy && store.proxy.api && store.proxy.api.read ? store.proxy.api.read : RouteURLErrorMsg

            debugData.WebAPIRoute = debugData.WebAPIRoute.replace(/(?:https*:\/\/)*bia.*\.com/g, '');
        }
        if (debugData.ExtraParams == null) {
            if (Ext.versions.major > 4) debugData.ExtraParams = Ext.clone(operation && opeartion.request && Ext.isObject(opeartion.request._params) ? operation.request._params : {});
            else debugData.ExtraParams = Ext.clone(store && store.proxy && store.proxy.extraParams ? store.proxy.extraParams : {});
        }
        if (debugData.CallString == null) debugData.CallString = 'N/A';
        generateTimePerformanceAnalysis(debugData);
        generateRecordCountAnalysis(debugData);
        generateMultiCallPerformanceAnalysis(debugData);
        generateCallFormatAnalysis(debugData);
        generateStoreErrorAnalysis(debugData, successful, operation);
        if (debugData.Status == 0) {
            if (debugData.TransactionId != null) debugData.AnalysisDescription.push('No problem areas found with this request');
            else debugData.AnalysisDescription.push(NoPerformanceAnalysisMsg);
        }
    }, me);

    var generateStoreErrorAnalysis = Ext.bind(function generateStoreErrorAnalysis(debugData, successful, operation) {
        if (!successful && operation.error && [0, 511, 401, 403].indexOf(operation.error.status) == -1) { // !=511 to prevent logged out ajax calls from reporting.. (M. Erdmann)
            updateDebugDataStatusProblemLevel(debugData, 1, 4);

            var errorResponse = new Object();
            try {
                if (Ext.getVersion().major == 5) errorResponse = Ext.JSON.decode(operation.error.response.responseText, true)
                else errorResponse = operation.error.response.responseJson;
            }
            catch (ex) {
                //Do Nothing! 
            }
            errorResponse = typeof errorResponse != 'undefined' && errorResponse != null && Ext.isObject(errorResponse) ? errorResponse : {};
            debugData.ErrorResponse = errorResponse;
            debugData.ProblemArea = [{ Type: 'Error', Level: 3, StackTrace: errorResponse.StackTrace }];
            debugData.AnalysisDescription = ['Error ' + operation.error.status.toString() + ' ' + operation.error.statusText + ': ' + (!Ext.isEmpty(errorResponse.BIACode) ? 'BIA Error Code = (' + errorResponse.BIACode + ') ' : '') + (!Ext.isEmpty(errorResponse.ExceptionType) ? 'Exception Type = ' + errorResponse.ExceptionType : '') + (!Ext.isEmpty(errorResponse.ExceptionMessage) ? ' ' + errorResponse.ExceptionMessage : '')];            
        }
    }, me);

    /* Ajax PerformanceTracking Functions */
    var buildTrackingAjaxObject = Ext.bind(function buildTrackingAjaxObject(ajaxId, request) {
        trackingStores[ajaxId] = {
            component: null,
            store: request,
            storeId: ajaxId,
            type: request.BIASQLInjectionTest ? 'test' : 'ajax',
            performanceHistory: []
        }
    }, me);

    var initializeAjaxPerformanceHistory = Ext.bind(function initializeAjaxPerformanceHistory(ajaxId, request) {
        var trackingStore = trackingStores[ajaxId];
        if (trackingStore) {
            return trackingStore.performanceHistory.push({
                performanceRecordId: getPerformanceRecordId(),
                storeId: ajaxId,
                type: request.BIASQLInjectionTest ? 'test' : 'ajax',
                StartRequest: new Date(),
                EndRequest: null,
                RequestTime: null,
                RecordCount: null,
                Status: null,
                ProblemLevel: null,
                ProblemArea: new Array(),
                AnalysisDescription: new Array(),
                ExtraParams: Ext.clone(Ext.apply({}, (request.params || {}), (request.jsonData || {}))),
                BIASQLInjectionTest: request.BIASQLInjectionTest
            });
        }
        return 0;
    }, me);

    var getCurrentAjaxDebugData = Ext.bind(function getCurrentAjaxDebugData(response) {
        var debugData = getDebugDataFromResponse(response);

        debugData.RecordsReturned = response.data != null ? response.data.length : 0;
        debugData.TotalRecords = response.total != null ? response.total : debugData.RecordsReturned;
        debugData.ColumnCount = response.metaData != null && response.metaData.fields != null && Ext.isArray(response.metaData.fields) ? response.metaData.fields.length
            : (response.data != null && Ext.isArray(response.data) && response.data.length > 0 ? Ext.Object.getKeys(response.data[0]).length : 1);
        debugData.DataSize = debugData.RecordsReturned * debugData.ColumnCount;
        debugData.DataMemory = Ext.JSON.encode(response.data || {}).length;

        return debugData;
    }, this);

    var completeAjaxPerformanceHistory = Ext.bind(function completeAjaxPerformanceHistory(ajaxId, performanceHistoryIndex, response, successful) {
        var trackingStore = trackingStores[ajaxId];
        if (trackingStore) {
            var performanceHistoryRecord = trackingStore.performanceHistory[performanceHistoryIndex];
            if (performanceHistoryRecord) {
                performanceHistoryRecord.EndRequest = new Date();
                performanceHistoryRecord.RequestTime = Ext.Date.diff(performanceHistoryRecord.StartRequest, performanceHistoryRecord.EndRequest, Ext.Date.MILLI);
                var debugData = getCurrentAjaxDebugData(response);
                if (debugData) {
                    debugData = Ext.apply(performanceHistoryRecord, debugData);
                    buildDebugDataTimeChunks(debugData);
                    applyAjaxPerformanceAnalysis(debugData, successful, response);
                    performanceHistoryRecord = debugData;
                    //Add operation.request._jsonData or similar object that includes the sort/start/limit properties to the trackingStore!!
                    trackingStore.store.FullParams = trackingStore.store.jsonData;

                    if (BIACore.Header.PerformanceTracker.CheckSQLInjectionToggle() && successful && performanceHistoryRecord.type != 'test') {
                        buildSQLInjectionTests(trackingStore.store);
                    }
                }

                addPerformanceRecord(trackingStore, performanceHistoryRecord);
            }
        }
    }, me);

    var applyAjaxPerformanceAnalysis = Ext.bind(function applyAjaxPerformanceAnalysis(debugData, successful, response) {
        if (debugData.WebAPIRoute == null) {
            debugData.WebAPIRoute = response && response.request && response.request.options && response.request.options.url ? response.request.options.url.split('?')[0] : RouteURLErrorMsg;
            //if (Ext.versions.major > 4) debugData.WebAPIRoute = response && response.request && response.request.options && response.request.options.url ? response.request.options.url.split('?')[0] : 'Could Not Determine Route';
            //else debugData.WebAPIRoute = store && store.proxy && store.proxy.api && store.proxy.api.read ? store.proxy.api.read : 'Could not determine route'

            debugData.WebAPIRoute = debugData.WebAPIRoute.replace(/(?:https*:\/\/)*bia.*\.com/g, '');
        }
        if (debugData.ExtraParams == null) {
            debugData.ExtraParams = resposne && response.request && response.request.options ? Ext.clone(Ext.apply(response.request.options.params || {}, response.request.options.jsonData || {})) : {};
            //if (Ext.versions.major > 4) debugData.ExtraParams = Ext.clone(operation && opeartion.request && Ext.isObject(opeartion.request._params) ? operation.request._params : {});
            //else debugData.ExtraParams = Ext.clone(store && store.proxy && store.proxy.extraParams ? store.proxy.extraParams : {});
        }
        if (debugData.CallString == null) debugData.CallString = 'N/A';

        if (debugData.type == 'test') {
            generateSQLInjectionTestAnalysis(debugData, successful, response);
        } else {
            generateTimePerformanceAnalysis(debugData);
            generateRecordCountAnalysis(debugData);
            generateMultiCallPerformanceAnalysis(debugData);
            generateCallFormatAnalysis(debugData);
            generateAjaxErrorAnalysis(debugData, successful, response);
        }

        if (debugData.Status == 0 && debugData.AnalysisDescription.length == 0) {
            if (debugData.TransactionId != null) debugData.AnalysisDescription.push('No problem areas found with this request');
            else debugData.AnalysisDescription.push('Could not determine performance issue anlysis because the app has not been updated with the latest BIACore.');
        }
    }, me);

    var generateAjaxErrorAnalysis = Ext.bind(function generateAjaxErrorAnalysis(debugData, successful, response) {
        if (!successful && [0, 511, 401, 403].indexOf(response.status) == -1) { // !=511 to prevent logged out ajax calls from reporting.. (M. Erdmann)
            updateDebugDataStatusProblemLevel(debugData, 1, 4);

            var errorResponse = {
                BIACode: '',
                StackTrace: '',
                Message: '',
                MessageDetail: ''
            };
            try {
                errorResponse = Ext.apply(errorResponse, Ext.JSON.decode(response.responseText, true));
            }
            catch (ex) {
                //Do Nothing! 
            }
            errorResponse = typeof errorResponse != 'undefined' && errorResponse != null && Ext.isObject(errorResponse) ? errorResponse : {};
            debugData.ErrorResponse = errorResponse;
            debugData.ProblemArea = [{ Type: 'Error', Level: 3, StackTrace: errorResponse.StackTrace }];
            debugData.AnalysisDescription = ['Error ' + response.status.toString() + ' ' + response.statusText + ': ' + (!Ext.isEmpty(errorResponse.BIACode) ? 'BIA Error Code = (' + errorResponse.BIACode + ') ' : '') + (!Ext.isEmpty(errorResponse.Message) ? 'Exception Type = ' + errorResponse.Message : '') + (!Ext.isEmpty(errorResponse.MessageDetail) ? ' ' + errorResponse.MessageDetail : '')];
        }
    }, me);

    var generateSQLInjectionTestAnalysis = Ext.bind(function generateSQLInjectionTestAnalysis(debugData, successful, response) {
        if (!successful && [0, 511, 401, 403].indexOf(response.status) == -1) { // !=511 to prevent logged out ajax calls from reporting.. (M. Erdmann)
            var errorResponse = {
                StackTrace: '',
                Message: '',
                MessageDetail: ''
            };
            try {
                errorResponse = Ext.apply(errorResponse, Ext.JSON.decode(response.responseText, true));
            }
            catch (ex) {
                //Do Nothing! 
            }

            errorResponse = typeof errorResponse != 'undefined' && errorResponse != null && Ext.isObject(errorResponse) ? errorResponse : {};
            debugData.ErrorResponse = errorResponse;
            if (errorResponse.ExceptionType == 'System.Data.SqlClient.SqlException') {
                updateDebugDataStatusProblemLevel(debugData, 1, 4);

                debugData.ProblemArea = [{ Type: 'Error', Level: 3, StackTrace: errorResponse.StackTrace }];
                debugData.AnalysisDescription = ['Possible SQL Injection Vulnerability Detected.'
                    + ' Invalid parameters should always be handled at the WebAPI level so they never cause SQL exceptions.'
                    + '<br> Error: ' + errorResponse.ExceptionMessage];
            } else if (errorResponse.ExceptionType == 'System.NullReferenceException' || errorResponse.ExceptionType == 'System.InvalidCastException'
                || errorResponse.ExceptionType == 'Microsoft.CSharp.RuntimeBinder.RuntimeBinderException') {
                updateDebugDataStatusProblemLevel(debugData, 1, 2);

                debugData.AnalysisDescription = ['WARNING: CAST and NULL pointer errors will not be flagged as successful SQL Injection attacks,'
                    + ' however they should be handled by the developer either by returning a controlled 500 response or nulling the parameter before'
                    + ' sending to the stored procedure. See AskMilton document WebAPI Invalid Parameter Handling.<br>Error: ' + errorResponse.ExceptionMessage];
            } else {
                updateDebugDataStatusProblemLevel(debugData, 0, 0);

                debugData.AnalysisDescription = ['The call returned an error but did not cause a SQL error. It is most likely not vulnerable to SQL injection.<br>Error: ' + errorResponse.ExceptionMessage];
            }
        } else {
            updateDebugDataStatusProblemLevel(debugData, 0, 0);
        }
    }, me);

    var buildSQLInjectionTests = Ext.bind(function buildSQLInjectionTests(request) {
        var injectionTests = [
            { desc: 'Escape Attack', payload: '\'' },
            { desc: 'Escape Attack', payload: '"' },
            { desc: 'Escape Attack', payload: ';' },
            { desc: 'Escape Attack', payload: ')' },
            { desc: 'Escape Attack', payload: ']' }
        ];

        var jsonData = request.FullParams;

        var url = null;
        if (request.options && request.options.url)
            url = response.request.options.url.split('?')[0];
        else if (request.url)
            url = request.url.split('?')[0];
        else if (request._url)
            url = request._url.split('?')[0];
        else if (request.proxy && request.proxy.api && request.proxy.api.read)
            url = request.proxy.api.read.split('?')[0];

        if (url && jsonData) {
            for (var i = 0; i < injectionTests.length; i++) {
                for (var prop in jsonData) {
                    var newJsonData = Ext.clone(jsonData);
                    newJsonData[prop] = injectionTests[i].payload;

                    BIA.Ajax.request({
                        method: request.method,
                        url: url,
                        jsonData: newJsonData,
                        BIASQLInjectionTest: {
                            parameter: prop,
                            payload: injectionTests[i].payload,
                            payloadDesc: injectionTests[i].desc
                        }
                    });
                }
            }
        }
    }, me);

    /* Class Accessor Functions */
    Ext.apply(me, {
        registerStore: function registerStore(store, component) {
            var storeId = getStoreId(store, component);
            if (nonTrackingStoreIDs.indexOf(storeId) < 0 && Ext.Object.getKeys(trackingStores).indexOf(storeId) < 0) {
                buildTrackingStoreObject(storeId, store, component);
                addStoreListeners(storeId);
            }
        },
        registerAjaxRequest: function registerAjaxRequest(request) {
            var ajaxId = request.uniqueId;
            if (nonTrackingStoreIDs.indexOf(ajaxId) < 0 && Ext.Object.getKeys(trackingStores).indexOf(ajaxId) < 0) {
                buildTrackingAjaxObject(ajaxId, request);
                var performanceHistoryRecordId = initializeAjaxPerformanceHistory(ajaxId, request) - 1;
                if (performanceHistoryRecordId != null) {
                    return {
                        performanceHistoryRecordId: performanceHistoryRecordId,
                        completeFn: completeAjaxPerformanceHistory
                    }
                }
            }
        },
        getPerformanceHistoryRecords: function getPerformanceHistoryRecords(performanceHistoryId) {
            if (performanceHistoryId != null) {
                var filteredPerformanceRecords = performanceRecords.filter(function (rec) { return rec.performanceRecordId > performanceHistoryId; });
                if (filteredPerformanceRecords.length > 0) return Ext.clone(filteredPerformanceRecords);
                else return new Array();
            }
            else return Ext.clone(performanceRecords);
        },
        getPerformanceProblemHistoryRecords: function getPerformanceProblemHistoryRecords(performanceHistoryId) {
            var problemPerformanceRecords = Ext.clone(performanceRecords.filter(function (rec) { return rec.Status == 1; }));
            if (performanceHistoryId != null) {
                var filteredProblemPerformanceRecords = problemPerformanceRecords.filter(function (rec) { return rec.performanceRecordId > performanceHistoryId; });
                if (filteredProblemPerformanceRecords.length > 0) return Ext.clone(filteredProblemPerformanceRecords);
                else return new Array();
            }
            else return problemPerformanceRecords;
        },
        getAverageRequestTime: function getAverageRequestTime(performanceHistoryId) {
            var currentPerformanceRecordBatch = performanceRecords.filter(function (rec) {
                return this.lastViewedPerformanceRecordId == null ||
                    (this.lastViewedPerformanceRecordId != null && rec.performanceRecordId > this.lastViewedPerformanceRecordId);
            }, { lastViewedPerformanceRecordId: performanceHistoryId });

            var requestTimes = Ext.Array.pluck(currentPerformanceRecordBatch, 'RequestTime');
            var totalTime = 0;
            for (i = 0; i < requestTimes.length; i++) totalTime += requestTimes[i];
            return totalTime / requestTimes.length;
        },
        getLastPerformanceRecordId: function getLastPerformanceRecordId() {
            return performanceRecordIncriminter - 1;
        }
    });

    if (Ext.versions.extjs.major <= 4) {
        var listeners = new Object();

        var addEventListeners = function addEventListeners(eventName, fn, scope, options, order) {
            if (listeners[eventName] != null && Ext.isArray(listeners[eventName])) {
                listeners[eventName].push({
                    fn: fn,
                    scope: scope,
                    options: options,
                    order: order
                });

                listeners[eventName] = listeners[eventName].sort(function (a, b) {
                    var aPriority = a.options && a.options.priority != null ? a.options.priority : null;
                    if (aPriority == null) {
                        var order = (a.order || (a.options || { order: 0 }).order);
                        if (order == "before") aPriority = 100;
                        if (order == "current") aPriority = 0;
                        if (order == "after") aPriority = -100;
                    }
                    var bPriority = b.options && b.options.priority != null ? b.options.priority : null;
                    if (bPriority == null) {
                        var order = (b.order || (b.options || { order: 0 }).order);
                        if (order == "before") bPriority = 100;
                        if (order == "current") bPriority = 0;
                        if (order == "after") bPriority = -100;
                    }
                    return aPriority - bPriority;
                });
            }
            else {
                listeners[eventName] = new Array();
                listeners[eventName].push({
                    fn: fn,
                    scope: scope,
                    options: options,
                    order: order
                });
            }
        };

        Ext.apply(me, {
            addListener: function (eventName, fn, scope, options, order) {
                if (Ext.isObject(eventName)) {
                    var eventNameKeys = Ext.Object.getKeys(eventName);
                    for (i = 0; i < eventNameKeys.length; i++) {
                        var listener = eventName[eventNameKeys[i]]
                        addEventListeners(eventNameKeys[i], listener.fn, listener.scope || me, listener.options || new Object(), listener.order);
                    }
                }
                else addEventListeners(eventName, fn, scope || me, options || new Object(), order);
            },
            removeListener: function (eventName, fn, scope) {
                var matchingEvent = listeners[eventName];
                if (matchingEvent) {
                    var matchingListeners = matchingEvent.filter(function (l) { return l.fn == fn && l.scope == scope; });
                    for (i = 0; i < matchingListeners.length; i++) {
                        Ext.Array.remove(matchingEvent, matchingListeners[i]);
                    }
                }
            },
            fireEvent: function (eventName, args) {
                var ret = true;
                var eventListeners = listeners[eventName];
                if (eventListeners != null) {
                    for (i = 0; i < eventListeners.length; i++) {
                        if (Ext.isFunction(eventListeners[i].fn)) {
                            var allArgs = eventListeners[i].options.args || new Array();
                            allArgs.push(args);
                            ret = eventListeners[i].fn.apply(eventListeners[i].scope || eventListeners[i].options.scope, allArgs);
                            if (ret === false) break;
                        }
                    }
                }

                return ret;
            }
        });
    }
});