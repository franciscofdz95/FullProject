Ext.define('BIA.header.tool.PerformanceTracker.Detail.Component.TimelinePart', {
    extend: (Ext.platformTags && Ext.platformTags.modern) ? 'Ext.Container' : 'Ext.container.Container',
    alias: 'widget.BIA-Header-Tool-PerformanceTracker-Detail-Component-TimelinePart',
    xtype: 'PerformanceTrackerDetailTimelinePart',
    cls: 'PerformanceTrackerDetailTimelinePart',

    layout: {
        type: 'vbox',
        align: 'stretch',
        pack: 'start'
    },
    border: true,

    items: [
        {
            xtype: 'container',
            itemId: 'BlockSection',
            height: 50,
            padding: '5 3'
            //width: '100%'
        },
        {
            xtype: 'container',
            itemId: 'TimeDisplay',
            padding: '5 0 0'
        }
    ]
});