/* ====================================================================================================
NAME:			[Vat Tax Amount Container]
BEHAVIOR:		Shows Vat Tax Amount Container.
_______________________________________________________________________________________________________
REVISION HISTORY
-------------------------------------------------------------------------------------------------------
Date			    Modified By			  Modifications
-------------------------------------------------------------------------------------------------------
07/26/2016        Sudhir Dandale		 Created.
 ======================================================================================================*/
Ext.define('App.View.Component.VatTaxAmt', {
    extend: 'Ext.container.Container',
    alias: 'widget.App-View-Component-VatTaxAmt',
    layout: 'fit',
    title: 'Vat codes',
    items: [],

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
            title: 'Vat Codes Details',
            itemId: 'ContentPanel',
            region: 'center',
            border: true
        }, config.Report, me.Report);
    }
});