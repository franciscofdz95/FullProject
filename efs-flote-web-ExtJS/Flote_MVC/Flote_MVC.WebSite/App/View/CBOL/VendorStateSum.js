/* ====================================================================================================
NAME:			[Vendor State Summary Window]
BEHAVIOR:		Shows Vendor statement summary by invoice.
_______________________________________________________________________________________________________
REVISION HISTORY
-------------------------------------------------------------------------------------------------------
Date			    Modified By			  Modifications
-------------------------------------------------------------------------------------------------------
12/29/2016        Sudhir Dandale		 Created.
 ======================================================================================================*/
Ext.define('App.View.CBOL.VendorStateSum', {
    extend: 'Ext.window.Window',
    alias: 'widget.App-View-CBOL-VendorStateSum',
    itemId: 'vendorStateSummaryId',
    title: '<div style="font-weight: bold">Vendor State Summary</div>',
    rec: '',
    items: [
        { xtype: 'App-View-CBOL-FieldDetails', height: '5%' },
        { xtype: 'App-View-CBOL-TabPanel', itemId: 'cbolTabPanelId' }
    ],
    getCBOLData: function (recDet) {
        PgAtt.setInvoice_id(recDet.data.invoice_id);
        var me = this;
        me.rec = recDet;

        var data = IProcessingSCls.getInvoiceChargesDetails(recDet.data.invoice_id);
        me.down('form').loadValues(data);
        me.show();
        var grid = me.down('grid'),
            store = me.down('grid').getStore(),
            pager = grid.down('[xtype="pagingtoolbar"]');
        var filter = me.down('App-View-Component-Container-FilterPanelBase');
        store.getProxy().extraParams = filter.GetParameters();
        if (pager) pager.moveFirst(); else store.load();



    }


});