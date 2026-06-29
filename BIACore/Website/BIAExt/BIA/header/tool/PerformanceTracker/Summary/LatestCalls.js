Ext.create('Ext.data.Store', {
    storeId: 'BIAPerformanceTrackerLatestCallsStore',
    fields: [
        'storeId'
        , 'StartRequest'
        , 'EndRequest'
        , 'Start'
        , 'End'
        , 'AppWebAPIStart'
        , 'AppWebAPIEnd'
        , 'WebAPIRoute'
        , 'CallString'
        , 'ExtraParams'
        , 'TransactionId'
        , 'RecordsReturned'
        , 'TotalRecords'
        , 'DBTime'
        , 'DataLoadTime'
        , 'BIAWebAPITime'
        , 'AppWebAPITime'
        , 'RequestTime'
        , 'BIAWebAPIOnlyTime'
        , 'AppWebAPIOnlyTime'
        , 'AppWebAPIStartTime'
        , 'AppWebAPIEndTime'
        , 'WebAPIOnlyTime'
        , 'WebAPIStartTime'
        , 'WebAPIEndTime'
        , 'NetworkOnlyTime'
        , 'InitTime'
        , 'NetworkEndTime'
        , 'Status'
        , 'ProblemLevel'
        , 'ProblemArea'
        , 'AnalysisDescription'
        , 'type'
        , 'BIASQLInjectionTest'
    ]
});

Ext.define('BIA.header.tool.PerformanceTracker.Summary.LatestCalls', {
    extend: 'BIA.header.tool.PerformanceTracker.Component.Grid',
    alias: 'widget.BIA-Header-Tool-PerformanceTracker-Summary-LatestCalls',
    xtype: 'BIAPerformanceTrackerLatestCalls',

    store: 'BIAPerformanceTrackerLatestCallsStore'
});