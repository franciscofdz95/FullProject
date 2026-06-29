Ext.define('BIA.header.tool.PerformanceTracker.Summary', {
    extend: 'Ext.window.Window',
    alias: 'widget.BIA-Header-Tool-PerformanceTracker-Summary',
    xtype: 'BIAPerformanceTrackerSummary',
    cls: 'BIAPerformanceTrackerSummary',

    title: 'AJAX Performance Tracker Summary',

    //draggable: false,
    //resizable: false,
    modal: true,
    bodyStyle: {
        border: 'none'
    },

    width: (window.innerWidth * .95),
    height: (window.innerHeight * .95),
    minWidth: window.innerWidth * .95 > 600 ? 600 : (window.innerWidth * .95),
    minHeight: window.innerHeight * .95 > 400 ? 400 : (window.innerHeight *.95),
    layout: {
        type: 'vbox',
        align: 'stretch',
        pack: 'start'
    },

    items: [
        { xtype: 'BIAPerformanceTrackerSummaryTabs', flex: 1 }
    ],

    lastHistoryRecordId: null,

    updateDataGrids: function updateDataGrids() {
        var performanceHistoryRecords = BIA.header.tool.PerformanceTrackerInterface.getPerformanceHistoryRecords(BIACore.Header.PerformanceTracker.GetLastViewedId());
        if (performanceHistoryRecords.length > 0) {
            performanceHistoryRecords.forEach(function (item) {
                if (item.performanceRecordId > this.lastHistoryRecordId) this.lastHistoryRecordId = item.performanceRecordId;
            }, this);
        }
        var LatestCallsGrid = this.down('BIAPerformanceTrackerLatestCalls');
        if (LatestCallsGrid && LatestCallsGrid.store) {
            LatestCallsGrid.store.loadData(performanceHistoryRecords);
        }

        var ProblemCallsGrid = this.down('BIAPerformanceTrackerProblemCalls');
        if (ProblemCallsGrid && ProblemCallsGrid.store) {
            ProblemCallsGrid.store.loadData(BIA.header.tool.PerformanceTrackerInterface.getPerformanceProblemHistoryRecords(BIACore.Header.PerformanceTracker.GetLastViewedId()));
        }

        this.fireEvent('griddataupdated', this);
    }
});