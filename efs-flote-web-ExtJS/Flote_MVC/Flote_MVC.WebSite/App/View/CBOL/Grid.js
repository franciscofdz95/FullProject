/* ====================================================================================================
NAME:			[CBOL/Charge Code Summary Grid ]
BEHAVIOR:		Shows CBOL / Charge Code grid Summary
_______________________________________________________________________________________________________
REVISION HISTORY
-------------------------------------------------------------------------------------------------------
Date			    Modified By			  Modifications
-------------------------------------------------------------------------------------------------------
12/29/2016        Sudhir Dandale		 Created.
 ======================================================================================================*/
Ext.define('App.View.CBOL.Grid', {
    extend: 'App.View.Component.Grid.Base',
    alias: 'widget.App-View-CBOL-Grid',
    store: {
        type: 'webapi',
        pageSize: 20,
        api: {
            read: 'api/WebAPIReport/GetCBolSumByInvId'
        },
        autoLoad: false
    },
    autoPageSize: false,
    tbar: [{ xtype: 'App-View-CBOL-TBar', width: '100%' }],
    bbar: [{ xtype: 'App-View-CBOL-BBar', width: '100%' }],
    viewConfig: {
        enableTextSelection: true,
        deferEmptyText: false,
        emptyText: 'No Matches Found! Verify the selected filter criteria.'
    },
    columnLines: true,
    defaults: { menuDisabled: false, align: 'left', border: 1, style: { borderColor: 'white', borderStyle: 'thin', color: 'white' } },
    cls: 'UBlue',
    columns: [
        {
            text: 'Carrier BOL ', itemId: 'colCarrierChargeBol', dataIndex: 'Carrier_BOL', renderer: CBOLSinCls.cbolColumnRenderSort
        },
        {
            text: 'Container <BR> No', itemId: 'colContainersCbol', dataIndex: 'Containers', renderer: CBOLSinCls.cbolColumnRenderSort
        },
        {
            xtype: 'actioncolumn',
            sortable: false,
            header: 'Status',
            renderer: function (value, metaData, record, row, col, store, gridView) {
                var me = this;
                return CBOLSinCls.cbolActionColRendered(me, value, metaData, record, row, col, store, gridView);

            },
            items: [
                {
                    icon: 'images/matched.png',  // Use a URL in the icon config
                    tooltip: '',
                    handler: function (grid, rowIndex, colIndex) {
                        var record = grid.getStore().getAt(rowIndex);
                        if (record.get('Ver_Charge_Code') != 0 && record.get('Shipment_Count') != 0 && record.get('NonVer_charge_code') == 0) {
                            var isProcessed = record.get('ChargeUsed');
                            if (isProcessed != 'Y') {
                                CBOLSinCls.processExcelDataToInvDetails(record, '');
                                this.fireEvent('btnApply');
                            }
                            else {
                                alert("Selected charge has already been selected on prior invoices. Please use invoice processing screen to split pay these charges")
                            }
                        }
                    }
                },
                {
                    icon: 'images/unmatched.png',  // Use a URL in the icon config
                    tooltip: ''
                }, {
                    icon: 'images/selected_img.png',  // Use a URL in the icon config
                    tooltip: ''
                },
                {
                    icon: 'images/info.png',  // Use a URL in the icon config
                    tooltip: ''
                },
                {
                    icon: 'images/Transaction money.png',  // Use a URL in the icon config
                    tooltip: 'Exchange Rate',
                    handler: function (grid, rowIndex, colIndex) {
                        var record = grid.getStore().getAt(rowIndex);
                        if (record.get('Buy_Cid_Orig') != record.get('Invoice_CID')) {
                            record.set('invoice_id', PgAtt.getInvoice_id());
                            if (record.get('comment') != '') {
                                IProcessingSCls.setFromCID(record.get('Buy_Cid'));
                                IProcessingSCls.setToCID(rec.get('Invoice_CID'));
                                var win = Ext.widget('App-View-InvoiceProcessing-ExchangeRateW');
                                win.rowDetails = record;
                                win.show();
                            }
                        }
                    }
                },
                {
                    icon: 'images/CC-icon.png',  // Use a URL in the icon config
                    tooltip: '',
                    handler: function (grid, rowIndex, colIndex) {
                        if (this.items[5].icon != "") {
                            grid.getStore().getAt(rowIndex);
                        }
                    }
                }
            ]
        },
        {
            text: 'Matched  <BR> Charge Codes', dataIndex: 'Ver_Charge_Code'
        },
        {
            text: 'Non-Matched <BR> Charge Codes', dataIndex: 'NonVer_charge_code'

        },
        {
            text: 'Selected <BR> Charge Codes', dataIndex: 'Processed_charge_code'
        },
        {
            text: 'Shipment</BR>Count', dataIndex: 'Shipment_Count'

        },
        {
            text: 'Container</BR>Count', dataIndex: 'Container_Count'

        },
        {
            text: 'Invoice Amt', dataIndex: 'Invoice_Amt', renderer: Utility.Formatting.NumFormat_Thousands_2Decimals
        },
        {
            text: 'E2k Buy <BR> Amt', dataIndex: 'E2K_Buy_Amt', renderer: Utility.Formatting.NumFormat_Thousands_2Decimals
        },
        {
            text: 'E2k Buy <BR> Curr', dataIndex: 'Buy_Cid_Orig'
        },
        {
            text: 'Diff Amt', dataIndex: 'Diff_Amt', renderer: Utility.Formatting.NumFormat_Thousands_2Decimals
        },
        {
            text: 'Sell Amt', dataIndex: 'Sell_Amt', renderer: Utility.Formatting.NumFormat_Thousands_2Decimals
        },
        {
            text: 'Net Amt', dataIndex: 'Net_Amt', renderer: Utility.Formatting.NumFormat_Thousands_2Decimals
        },
        {
            text: 'Selected <BR> Amt', dataIndex: 'Processed_Amt', renderer: Utility.Formatting.NumFormat_Thousands_2Decimals
        },
        {
            text: 'UnSelected <BR> Amt', renderer: function (value, metaData, record, row, col, store, gridView) {
                var val = record.get('Invoice_Amt') - record.get('Processed_Amt')
                return Utility.Formatting.NumFormat_Thousands_2Decimals(val, metaData);
            }
        },
        {
            text: 'Comment', dataIndex: 'Comment'
        },
        {
            xtype: 'widgetcolumn',
            header: 'Commit <BR> Explanation',
            dataIndex: 'CommitEx',
            renderer: function (value, metadata, record, rowIndex, colIndex, store) {
                metadata.tdAttr = 'data-qtip="' + Ext.String.htmlEncode(value) + '"';
                return value;
            },
            widget: {
                xtype: 'textfield',
                autoColumnResize: true,
                listeners: {
                    change: function (text, newValue, OldValue) {
                        var value = this.getValue();
                        if (value.length > 0) {
                            var record = text.getWidgetRecord();
                            record.set('CommitEx', Ext.util.Format.trim(value));
                        }

                    }
                }
            },
            onWidgetAttach: function (column, widget, record) {
                if (CBOLSinCls.getCbolPageType() === 'CC' && CBOLSinCls.getCbolStatus() == 'NonMatched' && record.get('ChargeUsed') != 'Y' && record.get('Shipment_Count') > 0) {
                    widget.setVisible(true);
                    widget.setDisabled(false);
                } else {
                    widget.setDisabled(true);
                }
            }
        },
        {
            xtype: 'widgetcolumn',
            text: '',
            sortable: false,
            hidden: true,
            widget: {
                xtype: 'button',
                text: 'Save',
                hidden: true,
                listeners: {
                    'click': function (btn, records) {
                        var record = btn.getWidgetRecord();
                        var cmts = Ext.util.Format.trim(record.get('CommitEx'));

                        if (cmts != '') {
                            CBOLSinCls.processExcelDataToInvDetails(record, cmts);
                            this.fireEvent('btnApply');
                            record.dirty = false;
                        }
                        else {
                            alert("Valid comment is missing for selected row.")
                        }
                    }
                }
            },
            onWidgetAttach: function (column, widget, record) {
                if (CBOLSinCls.getCbolPageType() === 'CC' && CBOLSinCls.getCbolStatus() == 'NonMatched' && record.get('ChargeUsed') != 'Y' && record.get('Shipment_Count') > 0) {
                    widget.setVisible(true);
                } else {
                    widget.setVisible(false);
                }
            }
        }
    ],
    features: [{
        ftype: 'remotesummary', dock: 'bottom', style: '', renderer: function (value, metaData, record, row, col, store, gridView) {
            metaData.tdAttr = 'data-qtip="' + Ext.String.htmlEncode(value) + '"';
            return Utility.Formatting.NumFormat_Thousands_2Decimals(value, metaData);
        }
    }]

});