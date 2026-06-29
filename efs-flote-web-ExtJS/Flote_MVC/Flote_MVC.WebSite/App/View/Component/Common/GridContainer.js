/* ====================================================================================================
NAME:			[Grid Container]
BEHAVIOR:		Common container for all the grids in Flote
_______________________________________________________________________________________________________
REVISION HISTORY
-------------------------------------------------------------------------------------------------------
Date			    Modified By			  Modifications
-------------------------------------------------------------------------------------------------------
07/26/2016        Sudhir Dandale		 Created.
 ======================================================================================================*/
Ext.define('App.View.Component.Common.GridContainer', {
    extend: 'Ext.container.Container',
    alias: 'widget.App-View-Component-Common-GridContainer',
    layout: 'border',
    items: [
    ],

    constructor: function (config) {
        var me = this;
        config = config || {};
        config.items = Ext.Array.from(config.items);
        config.items.push(me.getReportConfig(config));
        me.callParent([config]);
    },
    getReportConfig: function (config) {
        var me = this;
        return Ext.apply({
            itemId: 'ContentPanel',
            region: 'center',
            border: false
        }, config.Report, me.Report);
    },
    getFilterConfig: function () {
        return Ext.apply({
            xtype: 'container', itemId: 'FilterPanel',
            region: 'north',
            defaults: { flex: 1, border: false },
            items: [
                { xtype: 'button', width: '100px', region: 'center', itemId: 'ApplyButtontest', text: '<div style="font-weight: bold; float:"center">Log Vendor Bill</div>' }
            ]
        });
    }
});