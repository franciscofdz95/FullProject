Ext.define('BIA.header.tool.PerformanceTracker.Detail.Timeline', {
    extend: (Ext.platformTags && Ext.platformTags.modern) ? 'Ext.Container' : 'Ext.container.Container',
    alias: 'widget.BIA-Header-Tool-PerformanceTracker-Detail-Timeline',
    xtype: 'BIAPerformanceTrackerDetailTimeline',

    layout: {
        type: 'hbox',
        align: 'stretch',
        pack: 'middle'
    },

    width: 700,
    padding: '5 0 10',

    defaults: {
        minWidth: 40
    },
    items: [
        {
            xtype: 'PerformanceTrackerDetailTimelinePart',
            itemId: 'Init',
            blockStyle: {'background-color': '#007F46'},
            displayLabel: 'Init'
        },
        {
            xtype: 'PerformanceTrackerDetailTimelinePart',
            itemId: 'WebAPIStart',
            blockStyle: { 'background-color': '#357dc8' },
            displayLabel: 'API<br>Start'
        },
        {
            xtype: 'PerformanceTrackerDetailTimelinePart',
            itemId: 'Database',
            blockStyle: { 'background-color': '#7b528c' },
            displayLabel: 'DB'
        },
        {
            xtype: 'PerformanceTrackerDetailTimelinePart',
            itemId: 'Dataload',
            blockStyle: { 'background-color': '#e76f42' },
            displayLabel: 'Data<br>Load'
        },
        {
            xtype: 'PerformanceTrackerDetailTimelinePart',
            itemId: 'WebAPIEnd',
            blockStyle: { 'background-color': '#357dc8' },
            displayLabel: 'API<br>End'
        },
        {
            xtype: 'PerformanceTrackerDetailTimelinePart',
            itemId: 'Network',
            blockStyle: { 'background-color': '#646161' },
            displayLabel: 'Network'
        }
    ]
});