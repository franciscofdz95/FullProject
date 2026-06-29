/* ====================================================================================================
NAME:			[Filter Criteria Pop up ]
BEHAVIOR:		Shows all the filter criteria for Invoice processing Pop window.
_______________________________________________________________________________________________________
REVISION HISTORY
-------------------------------------------------------------------------------------------------------
Date			    Modified By			  Modifications
-------------------------------------------------------------------------------------------------------
07/26/2016        Sudhir Dandale		 Created.
 ======================================================================================================*/
Ext.define('App.View.Component.FilteredReportPop', {
    extend: 'Ext.container.Container',
    alias: 'widget.App-View-Component-FilteredReportPop',
    //layout: 'border',
    title: '<Div style="font-weight:bold; font-size:12px;color:white;">Filter Criteria</Div>',
    height: '100%',
    baseCls: 'UPS_Blue_3',
    Filter: { xtype: 'App-View-Component-Container-FilterPanelBase' },
    Report: { xtype: 'panel' },

    items: [],
    constructor: function (config) {
        var me = this,
            config = config || {};

        config.items = Ext.Array.from(config.items);
        config.items.push(me.getFilterConfig(config));
        //config.items.push(me.getReportConfig(config));

        me.callParent([config]);
    },
    initComponent: function () {
        this.callParent(arguments);
    },
    getFilterConfig: function (config) {
        var me = this;
        return Ext.apply({
            xtype: 'panel', itemId: 'FilterPanelPop',
            region: 'north',
            layout: {
                type: 'vbox',
                align: 'fit'
            },
            //layout: 'border',
           // defaults: { flex: 1, border: true },
            items: [
                {
                 //   xtype: 'panel', title: '<Div style="font-weight:bold; font-size:12px;color:white;">Filter Criteria</Div>', collapsible: false,
                    items: Ext.apply({}, config.Filter, me.Filter)
                }//,
              //{ xtype: 'App-View-Component-FilterDisplay', title:null }
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