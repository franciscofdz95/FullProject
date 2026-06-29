/* ====================================================================================================
NAME:			[Log Vendor VAT Grid]
BEHAVIOR:		Shows Log Vendor VAT Grid.
_______________________________________________________________________________________________________
REVISION HISTORY
-------------------------------------------------------------------------------------------------------
Date			    Modified By			  Modifications
-------------------------------------------------------------------------------------------------------
07/26/2016        Sudhir Dandale		 Created.
 ======================================================================================================*/
Ext.define('App.View.LogVendor.VatTaxAmt', {
    extend: 'Ext.grid.Panel',
    alias: 'widget.App-View-LogVendor-VatTaxAmt',
    //border: true,
    store: {
        type: 'webapi',
        api: {
            read: 'api/WebAPIReport/VatTaxAmt'
        }

    },
    selModel: 'cellmodel',
    plugins: {
        ptype: 'cellediting',
        clicksToEdit: 1,
        listeners: {
            beforeedit: function (e, obj) {
                var me = this;
                var c = obj.record.get('vat_percent');
                if (c == 0) {
                    me.isEditAllowed = true;
                    return true;
                }
            }
        }
    },
    viewConfig: {
        getRowClass: function (record, rowIndex, rp, ds) {
            var me = this;
            var win = me.up('window');
            var chkBox = win.down('#filShowAllVatsLVB checkbox').getValue();
            if (chkBox) { return 'rowVat'; }
            else { return (record.data.ActiveVAT == 1 ? 'rowVat' : 'rowHideVat'); }

        }
    },
    bbar: [
        { xtype: 'App-View-LogVendor-BBar', width: '100%' }
    ],
    columnLines: true,
    defaults: { menuDisabled: false, align: 'left', border: 1, sortable: true, autoColumnResize: true },
    cls: 'UBlue',
    border: 1,
    columns: [
        {
            text: '<Div style="color:white;">ROWID</Div>', dataIndex: 'ROWNUMBER', hidden: true
        },

        {
            text: '<Div style="color:white;">VAT Code</Div>', dataIndex: 'vat_code'
        },
        {
            text: '<Div style="color:white;">VAT Percent</Div>', dataIndex: 'vat_percent'
        },
        {
            xtype: 'widgetcolumn',
            baseCls: 'UPS_Blue_2',
            dataIndex: 'Amount',
            text: 'Taxable Amount',
            sortable: false,
            widget: {
                xtype: 'textfield',
                enableKeyEvents: true,
                dataIndex: 'Amount',
                //regex: /^(-?(\d*)|(-?\d*\.\d{1,6}))$/,
                maskRe: /[0-9.-]/,
                listeners: {
                    blur: function (text, event, eOpts) {
                        var isValid = /^(-?(\d*)|(-?\d*\.\d{1,6}))$/.test(this.getValue()), record = '', vatAmt = '', win = '', offsetVatRec = '', vatAmtOS = '';
                        if (this.getValue() != "" && isValid) {
                            win = this.up('window');
                            record = text.getWidgetRecord();
                            record.set('Amount', this.getValue());
                            vatAmt = LogVendorSCls.calculateVatAmount(record, this.getValue());
                            vatAmt = vatAmt !== undefined ? vatAmt : '';
                            record.set('VAT_Amount', vatAmt);

                            if (record.get('IsVatOffSet') == 'Y' && record.get('IS_OFFSET_LOC') == 'Y') {
                                offsetVatRec = this.up('grid').getStore().findRecord('vat_code', record.get('vat_code') + '-OS');
                                offsetVatRec.set('Amount', this.getValue());
                                vatAmtOS = LogVendorSCls.calculateVatAmount(offsetVatRec, this.getValue());
                                vatAmtOS = vatAmtOS !== undefined ? vatAmtOS : '';
                                offsetVatRec.set('OSOffset', vatAmtOS);
                                offsetVatRec.set('Amount', '');
                            }
                            LogVendorSCls.calTotalBillAmount(win);

                        }
                        else {
                            if (this.getValue() != "") {
                                alert("Taxable Amount field only allows 6 digits after decimal");
                                this.setValue(0.00);
                            }
                            // Vendor Bill Total does not update on this screen when edits are made. by Sriram                            
                            win = this.up('window');
                            record = text.getWidgetRecord();
                            record.set('Amount', this.getValue());
                            vatAmt = LogVendorSCls.calculateVatAmount(record, this.getValue());
                            vatAmt = vatAmt !== undefined ? vatAmt : '';
                            record.set('VAT_Amount', vatAmt);
                            if (record.get('IsVatOffSet') == 'Y' && record.get('IS_OFFSET_LOC') == 'Y') {
                                offsetVatRec = this.up('grid').getStore().findRecord('vat_code', record.get('vat_code') + '-OS');
                                offsetVatRec.set('Amount', this.getValue());
                                vatAmtOS = LogVendorSCls.calculateVatAmount(offsetVatRec, this.getValue());
                                vatAmtOS = vatAmtOS !== undefined ? vatAmtOS : '';
                                offsetVatRec.set('OSOffset', vatAmtOS);
                                offsetVatRec.set('Amount', '');
                            }
                            LogVendorSCls.calTotalBillAmount(win);
                            // Vendor Bill Total does not update on this screen when edits are made. by Sriram
                        }


                    }


                }
            },
            onWidgetAttach: function (column, widget, record) {
                if (record.get('Tax_Wthd_Only') == 'Y') {
                    widget.setDisabled(true);
                } else {
                    widget.setDisabled(false);
                }

                if (record.get('IsVatOffSet') == 'Y' && record.get('IS_OFFSET_LOC') == 'Y' && record.get('vat_code').indexOf('-OS') >= 0) {
                    widget.setDisabled(true);
                } else {
                    widget.setDisabled(false);
                }
            }
        },
        {
            text: '<Div style="color:white;">VAT Amount</Div>', dataIndex: 'VAT_Amount'
        },
        {
            xtype: 'widgetcolumn',
            itemId: 'osOffsetCol',
            dataIndex: 'OSOffset', baseCls: 'UPS_Blue_2',
            text: '<Div style="color:white;">OS-Offset</Div>',
            sortable: false,
            widget: {
                xtype: 'textfield',
                dataIndex: 'OSOffset',
                regex: /^(-?(\d*)|(-?\d*\.\d{1,6}))$/               
            },
            onWidgetAttach: function (column, widget, record) {
                widget.setDisabled(true);
            }
        },
        {
            text: '<Div style="color:white;">Description</Div>', dataIndex: 'long_description', width: 200
        },
        {
            xtype: 'widgetcolumn',
            itemId: 'taxWhldCol',
            dataIndex: 'TWH_Amount', baseCls: 'UPS_Blue_2',
            text: '<Div style="color:white;">Tax Withholding</Div>',
            sortable: false,
            widget: {
                xtype: 'textfield',
                dataIndex: 'TWH_Amount',
                regex: /^(-?(\d*)|(-?\d*\.\d{1,6}))$/,
                listeners: {
                    blur: function (text, newValue, OldValue) {
                        if (this.getValue() != "" && !isNaN(this.getValue())) {
                            if (this.getValue().indexOf('-') == -1 && this.getValue() != 0) {
                                alert("Tax Withholding Amt field only allow zero or negative number : -[0-9].[0-9]");
                                this.setValue(0);

                            } else {
                                var win = this.up('window');
                                var record = text.getWidgetRecord();
                                record.set('TWH_Amount', this.getValue());
                                LogVendorSCls.calTotalBillAmount(win);
                            }
                        }
                    }
                }
            },
            onWidgetAttach: function (column, widget, record) {
                if (parseInt(record.get('vat_percent')) == 0) {
                    widget.setDisabled(false);
                } else {
                    widget.setDisabled(true);
                }
            }
        }

    ]


});
