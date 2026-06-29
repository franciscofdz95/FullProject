Ext.define('BIA.Ajax', {
    singleton: true,
    requestObjs: new Object()
}, function (me) {
    var requestIdIncrementer = 0;

    Ext.apply(me, {
        request: function (options) {
            options = options || {};
            var scope = options.scope || me.scope || window,
                username = options.username || me.username || null,
                password = options.password || me.password || '',
                PerformanceTrackerAjax;

            var responseDataExtraction = function responseDataExtraction(response) {
                //if (Ext.getVersion().major >= 5) {
                    var responseJSON = response.responseText != null && (response.responseText.indexOf('[') == 0 || response.responseText.indexOf('{') == 0)
                        ? Ext.JSON.decode(response.responseText)
                        : new Object();
                    Ext.apply(response, { responseJSON: responseJSON }, responseJSON);
                //}
            };

            var logAjaxResponse = function logAjaxResponse(response, success) {
                var detail = Ext.String.format('Url: {1}{0}Params: {2}{0}JSONData: {3}{0}Async: {4}', 
                    '\n', 
                    response.request.options.url.split('?')[0], 
                    Ext.JSON.encode(response.request.options.params || {}),
                    Ext.JSON.encode(response.request.options.jsonData || {}),
                    response.request.async.toString()
                );

                if (!success) {
                    detail += Ext.String.format('{0}Error Code: {1}{0}Error Text: {2}{0}Error Message: {3}{0}Error Detail: {4}',
                        '\n',
                        response.status.toString(),
                        response.statusText,
                        response.ExceptionMessage || response.Message || 'No Error Message',
                        response.Stacktrace || response.MessageDetail || 'No Error Detail'
                    );

                    BIACore.Logger.Ajax('BIA.Ajax.request', detail);
                }
                else if(response.request.options.url.indexOf('api') != 0) BIACore.Logger.Ajax('BIA.Ajax.request', detail);
            };

            var resetAjaxFunctions = function resetAjaxFunctions(requestObj) {
                //me.success = requestObj.successFn;
                //me.failure = requestObj.failureFn;
                //me.callback = requestObj.callbackFn;
                delete me.PerformanceTrackerAjax;
                delete me.successFn;
                delete me.failureFn;
                delete me.callbackFn;
                delete requestObj.PerformanceTrackerAjax;
                delete requestObj.successFn;
                delete requestObj.failureFn;
                delete requestObj.callbackFn;
                me.requestObjs[requestObj.optionsId] = null;
            };

            var successHandler = function successHandler(response, request) {
                responseDataExtraction(response);
                //logAjaxResponse(response, true);
                //if (request.PerformanceTrackerAjax.completeFn && Ext.isFunction(request.PerformanceTrackerAjax.completeFn)) request.PerformanceTrackerAjax.completeFn(request.uniqueId, request.PerformanceTrackerAjax.performanceHistoryRecordId, response, true);
                if (request.requestObjs[request.optionsId].successFn && Ext.isFunction(request.requestObjs[request.optionsId].successFn)) request.requestObjs[request.optionsId].successFn.apply(scope, arguments);
                //resetAjaxFunctions(requestObj);
            };
            var failureHandler = function failureHandler(response, request) {
                responseDataExtraction(response);
                //logAjaxResponse(response, false);
                //if (request.PerformanceTrackerAjax.completeFn && Ext.isFunction(request.PerformanceTrackerAjax.completeFn)) request.PerformanceTrackerAjax.completeFn(request.uniqueId, request.PerformanceTrackerAjax.performanceHistoryRecordId, response, false);
                if (request.requestObjs[request.optionsId].failureFn && Ext.isFunction(request.requestObjs[request.optionsId].failureFn)) request.requestObjs[request.optionsId].failureFn.apply(scope, arguments);
                //resetAjaxFunctions(requestObj);
            };
            var callbackHandler = function callbackHandler(request, success, response) {
                responseDataExtraction(response);
                logAjaxResponse(response, success);
                if (request.requestObjs[request.optionsId].PerformanceTrackerAjax.completeFn && Ext.isFunction(request.requestObjs[request.optionsId].PerformanceTrackerAjax.completeFn)) request.requestObjs[request.optionsId].PerformanceTrackerAjax.completeFn(request.uniqueId, request.requestObjs[request.optionsId].PerformanceTrackerAjax.performanceHistoryRecordId, response, success);
                if (request.requestObjs[request.optionsId].callbackFn && Ext.isFunction(request.requestObjs[request.optionsId].callbackFn)) request.requestObjs[request.optionsId].callbackFn.apply(scope, arguments);
                resetAjaxFunctions(requestObj);
            };

            var requestObj = Ext.apply(
                Ext.apply({},Ext.clone(me)), 
                Ext.apply(
                    Ext.apply({},Ext.clone(options)),
                    {
                        uniqueId: me.getUniqueId(),
                        success: successHandler,
                        failure: failureHandler,
                        callback: callbackHandler,
                        successFn: options.success || Ext.emptyFn,
                        failureFn: options.failure || Ext.emptyFn,
                        callbackFn: options.callback || Ext.emptyFn
                    }
                )
            );

            requestObj.optionsId = requestObj.uniqueId.replace(/\-/g, '');

            PerformanceTrackerAjax = BIA.header.tool.PerformanceTrackerInterface.registerAjaxRequest(requestObj);

            me.requestObjs[requestObj.optionsId] = requestObj;
            
            var extAjaxRequest = Ext.Ajax.request(Ext.apply(requestObj, { PerformanceTrackerAjax: PerformanceTrackerAjax }));

            return extAjaxRequest;
        },
        getUniqueId: function getUniqueId() {
            return 'BIA-Ajax-Request-' + (++requestIdIncrementer).toString();
        }
    });
});
/*
store.getUniqueId
store.on (load, beforeload)
store.proxy
store.proxy.reader
store.proxy.reader.rawData
store.proxy.reader.rawData.debug
store.proxy.api
store.proxy.api.read
store.proxy.extraParams
store.data 
store.data.items ([data])
store.totalCount
*/