/* ====================================================================================================
NAME:			[Non-E2k cost DD ]
BEHAVIOR:		Shows Non E2k cost charges.
_______________________________________________________________________________________________________
REVISION HISTORY
-------------------------------------------------------------------------------------------------------
Date			    Modified By			  Modifications
-------------------------------------------------------------------------------------------------------
12/01/2016        Sudhir Dandale		 Created.
 ======================================================================================================*/
Ext.define('App.View.InvoiceProcessing.NonE2kCost', {
    extend: 'BIA.container.FilterContainer',
    alias: 'widget.App-View-InvoiceProcessing-NonE2kCost',
    layout: 'hbox',
    itemId: 'nonE2kCostId',
    items: [
         { xtype: 'label', html: '<Div style="font-weight: bold;">Insert Non-E2k Cost:</Div> ' },
         {
             xtype: 'combobox',
             emptyText: 'Select Custom Charge Code',
             store: {
                 type: 'webapi',
                 api: {
                     read: 'api/WebAPIReport/GetNonE2kCost'
                 },
                 listeners: {
                     beforeload: function (store, operation, eOpts) {
                         var rec = IProcessingSCls.getRecDetails();
                         var invoice_id = PgAtt.getInvoice_id();
                         var shipNo = PgAtt.getShipment_number();
                         var changeDesc = Ext.isDefined(operation._params) ? operation._params.query : "";                         
                         var query = '';
                         if (rec != '') {
                             invoice_id = rec.get('invoice_id');
                             shipNo = Ext.isDefined(rec.get('shipment_number')) ? rec.get('shipment_number') : shipNo;
                         }
                         query = invoice_id + ',' + shipNo;
                         if (Ext.isDefined(operation._params)) {
                             operation._params.query = query;
                             store.proxy.extraParams = { shipmentNumber: query, chargeDescription: changeDesc };
                         } else {
                             store.proxy.extraParams = { shipmentNumber: query, chargeDescription: changeDesc };
                         }
                         // But operation.params and operation.getParams() is always null
                     }
                 },
                 remoteFilter: false
             },
             valueField: 'charge_code',
             displayField: 'charge_description',
             itemId: 'nonE2kCostIdCombo',
             minChars: 3,
             matchFieldWidth: false,
             width: '70%',
             listConfig: {
                 loadingText: 'Searching...',
                 emptyText: 'No matching posts found.',
                 // Custom rendering template for each item
                 getInnerTpl: function () {
                     return '<div>' + '{charge_code} - {charge_description} ({ora_account_code} {intl_rev_allocation} - {FINANCIAL_ORIG_DEST_CODE} ' + '</div>';
                 }
             },
             listeners: {
                 'select': function (combo, records) {
                     var me = this;
                     var grid = me.up('grid');
                     var invCurr = PgAtt.getDisplay_currency();
                     var rec = grid.getStore().getAt(0);
                     me.fireEvent('nonE2kCostId', records, rec, invCurr);
                     me.getStore().reload();
                     combo.setValue('');
                     combo.emptyText = 'Select Custom Charge Code';
                     combo.applyEmptyText();
                 }
             }

         }]
});