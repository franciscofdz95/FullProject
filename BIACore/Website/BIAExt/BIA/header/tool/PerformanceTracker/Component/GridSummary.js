Ext.define('BIA.header.tool.PerformanceTracker.Component.GridSummary', {
    extend: (Ext.platformTags && Ext.platformTags.modern) ? 'Ext.Container' : 'Ext.container.Container',
    alias: 'widget.BIA-Header-Tool-PerformanceTracker-Component-GridSummary',
    xtype: 'PerformanceTrackerGridSummary',

    layout: {
        type: 'hbox',
        align: 'stretch',
        pack: 'center'
    },

    style: {
        backgroundColor: '#fafafa'
    },

    items: [
        { xtype: 'tbfill', flex: 1 },
        {
            xtype: 'container',
            itemId: 'RequestCount'
        },
        { xtype: 'tbfill', flex: 1 },
        {
            xtype: 'container',
            itemId: 'AvgRecordCount'
        },
        { xtype: 'tbfill', flex: 1 },
        {
            xtype: 'container',
            itemId: 'AvgRequestTime'
        },
        { xtype: 'tbfill', flex: 1 },
    ]
});