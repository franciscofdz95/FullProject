/* ====================================================================================================
NAME:			[Bills Details Report TBar Fields]
BEHAVIOR:		Shows Bill Details Reports Tbar Info.
_______________________________________________________________________________________________________
REVISION HISTORY
-------------------------------------------------------------------------------------------------------
Date			    Modified By			  Modifications
-------------------------------------------------------------------------------------------------------
11/09/2016        Sudhir Dandale		 Created.
 ======================================================================================================*/
Ext.define('App.View.Bills.Detail.TBar', {
    extend: 'Ext.FormPanel',
    alias: 'widget.App-View-Bills-Detail-TBar',
    width: '100%',
    bodyStyle: 'background:#DFE8F6',
    layout: 'hbox',
    items: [
        {
            xtype: 'container',
            itemId: 'billsDetailsReportTBar',
            bodyStyle: 'background:#DFE8F6',
            width: '100%',
            layout: 'vbox',
            border: false,
            items: [
                {
                    xtype: 'container',
                    bodyStyle: 'background:#DFE8F6',
                    itemId: 'btnContainerBD',
                    width: '100%',
                    layout: 'hbox',
                    border: false,
                    items: [
                        { xtype: 'button', itemId: 'btnApprove', hidden: true, cls: 'btn', margin: '5 5 0 5', text: 'Approve' },
                        { xtype: 'button', itemId: 'btnReturn', hidden: true, cls: 'btn', margin: '5 5 0 5', text: 'Return' },
                        { xtype: 'button', itemId: 'btnUnApprove', hidden: true, cls: 'btn', margin: '5 5 0 5', text: 'Un-Approve' },
                        { xtype: 'button', itemId: 'btnRetToApprove', hidden: true, cls: 'btn', margin: '5 5 0 5', text: 'Return to Approved Status' },
                        { xtype: 'button', itemId: 'btnRvwEtCodding', hidden: true, cls: 'btn', margin: '5 5 0 5', text: 'Review/Edit Coding Sheet' },
                        { xtype: 'button', itemId: 'btnAddToAputQ', hidden: true, cls: 'btn', margin: '5 5 0 5', text: 'Add to APUT Queue' },
                        { xtype: 'button', itemId: 'btnRmvFrmAputQ', hidden: true, cls: 'btn', margin: '5 5 0 5', text: 'Remove From APUT Queue' },
                        {
                            xtype: 'label', itemId: 'msgIncompleteInvDet', text: '', style: 'color:red;font-weight:bold; font-size:12px;', margin: '5 5 0 5',
                            listeners: {
                                afterrender: function () {
                                    if (PgAtt.getIncompleteInvoice() > 0 && PgAtt.getInvoice_status() == 'Verified') {
                                        this.setText('(' + PgAtt.getIncompleteInvoice() + ') invoices are older than one week and are stuck in Approved or Printed status. Please ensure these get moved to Scanned status.');
                                        this.getEl().frame('#EC0419', 3, { duration: this.animationDuration / 2 });
                                    }
                                }
                            }
                        },
                        { xtype: 'tbseparator', itemId: 'tbSepBillDet', margin: '0 0 0 5', width: '2%' },
                        { xtype: 'tbfill', itemId: 'tbSepBillDet' },
                        {
                            xtype: 'button', itemId: 'btnPrintBillDetailsReportEXCEL', margin: '5 5 5 5', hidden: false, //icon: 'images/excel_button_16.png',
                            text: '<img title="Print the Bill Detail Reports" style="width: 14px; height: 16px; vertical-align: middle;" src="images/excel_button_16.png"   />'
                        },
                        {
                            xtype: 'button', itemId: 'btnPrintBillDetailsReportPDF', margin: '5 25 5 5', hidden: false, 
                            text: '<img title="Print the Bill Detail Reports" style="width: 14px; height: 16px; vertical-align: middle;" src="images/button_print.gif"  />'
                        }
                    ]
                }
                ,
                {
                    xtype: 'label', itemId: 'msgSCACCodeId', text: '', style: 'color:red;font-weight:bold; font-size:12px;', margin: '5 5 0 5',
                    listeners: {
                        afterrender: function () {
                            var rec = this.up('grid').rowData;
                            var scanFlag = BillsSingCls.getSCACCode(this, rec.get('invoice_id'));
                            if (scanFlag && PgAtt.getInvoice_status() == 'Verified') {
                                this.setText('FORCE CARD: Invoice Vendor does not match MBLD carrier : ' + rec.get('ModifiedBy') + ' : ' + rec.get('Comment'));
                            }
                        }
                    }
                }
            ]
        }
    ]

});