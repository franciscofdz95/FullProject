/* ====================================================================================================
NAME:			[Filter Criteria container ]
BEHAVIOR:		Shows all the filter criteria in container.
_______________________________________________________________________________________________________
REVISION HISTORY
-------------------------------------------------------------------------------------------------------
Date			    Modified By			  Modifications
-------------------------------------------------------------------------------------------------------
07/26/2016        Sudhir Dandale		 Created.
 ======================================================================================================*/
Ext.define('App.View.Component.FilteredReport', {
    extend: 'Ext.container.Container',
    alias: 'widget.App-View-Component-FilteredReport',
    layout: 'border',
    height: '100%',
    baseCls: 'UPS_Blue_2',
    Filter: { xtype: 'App-View-Component-Container-FilterPanelBase' },
    Report: { xtype: 'panel' },
    items: [],
    constructor: function (config) {
        var me = this;
        config = config || {};

        config.items = Ext.Array.from(config.items);
        config.items.push(me.getFilterConfig(config));
        me.callParent([config]);
    },
    getFilterConfig: function (config) {
        var me = this;
        return Ext.apply({
            xtype: 'panel', itemId: 'FilterPanel',
            width: 220,
            region: 'north',
            layout: {
                type: 'vbox',
                align: 'stretch'
            },
            defaults: { flex: 1, border: false },
            items: [
                {
                    xtype: 'panel', items: Ext.apply({}, config.Filter, me.Filter)
                }
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