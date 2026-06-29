/* ====================================================================================================
NAME:			[CBOL BBar Controller ]
BEHAVIOR:		Performs Action and  data for Cbol BBar action event.
_______________________________________________________________________________________________________
REVISION HISTORY
-------------------------------------------------------------------------------------------------------
Date			    Modified By			  Modifications
-------------------------------------------------------------------------------------------------------
02/28/2017        Sudhir Dandale		 Created.
 ======================================================================================================*/
Ext.define('App.Controller.InvoiceProcessing.ExchangeRate', {
    extend: 'Ext.app.Controller',
    refs: [
        { ref: 'Current', selector: 'App-View-Main-TabPanel' },
        { ref: 'FilterPanel', selector: 'App-View-Component-Container-FilterPanelBase' }

    ],
    init: function () {
        var me = this;
        me.control({
            '[xtype="App-View-InvoiceProcessing-ExchangeRateW"]': {
                beforerender: me.WindowBeforeRender,
                beforeclose: me.WindowBeforeClose
            },
            '[xtype="App-View-InvoiceProcessing-ExchangeRateW"] #btnAddExchRateId': {
                click: me.AddExchangeRate
            },
            '[xtype="App-View-InvoiceProcessing-ExchangeRateW"] #btnSaveExchangeId': {
                click: me.SaveExchangeRate
            }

        });

    },
    SaveExchangeRate: function SaveExchangeRate(me) {
        var win = me.up('window');
        var row = win.rowDetails;
        var result = IProcessingSCls.postInvoiceLine(row);
        if (result != null && result != '') {
            // add exchange rate in processing screen and check it, the screen does not update the Bill Amount with the new rate by  Sriram 
            var len = win.down('grid').getStore().data.length;
            var invId = IProcessingSCls.getInvoice_id();
            var fromRate = '';
            var toRate = '';
            if (len > 0) {
                Ext.each(win.down('grid').getStore().data.items, function (item) {
                    if (item.get('Selected') == 1) {
                        fromRate = item.get('FromRate');
                        toRate = item.get('ToRate');
                    }
                });

                IProcessingSCls.postInvoiceCurrencyDetail(invId, fromRate, toRate, row);
                var convRate = 1;
                if (fromRate != 0) {
                    convRate = toRate / fromRate;
                }
                row.set('ConvRate', convRate);
                win.down('#exchRateCalId').setValue(row.get('ConvRate'));
                win.down('#fromCIDId').setValue(fromRate);
                win.down('#toCIDId').setValue(toRate);
                var msg = 'Saved/Confirmed Exchange rate (' + convRate + ') for selected charges!';
                win.down('#msgExchRateId').setText(msg);
            }
            if (row.get('ConvRate') == 0) {
                row.set('ConvRate', 1);
            }
            row.set('invoice_amt', row.get('buy_amt') * row.get('ConvRate'));
            IProcessingSCls.postInvoiceLine(row);
            win.parentRefWin.loadValues();
            win.close();
        }
    },
    AddExchangeRate: function AddExchangeRate(me) {
        var win = me.up('window');
        var row = win.rowDetails;
        var invId = IProcessingSCls.getInvoice_id() == "0" ? row.get('invoice_id') : IProcessingSCls.getInvoice_id();
        var fromRate = win.down('#fromCIDId').getValue();
        var toRate = win.down('#toCIDId').getValue();
        var convRate = 1;
        if (fromRate != 0) { convRate = toRate / fromRate; }

        IProcessingSCls.postInvoiceCurrencyDetail(invId, fromRate, toRate, row);
        var msg = 'Saved/Confirmed Exchange rate (' + convRate + ') for selected charges!';
        win.down('#msgExchRateId').setText(msg);
        me.up('window').parentRefWin.loadValues();
        me.up('window').rowDetails.set('ConvRate', convRate);

        var params = {
            InvoiceId: row.get('invoice_id'),
            FromCID: row.get('buy_cid').toUpperCase(),
            ToCID: IProcessingSCls.getToCID().toUpperCase(),
            ShipmentDimFK: row.get('shipment_dim_fk'),
            MBLFk: row.get('MBL_fk'),
            ShipmentNumber: row.get('shpmnt_nbr'),
            ChargeFk: parseInt(row.get('mbl_chg_fk')),
            ChargeCode: row.get('Charge_code')
        };
        var grid = win.down('grid');
        var store = win.down('grid').getStore();
        var pager = grid.down('[xtype="pagingtoolbar"]');
        store.getProxy().extraParams = params;
        if (pager) pager.moveFirst(); else store.load();

    },
    WindowBeforeClose: function WindowBeforeClose(win) {
        var row = win.rowDetails;
        var grid = win.down('grid');
        var store = win.down('grid').getStore();
        if (row.get('Invoice_detail_id') != 0 && row.get('invoice_id') == parseInt(PgAtt.getInvoice_id()) && row.get('buy_cid') != IProcessingSCls.getInvoiceCID()) {
            if (store != null && store.data.length == 0) {
                Ext.Msg.alert('Warning!', 'Please enter valid exchange rate.');
                return false;
            }
            if (row.get('buy_amt') !== row.get('old_amt') && row.get('comment') === '' && IProcessingSCls.getCommentsFlag()) {
                var commentWin = Ext.widget('App-View-InvoiceProcessing-CommentsW');
                commentWin.rowDetails = row;
                commentWin.grid = grid;
                commentWin.show();
            }
        }
    },
    WindowBeforeRender: function WindowBeforeRender(me) {

        // Kaizen 13732: Currency Issue  by Sriram
        var rec = me.rowDetails;

        me.parentRefWin = Ext.ComponentQuery.query('#InvoiceDetailsId')[0];
        me.down('#toCIDId').fieldLabel = 'To CID (' + IProcessingSCls.getToCID().toUpperCase() + ')';
        me.down('#fromCIDId').fieldLabel = 'From CID (' + IProcessingSCls.getFromCID().toUpperCase() + ')';

        var params = {
            InvoiceId: rec.get('invoice_id'),
            FromCID: rec.get('buy_cid').toUpperCase(),
            ToCID: IProcessingSCls.getToCID().toUpperCase(),
            ShipmentDimFK: rec.get('shipment_dim_fk'),
            MBLFk: rec.get('MBL_fk'),
            ShipmentNumber: rec.get('shpmnt_nbr'),
            ChargeFk: parseInt(rec.get('mbl_chg_fk')),
            ChargeCode: rec.get('Charge_code')
        };
        var grid = me.down('grid');
        var store = me.down('grid').getStore();
        var pager = grid.down('[xtype="pagingtoolbar"]');
        store.getProxy().extraParams = params;
        if (pager) pager.moveFirst(); else store.load();
    }
});

