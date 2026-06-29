/* ====================================================================================================
NAME:			[Exchange Rate winow]
BEHAVIOR:		This window inputs the exchange rate other than local currency.
_______________________________________________________________________________________________________
REVISION HISTORY
-------------------------------------------------------------------------------------------------------
Date			    Modified By			  Modifications
-------------------------------------------------------------------------------------------------------
12/12/2016        Sudhir Dandale		 Created.
 ======================================================================================================*/

Ext.define('App.View.InvoiceProcessing.ExchangeRateW', {
    extend: 'Ext.window.Window',
    alias: 'widget.App-View-InvoiceProcessing-ExchangeRateW',
    itemId: 'exchangeRateId',
    border: true,
    title: '<Div style="color:white;">Rate of Exchange</Div>',
    width: '40%',
    modal: true,
    parentRefWin: '',
    rowDetails: '',
    grid: '',
    items:
        [
            {
                xtype: 'container', itemId: 'exchRateContId', baseCls: 'UPS_Brown_4',
                style: { borderColor: 'white', borderStyle: 'solid' },
                items: [
                    { xtype: 'label', text: 'Add currency exchange rate:', style: 'border: 1px solid ;font-weight:bold; font-size:12px;' },
                    { xtype: 'label', itemId: 'msgExchRateId', text: '', margin: '5 5 5 5', style: 'background-color : white;color:green;font-weight:bold; font-size:12px;border: 1px solid white;border-color:#FFFFFF;' },
                    {
                        xtype: 'container', layout: 'hbox', height: '10%', baseCls: 'UPS_Brown_4', title: 'Add currency exchange rate.',
                        style: { borderColor: 'white', borderStyle: 'solid' },
                        items: [
                            {
                                xtype: 'numberfield', itemId: 'fromCIDId', decimalPrecision: 11,
                                fieldLabel: 'From CID (' + IProcessingSCls.getFromCID().toUpperCase() + ')',
                                emptyText: 'From CID', allowBlank: false, inputWidth: 100, value: '1.00000000000', labelAlign: 'top', margin: '5 5 5 5',
                                listeners: {
                                    change: function (field, value) {
                                        var win = this.up('window');
                                        var val = win.down('#toCIDId').getValue() / this.getValue();
                                        win.down('#exchRateCalId').setValue(Ext.util.Format.number(val, "0.000000"));
                                        win.down('#btnAddExchRateId').setVisible(true);
                                    }
                                }
                            },
                            { xtype: 'label', text: ' = ', margin: '30 5 5 5' },
                            {
                                xtype: 'numberfield', itemId: 'toCIDId', decimalPrecision: 11,
                                fieldLabel: 'To CID (' + IProcessingSCls.getToCID().toUpperCase() + ')',
                                emptyText: 'To CID', allowBlank: false, margin: '5 5 5 5',
                                inputWidth: 100, labelAlign: 'top',
                                listeners: {
                                    change: function (field, value) {
                                        var win = this.up('window');
                                        var val = this.getValue() / win.down('#fromCIDId').getValue();
                                        win.down('#exchRateCalId').setValue(Ext.util.Format.number(val, "0.000000"));
                                        win.down('#btnAddExchRateId').setVisible(true);
                                    }
                                }

                            },
                            { xtype: 'displayfield', itemId: 'exchRateCalId', fieldLabel: 'Exch Rate', margin: '5 5 5 5', labelAlign: 'top' },
                            { xtype: 'button', hidden: true, itemId: 'btnAddExchRateId', docked: 'bottom', cls: 'btn', margin: '25 5 5 5', text: '<img title="Add Exchange Rate" style="width: 14px; height: 16px; vertical-align: middle;" src="images/add-24x24.png"  />' }
                        ]
                    },
                    {
                        xtype: 'App-View-InvoiceProcessing-ExchangeRateGrid'
                    },
                    {
                        xtype: 'container',
                        layout: 'hbox',
                        width: '100%',
                        items: [
                            { xtype: 'button', itemId: 'btnSaveExchangeId', docked: 'bottom', cls: 'btn', margin: '5 5 5 220', text: '<div style="font-weight: bold;color:white;">Save/Confirm Exch.Rate</div>' }
                        ]
                    }
                ]
            }
        ]

});
