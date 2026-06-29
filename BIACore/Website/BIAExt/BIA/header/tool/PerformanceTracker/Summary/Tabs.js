Ext.define('BIA.header.tool.PerformanceTracker.Summary.Tabs', {
    extend: 'Ext.tab.Panel',
    alias: 'widget.BIA-Header-Tool-PerformanceTracker-Summary-Tabs',
    xtype: 'BIAPerformanceTrackerSummaryTabs',

    layout: {
        //type: 'vbox', //Issue with this in ExtJS 7.0..
        align: 'begin',
        pack: 'start'
    },
    width: 1000,

    items: [
        {
            xtype: 'container',
            title: 'Latest Calls',
            flex: 1,
            layout: {
                type: 'vbox',
                align: 'stretch',
                pack: 'start'
            },
            items: [
                { xtype: 'BIAPerformanceTrackerLatestCalls', flex: 1 }
            ]
        },
        {
            xtype: 'container',
            title: 'Problem Calls',
            flex: 1,
            layout: {
                type: 'vbox',
                align: 'stretch',
                pack: 'start'
            },
            items: [
                { xtype: 'BIAPerformanceTrackerProblemCalls', flex: 1 }
            ]
        },
    ]
});