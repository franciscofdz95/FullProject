Ext.create('Ext.data.Store', {
    storeId: 'BIAPerformanceTrackerProblemCallsStore',
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
    ]
});

Ext.define('BIA.header.tool.PerformanceTracker.Summary.ProblemCalls', {
    extend: 'BIA.header.tool.PerformanceTracker.Component.Grid',
    alias: 'widget.BIA-Header-Tool-PerformanceTracker-Summary-ProblemCalls',
    xtype: 'BIAPerformanceTrackerProblemCalls',

    store: 'BIAPerformanceTrackerProblemCallsStore'
});