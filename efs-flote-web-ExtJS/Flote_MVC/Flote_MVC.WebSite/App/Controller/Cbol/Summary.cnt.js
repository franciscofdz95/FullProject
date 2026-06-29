/* ====================================================================================================
NAME:			[Cbol summary Controller ]
BEHAVIOR:		Performs Action and  data for Cbol Summary action events.
_______________________________________________________________________________________________________
REVISION HISTORY
-------------------------------------------------------------------------------------------------------
Date			    Modified By			  Modifications
-------------------------------------------------------------------------------------------------------
1/05/2017        Sudhir Dandale		 Created.
 ======================================================================================================*/

Ext.define('App.Controller.Cbol.Summary', {
    extend: 'Ext.app.Controller',
    refs: [
        { ref: 'Current', selector: 'App-View-Main-TabPanel' },
        { ref: 'FilterPanel', selector: 'App-View-Component-Container-FilterPanelBase' }

    ],
    init: function () {
        var me = this;

        me.control({
            'App-View-Component-FilteredReport': {
            },
            '[xtype="App-View-CBOL-Grid"]': {
                cellclick: me.cbolReportCellClick

            },
            '[xtype="App-View-CBOL-NonMatched-Report"]': {
                activate: this.ReportTabActivate,
                render: me.CBOLGridRender
            },
            '[xtype="App-View-CBOL-All-Report"]': {
                activate: this.ReportTabActivate,
                render: me.CBOLGridRender
            },
            '[xtype="App-View-CBOL-Matched-Report"]': {
                activate: this.ReportTabActivate,
                render: me.CBOLGridRender
            },
            '[xtype="App-View-CBOL-Selected-Report"]': {
                activate: this.ReportTabActivate,
                render: me.CBOLGridRender
            }
        });

    },
    CBOLGridRender: function CBOLGridRender(me) {
        var cbolGrid = me.down('App-View-CBOL-Grid');
        if (cbolGrid) {
            cbolGrid.store.addListener({
                load: {
                    fn: this.loadInvoiceDetails,
                    scope: this,
                    args: [me]
                }
            })
        }
    },
    loadInvoiceDetails: function loadInvoiceDetails(me, store, records, success) {
        if (success && records.length >= 0) {
            var tabPanel = this.getActiveCurrent();
            if (tabPanel == null) {
                tabPanel = this.getAllCurrent();
            }
            grid.down('form').down('form').loadValues();
            CBOLSinCls.GetCbolSummaryCount(tabPanel);
        }

    },
    ReportTabActivate: function ReportTabActivate(tab) {
        CBOLSinCls.setCbolStatus(tab.CbolStatusName);
        PgAtt.setCbolTabNo(tab.tabNo);
        var pageName = tab.tab.text;
        var filter = this.getActiveFilterPanel();
        if (filter == null) {
            filter = this.getAllFilterPanel()[0];
        }
        var tabPanel = this.getActiveCurrent();
        if (tabPanel == null) {
            tabPanel = this.getAllCurrent();
        }
        filter.getAttirbuteFieldValues();
        filter.showHideFilter();
        var grid = tab.down('App-View-CBOL-Grid'),
            store = grid.getStore();
        store.getProxy().extraParams = filter.GetParameters();
        PgAtt.getGridCustomMsg(pageName);
        if (CBOLSinCls.getCbolRadioType() == 'ByCarrierBol') {
            grid.down('radiogroup').items.items[0].setValue(true);
        } else if (CBOLSinCls.getCbolRadioType() == 'ByHBL') {
            grid.down('radiogroup').items.items[2].setValue(true);
        } else {
            grid.down('radiogroup').items.items[1].setValue(true);
        }

        store.getProxy().extraParams.InvoiceId = PgAtt.getInvoice_id();
        store.getProxy().extraParams.CbolStatus = CBOLSinCls.getCbolStatus();
        store.getProxy().extraParams.RadioSelection = CBOLSinCls.getCbolRadioType();
        store.getProxy().extraParams.Hbl = CBOLSinCls.getHbl();

        if ((CBOLSinCls.getCarrier_Id() != '' && CBOLSinCls.getCarrier_Id() != null) || (CBOLSinCls.getCharge_Code() != '' && CBOLSinCls.getCharge_Code() != null)
            || (CBOLSinCls.getHbl() != '' && CBOLSinCls.getHbl() != null)) {
            grid.columns[1].setVisible(true);
            CBOLSinCls.disableEnableMainTab(true, tabPanel);
            CBOLSinCls.setCbolPageType('CC');
            grid.down('#rdoCBOLId').setVisible(false);
            grid.down('#btnCbolBack').setVisible(true);
            grid.down('#btnCloseButton').setVisible(false);
            if (CBOLSinCls.getCbolStatus() == 'NonMatched') {
                grid.down('#contUnmatchedChargesId').setVisible(true);
                grid.columns[18].setVisible(true);
            } else {
                grid.columns[18].setVisible(false);
            }
            if (CBOLSinCls.getCbolRadioType() == "ByCarrierBol") {
                store.getProxy().extraParams.CarrierCBOL = CBOLSinCls.getCarrier_Id();
                grid.down('form').down('form').setTitle('<Div style="backfont-size:16px;font-weight:bold;background-color : #1D598E;color:white;">Charge Code Summary by Carrier Bill of Lading (' + CBOLSinCls.getCarrier_Id() + ') </Div>')
            }
            else if (CBOLSinCls.getCbolRadioType() == "ByHBL") {
                store.getProxy().extraParams.Hbl = CBOLSinCls.getHbl();
                grid.down('form').down('form').setTitle('<Div style="backfont-size:16px;font-weight:bold;background-color : #1D598E;color:white;">Charge Code Summary by HBL(' + CBOLSinCls.getHbl() + ')</Div>')
            }
            else {
                store.getProxy().extraParams.ChargeCode = CBOLSinCls.getCharge_Code();
                grid.down('form').down('form').setTitle('<Div style="backfont-size:16px;font-weight:bold;background-color : #1D598E;color:white;">Charge Code Summary by Charge Code (' + CBOLSinCls.getCharge_Code() + ')</Div>')

            }
            if (CBOLSinCls.getCbolRadioType() == 'ByCarrierBol' && CBOLSinCls.getCbolPageType() != 'CC') {
                grid.columns[0].setText('<Div style="color:white;">Carrier BOL</Div>');
            } else if (CBOLSinCls.getCbolRadioType() == 'ByHBL' && CBOLSinCls.getCbolPageType() != 'CC') {
                grid.columns[0].setText('<Div style="color:white;">HBL</Div>');
            } else if (CBOLSinCls.getCbolRadioType() == 'ByChargeCode' && CBOLSinCls.getCbolPageType() == 'CC') {
                grid.columns[0].setText('<Div style="color:white;">Carrier BOL</Div>');
            } else { grid.columns[0].setText('<Div style="color:white;">Charge Code</Div>'); }
        } else {
            CBOLSinCls.setCbolPageType('CBOL');
            CBOLSinCls.disableEnableMainTab(false, tabPanel);
            grid.columns[1].setVisible(false);
            grid.columns[18].setVisible(false);
            grid.down('#btnCbolBack').setVisible(false);
            grid.down('#btnCloseButton').setVisible(true);
            grid.down('#contUnmatchedChargesId').setVisible(false);
            grid.down('#rdoCBOLId').setVisible(true);
            if (CBOLSinCls.getCbolRadioType() == 'ByCarrierBol') {
                grid.columns[0].setText('<Div style="color:white;">Carrier BOL</Div>');
            } else if (CBOLSinCls.getCbolRadioType() == 'ByHBL') {
                grid.columns[0].setText('<Div style="color:white;">HBL</Div>');
            } else {
                grid.columns[0].setText('<Div style="color:white;">Charge Code</Div>');
            }
            grid.down('form').down('form').setTitle('<Div style="backfont-size:16px;font-weight:bold;background-color : #1D598E;color:white;">Vendor Statement Summary </Div>')
        }
        store.load();

    },
    // Get Bills page cell click event.
    cbolReportCellClick: function (me, td, cellIndex, record) {
        var filter = this.getActiveFilterPanel();
        if (filter == null) {
            filter = this.getAllFilterPanel()[0];
        }
        var tabPanel = this.getActiveCurrent();
        if (tabPanel == null) {
            tabPanel = this.getAllCurrent();
        }
        var colName = me.grid.columns[cellIndex].itemId;
        var colValue = Ext.util.Format.trim(td.innerText),
            grid = '', rec = '';

        switch (colName) {
            case 'colCarrierChargeBol':
                if (colValue) {
                    grid = me.up('grid');
                    grid.down('radiogroup').setVisible(false);

                    if (CBOLSinCls.getCbolPageType() == 'CBOL') {
                        if (CBOLSinCls.getCbolRadioType() == "ByCarrierBol") {
                            CBOLSinCls.setCarrier_Id(colValue);
                            filter.down('#filCarrierBOL clearCombo').setValue(colValue);
                            filter.down('#filCarrierBOL clearCombo').getTrigger('clear').show();
                        } else if (CBOLSinCls.getCbolRadioType() == "ByHBL") {
                            CBOLSinCls.setHbl(colValue);
                            filter.down('#filShipmentNumber clearCombo').setValue(colValue);
                            filter.down('#filShipmentNumber clearCombo').getTrigger('clear').show();
                            filter.down('#filChargeCode clearCombo').getTrigger('clear').show();
                        } else {
                            CBOLSinCls.setCharge_Code(colValue);
                            filter.down('#filChargeCode clearCombo').setValue(colValue);
                            filter.down('#filChargeCode clearCombo').getTrigger('clear').show();
                        }

                        filter.fireEvent('btnApply');
                    } else {
                        rec = record;
                        rec.set('invoice_id', PgAtt.getInvoice_id());
                        CBOLSinCls.setInvoiceId(PgAtt.getInvoice_id())
                        if (CBOLSinCls.getCbolRadioType() == "ByCarrierBol") {
                            rec.set('Type', 'CC');
                            filter.down('#filChargeCode clearCombo').setValue(colValue);
                            filter.down('#filChargeCode clearCombo').getTrigger('clear').show();
                        } else if (CBOLSinCls.getCbolRadioType() == "ByHBL") {
                            rec.set('Type', 'HBL');
                            rec.set('shipment_number', CBOLSinCls.getHbl());
                            filter.down('#filChargeCode clearCombo').setValue(colValue);
                            filter.down('#filChargeCode clearCombo').getTrigger('clear').show();
                        } else {
                            rec.set('Type', 'CBOL');
                        }
                        rec.set('pageType', 'CbolCC')
                        IProcessingSCls.setPageType('CbolCC');
                        IProcessingSCls.setRecDetails(rec);
                        tabPanel.down('#InvoiceProcessingId').setDisabled(false);
                        tabPanel.setActiveTab(9);
                    }

                }
                break;
            case 'colContainersCbol':
                rec = record;
                rec.set('invoice_id', PgAtt.getInvoice_id());
                CBOLSinCls.setInvoiceId(PgAtt.getInvoice_id())
                if (CBOLSinCls.getCbolRadioType() == "ByCarrierBol") {
                    rec.set('Type', 'CC');
                } else if (CBOLSinCls.getCbolRadioType() == "ByHBL") {
                    rec.set('Type', 'HBL');
                } else {
                    rec.set('Type', 'CBOL');
                }
                rec.set('pageType', 'Containers')
                IProcessingSCls.setPageType('Containers');
                IProcessingSCls.setRecDetails(rec);
                tabPanel.setActiveTab(9);
                tabPanel.down('#InvoiceProcessingId').setDisabled(false);
                break;
            default:
                break;
        }
    }

});

