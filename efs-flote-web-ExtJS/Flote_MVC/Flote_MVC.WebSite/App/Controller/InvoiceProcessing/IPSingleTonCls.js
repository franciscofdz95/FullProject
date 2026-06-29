/* ====================================================================================================
NAME:			[Invoice Process Singleton Class]
BEHAVIOR:		All the actions related Invoice Processing page.
_______________________________________________________________________________________________________
REVISION HISTORY
-------------------------------------------------------------------------------------------------------
Date			    Modified By			  Modifications
-------------------------------------------------------------------------------------------------------
11/30/2016        Sudhir Dandale		 Created.
 ======================================================================================================*/
Ext.define('App.Controller.InvoiceProcessing.IPSingleTonCls', {
    alias: 'widget.App-Controller-InvoiceProcessing-IPSingleTonCls',
    alternateClassName: ['IProcessingSCls'],
    singleton: true,
    session: true,
    config: {
        currency_code: '',
        service_code: 'All',
        company_code: '',
        charge_code: '',
        charge_status: 'All',
        invoice_status: '',
        invoice_id: '0',
        invRefNo: '',
        location_code: '',
        container_number: '',
        carrier_id: '',
        cInvoice_id: '0',
        rdoType: 'Selected',
        invoiceCID: 'CID',
        toCID: 'USD',
        fromCID: 'USD',
        recDetails: '',
        vatListCodes: '',
        pageType: 'Bills',
        isFilterFieldRemoved: false,
        newRecDetails: '',
        newRecordFlag: false,
        commentsVisible: false,
        exchRateVisible: false,
        commentsFlag: false,
        shipment_number: ''
    },
    constructor: function (options) {
        this.initConfig(options);
    },
    getInvoiceChargesDetails: function getInvoiceChargesDetails(invoiceId, type) {
        if (type == '' || type == undefined) {
            type = 'All'
        }
        var params = {
            InvoiceId: invoiceId,
            ColumnNames: type
        };
        var result = BIA.Ajax.request({
            url: 'api/WebAPIReport/InvoiceChargesDetails',
            method: "POST",
            async: false,
            cache: false,
            dataType: "html",
            headers: {
                "Content-Type": "application/json"
            },
            jsonData: params,
            useDefaultXhrHeader: true,
            failure: function () {
                BIACore.Exception(conn.responseText);
                BIACore.Message(response);
            },
            scope: this
        });
        return result.responseJSON;
    },
    getValidateTWHEntry: function getValidateTWHEntry(invoiceId) {
        var result = BIA.Ajax.request({
            url: 'api/WebAPIReport/GetValidateTWHEntry',
            method: "POST",
            async: false,
            cache: false,
            dataType: "html",
            headers: {
                "Content-Type": "application/json"
            },
            jsonData: {
                InvoiceId: invoiceId
            },
            useDefaultXhrHeader: true,
            failure: function () {
                BIACore.Exception(conn.responseText);
                BIACore.Message(response);
            },
            scope: this
        });
        return Ext.decode(result.responseText);
    },
    getVATCodesBP: function getVATCodesBP(invoiceId, invVATId) {
        var rec = '';
        if (invVATId == '' || invVATId == null) {
            invVATId = 0
        }        
        var result = BIA.Ajax.request({
            url: 'api/WebAPIReport/GetVATCodesBP',
            method: "POST",
            async: false,
            cache: false,
            dataType: "html",
            headers: {
                "Content-Type": "application/json"
            },
            jsonData: {
                InvoiceId: invoiceId,
                InvoiceVATId: invVATId
            },
            useDefaultXhrHeader: true,
            failure: function () {
                BIACore.Exception(conn.responseText);
                BIACore.Message(response);
            },
            scope: this
        });
        var data = Ext.decode(result.responseText);
        if (IProcessingSCls.getPageType() == 'LVB') {
            rec = IProcessingSCls.getNewRecDetails();

            if (rec != undefined && rec.Invoice_Amt != 0) {
                data.push(new Ext.data.Record({
                    vat_code: 'XMPT',
                    displayVat: 'Exempt',
                    vat_percent: 0,
                    long_description: 'Exempt',
                    invoicevat_id: 0
                }));
            }

        } else {
            rec = IProcessingSCls.getRecDetails();

            if (rec != undefined && rec.get('invoiceAmt') != 0) {
                data.push(new Ext.data.Record({
                    vat_code: 'XMPT',
                    displayVat: 'Exempt',
                    vat_percent: 0,
                    long_description: 'Exempt',
                    invoicevat_id: 0
                }));
            }
        }


        if (invVATId != 0 && data.length == 0) {
            data.push(new Ext.data.Record({
                vat_code: 'XMPT',
                displayVat: 'Exempt',
                vat_percent: 0,
                long_description: 'Exempt',
                invoicevat_id: 0
            }));

        }
        if (data != undefined && data.length > 1) {
            data.push(new Ext.data.Record({
                vat_code: '0',
                displayVat: 'Select VAT Code',
                vat_percent: 0,
                long_description: 'Select VAT Code',
                invoicevat_id: 0
            }));

        }
        this.setVatListCodes(data);

    },
    postInvoiceCurrencyDetail: function postInvoiceCurrencyDetail(invoiceId, fromRate, toRate, rec) {
        var cc = rec.get('Charge_code'), convRate = 0;
        if (rec.get('rowtype') == 'CustomTWH') {
            cc = rec.get('Charge_code').replace('TW-', '');
        }
        //Set existing ConvRate if toRate and fromRate are 0
        if (toRate == 0 && fromRate == 0) {
            convRate = rec.get('ConvRate');
        }
        else {
            if (fromRate != 0) {
                convRate = toRate / fromRate;
            }
            else {
                convRate = 1;
            }
        }

        var params = {
            InvoiceId: invoiceId,
            FromCID: IProcessingSCls.getFromCID().toUpperCase(),
            ToCID: IProcessingSCls.getToCID().toUpperCase(),
            FromRate: fromRate,
            ToRate: toRate,
            ShipmentDimFK: rec.get('shipment_dim_fk'),
            MBLFk: rec.get('MBL_fk'),
            ShipmentNumber: rec.get('shpmnt_nbr'),
            ChargeFk: parseInt(rec.get('mbl_chg_fk')),
            RowType: rec.get('rowtype'),
            ChargeCode: cc,
            InvoiceDetId: rec.get('Invoice_detail_id'),
            ConvRate: convRate
        };


        var result = BIA.Ajax.request({
            url: 'api/WebAPIReport/PostInvoiceCurrency',
            method: "POST",
            async: false,
            cache: false,
            dataType: "html",
            headers: {
                "Content-Type": "application/json"
            },
            jsonData: params,
            useDefaultXhrHeader: true,
            failure: function () {
                BIACore.Exception(conn.responseText);
                BIACore.Message(response);
            },
            scope: this
        });

        return result.responseJSON;
    },
    postInvoiceLine: function postInvoiceLine(rec) {
        rec.set('userId', PgAtt.getUserId());
        var result = BIA.Ajax.request({
            url: 'api/WebAPIReport/PostInvoiceLine',
            method: "POST",
            async: false,
            cache: false,
            dataType: "html",
            headers: {
                "Content-Type": "application/json"
            },
            jsonData: rec.data,
            useDefaultXhrHeader: true,
            failure: function () {
                BIACore.Exception(conn.responseText);
                BIACore.Message(response);
            },
            scope: this
        });

        return result.responseJSON;
    },
    checkValidCurrency: function checkValidCurrency(currCode) {
        var result = BIA.Ajax.request({
            url: 'api/WebAPIReport/CheckValidCurrency',
            method: "POST",
            async: false,
            cache: false,
            dataType: "html",
            headers: {
                "Content-Type": "application/json"
            },
            jsonData: {
                CurrencyCode: currCode
            },
            useDefaultXhrHeader: true,
            failure: function () {
                BIACore.Exception(conn.responseText);
                BIACore.Message(response);
            },
            scope: this
        });

        return result.responseJSON;
    },
    billProcessingMblFkValidation: function billProcessingMblFkValidation(record, chkFlag, grid, tabPanel, type) {
        var e2kCarrierCode = tabPanel.down('#e2kCarCodeIdBP').getValue(),
            vendorNameEng = tabPanel.down('#vendorNameIdBP').getValue(),
            cicObj = IProcessingSCls.CheckInvoiceCurrency(record),
            cicVal = 0,
            exRateWinFlag = false,
            ise2kFlag = false,
            commentFlag = IProcessingSCls.GetVarianceAmount(record);
        IProcessingSCls.setCommentsFlag(commentFlag);
        if (cicObj.invoice_currency_id === 0 && (record.get('buy_cid') !== cicObj.Invoice_CID)) {
            cicVal = 0;
        } else {
            cicVal = 1;
        }
        if (record.get('buy_cid') !== IProcessingSCls.getInvoiceCID().toUpperCase()) {
            IProcessingSCls.setFromCID(record.get('buy_cid'));
            IProcessingSCls.setToCID(IProcessingSCls.getInvoiceCID().toUpperCase());
        }
        if (e2kCarrierCode != record.get('vendor_code') && record.get('MBL_nbr') != '' && chkFlag) {
            Ext.Msg.confirm('E2K Carrier Code Warning Message', 'Are you sure you want to process this (<span class="titleBrown">' + record.get('vendor_code') + ' - ' + record.get('vendor_name') + '</span>) masterbill charge on this (<span class="titleBrown">' + e2kCarrierCode + ' - ' + vendorNameEng + '</span>) invoice?', function (button) {
                if (button === 'yes') {
                    record.set('frontCheck', true);
                    ise2kFlag = true;
                    this.CheckForAmountandCID(record, grid, commentFlag, cicVal, exRateWinFlag, type, ise2kFlag, chkFlag);
                }
                else if (button === 'no') {
                    if (this.store != undefined) {
                        this.store.rejectChanges();
                    }
                    else {
                        record.set('frontCheck', false);
                        record.set('backCheck', false);
                    }
                }
                IProcessingSCls.OnFronCheckboxSelect(chkFlag, record);
                record.dirty = false;
                if (Ext.isDefined(grid.down('#InvoiceDetailsId'))) {
                    grid.down('#InvoiceDetailsId').loadValues();
                }
                grid.getView().refresh();
            }, this);
        } else {
            this.CheckForAmountandCID(record, grid, commentFlag, cicVal, exRateWinFlag, type, ise2kFlag, chkFlag);
            return record;

        }
    },
    CheckForAmountandCID: function CheckForAmountandCID(record, grid, commentFlag, cicVal, exRateWinFlag, type, ise2kFlag, checkFlag) {
        var showComments = false;
        record.set('invoice_id', parseInt(PgAtt.getInvoice_id()));
        record.set('userId', PgAtt.getUserId());
        var result = this.postInvoiceLine(record);
        if (result != null) {
            record.set('Invoice_detail_id', result['Invoice_detail_id']);
        }
        if (cicVal === 0 && record.get('buy_cid').length == 3) {
            exRateWinFlag = this.ShowExchangeRatePopup(record, grid);
            if (record.get('buy_cid') !== IProcessingSCls.getInvoiceCID().toUpperCase() && checkFlag && type === 'line') {
                if (!exRateWinFlag) {
                    if (commentFlag || (record.get('comment') == '' && commentFlag)) {
                        showComments = true;
                    }
                }

            }
            if (ise2kFlag && !exRateWinFlag) {
                if (record.get('buy_amt') !== record.get('old_amt') && record.get('comment') == '' && commentFlag) {
                    showComments = true;
                }
            }

        } else {
            if (!ise2kFlag && type === "line" && record.get('buy_amt') !== record.get('old_amt') && record.get('comment') === '' && commentFlag) {
                showComments = true;
            }
        }
        if (record.get('Invoice_detail_id') != '' && record.get('invoice_id') == parseInt(PgAtt.getInvoice_id()) && record.get('buy_cid') != IProcessingSCls.getInvoiceCID().toUpperCase() && record.get('buy_cid').length == 3) {
            if (record.get('invoice_currency_id') == 0) {
                var invCurrId = IProcessingSCls.postInvoiceCurrencyDetail(IProcessingSCls.getInvoice_id(), 0, 0, record);
                if (invCurrId.length > 0) {
                    record.set('invoice_currency_id', invCurrId[0].invoiceCurrencyId)
                    record.dirty = false;
                }
            }

            if (!exRateWinFlag && (record.get('comment') == '' || commentFlag) && type === 'line') {
                showComments = true;
            }
        }
        if (showComments) {
            this.ShowCommentsPopup(record, grid);
        }
    },
    ShowCommentsPopup: function ShowCommentsPopup(record, grid) {
        var win = Ext.widget('App-View-InvoiceProcessing-CommentsW');
        win.rowDetails = record;
        win.parentRefWin = Ext.ComponentQuery.query('#InvoiceDetailsId')[0];
        win.grid = grid;
        win.show();
    },
    ShowExchangeRatePopup: function ShowExchangeRatePopup(record, grid) {
        var win = Ext.widget('App-View-InvoiceProcessing-ExchangeRateW');
        win.rowDetails = record;
        win.grid = grid;
        win.show();
        return true;
    },
    getInvoiceChargeCountByVatId: function getInvoiceChargeCountByVatId() {
        var result = BIA.Ajax.request({
            url: 'api/WebAPIReport/GetInvoiceChargeCountByVatId',
            method: "POST",
            async: false,
            cache: false,
            dataType: "html",
            headers: {
                "Content-Type": "application/json"
            },
            jsonData: {
                InvoiceId: IProcessingSCls.getInvoice_id(),
                LocCode: PgAtt.getLocation_code()
            },
            useDefaultXhrHeader: true,
            failure: function () {
                BIACore.Exception(conn.responseText);
                BIACore.Message(response);
            },
            scope: this
        });

        return result.responseJSON;
    },
    updateInvoiceComment: function updateInvoiceComment(comment) {
        BIA.Ajax.request({
            url: 'api/WebAPIReport/UpdateInvoiceComment',
            method: "POST",
            async: false,
            cache: false,
            dataType: "html",
            headers: {
                "Content-Type": "application/json"
            },
            jsonData: {
                InvoiceId: IProcessingSCls.getInvoice_id(),
                UserId: PgAtt.getUserId(),
                Comments: comment
            },
            useDefaultXhrHeader: true,
            failure: function () {
                BIACore.Exception(conn.responseText);
                BIACore.Message(response);
            },
            scope: this
        });

    },
    getSCACCode: function getSCACCode() {
        var result = BIA.Ajax.request({
            url: 'api/WebAPIReport/GetSCACCode',
            method: "POST",
            async: false,
            cache: false,
            dataType: "html",
            headers: {
                "Content-Type": "application/json"
            },
            jsonData: {
                InvoiceId: IProcessingSCls.getInvoice_id()
            },
            useDefaultXhrHeader: true,
            failure: function () {
                BIACore.Exception(conn.responseText);
                BIACore.Message(response);
            },
            scope: this
        });

        return result.responseJSON;
    },
    verifyInvoice: function verifyInvoice(status, canApprove, e2kUserId) {
        var result = false;
        BIA.Ajax.request({
            url: 'api/WebAPIReport/VerifyInvoice',
            method: "POST",
            async: false,
            cache: false,
            dataType: "html",
            headers: {
                "Content-Type": "application/json"
            },
            jsonData: {
                InvoiceId: IProcessingSCls.getInvoice_id(),
                InvoiceStatusTo: status,
                CanApprove: canApprove,
                E2kUserId: e2kUserId,
                UserId: PgAtt.getUserId(),
                ActiveFlag: 1
            },
            useDefaultXhrHeader: true,
            success: function (conn, response, options, eOpts) {
                result = true;
            },
            failure: function () {
                BIACore.Exception(conn.responseText);
                BIACore.Message(response);
            },
            scope: this
        });

        return result;
    },
    resetFilterPopFilter: function resetFilterPopFilter(filter) {
        PgAtt.setCarrier_id(''); filter.down('#filCarrierId textfield').setValue('');
        PgAtt.setShipment_number(''); filter.down('#filShipmentNumber clearCombo').setValue('');
        PgAtt.setMbl_number(''); filter.down('#filMBLNumber clearCombo').setValue('');
        PgAtt.getMbl_iata_busid('');
        PgAtt.setContainer_number(''); filter.down('#filContainerNumber clearCombo').setValue('');
        PgAtt.setVendor_code(''); filter.down('#filVendorCode clearCombo').setValue('');
        PgAtt.setCharge_code(''); filter.down('#filChargeCode clearCombo').setValue('');


        if (IProcessingSCls.getPageType() == 'Bills') {
            filter.down('#filInvoiceId textfield').setValue('');
            PgAtt.setInvoice_id('0');
        } else {
            filter.down('#filUPSRefTypeName textfield').setValue('');
        }
    },
    updateVATInvoiceDetail: function updateVATInvoiceDetail(invoiceId) {

        BIA.Ajax.request({
            url: 'api/WebAPIReport/UpdateInvoiceVATId',
            method: "POST",
            async: false,
            cache: false,
            dataType: "html",
            headers: {
                "Content-Type": "application/json"
            },
            jsonData: {
                InvoiceId: invoiceId
            },
            useDefaultXhrHeader: true,
            failure: function () {
                BIACore.Exception(conn.responseText);
                BIACore.Message(response);
            },
            scope: this
        })

    },
    invoiceProcessingColumnRenderSort: function invoiceProcessingColumnRenderSort(me, value, metaData, record, rowIndex, colIndex) {
        if (!Ext.isEmpty(value) && Ext.isDefined(value)) {
            metaData.tdAttr = 'data-qtip="' + Ext.String.htmlEncode(value) + '"';
        }
        var rec = '', img = '', referenceId = '', strReturn = '', win = '';
        var invoiceId = 0;
        var pageType = IProcessingSCls.getPageType();
        if (pageType == 'LVB') {
            rec = IProcessingSCls.getNewRecDetails();
            invoiceId = rec.Invoice_id

        } else {
            rec = IProcessingSCls.getRecDetails();
            invoiceId = rec.get("invoice_id");
        }
        if (colIndex == 1) {
            strReturn = '<span style="font-weight:bold; font-size:12px;"></span>';
            if (record.get("invoice_id") != 0 && record.get("invoice_id") != invoiceId && record.get('newRecFlag') === undefined && record.get("AccrualFlag") === 0) {
                var refId = record.get('Reference_id');
                switch (refId) {
                    case 100: me.items[0].icon = 'images/Sinfo.png'; break;
                    case 101: me.items[0].icon = 'images/PInfo.png'; break;
                    case 102: me.items[0].icon = 'images/NInfo.png'; break;
                    case 103: me.items[0].icon = 'images/FInfo.png'; break;
                    case 104: me.items[0].icon = 'images/CInfo.png'; break;
                    default: me.items[0].icon = 'images/info.png'; break;
                }
                me.items[0].tooltip = 'On In-Process Bill ID: ' + record.get("invoice_id");
            } else {
                me.items[0].icon = '';
                me.items[0].tooltip = '';
            }

            if (record.get("invoice_id") != 0 && record.get("invoice_id") != invoiceId && record.get('newRecFlag') === undefined && record.get("AccrualFlag") !== 0) {
                me.items[1].icon = 'images/accrual.png';
                me.items[1].tooltip = 'Accruing: On In- Process Bill ID: ' + record.get("invoice_id");
            } else {
                me.items[1].icon = '';
                me.items[1].tooltip = '';
            }
            if (record.get("invoice_id") != 0 && record.get("invoice_id") != invoiceId && record.get('newRecFlag') === undefined && record.get('copied') === undefined && invoiceId !== 0) {
                me.items[2].icon = 'images/add-16x16.png';
                me.items[2].tooltip = 'Split Payment';
            } else {
                me.items[2].icon = '';
                me.items[2].tooltip = '';
            }
            return strReturn;
        }

        if (colIndex == 4) {

            if (value !== "") {
                win = me.up('App-View-Viewport');
                if (win.down('#filVendorCode clearCombo').getValue() != '') {
                    return value + ' ' + '<i title="Remove Vendor Carrier Name Filter" class="fa fa-search-minus"></i>';
                }
                else {
                    return value + ' ' + '<i title="Add Vendor Carrier Name Filter" class="fa fa-search-plus"></i>';
                }
            }
            else {
                return value;
            }
        }

        if (colIndex == 5) {
            if (value !== "") {
                win = me.up('App-View-Viewport');
                if (win.down('#filMBLNumber clearCombo').getValue() != '') {
                    return value + ' ' + '<i title="Remove Mbl Number Filter" class="fa fa-search-minus"></i>';
                }
                else {
                    return value + ' ' + '<i title="Add Shipment Number Filter" class="fa fa-search-plus"></i>';
                }
            }
            else {
                return value;
            }
        }

        if (colIndex == 7) {
            var comImgStr = '';
            metaData.style = "text-decoration: underline;cursor: pointer";
            if (record.get('RefNotes') != "") {
                comImgStr = ' <img src="images/comments.png" title="Reference Notes Comment" class="cursor_finger iconLaunchCol" style="margin: 0px;width:16px;height:16px;">'
            }
            if (value !== "") {
                return value + ' ' + comImgStr;
            }
            else {
                return '<a><span style="color:#1D598E;" >' + value + '</span></a>';
            }
        }

        if (colIndex == 8) {
            if (value !== "") {
                win = me.up('App-View-Viewport');
                if (win.down('#filShipmentNumber clearCombo').getValue() != '') {
                    return '<i title="Remove Shipment Number Filter" class="fa fa-search-minus"></i>';
                }
                else {
                    return '<i title="Add Shipment Number Filter" class="fa fa-search-plus"></i>';
                }
            }
        }
        if (colIndex == 11) {
            if (value !== "") {
                if (me.up('App-View-Viewport').down('#filChargeCode clearCombo').getValue() != '') {
                    return value + ' ' + '<i title="Remove Code Type Filter" class="fa fa-search-minus"></i>';
                }
                else {
                    return value + ' ' + '<i title="Add Code Type Filter" class="fa fa-search-plus"></i>';
                }
            }
            else {
                return value;
            }
        }

        if (colIndex == 15) {
            referenceId = record.get('Reference_id');
            if (record.get("invoice_id") == 0 && record.get("invoice_id") == invoiceId) {
                if (record.get("Charge_code") == "DCMB") {
                    metaData.css = 'Editable';
                } else {
                    if ((record.get("rev_split") != "50/50" && record.get("MBL_nbr") != "")) {
                        metaData.css = 'Editable';
                    }
                }
            }
            if (record.get('rowtype') == 'Custom' && (referenceId == 100 || referenceId == 101 || referenceId == 102 || referenceId == 103 || referenceId == 104)) {
                img = '<img src="images/warning.png" title="No E2K Entry" border="0" style="margin: 0px;" align="left">';
            }
            else if (record.get('buy_amt') != record.get('old_amt')) {
                img = '<img src="images/warning.png" title="Original Amt :' + record.get('old_amt') + '" border="0" style="margin: 0px;" align="left">';
            }
            return img + Utility.Formatting.NumFormat_Thousands_2Decimals(value, metaData);
        }

        if (colIndex == 16) {
            if (record.get("invoice_id") == 0 && record.get("invoice_id") == invoiceId) {
                if (record.get("Charge_code") == "DCMB") {
                    metaData.css = 'Editable';
                } else {
                    if ((record.get("rev_split") != "50/50" && record.get("MBL_nbr") != "")) {
                        metaData.css = 'Editable';
                    }
                }
            }
            if (record.get('buy_cid') != record.get('old_cid')) {
                img = '<img src="images/warning.png" title="Original CID :' + record.get('old_cid') + '" border="0" style="margin: 0px;" align="left">';
            }
            return img + value;
        }

        if (colIndex == 17) {
            strReturn = '<span style="font-weight:bold; font-size:12px;"></span>';
            if (record.get('Invoice_detail_id') != 0 && record.get('invoice_id') == parseInt(PgAtt.getInvoice_id()) && record.get('buy_cid') != IProcessingSCls.getInvoiceCID()) {
                me.items[0].icon = 'images/Transaction money.png';
                me.items[0].tooltip = 'Exchange Rate :' + record.get('ConvRate');
            } else {
                me.items[0].icon = '';
                me.items[0].tooltip = '';
            }

            referenceId = record.get('Reference_id');

            if ((record.get('comment') != '' || record.get('PaidDifferentlyReason') != '') && record.get('Invoice_detail_id') != 0 && (record.get('buy_cid') !== record.get('invoice_cid') || record.get('buy_amt') !== record.get('old_amt')) || referenceId == 100 || referenceId == 101 || referenceId == 102 || referenceId == 103 || referenceId == 104) {
                me.items[1].icon = 'images/comments.png';
                if ((record.get('PaidDifferentlyReason') != '') && (record.get('comment') != '')) {
                    me.items[1].tooltip = '<div><b>Paid Differrently Reason : </b>' + record.get('PaidDifferentlyReason') + '</br> <b>Comments: </b>' + record.get('comment') + '</div>';
                } else if (record.get('PaidDifferentlyReason') != '') {
                    me.items[1].tooltip = '<div><b>Paid Differrently Reason : </b>' + record.get('PaidDifferentlyReason') + '</div>';
                } else {
                    me.items[1].tooltip = '<div><b>Comments  :</b> ' + record.get('comment') + '</div>';
                }
            }
            else {
                me.items[1].icon = '';
                me.items[1].tooltip = '';
            }
            return strReturn;
        }

    },
    invoiceProcessingCheckColRendered: function invoiceProcessingCheckColRendered(value, metaData, record, row, col) {
        var rec = '', cssPrefix = '', cls = '';
        var invoiceId = 0;
        var pageType = IProcessingSCls.getPageType();
        if (pageType == 'LVB') {
            rec = IProcessingSCls.getNewRecDetails();
            invoiceId = rec.Invoice_id

        } else {
            rec = IProcessingSCls.getRecDetails();
            invoiceId = rec.get("invoice_id");
        }
        if (col == 0) {
            cssPrefix = Ext.baseCSSPrefix;
            cls = [cssPrefix + 'grid-checkcolumn'];

            if (record.get("invoice_id") != 0 && record.get("invoice_id") != invoiceId) {
                if (record.get('newRecFlag') !== undefined) {
                    cls += ' ' + cssPrefix + 'grid-checkcolumn-checked';
                    return '<div class="' + cls + '">&#160;</div>';
                } else {
                    return '<div class="">&#160;</div>';
                }

            }
            else {
                if ((record.get("rev_split") == "50/50" && record.get("MBL_nbr") == "") && record.get("Charge_code") != "DCMB") {
                    return '<div class="">&#160;</div>';
                } else {
                    if (value) {
                        cls += ' ' + cssPrefix + 'grid-checkcolumn-checked';
                        return '<div class="' + cls + '">&#160;</div>';
                    } else {
                        return '<div class="' + cls + '">&#160;</div>';
                    }
                }
            }

        }

        if (col == 19) {
            cssPrefix = Ext.baseCSSPrefix;
            cls = [cssPrefix + 'grid-checkcolumn'];
            if (invoiceId == record.get("invoice_id")) {
                if ((record.get("rev_split") == "50/50" && record.get("MBL_nbr") == "") || (invoiceId == 0 && (record.get("AccrualFlag") == 0 || record.get("AccrualFlag") == undefined))) {
                    return '<div class="">&#160;</div>';
                }
                else {
                    if (value) {
                        cls += ' ' + cssPrefix + 'grid-checkcolumn-checked';
                        return '<div class="' + cls + '">&#160;</div>';
                    }
                    else {
                        return '<div class="' + cls + '">&#160;</div>';
                    }
                }
            }
            else {
                if (record.get("AccrualFlag") == 1) {
                    return 'X';
                }
                else {
                    return '<div class="">&#160;</div>';
                }
            }
        }
    },
    GetSplitRemainder: function GetSplitRemainder(record) {
        var params = {
            ShipmentDimFK: record.get('shipment_dim_fk'),
            MblFK: record.get('MBL_fk'),
            ChargeFK: record.get('mbl_chg_fk'),
            ChargeCode: record.get('Charge_code')
        };
        var result = BIA.Ajax.request({
            url: 'api/WebAPIReport/GetSplitRemainder',
            method: "POST",
            async: false,
            cache: false,
            dataType: "html",
            headers: {
                "Content-Type": "application/json"
            },
            jsonData: params,
            useDefaultXhrHeader: true,
            failure: function () {
                BIACore.Exception(conn.responseText);
                BIACore.Message(response);
            },
            scope: this
        });
        return result.responseJSON;
    },
    GetVarianceAmount: function GetVarianceAmount(record) {
        var x = 0, y = 0, exch_rate = 1,
            chgcid = record.get('buy_cid'),
            reFlag = false, e2kAmt = 0,
            uAmt = record.get('buy_amt'),
            manTotAmt = record.get('man_tol_amt');
        var locTolAmt = record.get('loc_tol_amt');
        var locTolPer = record.get('loc_tol_per');
        if (chgcid != '' && chgcid != record.get('invoice_cid')) {
            var rate = IProcessingSCls.GetInvoiceCurrency(record);
            exch_rate = parseFloat(rate.ConvRate).toFixed(6);
        }
        if (exch_rate != '' && exch_rate != 0) {
            e2kAmt = record.get('old_amt') * exch_rate;
        } else {
            e2kAmt = record.get('old_amt');
        }
        if (e2kAmt !== 0) {
            x = Math.abs(e2kAmt - uAmt);
            y = Math.abs(e2kAmt - uAmt) / Math.abs(e2kAmt)
        }
        else {
            x = Math.abs(e2kAmt - uAmt);

        }
        if (record.get('MBL_fk') != 0 && record.get('MBL_nbr') != '' && (manTotAmt <= x || e2kAmt == 0) || (record.get('MBL_fk') == 0 && record.get('MBL_nbr') == '' && (e2kAmt == 0 || locTolAmt <= x || locTolPer <= y))) {// removed totper < y as per new RFC 202.02(a) PDR dropdown
            reFlag = true;
            IProcessingSCls.setCommentsVisible(true);
            return reFlag;
        }
        else {
            IProcessingSCls.setCommentsVisible(false);
            return false;
        }
    },
    GetInvoiceCurrency: function GetInvoiceCurrency(record) {
        var params = {
            ShipmentDimFK: record.get('shipment_dim_fk'),
            ShipmentNumber: record.get('shpmnt_nbr'),
            InvoiceId: record.get('invoice_id'),
            FromCID: record.get('buy_cid'),
            MblFK: record.get('MBL_fk'),
            ChargeFK: record.get('mbl_chg_fk'),
            ChargeCode: record.get('Charge_code')
        };
        var result = BIA.Ajax.request({
            url: 'api/WebAPIReport/GetInvoiceLineCurrency',
            method: "POST",
            async: false,
            cache: false,
            dataType: "html",
            headers: {
                "Content-Type": "application/json"
            },
            jsonData: params,
            useDefaultXhrHeader: true,
            failure: function () {
                BIACore.Exception(conn.responseText);
                BIACore.Message(response);
            },
            scope: this
        });
        return result.responseJSON;
    },
    OnFronCheckboxSelect: function OnFronCheckboxSelect(checked, record) {
        if (checked) {
            var Conv = 0, Chrg = 0, InvAmt = 0;
            if (!isNaN(parseFloat(record.get('buy_amt'))))
                Conv = parseFloat(record.get('ConvRate'));
            if (!isNaN(parseFloat(record.get('buy_amt'))))
                Chrg = parseFloat(record.get('buy_amt'));
            if (Conv != 0)
                InvAmt = Chrg * Conv;
            else
                InvAmt = Chrg;

            if (isNaN(InvAmt)) InvAmt = 0;
            record.set('invoice_amt', InvAmt.toFixed(2));
        }
    },
    CheckInvoiceCurrency: function CheckInvoiceCurrency(record) {
        var params = {
            InvoiceId: record.get('invoice_id'),
            FromCID: record.get('buy_cid')
        };
        var result = BIA.Ajax.request({
            url: 'api/WebAPIReport/CheckInvoiceCurrency',
            method: "POST",
            async: false,
            cache: false,
            dataType: "html",
            headers: {
                "Content-Type": "application/json"
            },
            jsonData: params,
            useDefaultXhrHeader: true,
            failure: function () {
                BIACore.Exception(conn.responseText);
                BIACore.Message(response);
            },
            scope: this
        });
        return result.responseJSON;

    },
    CheckPaidDifferentReason: function CheckPaidDifferentReason(rec) {
        var showPDReason = false;
        if ((rec.get('MBL_fk') != null && rec.get('MBL_fk') != 0) && (rec.get('MBL_nbr') != null && (rec.get('MBL_nbr') != ''))) {
            if ((rec.get('man_tol_amt') >= 250 || rec.get('man_tol_amt') <= -250)) {
                showPDReason = true;
            }
        }
        else if (rec.get('MBL_fk') == 0 && rec.get('MBL_nbr') == '') {
            if ((rec.get('loc_tol_amt') >= 50 || rec.get('loc_tol_amt') <= -50) && (rec.get('loc_tol_per') >= 0.10 || rec.get('loc_tol_per') <= -0.10)) {
                showPDReason = true;
            }
        }
        return showPDReason;
    }

});