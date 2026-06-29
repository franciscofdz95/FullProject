/* ====================================================================================================
NAME:			[Report Container]
BEHAVIOR:		Shows Report Container.
_______________________________________________________________________________________________________
REVISION HISTORY
-------------------------------------------------------------------------------------------------------
Date			    Modified By			  Modifications
-------------------------------------------------------------------------------------------------------
07/26/2016        Sudhir Dandale		 Created.
 ======================================================================================================*/
Ext.define('App.View.Component.Report', {
    extend: 'Ext.container.Container',
    alias: 'widget.App-View-Component-Report',
    layout: 'border',
    title: 'Filtered Report',
    Filter: { xtype: 'App-View-Component-Filter-PanelBase' },
    Report: { xtype: 'panel' },

    items: [],

    constructor: function (config) {
        var me = this;
        config = config || {};

        config.items = Ext.Array.from(config.items);
        config.items.push(me.getFilterConfig(config));
        config.items.push(me.getReportConfig(config));

        me.callParent([config]);
    },
    getFilterConfig: function (config) {
        var me = this;
        return Ext.apply({
            xtype: 'container', itemId: 'FilterPanel',
            region: 'north',
            layout: {
                type: 'vbox',
                align: 'stretch'
            },
            defaults: { flex: 1, border: false },
            items: [
                {
                    xtype: 'panel', title: 'Filter', collapsible: true,
                    items: Ext.apply({}, config.Filter, me.Filter)
                },
                { xtype: 'App-View-Component-Filter-Display', title: null }
            ]
        });
    },
    getReportConfig: function (config) {
        var me = this;
        return Ext.apply({
            title: 'Grid',
            itemId: 'ContentPanel',
            region: 'center',
            border: false
        }, config.Report, me.Report);
    }
});