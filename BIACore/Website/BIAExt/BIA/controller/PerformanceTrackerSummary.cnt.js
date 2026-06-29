Ext.define('BIA.controller.PerformanceTrackerSummary', {
    extend: 'Ext.app.Controller',
    init: function () {
        this.control({
            'BIAPerformanceTrackerSummary': {
                beforerender: this.SummaryBeforeRender,
                afterrender: this.SummaryWindowAfterRender
            },
            'BIAPerformanceTrackerGrid': {
                //added: this.LatestCallsAdded,
                cellclick: this.SummaryGridCellClick,
                celldblclick: this.SummaryGridDblCellClick
            },
            'PerformanceTrackerGridSummary': {
                beforerender: this.GridSummaryBeforeRender
            },
            'BIAPerformanceTrackerSummaryTabs': {
                afterrender: this.SummaryTabsAfterRender
            },
            'BIAPerformanceTrackerSummaryDataRefreshButton': {
                afterrender: this.DataRefreshButtonAfterRender,
                click: this.DataRefreshButtonClick,
                destroy: this.DataRefreshButtonDestroy
            },
            'BIAPerformanceTrackerSummaryNewSessionButton': {
                beforerender: this.NewSessionButtonBeforeRender,
                click: this.NewSessionButtonClick,
                destroy: this.NewSessionButtonDestroy
            },
            'BIAPerformanceTrackerSummaryClearSessionButton': {
                beforerender: this.ClearSessionButtonBeforeRender,
                click: this.ClearSessionButtonClick
            }
        });
    },
    SummaryResize: function (me, reposition) {
        me.setConfig({
            minWidth: window.innerWidth * .95 > 600 ? 600 : (window.innerWidth * .95),
            minHeight: window.innerHeight * .95 > 400 ? 400 : (window.innerHeight * .95),
            height: (window.innerHeight * .95),
            width: (window.innerWidth * .95)
        });

        if (reposition === true && !Ext.isEmpty(me.el)) {
            me.setConfig({
                x: (window.innerWidth - me.getWidth()) < 0 ? 0 : (window.innerWidth - me.getWidth()) / 2,
                y: (window.innerHeight - me.getHeight()) < 0 ? 0 : (window.innerHeight - me.getHeight()) / 2
            });
        }
    },
    SummaryBeforeRender: function SummaryBeforeRender(me) {
        Ext.GlobalEvents.addListener({
            resize: {
                fn: this.SummaryResize,
                scope: this,
                args: [me,true]
            }
        });

        this.SummaryResize(me);
    },
    SummaryWindowAfterRender: function SummaryWindowAfterRender(me, eOpts) {
        me.updateDataGrids();
        this.SummaryResize(me,true);
    },
    //LatestCallsAdded: function LatestCallsAdded(me, eOpts) {
    //    me.store.loadData(BIA.header.tool.PerformanceTrackerInterface.getPerformanceHistoryRecords());
    //},
    SummaryGridCellClick: function SummaryGridCellClick(gridView, cellEl, cellIndex, record, rowEl, rowIndex, event, eOpts) {
        if (Ext.getVersion().major > 4) {
            var columns = gridView.getGridColumns();
            if (columns[cellIndex].viewDetailOnClick) {
                var detailWindow = Ext.create('BIA.header.tool.PerformanceTracker.Detail', { record: record.data });
                detailWindow.show();
            }
        }
        else Ext.MessageBox.alert('Old ExtJS Version', 'You are utilizing an older ExtJS version which is not compatible with the Performance Tracker Detail view');
    },
    SummaryGridDblCellClick: function SummaryGridDblCellClick(gridView, cellEl, cellIndex, record, rowEl, rowIndex, event, eOpts) {
        if (Ext.getVersion().major > 4) {
            var detailWindow = Ext.create('BIA.header.tool.PerformanceTracker.Detail', { record: record.data });
            detailWindow.show();
        }
        else Ext.MessageBox.alert('Old ExtJS Version', 'You are utilizing an older ExtJS version which is not compatible with the Performance Tracker Detail view');
    },
    GridSummaryBeforeRender: function GridSummaryBeforeRender(me, eOpts) {
        var grid = me.up('grid');
        if (grid) {
            var gridStore = grid.store;
            if (gridStore) {
                me.setConfig({ hidden: false });
                if ((gridStore.isLoaded && gridStore.isLoaded()) || (!gridStore.isLoaded && gridStore.data && gridStore.data.length > 0)) {
                    this.GridSummaryUpdate(me, grid, gridStore);
                }

                if (Ext.getVersion().major > 4) {
                    me.up('window').addListener({
                        griddataupdated: {
                            fn: this.GridSummaryUpdate,
                            scope: this,
                            args: [me, grid, gridStore]
                        }
                    });

                    me.up('tabpanel').addListener({
                        tabchange: {
                            fn: function (tabPanel, newCard, oldCard) {
                                if (grid.ownerCt.title == tabPanel.getActiveTab().title) this.GridSummaryUpdate(me, grid, gridStore);
                            },
                            scope: this
                        }
                    });
                }
                else {
                    me.up('window').addListener({
                        griddataupdated: {
                            fn: this.GridSummaryUpdate,
                            scope: { scope: this, args: [me, grid, gridStore] }
                        }
                    });

                    me.up('tabpanel').addListener({
                        tabchange: {
                            fn: function (tabPanel, newCard, oldCard) {
                                if (grid.ownerCt.title == tabPanel.getActiveTab().title) this.GridSummaryUpdate(me, grid, gridStore);
                            },
                            scope: this
                        }
                    });
                }
            }
            else me.setConfig({ hidden: true });
        }
        else me.setConfig({ hidden: true });
    },
    GridSummaryUpdate: function GridSummaryUpdate(me, grid, gridStore) {
        if (Ext.getVersion().major <= 4 && this.args) {
            me = this.args[0];
            grid = this.args[1];
            gridStore = this.args[2];
        }

        if (gridStore.data && gridStore.data.length > 0) {
            var requestCount = gridStore.data.length;
            var dataAvgRecordCount = Ext.Array.pluck(Ext.Array.pluck(gridStore.data.items, 'data'), 'RecordsReturned');
            var dataAvgRequestTime = Ext.Array.pluck(Ext.Array.pluck(gridStore.data.items, 'data'), 'RequestTime');
            var avgRecordCount = Ext.Array.sum(dataAvgRecordCount) / dataAvgRecordCount.length;
            var avgRequestTime = Ext.Array.sum(dataAvgRequestTime) / dataAvgRequestTime.length;
            var requestCountDisplay = '# Requests: ' + requestCount;
            var avgRecordCountDisplay = 'Avg Record Count: ' + BIA.util.Format.number_0(avgRecordCount).replace('<span class="">', '').replace('</span>', '');
            var avgRequestTimeDisplay = 'Avg Request Time: ' + BIA.util.Format.number_0(avgRequestTime).replace('<span class="">', '').replace('</span>', '') + ' ms';

            if (Ext.getVersion().major > 4) {
                me.down('#RequestCount').update(requestCountDisplay);
                me.down('#AvgRecordCount').update(avgRecordCountDisplay);
                me.down('#AvgRequestTime').update(avgRequestTimeDisplay);
            }
            else {
                me.down('#RequestCount').update(requestCountDisplay);
                me.down('#AvgRecordCount').update(avgRecordCountDisplay);
                me.down('#AvgRequestTime').update(avgRequestTimeDisplay);
            }
        }
        else {
            me.down('#RequestCount').update('0');
            me.down('#AvgRecordCount').update('0');
            me.down('#AvgRequestTime').update('0 ms');
        }
    },
    SummaryTabsAfterRender: function SummaryTabsAfterRender(me, eOpts) {
        me.tabBar.add({ xtype: 'tbfill', flex: 1 });
        me.tabBar.add({ xtype: 'BIAPerformanceTrackerSummaryNewSessionButton', margin: 5 });
        me.tabBar.add({ xtype: 'BIAPerformanceTrackerSummaryClearSessionButton', margin: 5 });
        me.tabBar.add({ xtype: 'BIAPerformanceTrackerSummaryDataRefreshButton', margin: 5 });
    },
    DataRefreshButtonAfterRender: function DataRefreshButtonAfterRender(me) {
        this.DataRefreshAddPerformanceUpdateListeners(me);
        this.DataRefreshUpdateVisibility(me);
    },
    DataRefreshUpdateVisibility: function (me) {
        if (me.isVisible() || !me.rendered) {
            if (me.up('window').lastHistoryRecordId < BIA.header.tool.PerformanceTrackerInterface.getLastPerformanceRecordId()) {
                me.enable();
            }
            else me.disable();
        }
    },
    DataRefreshAddPerformanceUpdateListeners: function DataRefreshAddPerformanceUpdateListeners(me) {
        if (Ext.getVersion().major > 4) {
            BIA.header.tool.PerformanceTrackerInterface.addListener({
                performanceupdated: {
                    fn: this.DataRefreshButtonPerformanceUpdated,
                    scope: this,
                    args: [me.up('window'), me],
                    single: true
                }
            });
        }
        else {
            BIA.header.tool.PerformanceTrackerInterface.addListener({
                performanceupdated: {
                    fn: this.DataRefreshButtonPerformanceUpdated,
                    scope: { scope: this, args: [me.up('window'), me] },
                    single: true
                }
            });
        }
    },
    DataRefreshButtonPerformanceUpdated: function DataRefreshButtonPerformanceUpdated(summaryWindow, me, performanceRecords) {
        if (Ext.getVersion().major <= 4 && this.args) {
            performanceRecords = summaryWindow;
            summaryWindow = this.args[0];
            me = this.args[1];
        }
        if (Ext.getVersion().major <= 4 && this.args) {
            this.scope.DataRefreshUpdateVisibility.apply(this.scope, [me]);
            this.scope.DataRefreshAddPerformanceUpdateListeners.apply(this.scope, [me]);
        }
        else {
            this.DataRefreshUpdateVisibility(me);
            this.DataRefreshAddPerformanceUpdateListeners(me);
        }
    },
    DataRefreshButtonClick: function DataRefreshButtonClick(me) {
        me.up('window').updateDataGrids();
        this.DataRefreshUpdateVisibility(me);
        this.NewSessionButtonUpdateVisibility(me.ownerCt.down('BIAPerformanceTrackerSummaryNewSessionButton'));
        this.ClearSessionUpdateButtonVisibility(me.ownerCt.down('BIAPerformanceTrackerSummaryClearSessionButton'));
    },
    DataRefreshButtonDestroy: function DataRefreshButtonDestroy(me) {
        if (Ext.getVersion().major > 4) {
            BIA.header.tool.PerformanceTrackerInterface.removeListener('performanceupdated', this.DataRefreshButtonPerformanceUpdated, this);
        }
        else {
            BIA.header.tool.PerformanceTrackerInterface.removeListener('performanceupdated', this.DataRefreshButtonPerformanceUpdated, { scope: this, args: [me.up('window'), me] });
        }
    },
    NewSessionButtonBeforeRender: function NewSessionButtonBeforeRender(me) {
        this.NewSessionButtonUpdateVisibility(me);
        this.NewSessionButtonAddPerformanceUpdateListeners(me);
    },
    NewSessionButtonPerformanceUpdated: function NewSessionButtonPerformanceUpdated(summaryWindow, me, performanceRecords) {
        if (Ext.getVersion().major <= 4 && this.args) {
            performanceRecords = summaryWindow;
            summaryWindow = this.args[0];
            me = this.args[1];
        }

        if (Ext.getVersion().major <= 4 && this.args) {
            this.scope.NewSessionButtonUpdateVisibility.apply(this.scope, [me]);
            this.scope.NewSessionButtonAddPerformanceUpdateListeners.apply(this.scope, [me]);
        }
        else {
            this.NewSessionButtonUpdateVisibility(me);
            this.NewSessionButtonAddPerformanceUpdateListeners(me);
        }
    },
    NewSessionButtonUpdateVisibility: function NewSessionButtonUpdateVisibility(me) {
        if (me.isVisible() || !me.rendered) {
            if (BIACore.Header.PerformanceTracker.GetLastViewedId() == null || BIACore.Header.PerformanceTracker.GetLastViewedId() < BIA.header.tool.PerformanceTrackerInterface.getLastPerformanceRecordId()) {
                me.enable();
            }
            else me.disable();
        }
    },
    //TODO: Change to be a listenable event for the header tool to listen to
    NewSessionButtonAddPerformanceUpdateListeners: function NewSessionButtonAddPerformanceUpdateListeners(me) {
        if (Ext.getVersion().major > 4) {
            me.performanceUpdatedListener = BIA.header.tool.PerformanceTrackerInterface.addListener({
                performanceupdated: {
                    fn: this.NewSessionButtonPerformanceUpdated,
                    scope: this,
                    args: [me.up('window'), me],
                    single: true
                }
            });
        }
        else {
            me.performanceUpdatedListener = BIA.header.tool.PerformanceTrackerInterface.addListener({
                performanceupdated: {
                    fn: this.NewSessionButtonPerformanceUpdated,
                    scope: { scope: this, args: [me.up('window'), me] },
                    single: true
                }
            });
        }
    },
    NewSessionButtonClick: function NewSessionButtonClick(me) {
        //TODO: Change to be a listenable event for the header tool to listen to
        BIACore.Header.PerformanceTracker.SetLastViewedId(BIA.header.tool.PerformanceTrackerInterface.getLastPerformanceRecordId());
        this.NewSessionButtonUpdateVisibility(me);
        this.ClearSessionUpdateButtonVisibility(me.ownerCt.down('BIAPerformanceTrackerSummaryClearSessionButton'));
        me.up('window').updateDataGrids();
    },
    NewSessionButtonDestroy: function NewSessionButtonDestroy(me) {
        if (Ext.getVersion().major > 4) {
            BIA.header.tool.PerformanceTrackerInterface.removeListener('performanceupdated', this.NewSessionButtonPerformanceUpdated, this);
        }
        else {
            BIA.header.tool.PerformanceTrackerInterface.removeListener('performanceupdated', this.NewSessionButtonPerformanceUpdated, { scope: this, args: [me.up('window'), me] });
        }
    },
    ClearSessionButtonBeforeRender: function ClearSessionButtonBeforeRender(me) {
        this.ClearSessionUpdateButtonVisibility(me);
    },
    ClearSessionUpdateButtonVisibility: function ClearSessionUpdateButtonVisibility(me) {
        if (me.isVisible() || !me.rendered) {
            if (BIACore.Header.PerformanceTracker.GetLastViewedId() == null) me.disable();
            else me.enable();
        }
    },
    ClearSessionButtonClick: function ClearSessionButtonClick(me) {
        //TODO: Change to be a listenable event for the header tool to listen to
        BIACore.Header.PerformanceTracker.SetLastViewedId(null);

        this.ClearSessionUpdateButtonVisibility(me);
        this.NewSessionButtonUpdateVisibility(me.ownerCt.down('BIAPerformanceTrackerSummaryNewSessionButton'));
        me.up('window').updateDataGrids();
    }
});