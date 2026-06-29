/* ====================================================================================================
NAME:			[Invoice Processing Report Filter Controller ]
BEHAVIOR:		Connects to Invoice Processing for selected filter criteria.
_______________________________________________________________________________________________________
REVISION HISTORY
-------------------------------------------------------------------------------------------------------
Date			    Modified By			  Modifications
-------------------------------------------------------------------------------------------------------
07/26/2016        Sudhir Dandale		 Created.
 ======================================================================================================*/
Ext.define('App.controller.InvoiceProcessing.Report', {
    extend: 'Ext.app.Controller',
    refs: [
        { ref: 'Current', selector: 'App-View-Main-TabPanel' },
        { ref: 'FilterPanel', selector: 'App-View-Component-Container-FilterPanelBase' }
    ],
    init: function () {
        this.control({
            'App-View-Component-FilteredReport': {
            },
            '[xtype="App-View-InvoiceProcessing-Grid"]': {
                cellclick: this.InvoiceProcessingCellClick,
                beforeedit: this.BeforeEditInvoiceGrid,
                edit: this.EditInvoiceProcessingGrid,
                canceledit: this.CancelEditInvoiceProcessingGrid

            },
            'App-View-InvoiceProcessing-Report': {
                activate: this.ReportTabActivate
            },
            '[xtype="combobox"]': {
                nonE2kCostId: this.InsertNonE2KCharge,
                taxWHCodeId: this.InsertTaxWithholding
            }
        });

    },
    ReportTabActivate: function ReportTabActivate(tab) {
        var record = IProcessingSCls.getRecDetails();
        if (record != '' && record != null && record != undefined) {
            IProcessingSCls.setPageType(record.get('pageType'));
            IProcessingSCls.getVATCodesBP(record.get('invoice_id'), 0)
            PgAtt.setInvoice_id(record.get('invoice_id'));
            IProcessingSCls.setInvoice_id(record.get('invoice_id'));
            IProcessingSCls.setInvoiceCID(record.get('Invoice_CID'));
            IProcessingSCls.updateVATInvoiceDetail(record.get('invoice_id'));
        }
        else {
            record = IProcessingSCls.getNewRecDetails();
            IProcessingSCls.setPageType('LVB');
            IProcessingSCls.getVATCodesBP(record.Invoice_id, 0)
            PgAtt.setInvoice_id(record.Invoice_id);
            IProcessingSCls.setInvoice_id(record.Invoice_id);
            IProcessingSCls.setInvoiceCID(record.Invoice_CID);
            IProcessingSCls.updateVATInvoiceDetail(record.Invoice_id);
        }

        var pageName = tab.tab.text;
        var filter = this.getActiveFilterPanel();
        if (filter == null) {
            filter = this.getAllFilterPanel()[0];
        }

        var tabPanel = this.getActiveCurrent();
        if (tabPanel == null) {
            tabPanel = this.getAllCurrent();
        }
        tabPanel.down('#InvoiceDetailsId').loadValues();
        if (IProcessingSCls.getIsFilterFieldRemoved()) {
            filter.showHideFilter();
        }
        else {
            filter.setInvoiceProcessingFields()
        }
        filter.getAttirbuteFieldValues();
        var grid = tab.down('App-View-InvoiceProcessing-Grid');
        this.SetCurrencyColumn(grid);
        var store = grid.getStore();
        var pager = grid.down('[xtype="pagingtoolbar"]');
        var extraParams = {}
        if (PgAtt.getGeoCode() !== 'CO') {
            Ext.Object.merge(extraParams, filter.GetParameters(), { GeoId: PgAtt.getGeoId(), GeoCode: PgAtt.getGeoCode() });
        } else {
            Ext.Object.merge(extraParams, filter.GetParameters());
        }
        store.getProxy().extraParams = extraParams;
        store.getProxy().extraParams.RadioSelection = IProcessingSCls.getRdoType();
        PgAtt.setInvRecFlag(false);
        if (IProcessingSCls.getPageType() == 'Containers') {
            if (record.get('Containers').split(',').length > 1) {
                store.getProxy().extraParams.Containers = record.get('Containers');
            }
        }
        PgAtt.getGridCustomMsg(pageName);
        //Re-load the grid.
        if (PgAtt.getMsgEmptyDataFlag()) {
            if (pager) pager.moveFirst(); else store.load();
            grid.getView().emptyText = '<div class="x-grid-empty"> No Matches Found! Verify the selected filter criteria.</div>';
        } else {
            store = null;
            var view = grid.getView();
            view.getStore().clearFilter(true);
            view.getStore().removeAll(true);
            view.emptyText = '<div class="x-grid-empty">' + PgAtt.getMsgEmptyDataCustom() + '</div>';
            view.refresh();
        }
        var mainPanel = tab.up();
        if (Ext.isDefined(mainPanel.down('#nonE2kCostIdCombo'))) {
            store = tab.up().down('#nonE2kCostIdCombo').getStore();
            store.load();
        }
        this.ShowHideNonE2KCombo(mainPanel, record);
        this.ShowHideTWHCodeCombo(mainPanel);
    },
    ShowHideNonE2KCombo: function ShowHideNonE2KCombo(tab, rec) {
        var showFlag = false, shipNo = '', refId = '';
        if (IProcessingSCls.getPageType() == 'Bills') {
            shipNo = rec.get('ReferenceFilter').split(",");
            refId = rec.get('reference_id');
            if (shipNo != '' && shipNo.length == 1 && refId == 1) {
                showFlag = true;
            }
        } else if (IProcessingSCls.getPageType() == 'LVB') {
            shipNo = rec.ReferenceFilter.split(",");
            if (shipNo != '' && shipNo.length == 1) {
                showFlag = true;
            }
        }
        if (Ext.isDefined(tab.down('#nonE2kCostId'))) {
            tab.down('#nonE2kCostId').setVisible(showFlag);
        }
    },
    ShowHideTWHCodeCombo: function ShowHideTWHCodeCombo(tab) {
        if (IProcessingSCls.getValidateTWHEntry(IProcessingSCls.getInvoice_id())) {
            if (Ext.isDefined(tab.down('#taxWHCodeId'))) {
                var twhCont = tab.down('#taxWHCodeId').setVisible(true);
                twhCont.setVisible(true);
                twhCont.down('combobox').getStore().load();
            }
        }
    },
    InvoiceProcessingCellClick: function InvoiceProcessingCellClick(me, td, cellIndex, record) {

        var filter = this.getActiveFilterPanel();
        if (filter == null) {
            filter = this.getAllFilterPanel()[0];
        }

        var colName = me.grid.columns[cellIndex].itemId;
        var colValue = Ext.util.Format.trim(td.innerText);
        var setFlag = false;
        if (colName != '' && ['colVendorCode', 'colMblNumber', 'colShipNbrIP', 'colShipNbrSortIP', 'colChargeCode'].indexOf(colName) >= 0) {
            switch (colName) {
                case 'colVendorCode':
                    if (colValue != PgAtt.getVendor_code()) {
                        PgAtt.setVendor_code(colValue);
                        filter.down('#filVendorCode clearCombo').setValue(colValue);
                        filter.down('#filVendorCode clearCombo').getTrigger('clear').show();
                        IProcessingSCls.setIsFilterFieldRemoved(false);
                    }
                    else {
                        PgAtt.setVendor_code('');
                        filter.down('#filVendorCode clearCombo').setValue('');
                        IProcessingSCls.setIsFilterFieldRemoved(true);
                    }
                    setFlag = true;
                    break;
                case 'colMblNumber':
                    if (colValue != PgAtt.getMbl_number()) {
                        PgAtt.setMbl_number(colValue);
                        filter.down('#filMBLNumber clearCombo').setValue(colValue);
                        filter.down('#filMBLNumber clearCombo').getTrigger('clear').show();
                        IProcessingSCls.setIsFilterFieldRemoved(false);
                    }
                    else {
                        PgAtt.setMbl_number('');
                        filter.down('#filMBLNumber clearCombo').setValue('');
                        IProcessingSCls.setIsFilterFieldRemoved(true);
                    }
                    setFlag = true;
                    break;
                case 'colShipNbrIP':
                    // Add ‘processing’ message when page is waiting for something  by  Sriram
                    Ext.get(me.grid.getEl()).mask();
                    Ext.defer(function () {
                        var win = Ext.widget('App-View-ShipmentSummary-Report');
                        win.rec = record;
                        win.show();
                        Ext.get(me.grid.getEl()).unmask();
                    }, 100);

                    break;
                case 'colShipNbrSortIP':
                    colValue = record.get('shpmnt_nbr');
                    if (colValue != PgAtt.getShipment_number()) {
                        PgAtt.setShipment_number(colValue);
                        IProcessingSCls.setIsFilterFieldRemoved(false);
                        filter.down('#filShipmentNumber clearCombo').setValue(colValue);
                        filter.down('#filShipmentNumber clearCombo').getTrigger('clear').show();
                    }
                    else {
                        PgAtt.setShipment_number('');
                        filter.down('#filShipmentNumber clearCombo').setValue('');
                        IProcessingSCls.setIsFilterFieldRemoved(true);
                    }
                    setFlag = true;
                    break;
                case 'colChargeCode':
                    if (record.get("Charge_code") != PgAtt.getCharge_code()) {
                        PgAtt.setCharge_code(record.get("Charge_code"));
                        IProcessingSCls.setIsFilterFieldRemoved(false);
                        filter.down('#filChargeCode clearCombo').setValue(record.get("Charge_code"));
                        filter.down('#filChargeCode clearCombo').getTrigger('clear').show();
                    }
                    else {
                        PgAtt.setCharge_code('');
                        IProcessingSCls.setIsFilterFieldRemoved(true);
                        filter.down('#filChargeCode clearCombo').setValue('')
                    }
                    setFlag = true;
                    break;
                default:
                    break;
            }
        }

        if (setFlag) {
            filter.fireEvent('btnApply');
        }

    },
    BeforeEditInvoiceGrid: function (editor, context, eOpts) {
        if (context.record != null && context.record != undefined) {
            var rec = '';
            var invoiceId = 0;
            var pageType = IProcessingSCls.getPageType();
            if (pageType == 'LVB') {
                rec = IProcessingSCls.getNewRecDetails();
                invoiceId = rec.Invoice_id
            } else {
                rec = IProcessingSCls.getRecDetails();
                invoiceId = rec.get("invoice_id");
            }
            if ((context.column.text === 'VAT') || (context.record.get("invoice_id") != 0 && context.record.get("invoice_id") != invoiceId && (context.record.get('newRecFlag') === false || context.record.get('newRecFlag') === undefined))) {
                return false;
            }
        }
    },
    EditInvoiceProcessingGrid: function EditInvoiceProcessingGrid(editor, context, eOpts) {
        if (context.record != null && context.record != undefined) {
            var tabPanel = this.getActiveCurrent();
            if (tabPanel == null) {
                tabPanel = this.getAllCurrent();
            }

            if ((context.record.get("rev_split") == "50/50" && context.record.get("MBL_nbr") == "" && context.record.get("Charge_code") != "DCMB") || (PgAtt.getInvoice_id() == 0 && (context.record.get("AccrualFlag") == 0 || context.record.get("AccrualFlag") == NULL))) {
                alert('This is not valid charge for this invoice');
                editor.view.refresh();

            } else {
                var chkFlag = true, type = "line";
                IProcessingSCls.getVATCodesBP(PgAtt.getInvoice_id(), context.record.get('invoicevat_id'));
                var data = '';
                data = IProcessingSCls.getVatListCodes();
                if (data.length == 1) {
                    if (data[0].invoicevat_id) {
                        var vatPer = data[0].vat_percent;
                        var vatAmt = 0
                        if (parseFloat(vatPer)) {
                            vatAmt = parseFloat(vatPer / 100);
                        }
                        context.record.set('invoicevat_amt', vatAmt);
                        context.record.set('invoicevat_id', data[0].invoicevat_id);
                        IProcessingSCls.getVATCodesBP(PgAtt.getInvoice_id(), 0);
                    }
                } else {
                    context.record.set('invoicevat_id', 999999999);
                }
                if (context.record.get('buy_cid') == "") {
                    context.record.set('buy_cid', IProcessingSCls.getInvoiceCID().toUpperCase());
                }
                if (context.record.get('frontCheck') && PgAtt.getInvoice_id() == context.record.get('invoice_id').toString()) {
                    chkFlag = false;
                }

                var chgcid = context.record.get('buy_cid');
                if (chgcid != '' && chgcid !== context.record.get('invoice_cid')) {
                    var rate = IProcessingSCls.GetInvoiceCurrency(context.record);
                    if (Ext.Object.isEmpty(rate)) {
                        rate = IProcessingSCls.GetInvoiceCurrency(context.record);
                    }
                    context.record.set('ConvRate', parseFloat(rate.ConvRate).toFixed(6));
                } else {
                    context.record.set('ConvRate', 1);
                }
                //14438 and 1441 Processed Amount will not update
                if (context.record.get('ConvRate') == 0) {
                    context.record.set('ConvRate', 1);
                }

                context.record.set('invoice_amt', context.record.get('buy_amt') * context.record.get('ConvRate'));


                context.record.set('frontCheck', true);
                context.record = IProcessingSCls.billProcessingMblFkValidation(context.record, chkFlag, tabPanel.down('grid'), tabPanel, type);
                tabPanel.down('#InvoiceDetailsId').loadValues();
            }
        }
    },
    CancelEditInvoiceProcessingGrid: function CancelEditInvoiceProcessingGrid(editor, context, eOpts) {
        editor.view.refresh();
    },
    InsertNonE2KCharge: function InsertNonE2KCharge(record, rec, invCurr) {
        var filter = this.getActiveFilterPanel();
        if (filter == null) {
            filter = this.getAllFilterPanel()[0];
        }
        var params = {
            InvoiceId: rec.get('invoice_id'),
            ShipmentNumber: rec.get('shpmnt_nbr'),
            ShipmentDimFK: rec.get('shipment_dim_fk'),
            UserId: PgAtt.getUserId(),
            RevSplit: record.get('intl_rev_allocation'),
            ChargeCode: record.get('charge_code'),
            Description: record.get('charge_description'),
            ORAAccount: record.get('ora_account_code'),
            LocCode: rec.get('location_code'),
            CurrencyCode: invCurr
        };
        BIA.Ajax.request({
            url: 'api/WebAPIReport/InsertNonE2KCharge',
            method: "POST",
            async: false,
            cache: false,
            dataType: "html",
            headers: {
                "Content-Type": "application/json"
            },
            jsonData: params,
            useDefaultXhrHeader: true,
            success: function (conn, response, options, eOpts) {
                filter.fireEvent('btnApply');
            },
            failure: function () {
                BIACore.Exception(conn.responseText);
                BIACore.Message(response);
            },
            scope: this
        })
    },
    InsertTaxWithholding: function InsertTaxWithholding(rec, comboVal) {
        var filter = this.getActiveFilterPanel();
        if (filter == null) {
            filter = this.getAllFilterPanel()[0];
        }
        var strVal = comboVal.get('ValueString').split('|');
        var params = {
            InvoiceId: rec.get('invoice_id'),
            ShipmentNumber: rec.get('shpmnt_nbr'),
            ShipmentDimFK: rec.get('shipment_dim_fk'),
            UserId: PgAtt.getUserId(),
            VATCode: strVal[0],// comboVal.get('TAX_Code'),
            Description: strVal[2], //comboVal.get('Description'),
            LocCode: strVal[3],//comboVal.get(''),
            CurrencyCode: strVal[4],//invCurr,
            TWHCode: strVal[1]//comboVal.get('TWH_CODE')
        };
        BIA.Ajax.request({
            url: 'api/WebAPIReport/InsertTaxWithholding',
            method: "POST",
            async: false,
            cache: false,
            dataType: "html",
            headers: {
                "Content-Type": "application/json"
            },
            jsonData: params,
            useDefaultXhrHeader: true,
            success: function (conn, response, options, eOpts) {
                filter.fireEvent('btnApply');
            },
            failure: function () {
                BIACore.Exception(conn.responseText);
                BIACore.Message(response);
            },
            scope: this
        })
    },
    SetCurrencyColumn: function SetCurrencyColumn(me) {

        // CHanged by Sriram to display Bill Amount Currency not  Currency from PgAtt
        var colBillAmt_IP = me.down('#colBillAmt_IP');

        var record = IProcessingSCls.getRecDetails();

        if (record != '' && record != null && record != undefined) {
            colBillAmt_IP.setText('Bill <BR> Amt <BR>(' + record.get('Invoice_CID') + ' )')
        }

        else {
            record = IProcessingSCls.getNewRecDetails();

            if (record.Invoice_CID != PgAtt.getDisplay_currency()) {
                colBillAmt_IP.setText('Bill <BR> Amt <BR>(' + record.Invoice_CID + ' )')
            }

            else {
                // CHanged by Sriram to display Bill Amount Currency not  Currency from PgAtt
                colBillAmt_IP.setText('Bill <BR> Amt <BR>(' + PgAtt.getDisplay_currency() + ' )')
            }

        }

    }
});