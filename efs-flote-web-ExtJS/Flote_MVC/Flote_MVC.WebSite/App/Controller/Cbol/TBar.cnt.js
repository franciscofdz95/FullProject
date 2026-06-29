/* ====================================================================================================
NAME:			[CBOL TBAR Controller ]
BEHAVIOR:		Performs Action and  data for Cbol TBar action event.
_______________________________________________________________________________________________________
REVISION HISTORY
-------------------------------------------------------------------------------------------------------
Date			    Modified By			  Modifications
-------------------------------------------------------------------------------------------------------
02/28/2017        Sudhir Dandale		 Created.
 ======================================================================================================*/


Ext.define('App.Controller.Cbol.TBar', {
    extend: 'Ext.app.Controller',
    refs: [
        { ref: 'Current', selector: 'App-View-Main-TabPanel' },
        { ref: 'FilterPanel', selector: 'App-View-Component-Container-FilterPanelBase' }

    ],
    init: function () {
        var me = this;

        me.control({
            '[xtype="App-View-CBOL-TBar"] #btnCbolBack': {
                click: me.CbolBackButtonClick
            },
            '[xtype="App-View-CBOL-TBar"] #btnCloseButton': {
                click: me.btnCloseButtonClick
            },
            '[xtype="App-View-CBOL-TBar"] #rdoCBOLId': {
                change: me.RadioButtonChanged
            },
            '[xtype="App-View-CBOL-TBar"] #btnProcessExcelDataToFlote': {
                click: me.ProcessExcelDataToFlote
            }

        });

    },
    // Get Bills Details Reports cell click event.


    CbolBackButtonClick: function CbolBackButtonClick(me) {
        var filter = this.getActiveFilterPanel();
        if (filter == null) {
            filter = this.getAllFilterPanel()[0];
        }
        PgAtt.setMbl_iata_busid('');
        PgAtt.setCharge_code('');
        PgAtt.setShipment_number('');
        CBOLSinCls.setCharge_Code('');
        CBOLSinCls.setCarrier_Id('');
        CBOLSinCls.setHbl('');
        if (CBOLSinCls.getCbolRadioType() == "ByCarrierBol") {
            me.up('App-View-Viewport').down('#filCarrierBOL clearCombo').setValue('');
        } else if (CBOLSinCls.getCbolRadioType() == "ByChargeCode") {
            me.up('App-View-Viewport').down('#filChargeCode clearCombo').setValue('');
        } else if (CBOLSinCls.getCbolRadioType() == "ByHBL") {
            me.up('App-View-Viewport').down('#filShipmentNumber clearCombo').setValue('');
        }
        filter.fireEvent('btnApply');
    },
    btnCloseButtonClick: function btnCloseButtonClick(me) {
        var tabPanel = me.up('#tabPanelId');

        var filter = this.getActiveFilterPanel();
        if (filter == null) {
            filter = this.getAllFilterPanel()[0];
        }
        CBOLSinCls.resetFilterPopFilter(filter);
        tabPanel.down('#appCbolSumId').setDisabled(true);
        if (CBOLSinCls.getPageType() == 'Bills') {
            tabPanel.setActiveTab(3);
        }
        filter.fireEvent('btnApply');
    },
    RadioButtonChanged: function RadioButtonChanged(me) {
        var val = me.getValue().rdGroup;
        if (val != undefined && val != null) {
            var grid = me.up('grid'),
                store = grid.getStore(),
                pager = grid.down('[xtype="pagingtoolbar"]');
            store.getProxy().extraParams.InvoiceId = PgAtt.getInvoice_id();
            store.getProxy().extraParams.CbolStatus = CBOLSinCls.getCbolStatus();
            CBOLSinCls.setCbolRadioType(val);
            store.getProxy().extraParams.RadioSelection = val;
            if (CBOLSinCls.getCbolRadioType() == 'ByCarrierBol') {
                grid.columns[0].setText('<Div style="color:white;">Carrier BOL</Div>');
            } else if (CBOLSinCls.getCbolRadioType() == 'ByChargeCode') {
                grid.columns[0].setText('<Div style="color:white;">Charge Code</Div>');
            }
            else if (CBOLSinCls.getCbolRadioType() == 'ByHBL') {
                grid.columns[0].setText('<Div style="color:white;">HBL</Div>');
            }
            if (pager) { pager.moveFirst(); } else store.load();
        }
    },
    ProcessExcelDataToFlote: function ProcessExcelDataToFlote(me) {
        var filter = this.getActiveFilterPanel();
        if (filter == null) {
            filter = this.getAllFilterPanel()[0];
        }
        var matchedCount = CBOLSinCls.getMatchedCount();
        var isProcessed = CBOLSinCls.getProcessedCount();
        var message = '';
        if (isProcessed > 0) {
            message = 'These charges (' + isProcessed + ') have already been selected on prior invoices.Please use invoice processing screen to split pay these charges. Click "Yes" to process rest of the charges?';

        } else {
            message = 'Are you sure you want to process these (' + matchedCount + ') matching charges?';

        }
        Ext.Msg.confirm('Process Cbol Charges Message', message, function (button) {
            if (button === 'yes') {
                CBOLSinCls.processExcelDataToInvDetails('', '');
                filter.fireEvent('btnApply');
            }

        }, me);
    }
});

