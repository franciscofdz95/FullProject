Ext.define('App.Controller.LogVendor.LogVendorBill', {
    extend: 'Ext.app.Controller',
    init: function () {
        this.control({
            'App-View-LogVendor-VatTaxAmt': {
                beforerender: this.VatTaxAmtBeforeRender
            },
            'App-View-LogVendor-LogVendorBill': {
                beforerender: this.LogVendorBeforeRender
            }
        });
    },
    VatTaxAmtBeforeRender: function VatTaxAmtBeforeRender(me) {
        if (me) {
            me.store.addListener({
                load: {
                    fn: this.LoadTotalBillAmount,
                    scope: this,
                    args: [me]
                }
            })
        }
    },
    LoadTotalBillAmount: function LoadTotalBillAmount(me, store, records, success) {
        var win = me.up('window');
        if (records.length > 0) {
            win.down('#filVatPtDateLVB datefield').setDisabled(false);
            win.down('#filVatPtDateLVB label').setDisabled(false);
            win.down('#filVatPtDateLVB datefield').show();
            win.down('#filVatPtDateLVB label').show();
        } else {
            win.down('#filVatPtDateLVB datefield').setDisabled(true);
            win.down('#filVatPtDateLVB label').setDisabled(true);
            win.down('#filVatPtDateLVB datefield').hide();
            win.down('#filVatPtDateLVB label').hide();
        }
        LogVendorSCls.calTotalBillAmount(win);
    },
    LogVendorBeforeRender: function LogVendorBeforeRender(me) {
        var rec = me.rec;
        var invoiceId = LogVendorSCls.getInvoiceId();
        var locCode = me.down('#filVendorLoctionLVB clearCombo').getValue();
        me.down('#filBillDueDateLVB datefield').setDisabled(true);
        me.down('#TWHFlag').setValue(LogVendorSCls.getTaxWthgInd());
        this.getLVBFieldsData(invoiceId, me);
        var grid = me.down('grid'),
            store = grid.getStore();

        if (rec != null && (locCode == null || locCode == '')) {
            locCode = rec.get('Location_Code');
        }
        if (locCode == null || locCode == undefined || locCode == '') {
            locCode = PgAtt.getLocation_code();
            // VendorLoction Text box auto populated with Location Code from Filter by Sriram
            me.down('#filVendorLoctionLVB clearCombo').setValue(PgAtt.getLocation_code());
        }
        // set the parameters on the proxy                                              
        store.getProxy().extraParams.LocCode = locCode
        store.getProxy().extraParams.InvoiceId = invoiceId;
        store.load();

        if (LogVendorSCls.getVocInd() == 'Y') {
            me.down('#filACCNoLVB clearCombo').setDisabled(false);
        } else {
            me.down('#filACCNoLVB clearCombo').setDisabled(true);
        }

        if (LogVendorSCls.getTaxWthgInd() == 'Y') {
            grid.down('#taxWhldCol').show();
        } else {
            grid.down('#taxWhldCol').hide();
        }

    },
    getLVBFieldsData: function (invoiceId, me) {
        if (invoiceId !== 0) {

            BIA.Ajax.request({
                url: 'api/WebAPIReport/GetLVBFieldsData',
                method: "POST",
                async: false,
                cache: false,
                headers: {
                    "Content-Type": "application/json"
                },
                jsonData: {
                    InvoiceId: invoiceId
                },
                useDefaultXhrHeader: true,
                success: function (response) {
                    var data = Ext.decode(response.responseText);
                    if (Ext.isObject(data) && data != '' && data != null) {
                        me.dataRecord = Ext.clone(data);
                        LogVendorSCls.setDataRecord(Ext.clone(data));
                        this.loadLVBFields(data, me);
                        var status = data.invoice_status;
                        if (status !== 'Logged' || status !== 'Pending') {
                            me.down('#SaveProcess').hide();
                            me.down('#LogNext').hide();
                            if (data.RegionId == '11') {
                                me.down('#filPayAloneLVB').show();
                                me.down('#filPayAloneLVB checkbox').setValue(data.pay_alone_flag);
                            }
                            else {
                                me.down('#filPayAloneLVB').hide();
                            }
                            if (data.CountryCode == 'TW') {
                                me.down('#filInvoiceTypeLVB').show();
                                me.down('#filInvoiceTypeLVB clearCombo').setValue(data.value_pay_invoice_type_code);
                            }
                            else {
                                me.down('#filInvoiceTypeLVB').hide();
                            }
                        }
                        if ((status == 'Printed' && data.ScanInfo == 'PAID') || status == 'Approved') {
                            if (data.RegionId == '10' || data.RegionId == '11' || data.RegionId == '13' || data.RegionId == '20') {
                                this.enableCheckInfoFields(me);
                                me.down('#SaveCheckInfo').show();
                                me.down('#checkDetailsLVB').show();
                            }
                        }
                        else if (status == 'Scanned' || status == 'Queued' || status == 'Sent' || status == 'Archived') {
                            if ((data.RegionId == '10' || data.RegionId == '11' || data.RegionId == '13' || data.RegionId == '20') && data.ScanInfo == 'PAID') {
                                me.down('#checkDetailsLVB').show();
                                me.down('#SaveCheckInfo').hide();
                                this.disableCheckInfoFields(me);
                            }
                            else {
                                me.down('#SaveCheckInfo').hide();
                                me.down('#checkDetailsLVB').hide();
                            }
                        }
                        else {
                            me.down('#SaveCheckInfo').hide();
                            me.down('#checkDetailsLVB').hide();
                        }

                        if (data.invoice_CID != data.locCurrCode) {
                            me.down('#filGLCurrRateLVB').show();
                            me.down('#lblThreeId').hide();
                            var currLbl = 'Currency Rate (' + data.invoice_CID + ' to ' + data.locCurrCode + '):';
                            me.down('#filGLCurrRateLVB').setText(currLbl);
                        }
                        else {
                            me.down('#filGLCurrRateLVB').hide();
                            me.down('#lblThreeId').show();
                            me.down('#filGLCurrRateLVB').setText(0);

                        }

                        /* Kaizen 6479 Remove save button in edit window for Approved invoices (nww1sxj) */
                        if (status == 'Logged' || status == 'Pending' || status == 'Verified') {
                            me.down('#LogNext').show();
                            if (data.RegionId == '11') {
                                me.down('#filPayAloneLVB').show();
                                me.down('#filPayAloneLVB checkbox').setValue(data.pay_alone_flag);
                            }
                            else {
                                me.down('#filPayAloneLVB').hide();
                            }
                            if (data.CountryCode == 'TW') {
                                me.down('#filInvoiceTypeLVB').show();
                                me.down('#filInvoiceTypeLVB clearCombo').setValue(data.value_pay_invoice_type_code);
                            }
                            else {
                                me.down('#filInvoiceTypeLVB').hide();
                            }
                        } else {
                            this.disableFormFields(me);
                            me.down('#LogNext').hide();
                        }

                        if (BIACore.Security.User.permissions[PgAtt.getGeoIndex()].EA_ProfileId != 1 && BIACore.Security.User.permissions[PgAtt.getGeoIndex()].EA_ProfileId != 5) {
                            if (status == 'Logged' || status == 'Pending' || status == 'Verified') {
                                if (data.ReferenceFilter === 'ExcelUploadCBOL' || data.Reference_id === 99) {
                                    me.down('#filUPSRefTypeLVB clearCombo').setValue('ExcelUpload');
                                    me.down('#SaveProcess').hide();
                                    me.down('#LogNext').show();
                                    me.down('#LogNext').setText('Save');
                                    me.down('#SaveCheckInfo').hide();
                                    me.down('#checkDetailsLVB').hide();
                                    me.down('#filPayAloneLVB').hide();
                                    me.down('#filGLCurrRateLVB').hide();
                                    me.down('#lblThreeId').show();
                                    me.down('#filInvoiceTypeLVB').hide();
                                    me.down('#Cancel').hide();
                                    me.down('#ExcelUpload').show();
                                    me.down('#ExcelUpload').setText('Edit Upload');
                                }
                                else {
                                    me.down('#filUPSRefTypeLVB clearCombo').setValue(data.Reference_id);
                                    me.down('#LogNext').setText('Save');
                                    if (status == 'Logged') {
                                        me.down('#SaveProcess').show();
                                        if (data.RegionId == '11') {
                                            me.down('#filPayAloneLVB').show();
                                        }
                                        else {
                                            me.down('#filPayAloneLVB').hide();
                                        }
                                        if (data.CountryCode == 'TW') {
                                            me.down('#filInvoiceTypeLVB').show();
                                        }
                                        else {
                                            me.down('#filInvoiceTypeLVB').hide();
                                        }
                                    }
                                    else {
                                        me.down('#LogNext').setText('Save');
                                    }
                                    me.down('#LogNext').show();
                                    me.down('#SaveCheckInfo').hide();
                                    me.down('#checkDetailsLVB').hide();
                                    me.down('#Cancel').show();
                                    me.down('#ExcelUpload').hide();
                                }
                            }
                            else if (status == 'Printed' || status == 'Approved') {
                                me.down('#SaveProcess').hide();
                                me.down('#LogNext').hide();
                                if ((status == 'Printed' && data.ScanInfo == 'PAID') || status == 'Approved') {
                                    if (data.RegionId == '10' || data.RegionId == '11' || data.RegionId == '13' || data.RegionId == '20') {
                                        me.down('#SaveCheckInfo').show();
                                        me.down('#checkDetailsLVB').show();
                                        me.down('#filPayAloneLVB').setDisabled(false);
                                    }
                                }
                                else {
                                    me.down('#SaveCheckInfo').hide();
                                    me.down('#checkDetailsLVB').hide();
                                }
                                me.down('#Cancel').show();
                                me.down('#ExcelUpload').hide();

                            }
                            else if (status == 'Scanned' || status == 'Queued' || status == 'Sent' || status == 'Archived') {
                                if ((data.RegionId == '10' || data.RegionId == '11' || data.RegionId == '13' || data.RegionId == '20') && data.ScanInfo == 'PAID') {
                                    me.down('#SaveCheckInfo').hide();
                                    me.down('#checkDetailsLVB').show();
                                    this.disableCheckInfoFields(me);
                                }
                                else {
                                    me.down('#SaveProcess').hide();
                                    me.down('#LogNext').hide();
                                    me.down('#SaveCheckInfo').hide();
                                    me.down('#checkDetailsLVB').hide();
                                    me.down('#Cancel').show();
                                    me.down('#ExcelUpload').hide();

                                }
                            }
                            else {
                                me.down('#SaveProcess').hide();
                                me.down('#LogNext').hide();
                                me.down('#SaveCheckInfo').hide();
                                me.down('#checkDetailsLVB').hide();
                                me.down('#Cancel').show();
                                me.down('#ExcelUpload').hide();
                            }
                        }
                    }
                },
                failure: function () {
                    BIACore.Exception(conn.responseText);
                    BIACore.Message(response);
                },
                scope: this
            });

            if (BIACore.Security.User.permissions[PgAtt.getGeoIndex()].EA_ProfileId == 1 || BIACore.Security.User.permissions[PgAtt.getGeoIndex()].EA_ProfileId == 5) {
                me.down('#SaveProcess').hide();
                me.down('#LogNext').hide();
                me.down('#SaveCheckInfo').hide();
                me.down('#checkDetailsLVB').hide();
                me.down('#filPayAloneLVB').hide();
                me.down('#filGLCurrRateLVB').hide();
                me.down('#lblThreeId').show();
                me.down('#filInvoiceTypeLVB').hide();
                me.down('#Cancel').show();
                me.down('#ExcelUpload').hide();

                if (BIACore.Security.User.permissions[PgAtt.getGeoIndex()].EA_ProfileId == 5) {
                    if (status == 'Printed' || status == 'Approved') {
                        if ((status == 'Printed' && data.ScanInfo == 'PAID') || status == 'Approved') {
                            if (data.RegionId == '10' || data.RegionId == '11' || data.RegionId == '13' || data.RegionId == '20') {
                                me.down('#SaveCheckInfo').show();
                                me.down('#checkDetailsLVB').show();
                            }
                        }
                        else {
                            me.down('#SaveCheckInfo').hide();
                            me.down('#checkDetailsLVB').hide();
                        }
                    }
                    else if (status == 'Scanned' || status == 'Queued' || status == 'Sent' || status == 'Archived') {
                        if ((data.RegionId == '10' || data.RegionId == '11' || data.RegionId == '13' || data.RegionId == '20') && data.ScanInfo == 'PAID') {
                            me.down('#SaveCheckInfo').show();
                            me.down('#checkDetailsLVB').show();
                            this.disableCheckInfoFields(me);
                        }
                        else {
                            me.down('#SaveCheckInfo').hide();
                            me.down('#checkDetailsLVB').hide();

                        }
                    }
                }
            }

        }
        else {
            me.down('#edit_Invoice_Click').Value = 0;
            me.down('#Inv_Location').Value = me.down('#filVendorLoctionLVB').Value;
            me.down('#ExcelUpload').hide();
            me.down('#SaveProcess').show();
            me.down('#filGLCurrRateLVB').hide();
            me.down('#lblThreeId').show();
            me.down('#SaveCheckInfo').hide();
            me.down('#checkDetailsLVB').hide();
            me.down('#filSupplierIdLVB').Value = '';
            me.down('#lblEmptyLVB').setVisible(true);
            me.down('#lblThreeId').setVisible(true);


            //log vendor bill pop up shows different data vs cold fusion version  by Sriram
            me.down('#filPayAloneLVB').hide();
            me.down('#filInvoiceTypeLVB').hide();


            // Need this to populate VAT in case default location exists. 
            me.down('#Inv_ID').Value = 0;

            var rec = me.rec;
            var locCode = me.down('#filVendorLoctionLVB clearCombo').getValue();
            if (rec != null && (locCode == null || locCode == '')) {
                locCode = rec.get('Location_Code');
            }
            if (locCode == null || locCode == undefined || locCode == '') {
                locCode = PgAtt.getLocation_code();
            }
            BIA.Ajax.request({
                url: 'api/WebAPIReport/GetRegionInfo',
                method: "POST",
                async: false,
                cache: false,
                headers: {
                    "Content-Type": "application/json"
                },
                jsonData: {
                    InvLoc: locCode
                },
                useDefaultXhrHeader: true,
                success: function (response) {
                    var data = Ext.decode(response.responseText);
                    if (data != null) {
                        me.dataRecord = Ext.clone(data);
                        if (data.RegionId == '11') {
                            me.down('#filPayAloneLVB').show();
                            me.down('#filPayAloneLVB checkbox').setValue(0); //uncheck flag
                        }
                        else {
                            me.down('#filPayAloneLVB').hide();
                        }
                        if (data.CountryCode == 'TW') {
                            me.down('#filInvoiceTypeLVB').show();
                        }
                        else {
                            me.down('#filInvoiceTypeLVB').hide();
                        }
                    }
                }

            });

        }

    },
    loadLVBFields: function (data, me) {
        if (data != null) {
            me.down('#filVendorLoctionLVB clearCombo').setValue(data.location_code);
            me.down('#VendorHiddenId').setValue(data.VendorKeyField);
            me.down('#filBillRefNoLVB textfield').setValue(data.InvRefNo);
            me.down('#filBillDateLVB datefield').setValue(data.InvoiceDate);
            me.down('#filStampNumberLVB textfield').setValue(data.StampNumber);
            me.down('#filBillDueDateLVB datefield').setValue(data.InvoiceDueDate);
            me.down('#filTaxExptAmtLVB textfield').setValue(data.Invoice_Amt);
            me.down('#filUPSRefTypeLVB clearCombo').setValue(data.Reference_id);
            me.down('#filUPSReferenceLVB textfield').setValue(data.ReferenceFilter);
            me.down('#filSupplierIdLVB textfield').setValue(data.SupplierID);
            me.down('#filOtherRefLVB textfield').setValue(data.OtherReference);
            me.down('#filVatPtDateLVB datefield').setValue(data.VATPointDate);


            me.down('#filInvoiceTypeLVB clearCombo').setValue(data.value_pay_invoice_type_code);
            me.down('#filCheckNoLVB2 textfield').setValue(data.CheckNumber);
            me.down('#filCheckAmtLVB textfield').setValue(data.CheckAmt);
            me.down('#filCheckDateLVB datefield').setValue(Ext.Date.format(new Date(data.Check_date), 'm/d/Y'));
            me.down('#filBankInfoLVB textfield').setValue(data.Bank_info);
            me.down('#filPayAloneLVB checkbox').setValue(data.pay_alone_flag);
            me.down('#filGLCurrRateLVB').setText(data.GL_Currency_rate);

            //Set Values for Hidden Fields
            me.down('#SiteCodeCurr').setValue(data.SITE_CURRENCY_CODE);
            me.down('#VendorHiddenId').setValue(data.VendorKeyField);
            me.down('#VATTotal_Org').setValue(data.VATTotal);
            me.down('#TotalBillAmount').setValue(data.TotalBillAmount);
            LogVendorSCls.setCountryCode(data.CountryCode);
            me.down('#Inv_ID').setValue(data.Invoice_id);
            me.down('#Inv_Location').setValue(data.location_code);
            me.down('#InvoiceAmt_Org').setValue(data.Invoice_Amt);
            me.down('#Invoice_Status').setValue(data.invoice_status);
            if (data.SupplierID.slice(-3) == "RCK") {
                me.down('#filRemoteCheckLocLVB').setVisible(true);
                me.down('#lblEmptyLVB').setVisible(false);
            } else {
                me.down('#filRemoteCheckLocLVB').setVisible(false);
                me.down('#lblEmptyLVB').setVisible(true);

            }
        }
    },
    disableCheckInfoFields: function (me) {
        me.down('#filCheckNoLVB2').hide();
        me.down('#filCheckAmtLVB').hide();
        me.down('#filCheckDateLVB').hide();
        me.down('#filBankInfoLVB').hide();
    },

    enableCheckInfoFields: function (me) {
        me.down('#filCheckNoLVB2').show();
        me.down('#filCheckAmtLVB').show();
        me.down('#filCheckDateLVB').show();
        me.down('#filBankInfoLVB').show();
    },
    disableFormFields: function (me) {
        me.down('#filVendorLoctionLVB clearCombo').setDisabled(true);
        me.down('#filVendorLVB clearCombo').setDisabled(true);
        me.down('#filBillRefNoLVB textfield').setDisabled(true);
        me.down('#filStampNumberLVB textfield').setDisabled(true);
        me.down('#filOtherRefLVB textfield').setDisabled(true);
        me.down('#filBillDateLVB datefield').setDisabled(true);
        me.down('#filTaxExptAmtLVB textfield').setDisabled(true);
        me.down('#filVatPtDateLVB datefield').setDisabled(true);
        me.down('#filBillCurrLVB clearCombo').setDisabled(true);
        me.down('#filACCNoLVB clearCombo').setDisabled(true);
        me.down('#filUPSReferenceLVB textfield').setDisabled(true);
        me.down('#filPayAloneLVB').setDisabled(true);
        me.down('#filInvoiceTypeLVB clearCombo').setDisabled(true);
        me.down('#filGLCurrRateLVB').setDisabled(true);
        me.down('#filBillDueDateLVB datefield').setDisabled(true);
        me.down('#filUPSRefTypeLVB clearCombo').setDisabled(true);

    },
    enableCheckInfoFields2: function (me) {
        me.down('#filCheckNoLVB2').show();
        me.down('#filCheckAmtLVB').show();
        me.down('#filCheckDateLVB').show();
        me.down('#filBankInfoLVB').show();
    }

});