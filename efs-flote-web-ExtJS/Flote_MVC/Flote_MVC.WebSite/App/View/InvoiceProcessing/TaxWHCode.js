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
Ext.define('App.View.InvoiceProcessing.TaxWHCode', {
    extend: 'BIA.container.FilterContainer',
    alias: 'widget.App-View-InvoiceProcessing-TaxWHCode',
    layout: 'hbox',
    hidden: true,
    itemId: 'taxWHCodeId',
    items: [
        { xtype: 'label', html: '<Div style="font-weight: bold;">Tax Withholding:</Div>' },
        {
            xtype: 'combobox',
            emptyText: 'Select Tax Withholding',
            store: {
                type: 'webapi',
                api: {
                    read: 'api/WebAPIReport/GetTWHCodes'
                },
                listeners: {
                    beforeload: function (store, operation, eOpts) {
                        var pageType = IProcessingSCls.getPageType(),
                            invoice_id = PgAtt.getInvoice_id(),
                            locCode = PgAtt.getLocation_code(),
                            query = '',
                            rec = '',
                            invCurr = PgAtt.getDisplay_currency();
                        if (pageType == 'LVB') {
                            rec = IProcessingSCls.getNewRecDetails();
                            if (!Ext.isEmpty(rec)) {
                                invoice_id = Ext.isDefined(rec.Invoice_id) ? rec.Invoice_id : invoice_id;
                                locCode = Ext.isDefined(rec.location_code) ? rec.location_code : locCode;
                                invCurr = Ext.isDefined(rec.Invoice_CID) ? rec.Invoice_CID : invCurr;
                            }
                        } else {
                            rec = IProcessingSCls.getRecDetails();
                            if (!Ext.isEmpty(rec)) {
                                invoice_id = rec.get('invoice_id');
                                locCode = rec.get('Location_Code');
                                invCurr = rec.get('Invoice_CID');
                            }
                        }
                        query = invCurr + ',' + invoice_id + ',' + locCode;
                        if (Ext.isDefined(operation._params)) {
                            operation._params.query = query;
                            store.proxy.extraParams = { exParams: query };
                        } else {
                            store.proxy.extraParams = { exParams: query };
                        }
                        // But operation.params and operation.getParams() is always null
                    }
                },
                remoteFilter: false
            },
            valueField: 'ValueString',
            displayField: 'Description',
            width: '60%',
            editable: false,
            anchor: '100%',
            listConfig: {
                loadingText: 'Searching...',
                emptyText: 'No matching posts found.',
                // Custom rendering template for each item
                getInnerTpl: function () {
                    return '<div>' + '{Description} ' + '</div>';
                }
            },            
            listeners: {
                'select': function (combo, records) {
                    var me = this;
                    var grid = me.up('grid');
                    var record = grid.getStore().getAt(0);
                    me.fireEvent('taxWHCodeId', record, records);
                    me.getStore().reload();
                    combo.setValue('');
                    combo.emptyText = 'Select Tax Withholding';
                    combo.applyEmptyText();
                }
            }

        }]
});