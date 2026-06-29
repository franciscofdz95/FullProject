Ext.define('BIA.header.tool.PerformanceTracker.Summary.NewSessionButton', {
    extend: (Ext.platformTags && Ext.platformTags.modern) ? 'Ext.Button' : 'Ext.button.Button',
    alias: 'widget.BIA-Header-Tool-PerformanceTracker-Summary-NewSessionButton',
    xtype: 'BIAPerformanceTrackerSummaryNewSessionButton',

    cls: 'BIAPerformanceTrackerSummaryNewSessionButton',

    //floating: true,
    //constrain: true,
    //draggable: false,
    //initDraggable: Ext.window.Window.prototype.initDraggable,
    text: 'Start New Tracking Session'
    //disabled: true,
    //x: 800,
    //y: 40
});