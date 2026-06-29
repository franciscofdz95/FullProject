Ext.define('BIA.header.tool.PerformanceTracker.Summary.DataRefreshButton', {
    extend: (Ext.platformTags && Ext.platformTags.modern) ? 'Ext.Button' : 'Ext.button.Button',
    alias: 'widget.BIA-Header-Tool-PerformanceTracker-Summary-DataRefreshButton',
    xtype: 'BIAPerformanceTrackerSummaryDataRefreshButton',

    cls: 'BIAPerformanceTrackerSummaryDataRefreshButton',

    //floating: true,
    //constrain: true,
    //draggable: false,
    //initDraggable: Ext.window.Window.prototype.initDraggable,
    text: 'New Data Available',
    disabled: true
    //x: 800,
    //y: 40
});