/* ====================================================================================================
NAME:			[Invoice Processing Window]
BEHAVIOR:		Shows Invoice  processing Detail Fields filter criteria and invoice Processing grid in a window.
_______________________________________________________________________________________________________
REVISION HISTORY
-------------------------------------------------------------------------------------------------------
Date			    Modified By			  Modifications
-------------------------------------------------------------------------------------------------------
07/26/2016        Sudhir Dandale		 Created.
 ======================================================================================================*/
Ext.define('App.View.InvoiceProcessing.InvoiceProcessing', {
    extend: 'Ext.window.Window',
    alias: 'widget.App-View-InvoiceProcessing-InvoiceProcessing',
    itemId: 'InvoiceProcessingId',
    title: '<div style="font-weight: bold">Invoice Processing</div>',
   // width: IProcessingSCls.getWidth(), //Ext.getBody().getViewSize().width ,//'100%',
    modal: true,
   // height: IProcessingSCls.getHeight(),// Ext.getBody().getViewSize().height ,//'100%',
    autoScroll: true,
    rec: '',
    closable: true,
    closeAction: 'close',
    defaults: {
        labelWidth: 100
    },
    items: [
        { xtype: 'App-View-InvoiceProcessing-InvoiceDetailsFormFilter', height: '5%', text: 'Invoice Details' },
        { xtype: 'App-View-InvoiceProcessing-Grid', itemId: 'invoiceProcessingGridId' }
    ],
    getProcessingData: function (recDet, pageType) {
        var me = this;
        this.width = Ext.getBody().getViewSize().width;
        this.height = Ext.getBody().getViewSize().height;
        // IProcessingSCls.setHeight('' + Ext.getBody().getViewSize().height + 'px');
        IProcessingSCls.setPageType(pageType);
        recDet.set('pageType', pageType)
        me.rec = recDet;
        me.down('#FilterFieldsPopUpId').rowData = recDet;
        IProcessingSCls.getVATCodesBP(recDet.get('invoice_id'), 0)
        PgAtt.setInvoice_id(recDet.get('invoice_id'));
        IProcessingSCls.setInvoice_id(recDet.get('invoice_id'));
        IProcessingSCls.setInvoiceCID(recDet.get('Invoice_CID'));
        IProcessingSCls.setRecDetails(recDet);
        me.down('form').loadValues();
        IProcessingSCls.updateVATInvoiceDetail(recDet.get('invoice_id'));
        me.show();
        grid = me.down('grid');
        store = me.down('grid').getStore();
        pager = grid.down('[xtype="pagingtoolbar"]');
        var filter = me.down('App-View-Component-Container-FilterPanelBase');
        store.getProxy().extraParams = filter.GetParameters();

        if (pageType == 'Containers') {
            if (recDet.get('Containers').split(',').length > 1) {
                store.getProxy().extraParams.Containers = recDet.get('Containers');
            }
        }
        if (pager) pager.moveFirst(); else store.load();
    }
});