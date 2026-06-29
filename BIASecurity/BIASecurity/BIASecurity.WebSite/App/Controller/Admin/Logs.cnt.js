Ext.define('App.Controller.Admin.Logs', {
    extend: 'Ext.app.Controller',
    refs: [
        { ref: 'Content', selector: 'App-View-Content-Container[hidden=false][rendered=true]' },
        { ref: 'LogContainer', selector: 'App-View-Admin-Logs-Container' },
        { ref: 'LogFilter', selector: 'App-View-Admin-Logs-Component-Filter App-View-Admin-Logs-Component-Filter-Container' },
        { ref: 'LogList', selector: 'App-View-Admin-Logs-Component-List-View' },
        { ref: 'LogDetail', selector: 'App-View-Admin-Logs-Detail-Window[hidden=false]' }
    ],
    init: function init() {
        this.listen({
            global: {
                doLogsDeepLink: {
                    fn: this.DoLogsDeepLink
                },
                handleDeepLinkLogDetail: {
                    fn: this.HandleDeepLinkLogDetail
                }
            }
        });
        this.control({
            'App-View-Admin-Logs-Container': {
                added: this.LogsContainerAdded,
                boxready: this.LogsContainerBoxReady
            },
            'App-View-Admin-Logs-Grouped-Item-Expander': {
                afterrender: this.GroupedItemExpanderAfterRender
            },
            'App-View-Admin-Logs-Grouped-Item[header=false]': {
                afterrender: this.GroupedItemNonHeaderAfterRender
            },
            'App-View-Admin-Logs-Raw-Item[header=false]': {
                beforerender: this.RawItemNonHeaderBeforeRender,
                afterrender: this.RawItemNonHeaderAfterRender
            },
            'App-View-Admin-Logs-Component-List-Item[header=false] logItemField[dataField="GroupMessage"]': {
                beforerender: this.LogsListItemGroupMessageBeforeRender
            },
            'App-View-Admin-Logs-Raw-Item-ViewLog': {
                beforerender: this.RawItemViewLogBeforeRender,
                afterrender: this.RawItemViewLogAfterRender
            },
            'App-View-Admin-Logs-Detail-Window': {
                beforerender: this.LogsDetailWindowBeforeRender,
                close: this.LogsDetailWindowClose
            },
            'App-View-Admin-Logs-Detail-Container': {
                beforerender: this.LogsDetailContainerBeforeRender,
                afterrender: this.LogsDetailContainerAfterRender,
                storebeforeload: this.LogsDetailContainerStoreBeforeLoad,
                storeload: this.LogsDetailContainerStoreLoad
            },
            'App-View-Admin-Logs-Detail-Component-Field': {
                beforerender: this.LogsDetailFieldBeforeRender
            },
            'App-View-Admin-Logs-Component-NoAccess': {
                beforerender: this.LogsNoAccessBeforeRender
            },
            'App-View-Admin-Logs-Component-List-Item-Sorting': {
                beforerender: this.LogsSortingBeforeRender,
                afterrender: this.LogsSortingAfterRender
            },
            'App-View-Admin-Logs-Raw-Item-LogRangeView': {
                beforerender: this.RawItemLogRangeViewBeforeRender,
                afterrender: this.RawItemLogRangeViewAfterRender
            },
            'App-View-Admin-Logs-Raw-Item-LogRangeCombo #LogRangeId': {
                select: this.LogRangeComboFilter                
            },
        });
    },
    LogRangeComboFilter: function LogRangeComboFilter(me, args) {
        var filterContainer = this.getLogContainer(),
            startLogField = filterContainer.down('App-View-Admin-Logs-Component-Filter-LogIdRange #StartLogId'),
            endLogField = filterContainer.down('App-View-Admin-Logs-Component-Filter-LogIdRange #EndLogId');

        if (!Ext.isEmpty(me.getValue())) {            
            startLogField.setValue(me.up('window').LogId - me.getValue()); 
            endLogField.setValue(me.up('window').LogId + me.getValue());
            var filterWindow = this.getLogFilter();            
            filterWindow.down('#Apply').addCls('bia-red-btn');
        }

        me.up('window').close();      

    },
    DoLogsDeepLink: function DoLogsDeepLink(logList, event, params, listType) {
        var params = Ext.isObject(params) ? params : {},
            logFilter = this.getLogFilter(),
            logList = !Ext.isEmpty(logList) && logList != null && (!Ext.isObject(logList) || (Ext.isObject(logList) && !Ext.Object.isEmpty(logList)))
                ? logList : this.getLogList(),
            event = !Ext.isEmpty(event) && event != null ? event : 'gotoNewContent',
            logDetail = this.getLogDetail(),
            logDetailData = {},
            evtObj = {
                xtype: 'App-View-Admin-Logs-Container',
                deeplinkData: {
                    currentPage: logList.currentPage,
                    listType: !Ext.isEmpty(listType) ? listType : logList.listType,
                    filterParams: Ext.apply(Ext.apply(Ext.clone(logFilter ? logFilter.GetParameters() : {}), { sort: logList.sort }), params.filterParams)
                },
                noChangeIfSameXtype: true
            };
        if (params.filterParams) delete params.filterParams;
        if (logDetail) logDetailData = { logDetailId: logDetail.LogId };
        Ext.apply(evtObj.deeplinkData, params, logDetailData);

        Ext.GlobalEvents.fireEvent('doAppDeepLink', event, evtObj)
        //BIA.Components.DeepLink.addEventHistory(event, evtObj);
    },
    HandleDeepLinkLogDetail: function HandleDeepLinkLogDetail(logId) {
        var logDetail = this.getLogDetail();
        if (logDetail && !Ext.isEmpty(logId)) {
            logDetail.LogId = logId;
            this.LogsDetailWindowBeforeRender(logDetail);
            var cnt = logDetail.down('App-View-Admin-Logs-Detail-Container');
            if (cnt) {
                this.LogsDetailContainerBeforeRender(cnt);
                this.LogsDetailContainerAfterRender(cnt);
            }
        }
        else {
            Ext.create({
                xtype: 'App-View-Admin-Logs-Detail-Window',
                LogId: logId
            }).show();
        }
    },
    ContentItemChange: function ContentItemChange(content, config, logsContainer) {
        if (this.LogsContainerAdded(Ext.apply(logsContainer, config))) {

            var logList = this.getLogList();
            if (logList) {
                if (!logList.store.isLoading()) {
                    if (logList.store.isLoaded() && (!config.deeplinkData || Ext.isEmpty(config.deeplinkData.logDetailId))) {
                        if (logList.LogDetailShowing === true) logList.LogDetailShowing = false;
                        else {
                            logList.mask(logList.loadingMessage);
                            logList.changeCurrentPage(config.deeplinkData.currentPage);
                            logList.store.load();
                        }
                    }
                }
                if (config.deeplinkData && !Ext.isEmpty(config.deeplinkData.logDetailId)) logList.LogDetailShowing = true;
            }

            if (config.deeplinkData && !Ext.isEmpty(config.deeplinkData.logDetailId)) {
                Ext.GlobalEvents.fireEvent('handleDeepLinkLogDetail', config.deeplinkData.logDetailId);
            }
        }
    },
    LogsContainerAdded: function LogsContainerAdded(me) {
        var failedAppAccess = false;
        if (me.deeplinkData && me.deeplinkData.filterParams) {
            if (App.View.Admin.Logs.Utility.UserHasAppAccess(me.deeplinkData.filterParams.AppCode) == false) failedAppAccess = true;
        }

        if (arguments.length > 1) me.initialLoad = true;
        else if (me.initialLoad) {
            me.initialLoad = false;
            return !failedAppAccess
        }

        var listConfig = me.toggleListConfig.default,
            logList = this.getLogList(),
            content = this.getContent(),
            sort = null;
        if (me.deeplinkData && failedAppAccess !== true) {            
            if (!me.toggleListConfig[me.deeplinkData.listType]) me.deeplinkData.listType = 'grouped';
            if (me.deeplinkData.filterParams && me.deeplinkData.filterParams.sort) sort = me.deeplinkData.filterParams.sort;
            listConfig = Ext.apply(Ext.clone(me.toggleListConfig[me.deeplinkData.listType]),
                {
                    currentPage: Ext.isEmpty(me.deeplinkData.currentPage) ? 1 : me.deeplinkData.currentPage,
                    sort: sort
                }
            );

            if (logList) logList.sort = sort;

            if (me.deeplinkData.filterParams) {
                this.getLogFilter().fireEvent('handleDeepLinkData', me.deeplinkData.filterParams);
            }
        }

        if (failedAppAccess === true) {
            if (!content.down('App-View-Admin-Logs-Component-NoAccess')) {
                content.add({
                    xtype: 'App-View-Admin-Logs-Component-NoAccess',
                    constrainTo: content,
                    alignTo: content,
                    defaultAlign: 'tl-tl',
                    height: content.body.getHeight(),
                    width: content.body.getWidth()
                }).show();
            }
            return false;
        }
        else if (Ext.isEmpty(logList) || (logList && !logList.isXType(listConfig.xtype))) {
            me.remove(logList);
            me.add(listConfig);
        }
        else {
            logList.sort = sort;
        }

        if (content.down('App-View-Admin-Logs-Component-NoAccess')) {
            content.down('App-View-Admin-Logs-Component-NoAccess').destroy();
        }
        return true;
    },
    LogsContainerBoxReady: function LogsContainerBoxReady(me) {
        if (this.getContent()) {
            if (me.ContentItemChangeListener == null) {
                me.addManagedListener(this.getContent(), 'afterMainItemChange', this.ContentItemChange, this);
                //this.getContent().addManagedListener({
                //    afterMainItemChange: {
                //        fn: this.ContentItemChange,
                //        scope: this,
                //        destroyable: true
                //    }
                //});
            }
        }
    },
    GroupedItemExpanderAfterRender: function GroupedItemExpanderAfterRender(me) {
        me.getEl().addListener({
            click: {
                fn: this.GroupedItemExpanderClick,
                scope: this,
                args: [me]
            }
        });
    },
    GroupedItemExpanderClick: function GroupedItemExpanderClick(me) {
        var clickTarget = Ext.fly(arguments[2]),
            clickCmp = clickTarget && clickTarget.component ? clickTarget.component : null,
            listItem = me.isXType('App-View-Component-List-Item') ? me : me.up('App-View-Component-List-Item'),
            expander = listItem.down('App-View-Admin-Logs-Grouped-Item-Expander'),
            list = this.getLogList(),
            scrollTo = list && list.scrollable ? list.scrollable.trackingScrollTop : null,
            groupedItems = listItem.down('App-View-Admin-Logs-Grouped-Item-List');;
        if (listItem) {
            if (groupedItems && (clickCmp == null || !clickCmp.up('App-View-Admin-Logs-Grouped-Item-List'))) {
                if (groupedItems.hidden) groupedItems.show();
                else groupedItems.hide();
                //groupedItems.setVisible(groupedItems.hidden);
                if (!groupedItems.store.isLoaded()) {
                    groupedItems.mask(groupedItems.maskText);
                    if (!groupedItems.store.isLoading()) groupedItems.store.load();
                }
            }
        }
        if (expander && (clickCmp == null || !clickCmp.up('App-View-Admin-Logs-Grouped-Item-List'))) {
            if (expander.expanded) {
                expander.expanded = false;
                expander.setConfig({ html: expander.collapsedIcon });
            }
            else {
                expander.expanded = true;
                expander.setConfig({ html: expander.expandedIcon });
            }
        }


        var doScroll = function doScroll(list, scrollTo, groupedItems, reapplyDefer) {
            list.scrollable.doScrollTo(0, scrollTo, false);
            groupedItems.addItemsLoadedListener = false;
            if (list.scrollable.deferredScrollListener != null) {
                clearTimeout(list.scrollable.deferredScrollListener)
                delete list.scrollable.deferredScrollListener;
            }
            else list.scrollable.deferredScrollListener = Ext.defer(doScroll, 1, this, [list, scrollTo, groupedItems]);

            if (reapplyDefer === true) list.scrollable.deferredScrollListener = Ext.defer(doScroll, 1, this, [list, scrollTo, groupedItems]);
        },
            addItemsLoadedListener = function addItemsLoadedListener(groupedItems, list) {
                scrollTo = list && list.scrollable ? list.scrollable.trackingScrollTop : null;
                if (scrollTo != null) {
                    if (groupedItems.addItemsLoadedListener) {
                        groupedItems.removeListener('itemsLoaded', doScroll, this);
                        groupedItems.addItemsLoadedListener = false;
                    }
                    groupedItems.addListener({
                        itemsLoaded: {
                            fn: doScroll,
                            scope: this,
                            single: true,
                            args: [list, scrollTo, groupedItems, true],
                            destroyable: true
                        }
                    });
                    groupedItems.addItemsLoadedListener = true;
                }
            };

        if (groupedItems && groupedItems.store && groupedItems.store.isLoading()) {
            groupedItems.addListener({
                storebeforeload: {
                    fn: addItemsLoadedListener,
                    scope: this,
                    args: [groupedItems, list]
                }
            });
        }

        if (scrollTo != null) {
            addItemsLoadedListener(groupedItems, list);
            doScroll(list, scrollTo, groupedItems);
        }

    },
    GroupedItemNonHeaderAfterRender: function GroupedItemNonHeaderAfterRender(me) {
        me.getEl().addListener({
            dblclick: {
                fn: this.GroupedItemExpanderClick,
                scope: this,
                args: [me]
            }
        });
    },
    RawItemNonHeaderBeforeRender: function RawItemNonHeaderBeforeRender(me) {
        var detail = me.up('App-View-Admin-Logs-Detail-Container[record]');
        if (detail) {
            if (me.record.LogId == detail.record.LogId && me.getId() != detail.getId()) {
                me.addCls('CurrentViewLog');
            }
        }
    },
    RawItemNonHeaderAfterRender: function RawItemNonHeaderAfterRender(me) {
        me.getEl().addListener({
            dblclick: {
                fn: this.RawItemViewLogClick,
                scope: this,
                args: [me]
            }
        });
    },
    LogsListItemGroupMessageBeforeRender: function LogsListItemGroupMessageBeforeRender(me) {
        me.addCls('GroupMessage');
    },
    RawItemViewLogBeforeRender: function RawItemViewLogBeforeRender(me) {
        var row = me.up('[record]'),
            detail = me.up('App-View-Admin-Logs-Detail-Container[record]');
        if (row && detail) {
            if (row.record.LogId == detail.record.LogId && row.getId() != detail.getId()) {
                me.currentViewLog = true;
                me.setConfig({ html: '&nbsp;' });
            }
        }
    },
    RawItemViewLogAfterRender: function RawItemViewLogAfterRender(me) {
        if (me.up('[header=true]')) {
            me.setConfig({ html: ' ' });
        }
        else if (me.currentViewLog !== true) {
            me.getEl().addListener({
                click: {
                    fn: this.RawItemViewLogClick,
                    scope: this,
                    args: [me]
                }
            });
        }
    },
    RawItemViewLogClick: function RawItemViewLogClick(me) {
        var listItem = me.isXType('App-View-Component-List-Item') ? me : me.up('App-View-Component-List-Item'),
            logList = this.getLogList();
        if (listItem && listItem.record) {
            if (logList) logList.LogDetailShowing = true;
            var logId = listItem.record.data ? listItem.record.data.LogId : listItem.record.LogId;
            Ext.GlobalEvents.fireEvent('doLogsDeepLink', null, null, { logDetailId: logId }, null);
        }
        return false;
    },
    RawItemLogRangeViewBeforeRender: function RawItemLogRangeViewBeforeRender(me) {
        var row = me.up('[record]'),
            detail = me.up('App-View-Admin-Logs-Detail-Container[record]');
        if (row && detail) {
            if (row.record.LogId == detail.record.LogId && row.getId() != detail.getId()) {
                me.currentViewLog = true;
                me.setConfig({ html: '&nbsp;' });
            }
        }
    },
    RawItemLogRangeViewAfterRender: function RawItemLogRangeAfterRender(me) {
        if (me.up('[header=true]')) {
            me.setConfig({ html: ' ' });
        }
        else if (me.currentViewLog !== true) {
            me.getEl().addListener({
                click: {
                    fn: this.RawItemLogRangeViewClick,
                    scope: this,
                    args: [me]
                }
            });
        }
    },
    RawItemLogRangeViewClick: function RawItemLogRangeClick(me, args) {
        var listItem = me.isXType('App-View-Component-List-Item') ? me : me.up('App-View-Component-List-Item');
            
        var win = Ext.create({ xtype: 'App-View-Admin-Logs-Raw-Item-LogRangeCombo', LogId: listItem.record.LogId }).show();
    },
    LogsDetailWindowBeforeRender: function LogsDetailWindowBeforeRender(me) {
        me.setConfig({ title: 'Log Detail for Log #' + me.LogId });
    },
    LogsDetailWindowClose: function LogsDetailWindowClose(me) {
        Ext.defer(function () {
            Ext.GlobalEvents.fireEvent('doLogsDeepLink', null, null, null, null);
        }, 5, this);
    },
    LogsDetailContainerBeforeRender: function LogsDetailContainerBeforeRender(me) {
        me.store.load();
    },
    LogsDetailContainerAfterRender: function LogsDetailContainerAfterRender(me) {
        if (me.store.isLoading()) me.mask('Loading Log Info');
    },
    LogsDetailContainerStoreBeforeLoad: function LogsDetailContainerStoreBeforeLoad(me, store) {
        var logId = me.LogId || (me.up('[LogId]') || {}).LogId;
        if (!Ext.isEmpty(logId)) {
            store.getProxy().extraParams = { LogId: logId };
        }
    },
    LogsDetailContainerStoreLoad: function LogsDetailContainerStoreLoad(me, store, records, success) {
        if (success && records.length == 1) {
            me.record = records[0].data;

            var fields = me.query('logdetailfield[setValue]');
            for (var i = 0; i < fields.length; i++) fields[i].setValue();

            if (me.down('App-View-Admin-Logs-Grouped-Item-List')) me.down('App-View-Admin-Logs-Grouped-Item-List').destroy();
            me.add({ xtype: 'App-View-Admin-Logs-Grouped-Item-List', autoLoadStore: true, hideFilters: true });
        }
        if (me.isMasked()) me.unmask();
    },
    LogsDetailFieldBeforeRender: function LogsDetailFieldBeforeRender(me) {
        if (!Ext.isEmpty(me.fieldLabel)) {
            me.down('label').setConfig({ html: me.fieldLabel + ': ' });
        }
    },
    LogsNoAccessBeforeRender: function LogsNoAccessBeforeRender(me) {
        var content = this.getContent();
        if (content) {
            me.addManagedListener(content, 'resize', function (me, content) {
                me.setHeight(content.body.getHeight());
                me.setWidth(content.body.getWidth());
            }, this, { args: [me, content] });
        }
    },
    LogsSortingBeforeRender: function LogsSortingBeforeRender(me) {
        //var list = me.up('pagedlist');
        //if (list) {
        //    me.addManagedListener(list, 'sortIconChange', function (me) { this.LogsSortingSetIcon(me); }, this, { args: [me] });
        //}

        this.LogsSortingSetIcon(me);
    },
    LogsSortingSetIcon: function LogsSortingSetIcon(me) {
        var list = me.up('pagedlist'),
            sortIcon = me.sortIcon.noSort;
        if (list && me.dataField) {
            var sortValue = list.sort,
                defaultSort = list.listTypeSort[list.listType];
            if (!Ext.isEmpty(sortValue) && Ext.isArray(sortValue)) sortValue = sortValue[0];
            if (sortValue && Ext.isObject(sortValue)) {
                if (sortValue.property === me.dataField) {
                    sortIcon = me.sortIcon[sortValue.direction.toUpperCase()];
                    me.sortStatus = sortValue.direction.toUpperCase();
                }
            }
            else if (defaultSort.property == me.dataField) {
                sortIcon = me.sortIcon[defaultSort.direction.toUpperCase()];
                me.sortStatus = defaultSort.direction.toUpperCase();
            }
        }

        me.setConfig({ html: sortIcon });
    },
    LogsSortingAfterRender: function LogsSortingAfterRender(me) {
        me.getEl().addListener({
            click: {
                fn: this.LogsSortingClick,
                scope: this,
                args: [me]
            }
        });
    },
    LogsSortingClick: function LogsSortingClick(me) {
        var list = me.up('pagedlist');
        if (list) {
            var sortingIcons = list.query(me.xtype + '[sortStatus!="noSort"][id!="' + me.id + '"]');
            for (var i = 0; i < sortingIcons.length; i++) {
                sortingIcons[i].sortStatus = 'noSort';
                sortingIcons[i].setConfig({ html: sortingIcons[i].sortIcon[sortingIcons[i].sortStatus] });
            }
            me.sortStatus = me.sortStatusChange[me.sortStatus];
            me.setConfig({ html: me.sortIcon[me.sortStatus] });
            list.sort = [{ property: me.dataField, direction: me.sortStatus }];
            Ext.GlobalEvents.fireEvent('doLogsDeepLink', null, null, null, null);
        }
    }
});