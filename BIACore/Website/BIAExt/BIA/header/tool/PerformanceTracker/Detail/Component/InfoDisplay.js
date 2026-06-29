Ext.define('BIA.header.tool.PerformanceTracker.Detail.Component.InfoDisplay', {
    extend: (Ext.platformTags && Ext.platformTags.modern) ? 'Ext.Container' : 'Ext.container.Container',
    alias: 'widget.BIA-Header-Tool-PerformanceTracker-Detail-Component-InfoDisplay',
    xtype: 'BIAPerformanceTrackerDetailInfoDisplay',

    label: null,
    dataValue: null,
    displayCode: false,

    viewModel: {
        formulas: {
            getHidden: function (get) {
                return this.getView().label == null || this.getView().dataValue == null;
            }
        }
    },

    layout: {
        type: 'vbox',
        align: 'stretch',
        pack: 'start'
    },
    
    margin: '0 0 10 0',

    defaults: {
        padding: '5 0'
    },

    items: [
        {
            xtype: 'container',
            itemId: 'label',
            style: {
                fontSize: '18px',
                fontWeight: 'bold'
}
        },
        {
            xtype: 'container',
            itemId: 'dataValue',
            style: {
                fontSize: '14px'
            },
            padding: 0
        }
    ]
});