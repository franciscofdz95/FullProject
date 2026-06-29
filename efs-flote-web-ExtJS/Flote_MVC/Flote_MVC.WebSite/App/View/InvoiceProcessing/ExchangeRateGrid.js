/* ====================================================================================================
NAME:			[Exchange Rate Grid]
BEHAVIOR:		Shows all the avialabel exchange rate for selections.
_______________________________________________________________________________________________________
REVISION HISTORY
-------------------------------------------------------------------------------------------------------
Date			    Modified By			  Modifications
-------------------------------------------------------------------------------------------------------
12/12/2016        Sudhir Dandale		 Created.
 ======================================================================================================*/

Ext.define('App.View.InvoiceProcessing.ExchangeRateGrid', {
    extend: 'BIA.grid.PagedPanel',
    alias: 'widget.App-View-InvoiceProcessing-ExchangeRateGrid',
    border: true,
    skipToolbar: true,
    store:
    {
        type: 'webapi',
        api: {
            read: 'api/WebAPIReport/GetExchangeRateData'
        }
    },
    viewConfig: {
        enableTextSelection: true,
        deferEmptyText: false,
        emptyText: 'Click Search to begin.',
        forceFit: true
    },
    height: 200,
    autoScroll: true,
    columnLines: true,
    defaults: { menuDisabled: false, align: 'left' },
    cls: 'UBlue',
    columns: [
        {
            text: '<Div style="color:white;">From CID</Div>', dataIndex: 'FromRate', cls: 'UBlue', border: 1, autoColumnResize: true,
            style: {
                borderColor: 'white',
                borderStyle: 'thin'
            },
            renderer: function (value) {
                return value;
            }
        },
        {
            text: '<Div style="color:white;">To CID</Div>', dataIndex: 'ToRate', cls: 'UBlue', border: 1, autoColumnResize: true,
            style: {
                borderColor: 'white',
                borderStyle: 'thin'
            }
        },
        {
            text: '<Div style="color:white;">Exch. Rate</Div>', dataIndex: 'ConvRate', cls: 'UBlue', border: 1, autoColumnResize: true,
            style: {
                borderColor: 'white',
                borderStyle: 'thin'
            }
        },
        {
            xtype: 'checkcolumn',
            header: '<Div style="color:white;"></Div>',
            dataIndex: 'Selected',
            listeners: {
                checkchange: function (column, rowIdx, checked, eOpts) {
                    var rec = this.up('grid').getStore().getAt(rowIdx);
                    var len = this.up('grid').getStore().data.length;
                    var win = this.up('window');
                    if (len > 0) {
                        Ext.each(this.up('grid').getStore().data.items, function (item) {
                            if (rec.get('ConvRate') != item.get('ConvRate')) {
                                item.set('Selected', 0);
                                item.dirty = false;
                            }
                        });
                        var row = this.up('window').rowDetails;
                        var invId = IProcessingSCls.getInvoice_id();
                        var fromRate = rec.get('FromRate');
                        var toRate = rec.get('ToRate');
                        IProcessingSCls.postInvoiceCurrencyDetail(invId, fromRate, toRate, row);
                        var convRate = 1;
                        if (fromRate != 0) { convRate = toRate / fromRate; }
                        win.rowDetails.set('ConvRate', convRate);
                        win.down('#exchRateCalId').setValue(rec.get('ConvRate'));
                        win.down('#fromCIDId').setValue(fromRate);
                        win.down('#toCIDId').setValue(toRate);
                        var msg = 'Saved/Confirmed Exchange rate (' + convRate + ') for selected charges!';
                        win.down('#msgExchRateId').setText(msg);
                        win.parentRefWin.loadValues();
                        win.rowDetails.set('invoice_amt', win.rowDetails.get('buy_amt') * rec.get('ConvRate'));
                        win.rowDetails.dirty = false;
                        win.grid.getView().refresh();
                        rec.dirty = false;
                        this.up('grid').getView().refresh();
                    }

                }
            }
        }
    ]

});
