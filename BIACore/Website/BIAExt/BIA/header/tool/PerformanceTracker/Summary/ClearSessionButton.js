Ext.define('BIA.header.tool.PerformanceTracker.Summary.ClearSessionButton', {
    extend: (Ext.platformTags && Ext.platformTags.modern) ? 'Ext.Button' : 'Ext.button.Button',
    alias: 'widget.BIA-Header-Tool-PerformanceTracker-Summary-ClearSessionButton',
    xtype: 'BIAPerformanceTrackerSummaryClearSessionButton',

    cls: 'BIAPerformanceTrackerSummaryClearSessionButton',

    //floating: true,
    //constrain: true,
    //draggable: false,
    //initDraggable: Ext.window.Window.prototype.initDraggable,
    text: 'Clear Current Tracking Session'
    //disabled: true,
    //x: 800,
    //y: 40
});