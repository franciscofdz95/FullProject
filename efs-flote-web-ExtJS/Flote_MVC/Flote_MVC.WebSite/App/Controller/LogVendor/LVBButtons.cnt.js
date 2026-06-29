/* ====================================================================================================
NAME:			[Accruals Controller]
BEHAVIOR:		Shows Accruals Controller.
_______________________________________________________________________________________________________
REVISION HISTORY
-------------------------------------------------------------------------------------------------------
Date			    Modified By			  Modifications
-------------------------------------------------------------------------------------------------------
04/01/2017        Sudhir Dandale		  Modified for Log vendor bill button functionality.
 ======================================================================================================*/

Ext.define('App.Controller.LogVendor.LVBButtons', {
    extend: 'Ext.app.Controller',
    refs: [
        { ref: 'Current', selector: 'App-View-Main-TabPanel' },
        { ref: 'FilterPanel', selector: 'App-View-Component-Container-FilterPanelBase' }
    ],
    config: { varlocation: '', varvendor: '', varsiteCode: '', varBillCurrency: '', vatdate: '' },
    init: function () {
        this.control({
            'App-View-LogVendor-Filter-LVBButtons #SaveProcess': {
                click: this.SaveProcessClick
            },
            'App-View-LogVendor-Filter-LVBButtons #LogNext': {
                click: this.SaveClick
            },
            'App-View-LogVendor-Filter-LVBButtons #ExcelUpload': {
                click: this.ExcelUploadClick
            },
            'App-View-LogVendor-Filter-LVBButtons #SaveCheckInfo': {
                click: this.SaveCheckInfoClick
            },
            'App-View-LogVendor-Filter-LVBButtons #Cancel': {
                click: this.CancelClick
            }
        });
    },
    postInvoice: function postInvoice(t, VendorId, vatstring, me) {
        var page = this;
        var filter = this.getActiveFilterPanel();
        if (filter == null) {
            filter = this.getAllFilterPanel()[0];
        }
        var win = me.up('window');
        var invRefName = '';
        var upsRefList = ''
        var userId = BIACore.Security.User.permissions[PgAtt.getGeoIndex()].userId;
        if (win.down('#filUPSRefTypeLVB textfield').value !== 99) {
            upsRefList = win.down('#filUPSReferenceLVB tagfield').value;
            for (var i = 0; i < upsRefList.length; i++) {
                if (upsRefList[i] != "") {
                    invRefName += upsRefList[i];
                    if (upsRefList.length - 1 != i && upsRefList.length != 1) {
                        invRefName += ',';
                    }
                }
            }
        }
        else { invRefName = 'ExcelUploadCBOL'; }
        var glrate = 0;
        var bValid = true;
        var params = {
            inv_location: win.down('#filVendorLoctionLVB clearCombo').value,
            start: 1,
            limit: 25,
            Sort: 'test'
        };
        if (me.itemId === "LogNext" && me.text === "Log Next") {
            win.down('#Inv_ID').setValue("0");
        }
        if (bValid) {
            params = {
                InvoiceId: win.down('#Inv_ID').value,
                VendorId: Ext.util.Format.trim(VendorId),
                InvRefNo: win.down('#filBillRefNoLVB textfield').value,
                TotInvAmt: win.down('#filTaxExptAmtLVB textfield').value,
                LocationCode: win.down('#filVendorLoctionLVB clearCombo').value,
                RemoteCheckLocationCode: win.down('#filRemoteCheckLocLVB clearCombo').value,// <<<< This is a newly added parameter (09/20/2012)
                InvoiceCID: win.down('#filBillCurrLVB clearCombo').value, //Sk check
                InvoiceStatus: t,
                UserId: userId,
                ActiveFlag: 1,
                InvoiceDueDate: Ext.util.Format.date(win.down('#filBillDueDateLVB datefield').value, 'm/d/Y'),
                InvoiceDate: Ext.util.Format.date(win.down('#filBillDateLVB datefield').value, 'm/d/Y'),
                VATData: vatstring,
                VATPointDate: Ext.util.Format.date(win.down('#filVatPtDateLVB datefield').value, 'm/d/Y'),
                PartialPay: 0,//jQ('#PartialPay').attr('checked') ? 1 : 0,
                ReferenceFilter: invRefName,
                ReferenceId: win.down('#filUPSRefTypeLVB clearCombo').value,
                OtherReference: win.down('#filOtherRefLVB textfield').value,
                CheckNumber: win.down('#filCheckNoLVB2 textfield').value,
                StampNumber: win.down('#filStampNumberLVB textfield').value.substr(0, 24),
                PayAloneFlag: win.down('#filPayAloneLVB checkbox').getValue() ? 1 : 0,
                ValuePayInvoiceTypeCode: Ext.isEmpty(win.down('#filInvoiceTypeLVB clearCombo').value) ? 0 : win.down('#filInvoiceTypeLVB clearCombo').value,
                GLCurrencyRate: glrate,
                AccNumber: win.down('#filACCNoLVB clearCombo').value
            };

            BIA.Ajax.request({
                url: 'api/WebAPIReport/PostInvoice',
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
                    var data = Ext.decode(conn.responseText);
                    if (data == "VendorInvoice") {
                        alert("This vendor invoice number already exists.");
                    } else if (data == "Exception") {
                        alert("There was an exception .Please resubmit the record again.");
                    }
                    else {
                        if (data != '' && data != null && data != undefined) {
                            var invoiceId = 0;
                            if (data == "Updated") {
                                invoiceId = LogVendorSCls.getInvoiceId();
                            } else {
                                invoiceId = data;
                                LogVendorSCls.setInvoiceId(data);
                            }
                            if (invoiceId != '0' && invoiceId != undefined && invoiceId != null) {
                                win.down('#Inv_ID').setValue(invoiceId);
                                PgAtt.setInvoice_id(invoiceId);
                                IProcessingSCls.setInvoice_id(invoiceId);

                                if (me.itemId == "SaveProcess") {
                                    var tabPanel = this.getActiveCurrent();
                                    if (tabPanel == null) {
                                        tabPanel = this.getAllCurrent();
                                    }
                                    var rec = BillsSingCls.billDetailsInfo(invoiceId);
                                    IProcessingSCls.setRecDetails('');
                                    IProcessingSCls.setNewRecDetails(rec);
                                    IProcessingSCls.setPageType('LVB');
                                    PgAtt.setInvRecFlag(true);
                                    win.close()
                                    tabPanel.down('#InvoiceProcessingId').setDisabled(false);
                                    tabPanel.setActiveTab(9);

                                } else if (me.itemId == "LogNext" && data != "Updated") {
                                    page.ReloadDialog(me);
                                } else if (me.itemId == "ExcelUpload") {
                                    ImportExcelSCls.setInvoiceId(invoiceId);
                                } else {
                                    PgAtt.setFilterGoFlag(true);
                                    win.close();
                                    filter.fireEvent('btnApply');
                                }
                            }
                            else {
                                alert("Invalid Invoice Id , Please refresh page and do log the invoice again.")
                            }
                        } else {
                            PgAtt.setFilterGoFlag(true);
                            win.close();
                            filter.fireEvent('btnApply');
                        }

                    }
                },
                failure: function (conn, response, options, eOpts) {
                    BIACore.Exception(conn.responseText);
                    BIACore.Message(response);
                },
                scope: this
            });
        }
    },
    SaveProcessClick: function SaveProcessClick(me) {
        var win = me.up('window');
        var bValid = true;
        var errorMessage = '';
        var retValue = '';
        var str = win.down('#VendorHiddenId').getValue();
        var z = str.split('-');
        var VendorId = z[0];
        retValue = LogVendorSCls.checkLength(win.down('#filVendorLoctionLVB clearCombo'), "Invoice Location", 3, 50);
        errorMessage += retValue;
        bValid = bValid && retValue.length > 0 ? false : true;

        retValue = LogVendorSCls.checkLength(win.down('#filVendorLVB clearCombo'), "Vendor", 5, 250);
        errorMessage += retValue;
        bValid = bValid && retValue.length > 0 ? false : true;

        retValue = LogVendorSCls.checkLength(win.down('#filBillRefNoLVB textfield'), "Invoice Ref No", 3, 50);
        errorMessage += retValue;
        bValid = bValid && retValue.length > 0 ? false : true;


        retValue = LogVendorSCls.checkLength(win.down('#filBillCurrLVB textfield'), "Invoice Currency Code", 3, 3);
        errorMessage += retValue;
        bValid = bValid && retValue.length > 0 ? false : true;

        retValue = LogVendorSCls.checkLength(win.down('#filTaxExptAmtLVB textfield'), "Tax Exempt Amount", 1, 20);
        errorMessage += retValue;
        bValid = bValid && retValue.length > 0 ? false : true;

        if (win.down('#filUPSRefTypeLVB clearCombo').value !== null && win.down('#filUPSRefTypeLVB clearCombo').value !== '') {
            retValue = LogVendorSCls.checkLength(win.down('#filUPSRefTypeLVB clearCombo'), "Invoice Reference Type", 1, 60);
            errorMessage += retValue;
            bValid = bValid && retValue.length > 0 ? false : true;
        } else {
            bValid = false;
            errorMessage = errorMessage + "This is a required field, please select the appropriate UPS Reference Type from list. <br>";
        }

        if (win.down('#SiteCodeCurr').value != win.down('#filBillCurrLVB textfield').value) {
            bValid = false;
            errorMessage = errorMessage + "Site code currency does not match invoice currency. Please select a site code with the correct currency before you save or process this invoice. <br>";
            win.down('#filBillCurrLVB textfield').addCls('red-btn');
            win.down('#filSupplierIdLVB textfield').addCls('red-btn');
        }

        retValue = LogVendorSCls.checkLength(win.down('#filUPSReferenceLVB tagfield'), "UPS Reference", 1, 10);
        errorMessage += retValue;
        bValid = bValid && retValue.length > 0 ? false : true;

        if (retValue.length == 0) {
            retValue = LogVendorSCls.checkUPSRefNum(win);
            errorMessage += retValue;
            bValid = bValid && retValue.length > 0 ? false : true;
        }
        retValue = LogVendorSCls.checkRegexpForGrid(win.down('#filTaxExptAmtLVB textfield').value, /^(-?(\d*)|-?(\d*\.\d{1,6}))$/, "Tax Exempt Amount field only allow : [0-9].[0-9] <br>");
        errorMessage += retValue;
        bValid = bValid && retValue.length > 0 ? false : true;

        retValue = LogVendorSCls.check_main_date(win.down('#filBillDateLVB datefield'), 'during_form_submission');
        errorMessage += retValue;
        bValid = bValid && retValue.length > 0 ? false : true;

        if (LogVendorSCls.getCountryCode() == "TW") {
            if (win.down('#filInvoiceTypeLVB clearCombo').value == '0') {
                bValid = false;
                errorMessage += "This is a required field, please select the appropriate Invoice Type.";
                win.down('#filInvoiceTypeLVB clearCombo').setFieldStyle('background-color:red');
            }
        }

        var vatstring = '';
        var VATPercent = 0;
        var VATCodeEdits = Ext.Array.pluck(win.down('App-View-LogVendor-VatTaxAmt').store.data.items, 'data')
        if (Ext.isArray(VATCodeEdits)) {
            for (var i = 0; i < VATCodeEdits.length - 1; i++) {

                // loop through all the VATCodes Amounts                 
                var TWHAmount = VATCodeEdits[i].TWH_Amount,
                    StrTWHAmount = Ext.isEmpty(VATCodeEdits[i].TWH_Amount) ? '' : VATCodeEdits[i].TWH_Amount.toString(),
                    VATCode = VATCodeEdits[i].vat_code,
                    RetRate = VATCodeEdits[i].RetentionFlag,
                    Amount = VATCodeEdits[i].Amount,
                    StrAmount = Ext.isEmpty(VATCodeEdits[i].Amount) ? '' : VATCodeEdits[i].Amount.toString(),
                    IsVatOffSet = VATCodeEdits[i].IsVatOffSet,
                    IS_OFFSET_LOC = VATCodeEdits[i].IS_OFFSET_LOC,
                    OSOffset = VATCodeEdits[i].OSOffset;
                VATPercent = VATCodeEdits[i].vat_percent;

                if (Amount === '' || Amount === null) {
                    Amount = 0;
                }

                if (win.down('#TWHFlag').value == 'Y') {
                    if (TWHAmount === '' || TWHAmount === null) {
                        StrTWHAmount = '0';
                        TWHAmount = 0;
                    }
                } else {
                    TWHAmount = 0;
                }
                if (VATPercent == 0 && TWHAmount != 0 && StrAmount.length == 0) {
                    StrAmount = '0';
                    VATCodeEdits[i].Amount = 0;
                }

                if (OSOffset == '' || OSOffset == null) {
                    OSOffset = 0;
                }
                if (OSOffset <= 0 && IsVatOffSet == 'Y' && IS_OFFSET_LOC == 'Y' && RetRate == 1) {
                    var vatCodeParent = Ext.Array.findBy(VATCodeEdits, function (c) { return c.vat_code == VATCode.replace('-OS', ''); });
                    if (vatCodeParent.IsVatOffSet == 'Y' && vatCodeParent.Amount !== null && vatCodeParent.Amount > 0) {
                        vatstring = vatstring + VATCode + "_" + VATPercent + "_" + Amount + "_" + RetRate + "_" + TWHAmount + "_" + OSOffset + "|";
                    }
                }
                if (StrAmount.length > 0) {
                    retValue = LogVendorSCls.checkGridItemsLength(StrAmount, "VAT Taxable Amt", 1, 20);
                    errorMessage += retValue;
                    bValid = bValid && retValue.length > 0 ? false : true;
                    retValue = LogVendorSCls.checkRegexpForGrid(StrAmount, /^(-?(\d*)|(-?\d*\.\d{1,6}))$/, "VAT Taxable Amt field only allow : [0-9].[0-9]");
                    errorMessage += retValue;
                    bValid = bValid && retValue.length > 0 ? false : true;

                    if (win.down('#TWHFlag').value == 'Y') {
                        retValue = LogVendorSCls.checkGridItemsLength(StrTWHAmount, "Tax Withholding Amt", 1, 20);
                        errorMessage += retValue;
                        bValid = bValid && retValue.length > 0 ? false : true;

                        retValue = LogVendorSCls.checkRegexpForGrid(StrTWHAmount, /^-(\d*)|(^-\d*\.\d{1,6})|^0|(^0\.0{1,6})$/, "Tax Withholding Amt field only allow zero or negative number : -[0-9].[0-9]");
                        errorMessage += retValue;
                        bValid = bValid && retValue.length > 0 ? false : true;
                    }
                    vatstring = vatstring + VATCode + "_" + VATPercent + "_" + Amount + "_" + RetRate + "_" + TWHAmount + "_" + OSOffset + "|";
                } else {
                    // This entire 'else' clause was added after the fact. This click event didn't fire if the user was trying to set the 'Amount' to Null or '' or 0.0, because the update is contingent upon the .value() not being ''.
                    if (!Ext.isEmpty(VATCode))
                        LogVendorSCls.deleteVATData(win.down('#Inv_ID').value, VATCode);
                }
            }
        }
        win.down('#LVBTips').setText(errorMessage, false);
        if (bValid && errorMessage == '') {
            this.postInvoice('Logged', VendorId, vatstring, me);
        }
    },
    SaveClick: function SaveClick(me) {
        var win = me.up('window');
        var page = this;
        //Attention, this line will really serve for 'Log Next' and 'Save', since the button label gets changed, but this keeps the code simple
        //str_button_clicked = 'Log Next';
        var bValid = true;
        var retValue = '';
        var errorMessage = '',
            varlocation = win.down('#filVendorLoctionLVB clearCombo').value,
            varvendor = win.down('#filVendorLVB clearCombo').value,
            varBillCurrency = win.down('#SiteCodeCurr').value,
            varsiteCode = win.down('#filSupplierIdLVB textfield').value,
            vatdate = win.down('#filVatPtDateLVB datefield').value;

        retValue = LogVendorSCls.checkLength(win.down('#filVendorLoctionLVB clearCombo'), "Invoice Location", 3, 50);
        errorMessage += retValue;
        bValid = bValid && retValue.length > 0 ? false : true;

        retValue = LogVendorSCls.checkLength(win.down('#filVendorLVB clearCombo'), "Vendor", 5, 250);
        errorMessage += retValue;
        bValid = bValid && retValue.length > 0 ? false : true;

        retValue = LogVendorSCls.checkLength(win.down('#filBillRefNoLVB textfield'), "Invoice Ref No", 3, 50);
        errorMessage += retValue;
        bValid = bValid && retValue.length > 0 ? false : true;

        retValue = LogVendorSCls.checkLength(win.down('#filBillCurrLVB textfield'), "Invoice Currency Code", 3, 3);
        errorMessage += retValue;
        bValid = bValid && retValue.length > 0 ? false : true;

        retValue = LogVendorSCls.checkLength(win.down('#filTaxExptAmtLVB textfield'), "Tax Exempt Amount", 1, 20);
        errorMessage += retValue;
        bValid = bValid && retValue.length > 0 ? false : true;


        if (win.down('#SiteCodeCurr').value != win.down('#filBillCurrLVB textfield').value) {
            bValid = false;
            errorMessage = errorMessage + "Site code currency does not match invoice currency. Please select a site code with the correct currency before you save or process this invoice. <br>";
            win.down('#filBillCurrLVB textfield').addCls('red-btn');
            win.down('#filSupplierIdLVB textfield').addCls('red-btn');
        }

        if (win.down('#filUPSRefTypeLVB clearCombo').value !== null && win.down('#filUPSRefTypeLVB clearCombo').value !== '') {
            retValue = LogVendorSCls.checkLength(win.down('#filUPSRefTypeLVB clearCombo'), "Invoice Reference Type", 1, 60);
            errorMessage += retValue;
            bValid = bValid && retValue.length > 0 ? false : true;
        } else {
            bValid = false;
            errorMessage = errorMessage + "This is a required field, please select the appropriate UPS Reference Type from list. <br>";
        }

        if (win.down('#filUPSRefTypeLVB clearCombo').value === 99) {
            win.down('#filUPSReferenceLVB textfield').setValue('ExcelUploadCBOL');
        }

        if (win.down('#filUPSRefTypeLVB clearCombo').value !== 99) {
            retValue = LogVendorSCls.checkLength(win.down('#filUPSReferenceLVB textfield'), "UPS Reference", 1, 250);
            errorMessage += retValue;
            bValid = bValid && retValue.length > 0 ? false : true;

            if (retValue.length == 0) {
                retValue = LogVendorSCls.checkUPSRefNum(win);
                errorMessage += retValue;
                bValid = bValid && retValue.length > 0 ? false : true;
            }

        }

        retValue = LogVendorSCls.checkRegexpForGrid(win.down('#filTaxExptAmtLVB textfield').value, /^(-?(\d*)|-?(\d*\.\d{1,6}))$/, "Tax Exempt Amount field only allow : [0-9].[0-9] <br>");
        errorMessage += retValue;
        bValid = bValid && retValue.length > 0 ? false : true;

        retValue = LogVendorSCls.check_main_date(win.down('#filBillDateLVB datefield'), 'during_form_submission');
        errorMessage += retValue;
        bValid = bValid && retValue.length > 0 ? false : true;

        if (LogVendorSCls.getCountryCode() == "TW") {
            if (win.down('#filInvoiceTypeLVB clearCombo').value == '0') {
                bValid = false;
                errorMessage += "This is a required field, please select the appropriate Invoice Type.";
            }
        }

        var vatCodesD = [];
        var vatstring = '';
        var VATTotal = 0.00;
        var VATPercent = 0;
        var VATCodeEdits = Ext.Array.pluck(win.down('App-View-LogVendor-VatTaxAmt').store.data.items, 'data');
        var z = '';
        if (Ext.isArray(VATCodeEdits)) {
            for (var i = 0; i < VATCodeEdits.length; i++) {
                // loop through all the VATCodes Amounts    
                var TWHAmount = VATCodeEdits[i].TWH_Amount,
                    StrTWHAmount = Ext.isEmpty(VATCodeEdits[i].TWH_Amount) ? '' : VATCodeEdits[i].TWH_Amount.toString(),
                    VATCode = VATCodeEdits[i].vat_code,
                    RetRate = VATCodeEdits[i].RetentionFlag,
                    Amount = VATCodeEdits[i].Amount,
                    StrAmount = Ext.isEmpty(VATCodeEdits[i].Amount) ? '' : VATCodeEdits[i].Amount.toString(),
                    IsVatOffSet = VATCodeEdits[i].IsVatOffSet,
                    IS_OFFSET_LOC = VATCodeEdits[i].IS_OFFSET_LOC,
                    OSOffset = VATCodeEdits[i].OSOffset;

                VATPercent = VATCodeEdits[i].vat_percent;

                if (Amount === '' || Amount === null) {
                    Amount = 0;
                }

                if (win.down('#TWHFlag').value == 'Y') {
                    if (TWHAmount === '' || TWHAmount === null) {
                        StrTWHAmount = '0';
                        TWHAmount = 0;
                    }
                } else {
                    TWHAmount = 0;
                }
                if (IsVatOffSet == 'Y' && IS_OFFSET_LOC == 'Y' && RetRate == 1) {
                    VATTotal = VATTotal + parseFloat(Amount) + parseFloat(TWHAmount) + parseFloat(OSOffset);
                }
                else {
                    VATTotal = VATTotal + parseFloat(Amount) + parseFloat(TWHAmount);
                }

                if (VATPercent == 0 && TWHAmount != 0 && StrAmount.length == 0) {
                    StrAmount = '0';
                    VATCodeEdits[i].Amount = 0;
                }

                if (OSOffset == '' || OSOffset == null) {
                    OSOffset = 0;
                }
                if (OSOffset <= 0 && IsVatOffSet == 'Y' && IS_OFFSET_LOC == 'Y' && RetRate == 1) {
                    var vatCodeParent = Ext.Array.findBy(VATCodeEdits, function (c) { return c.vat_code == VATCode.replace('-OS', ''); });
                    if (vatCodeParent.IsVatOffSet == 'Y' && vatCodeParent.Amount !== null && vatCodeParent.Amount > 0) {
                        vatstring = vatstring + VATCode + "_" + VATPercent + "_" + Amount + "_" + RetRate + "_" + TWHAmount + "_" + OSOffset + "|";
                    }
                }
                if (StrAmount.length > 0) {
                    retValue = LogVendorSCls.checkGridItemsLength(StrAmount, "VAT Taxable Amt", 1, 20);
                    errorMessage += retValue;
                    bValid = bValid && retValue.length > 0 ? false : true;

                    retValue = LogVendorSCls.checkRegexpForGrid(StrAmount, /^(-?(\d*)|(-?\d*\.\d{1,6}))$/, "VAT Taxable Amt field only allow : [0-9].[0-9]");
                    errorMessage += retValue;
                    bValid = bValid && retValue.length > 0 ? false : true;

                    if (win.down('#TWHFlag').value == 'Y') {
                        retValue = LogVendorSCls.checkGridItemsLength(StrTWHAmount, "Tax Withholding Amt", 1, 20);
                        errorMessage += retValue;
                        bValid = bValid && retValue.length > 0 ? false : true;

                        retValue = LogVendorSCls.checkRegexpForGrid(StrTWHAmount, /^-(\d*)|(^-\d*\.\d{1,6})|^0|(^0\.0{1,6})$/, "Tax Withholding Amt field only allow zero or negative number : -[0-9].[0-9]");
                        errorMessage += retValue;
                        bValid = bValid && retValue.length > 0 ? false : true;
                    }
                    vatstring = vatstring + VATCode + "_" + VATPercent + "_" + Amount + "_" + RetRate + "_" + TWHAmount + "_" + OSOffset + "|";
                }
                else {

                    // This entire 'else' clause was added after the fact. This click event didn't fire if the user was trying to set the 'Amount' to Null or '' or 0.0, because the update is contingent upon the .value() not being ''.
                    var y = LogVendorSCls.checkInvoiceDetailForExVatCode(win.down('#Inv_ID').value, VATCode);//CheckInvoiceDetailForExVatCode(rec.get('invoice_id'))
                    if (y) {
                        vatCodesD.push(VATCode);
                        if (IsVatOffSet == 'Y' && IS_OFFSET_LOC == 'Y') {
                            vatCodesD.push(VATCode + '-OS');
                        }
                    }
                    else {
                        if (!Ext.isEmpty(VATCode))
                            LogVendorSCls.deleteVATData(win.down('#Inv_ID').value, VATCode);
                    }
                }
            }
        }
        var VendorId = '', vInvoiceStatus = 'Logged';
        if (vatCodesD.length > 0) {
            for (var k = 0; k < vatCodesD.length; k++) {
                var vatCodeDel = vatCodesD[k]
                Ext.Msg.confirm('Vat code deletion', '<div><h4>This will uncheck all selected records with tax code - ' + vatCodeDel + ' from invoice id - ' + win.down('#Inv_ID').value + '. Are you sure?</h4></div>', function (e) {
                    if (e == 'yes') {
                        LogVendorSCls.updateDeleteInvoiceVatData(win.down('#Inv_ID').value, vatCodeDel);
                        if (bValid && errorMessage == '') {
                            z = win.down('#VendorHiddenId').value.split('-');
                            VendorId = z[0];
                            if (win.down('#InvoiceAmt_Org').value != 'NewInv') { // Existing Invoice
                                if (win.down('#Invoice_Status').value == 'Verified') {
                                    if ((win.down('#InvoiceAmt_Org').value != win.down('#filTaxExptAmtLVB textfield').value) || (win.down('#VATTotal_Org').value != VATTotal)) {
                                        vInvoiceStatus = 'Pending';
                                    } else {
                                        vInvoiceStatus = win.down('#Invoice_Status').value;
                                    }
                                } else {
                                    vInvoiceStatus = win.down('#Invoice_Status').value;
                                }
                            }
                            page.postInvoice(vInvoiceStatus, VendorId, vatstring, me);
                            win.down('#filVendorLoctionLVB clearCombo').setValue(varlocation);
                            win.down('#filVendorLVB clearCombo').setValue(varvendor);
                            win.down('#SiteCodeCurr').setValue(varBillCurrency);
                            win.down('#filSupplierIdLVB textfield').setValue(varsiteCode);
                            win.down('#filVatPtDateLVB datefield').setValue(vatdate);

                        }
                    }
                    else if (e == 'Cancel') {
                        bValid = false;
                    }
                });
            }
        }
        else {
            win.down('#LVBTips').setText(errorMessage, false);
            if (bValid && errorMessage == '') {
                z = win.down('#VendorHiddenId').value.split('-');
                VendorId = z[0];
                /*
                Kaizen 6479 Verified status -- allow update of any fields to users. 
                    dollar amount update forces to pending status 
                    VAT code changes forces the invoices back to pending status(nww1sxj)
                */

                if (win.down('#InvoiceAmt_Org').value != 'NewInv') { // Existing Invoice
                    if (win.down('#Invoice_Status').value == 'Verified') {
                        if ((win.down('#InvoiceAmt_Org').value != win.down('#filTaxExptAmtLVB textfield').value) || (win.down('#VATTotal_Org').value != VATTotal)) {
                            vInvoiceStatus = 'Pending';
                        } else {
                            vInvoiceStatus = win.down("#Invoice_Status").value;
                        }
                    } else {
                        vInvoiceStatus = win.down('#Invoice_Status').value;
                    }
                }
                page.postInvoice(vInvoiceStatus, VendorId, vatstring, me);
                win.down('#filVendorLoctionLVB clearCombo').setValue(varlocation);
                win.down('#filVendorLVB clearCombo').setValue(varvendor);
                win.down('#SiteCodeCurr').setValue(varBillCurrency);
                win.down('#filSupplierIdLVB textfield').setValue(varsiteCode);
                win.down('#filVatPtDateLVB datefield').setValue(vatdate);
            }
        }
    },
    ExcelUploadClick: function ExcelUploadClick(me) {
        var win = me.up('window');

        var bValid = true;
        var errorMessage = '';
        var retValue = '';

        retValue = LogVendorSCls.checkLength(win.down('#filVendorLoctionLVB clearCombo'), "Invoice Location", 3, 50);
        errorMessage += retValue;
        bValid = bValid && retValue.length > 0 ? false : true;

        retValue = LogVendorSCls.checkLength(win.down('#filVendorLVB clearCombo'), "Vendor", 5, 250);
        errorMessage += retValue;
        bValid = bValid && retValue.length > 0 ? false : true;

        retValue = LogVendorSCls.checkLength(win.down('#filBillRefNoLVB textfield'), "Invoice Ref No", 3, 50);
        errorMessage += retValue;
        bValid = bValid && retValue.length > 0 ? false : true;


        retValue = LogVendorSCls.checkLength(win.down('#filBillCurrLVB textfield'), "Invoice Currency Code", 3, 3);
        errorMessage += retValue;
        bValid = bValid && retValue.length > 0 ? false : true;

        retValue = LogVendorSCls.checkLength(win.down('#filTaxExptAmtLVB textfield'), "Tax Exempt Amount", 1, 20);
        errorMessage += retValue;
        bValid = bValid && retValue.length > 0 ? false : true;

        retValue = LogVendorSCls.checkRegexpForGrid(win.down('#filTaxExptAmtLVB textfield').value, /^(-?(\d*)|-?(\d*\.\d{1,6}))$/, "Tax Exempt Amount field only allow : [0-9].[0-9] <br>");
        errorMessage += retValue;
        bValid = bValid && retValue.length > 0 ? false : true;

        retValue = LogVendorSCls.check_main_date(win.down('#filBillDateLVB datefield'), 'during_form_submission');
        errorMessage += retValue;
        bValid = bValid && retValue.length > 0 ? false : true;


        var vatstring = '';
        var VATPercent = 0;
        var VATCodeEdits = Ext.Array.pluck(win.down('App-View-LogVendor-VatTaxAmt').store.data.items, 'data')
        if (Ext.isArray(VATCodeEdits)) {
            for (var i = 0; i < VATCodeEdits.length; i++) {
                // loop through all the VATCodes Amounts 

                var TWHAmount = VATCodeEdits[i].TWH_Amount,
                    StrTWHAmount = Ext.isEmpty(VATCodeEdits[i].TWH_Amount) ? '' : VATCodeEdits[i].TWH_Amount.toString(),
                    //str = VATId.split('_'),
                    VATCode = VATCodeEdits[i].vat_code,
                    //  Count = VATCodeEdits.length,
                    RetRate = VATCodeEdits[i].RetentionFlag,
                    Amount = VATCodeEdits[i].Amount,
                    StrAmount = Ext.isEmpty(VATCodeEdits[i].Amount) ? '' : VATCodeEdits[i].Amount.toString(),
                    IsVatOffSet = VATCodeEdits[i].IsVatOffSet,
                    IS_OFFSET_LOC = VATCodeEdits[i].IS_OFFSET_LOC,
                    OSOffset = VATCodeEdits[i].OSOffset;
                VATPercent = VATCodeEdits[i].vat_percent;

                if (Amount === '' || Amount === null) {
                    Amount = 0;
                }

                if (win.down('#TWHFlag').value == 'Y') {
                    if (TWHAmount === '' || TWHAmount === null) {
                        StrTWHAmount = '0';
                        TWHAmount = 0;
                    }
                } else {
                    TWHAmount = 0;
                }
                if (VATPercent == 0 && TWHAmount != 0 && StrAmount.length == 0) {
                    StrAmount = '0';
                    VATCodeEdits[i].Amount = 0;
                }
                if (OSOffset == '' || OSOffset == null) {
                    OSOffset = 0;
                }
                if (OSOffset < 0 && IsVatOffSet == 'Y' && IS_OFFSET_LOC == 'Y' && RetRate == 1) {
                    var vatCodeParent = Ext.Array.findBy(VATCodeEdits, function (c) { return c.vat_code == VATCode.replace('-OS', ''); });
                    if (vatCodeParent.IsVatOffSet == 'Y' && vatCodeParent.Amount !== null && vatCodeParent.Amount > 0) {
                        vatstring = vatstring + VATCode + "_" + VATPercent + "_" + Amount + "_" + RetRate + "_" + TWHAmount + "_" + OSOffset + "|";
                    }
                }

                if ((Amount != 0 && Amount != '' && Amount !== null) || (TWHAmount != 0 && TWHAmount != '')) {
                    retValue = LogVendorSCls.checkGridItemsLength(StrAmount, "VAT Taxable Amt", 1, 20);
                    errorMessage += retValue;
                    bValid = bValid && retValue.length > 0 ? false : true;

                    retValue = LogVendorSCls.checkRegexpForGrid(StrAmount, /^(-?(\d*)|(-?\d*\.\d{1,6}))$/, "VAT Taxable Amt field only allow : [0-9].[0-9]");
                    errorMessage += retValue;
                    bValid = bValid && retValue.length > 0 ? false : true;

                    if (win.down('#TWHFlag').value == 'Y') {
                        retValue = LogVendorSCls.checkGridItemsLength(StrTWHAmount, "Tax Withholding Amt", 1, 20);
                        errorMessage += retValue;
                        bValid = bValid && retValue.length > 0 ? false : true;

                        retValue = LogVendorSCls.checkRegexpForGrid(StrTWHAmount, /^-(\d*)|(^-\d*\.\d{1,6})|^0|(^0\.0{1,6})$/, "Tax Withholding Amt field only allow zero or negative number : -[0-9].[0-9]");
                        errorMessage += retValue;
                        bValid = bValid && retValue.length > 0 ? false : true;
                    }
                    vatstring = vatstring + VATCode + "_" + VATPercent + "_" + Amount + "_" + RetRate + "_" + TWHAmount + "_" + OSOffset + "|";
                }
                else {
                    // ATTENTION - ATTENTION - ATTENTION - ATTENTION - ATTENTION - ATTENTION - ATTENTION - ATTENTION - ATTENTION
                    // This entire 'else' clause was added after the fact. This click event didn't fire if the user was trying to set the 'Amount' to Null or '' or 0.0, because the update is contingent upon the .value() not being ''.
                    //###############################################################################################################
                    if (!Ext.isEmpty(VATCode))
                        LogVendorSCls.deleteVATData(win.down('#Inv_ID').value, VATCode);
                    //###############################################################################################################
                }
            }
        }
        win.down('#LVBTips').setText(errorMessage, false);
        var vatsplit = vatstring.split("|");
        if (bValid && errorMessage == "") {
            if (vatsplit.length <= 2) {
                var z = win.down('#VendorHiddenId').value.split('-');
                var vInvoiceStatus = 'Logged';
                if (win.down('#InvoiceAmt_Org').value != 'NewInv') { // Existing Invoice
                    if (win.down('#Invoice_Status').value == 'Verified') {
                        if ((win.down('#InvoiceAmt_Org').value != win.down('#filTaxExptAmtLVB textfield').value) || (win.down('#VATTotal_Org').value != VATTotal)) {
                            vInvoiceStatus = 'Pending';
                        } else {
                            vInvoiceStatus = win.down("#Invoice_Status").value;
                        }
                    } else {
                        vInvoiceStatus = win.down('#Invoice_Status').value;
                    }
                }
                var VendorId = z[0];
                this.postInvoice(vInvoiceStatus, VendorId, vatstring, me);
                Ext.widget('App-View-ImportExcel-Report').show();
            }
            else {
                alert("Excel upload allows only one vat code per Invoice Id.");
            }
        }


    },
    SaveCheckInfoClick: function SaveCheckInfoClick(me) {
        var win = me.up('window');
        var bValid = true;
        var errorMessage = '';
        var retValue = '';

        if (win.down('#filCheckDateLVB datefield').value != '') {
            bValid = bValid && LogVendorSCls.validate_check_date(win.down('#filCheckDateLVB datefield'), 'during_form_submission');
        }
        if (win.down('#filCheckAmtLVB textfield').value != '') {
            bValid = bValid && LogVendorSCls.validate_check_amount(win.down('#filCheckAmtLVB textfield'), 'during_form_submission');

            retValue = LogVendorSCls.checkLength(win.down('#filCheckAmtLVB textfield'), "Check Amount", 1, 20);
            errorMessage += retValue;
            bValid = bValid && retValue.length > 0 ? false : true;

            retValue = LogVendorSCls.checkRegexp(win.down('#filCheckAmtLVB textfield'), /^(-?(\d*)|-?(\d*\.\d{1,6}))$/, "Check Amount field only allows : [0-9].[0-9]");
            errorMessage += retValue;
            bValid = bValid && retValue.length > 0 ? false : true;
        }
        if (bValid && errorMessage == '') {
            LogVendorSCls.updateInvCheckInfo(win);
            win.close();
        }
        else {
            win.down('#LVBTips').setText(errorMessage, false);
        }
    },
    CancelClick: function CancelClick(me) {
        var win = me.up('window');
        win.close();
    },
    ReloadDialog: function ReloadDialog(me) {
        var win = me.up('window');
        win.down('#filVendorLVB clearCombo').setValue('');
        win.down('#filSupplierIdLVB textfield').setValue('');
        win.down('#filBillRefNoLVB textfield').setValue('');
        win.down('#filStampNumberLVB textfield').setValue('');
        win.down('#filOtherRefLVB textfield').setValue('');
        win.down('#filBillDateLVB datefield').setValue('');
        win.down('#filTaxExptAmtLVB textfield').setValue('');
        win.down('#filVatPtDateLVB datefield').setValue('');
        win.down('#filACCNoLVB clearCombo').setValue('');
        win.down('#filUPSReferenceLVB textfield').setValue('');
        win.down('#filPayAloneLVB checkbox').setValue(false);
        win.down('#filInvoiceTypeLVB clearCombo').setValue('');
        win.down('#filBillDueDateLVB datefield').setValue('');

        var grid = win.down('grid');
        var store = grid.getStore();
        var locCode = win.down('#filVendorLoctionLVB clearCombo').getValue();
        // set the parameters on the proxy                                                     
        // load new data

        store.getProxy().extraParams.LocCode = locCode
        store.getProxy().extraParams.InvoiceId = 0;
        store.load();
    }
});