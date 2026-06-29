Ext.define('BIA.header.tool.PerformanceTracker.Detail', {
    extend: 'Ext.window.Window',
    alias: 'widget.BIA-Header-Tool-PerformanceTracker-Detail',
    xtype: 'BIAPerformanceTrackerDetail',
    cls: 'BIAPerformanceTrackerDetail',

    //title: 'Performance Tracker Request Detail',
    closable: false,
    draggable: false,
    resizable: false,
    modal: true,

    bodyStyle: {
        border: 'none',
        backgroundColor: 'white'
    },

    width: 800,
    //height: '75%',
    minWidth: 400,
    minHeight: 400,
    maxHeight: (window.innerHeight * .95),
    maxWidth: (window.innerWidth * .95),

    record: null,

    layout: {
        type: 'vbox',
        align: 'stretch',
        pack: 'start'
    },
    
    items: [
        { xtype: 'BIAPerformanceTrackerDetailTitle' },
        { xtype: 'BIAPerformanceTrackerDetailContainer', flex: 1 },
    ]
});