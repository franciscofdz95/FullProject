/* ====================================================================================================
NAME:			[Bills Page Singleton Class]
BEHAVIOR:		All the actions related Bills page.
_______________________________________________________________________________________________________
REVISION HISTORY
-------------------------------------------------------------------------------------------------------
Date			    Modified By			  Modifications
-------------------------------------------------------------------------------------------------------
11/14/2016        Sudhir Dandale		 Created.
 ======================================================================================================*/
Ext.define('App.Controller.LogVendor.SingletonCls', {
    alias: 'widget.App-Controller-LogVendor-SingletonCls',
    alternateClassName: ['LogVendorSCls'],
    singleton: true,
    config: {
        invoiceId: 0,
        selectedRecord: '',
        taxWthgInd: 'N',
        vatCodeInd: 'N',
        excelUpldInd: 'N',
        vocInd: 'N',
        dataRecord: '',
        countryCode: ''
    },
    constructor: function (options) {
        this.initConfig(options);
    },
    checkLength: function (o, n, min, max) {
        var errMsg = '';
        if (o.value != null) {
            if (o.value.length > max || o.value.length < min) {
                o.setFieldStyle('background-color:red');
                if (o.displayField == 'ReferenceFilter') {
                    errMsg = "This is a required field, please enter shipment, masterbill, container or bill of lading number";
                }
                else {
                    errMsg = "Length of " + n + " must be between " + min + " and " + max + " characters. <br>";
                }
                return errMsg;
            }
            else {
                o.setFieldStyle('background-color:white');
                return errMsg;
            }
        }
        else {
            o.setFieldStyle('background-color:red');
            return "Please enter valid " + n + ". <br/>";
        }
    },
    checkGridItemsLength: function (o, n, min, max) {
        var errMsg = '';
        if (o != null) {
            if (o.length > max || o.length < min) {
                errMsg = "Length of " + n + " must be between " + min + " and " + max + " characters. <br>";
                return errMsg;
            }
            else {
                return errMsg;
            }
        }
        else {
            return "Please enter valid " + n + ". <br/>";
        }
    },
    checkInvoiceDetailForExVatCode: function (invoiceId, vatcode) {
        var result = BIA.Ajax.request({
            url: 'api/WebAPIReport/CheckInvoiceDetailForExVatCode',
            method: "POST",
            async: false,
            cache: false,
            dataType: "html",
            headers: {
                "Content-Type": "application/json"
            },
            jsonData: {
                InvoiceId: invoiceId,
                VatCode: vatcode
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
    checkUPSRefNum: function (win) {
        win.down('#Inv_InvalidList').setValue('');
        var upsRefList = win.down('#filUPSReferenceLVB textfield').getValue();
        var strUPSRefList = '';
        for (var i = 0; i < upsRefList.length; i++) {
            if (upsRefList[i] != "") {
                strUPSRefList += upsRefList[i];
                if (upsRefList.length - 1 != i && upsRefList.length != 1) {
                    strUPSRefList += ',';
                }
            }
        }
        //temporarily added 10/19/16
        var retValue = true;
        var errMsg = '';
        BIA.Ajax.request({
            url: 'api/WebAPIReport/ValidateUPSReference',
            method: "POST",
            async: false,
            cache: false,
            dataType: "html",
            headers: {
                "Content-Type": "application/json"
            },
            jsonData: {
                Key: win.down('#filUPSRefTypeLVB clearCombo').getValue(),
                Values: strUPSRefList.replace("'", "")
            },
            useDefaultXhrHeader: true,
            success: function (conn, response, options, eOpts) {
                var data = Ext.decode(conn.responseText);
                var flagStatus = 'N';
                var InValidList = '';

                for (var k = 0, length = data.length; k < length; ++k) {
                    if (data[k].ItemType == 'InValid') {
                        InValidList = data[k].valueList;
                        flagStatus = 'Y';
                    }
                }

                if (flagStatus == "Y") {
                    errMsg = "Invalid " + win.down('#filUPSRefTypeLVB clearCombo').selection.data.text + ": " + InValidList + ".";
                    win.down('#Inv_InvalidList').setValue(InValidList);
                    retValue = errMsg;
                } else {
                    retValue = errMsg;
                }
            },
            failure: function (conn, response, options, eOpts) {
                BIACore.Exception(conn.responseText);
                BIACore.Message(response);
            },
            scope: this
        });
        return retValue;
    },
    checkRegexp: function (o, regexp, n) {
        if (!(regexp.test(o.value))) {
            o.setFieldStyle('background-color:red');
            return n;
        } else {
            o.setFieldStyle('background-color:white');
            return '';
        }
    },
    checkRegexpForGrid: function (o, regexp, n) {
        if (!(regexp.test(o))) {
            return n;
        } else {
            return '';
        }
    },
    check_main_date: function (o, str_context) {
        var win = o.up('window');
        //check general date formatting
        var isFormat = this.checkdate_formatting(o);
        if (isFormat != "") {
            o.setFieldStyle('background-color:red');
            return isFormat;
        }

        //check special case that main invoice date is not < 2 years ago and not > 1 year from now
        var a_formValue_Date = new Date(o.rawValue);

        var two_YearsAgo_Date = new Date();
        two_YearsAgo_Date.setFullYear(two_YearsAgo_Date.getFullYear() - 2);

        var one_YearAhead_Date = new Date();
        one_YearAhead_Date.setFullYear(one_YearAhead_Date.getFullYear());

        if (a_formValue_Date < two_YearsAgo_Date) {
            o.setValue('');
            o.setFieldStyle('background-color:red');
            return 'Invoice Date cannot be older than two years\.';
        }

        if (a_formValue_Date > one_YearAhead_Date) {
            o.setValue('');
            o.setFieldStyle('background-color:red');
            return 'Invoice Date cannot be future date\.';
        }

        //if this is 'first time through' and due date/VAT date do not have values, run 'dateUpdates()' which will populate them
        if (win.down('#filBillDateLVB').Value != '') {
            this.dateUpdates(o.rawValue, win);
        }

        o.setFieldStyle('background-color:white');
        return '';
    },
    deleteVATData: function (invId, vatCode) {
        BIA.Ajax.request({
            url: 'api/WebAPIReport/DeleteVATData',
            method: "POST",
            async: false,
            cache: false,
            dataType: "html",
            headers: {
                "Content-Type": "application/json"
            },
            jsonData: {
                InvoiceId: invId,
                VatCode: vatCode
            },
            useDefaultXhrHeader: true,           
            failure: function (conn, response, options, eOpts) {
                BIACore.Exception(conn.responseText);
                BIACore.Message(response);
            },
            scope: this
        });

    },
    updateDeleteInvoiceVatData: function (invId, vatCode) {
        BIA.Ajax.request({
            url: 'api/WebAPIReport/UpdateDeleteInvoiceVatData',
            method: "POST",
            async: false,
            cache: false,
            dataType: "html",
            headers: {
                "Content-Type": "application/json"
            },
            jsonData: {
                InvoiceId: invId,
                VatCode: vatCode
            },
            useDefaultXhrHeader: true,           
            failure: function (conn, response, options, eOpts) {
                BIACore.Exception(conn.responseText);
                BIACore.Message(response);
            },
            scope: this
        });

    },
    checkdate_formatting: function (o) {

        if (o.rawValue == '') {
            return 'Please enter a Date value for ' + o.name + '.';
        }

        // Test for general proper formatting structure (mm/dd/yyyy)
        var validformat = /^((0?[1-9]|1[012])[- /.](0?[1-9]|[12][0-9]|3[01])[- /.](19|20)[0-9][0-9])*$/ //Basic check for format validity

        if (!validformat.test(o.rawValue)) {
            return 'Please enter the date in valid mm/dd/yyyy format.';
        }

        // Test for logical mm/dd combinations (e.g. Feb can't have > 28 days, etc.)
        var monthfield = o.rawValue.split("/")[0]
        var dayfield = o.rawValue.split("/")[1]
        var yearfield = o.rawValue.split("/")[2]

        var isLeap = false;
        if (yearfield % 400 == 0 || (yearfield % 100 != 0 && yearfield % 4 == 0)) {
            isLeap = true;
        }
        

        var days = 28;
        if (isLeap) {
            days = 29;
        }

        if (
            ((monthfield == '02' || monthfield == '2') && (dayfield > days))
            ||
            ((monthfield == '04' || monthfield == '4' || monthfield == '06' || monthfield == '6' || monthfield == '09' || monthfield == '9' || monthfield == '11') && (dayfield > 30))
        ) {
            return 'Invalid numbers of days for selected month.';
        }
        return "";
    },
    dateUpdates: function (str_Date, win) {
        var selectdate = str_Date.split('/'),
            month = selectdate[0],
            day = selectdate[1],
            year = selectdate[2],
            str = win.down('#VendorHiddenId').value,
            daystoadd = 0;

        if (str.length > 1 && str.indexOf('-') > -1) {
            var z = str.split('-'),
                VendorTermsId = Ext.util.Format.trim(z[1]); 	//VendorTermsId
            if (VendorTermsId.substring(0, 1) == 'N' || VendorTermsId.substring(0, 1) == 'n') {
                daystoadd = parseInt(VendorTermsId.substring(1));
            }
            var newdate = new Date(month + '/' + day + '/' + year);
            newdate.setDate(newdate.getDate() + daystoadd);

            var dmonth = newdate.getMonth() + 1;
            if (dmonth < 10) {
                dmonth = '0' + dmonth;
            }

            var dDay = newdate.getDate();
            if (dDay < 10) {
                dDay = '0' + dDay;
            }

            var defaultduedate = dmonth + '/' + dDay + '/' + newdate.getFullYear();
            win.down('#filBillDueDateLVB datefield').setValue(defaultduedate);
        }
    },
    check_VAT_Point_date: function (o, str_context) {
        var win = o.up('window');
        //check general date formatting
        if (!this.checkdate_formatting(o)) {
            win.down('#filBillRefNoLVB').focus();
            o.focus();
            return false;
        }

        if (str_context == 'during_form_population') {
            win.down('#filTaxExptAmtLVB').focus();
        }
        return true;
    },
    validate_check_date: function validate_check_date(o, str_context) {
        var win = o.up('window');
        //first, ensure that the invoice 'main' date has a value for comparing against
        if (win.down('#filBillDateLVB datefield').rawValue == '') {
            o.value = '';
            win.down('#filBillDateLVB').focus();
            return 'Please provide a main \'Invoice Date\' before inputting \'Due Date\'.';
        }

        //check general date formatting
        if (!this.checkdate_formatting_notRequiredField(o)) {
            win.down('#filCheckDateLVB').focus();
            o.focus();
            return false;
        }

        //check special case that invoice due date is not < main invoice date and not > 1 year from now
        var a_formValue_Date = new Date(o.rawValue);

        var invoice_main_date = new Date(win.down('#filBillDateLVB datefield').rawValue);

        if (a_formValue_Date < invoice_main_date) {
            alert('Check Date should always be after main Invoice Date\.');
            win.down('#filCheckDateLVB').focus();
            o.focus();
            return false;
        }

        if (str_context == 'during_form_population') {
            // This will focus on Bank Info next
            win.down('#filBankInfoLVB').focus();

        }
        return true;
    },
    checkdate_formatting_notRequiredField: function checkdate_formatting_notRequiredField(o) {

        if (o.rawValue != '') {
            // Test for general proper formatting structure (mm/dd/yyyy)
            var validformat = /^((0?[1-9]|1[012])[- /.](0?[1-9]|[12][0-9]|3[01])[- /.](19|20)[0-9][0-9])*$/ //Basic check for format validity

            if (!validformat.test(o.rawValue)) {
                alert('Please enter the date in valid mm/dd/yyyy format.');
                return false;
            }

            // Test for logical mm/dd combinations (e.g. Feb can't have > 28 days, etc.)
            var monthfield = o.rawValue.split("/")[0]
            var dayfield = o.rawValue.split("/")[1]
            var yearfield = o.rawValue.split("/")[2]

            var isLeap = false;
            if (yearfield % 400 == 0 || (yearfield % 100 != 0 && yearfield % 4 == 0)) {
                isLeap = true;
            }
            

            var days = 28;
            if (isLeap) {
                days = 29;
            }

            if (
                ((monthfield == '02' || monthfield == '2') && (dayfield > days))
                ||
                ((monthfield == '04' || monthfield == '4' || monthfield == '06' || monthfield == '6' || monthfield == '09' || monthfield == '9' || monthfield == '11') && (dayfield > 30))
            ) {
                alert('Invalid numbers of days for selected month.');
                return false;
            }
        }
        return true;
    },
    validate_check_amount: function validate_check_amount(o, str_context) {
        var win = o.up('window');
        //first, ensure that the invoice 'main' amount has a value for comparing against
        if (win.down('#TotalBillAmount').value == '') {
            alert('Please provide a main \'Invoice Amount\' before inputting \'Check Amount\'.');
            o.value = '';
            win.down('#filCheckAmtLVB').focus();
            return false;
        }

        //check special case that Check amount cannot be over the total invoice amount       

        if (str_context == 'during_form_population') {
            // This will focus on Bank Info next
            win.down('#filBankInfoLVB').focus();

        }
        return true;
    },
    getAccName: function getAccName(me, win, click) {
        if (click) {
            if (win.down('#filBillDateLVB datefield').value == "" || win.down('#filBillDateLVB datefield').value == null) {
                win.down('#filACCNoLVB clearCombo').clearValue();
                alert("Bill Date is required field for ACC Name.");
            }
        }
        else {
            BIA.Ajax.request({
                url: 'api/WebAPIReport/GetAccName',
                method: "POST",
                async: false,
                cache: false,
                dataType: "html",
                headers: {
                    "Content-Type": "application/json"
                },
                jsonData: {
                    LocCode: win.down('#filVendorLoctionLVB clearCombo').value == null ? PgAtt.getLocation_code() : win.down('#filVendorLoctionLVB clearCombo').value,
                    InvDate: win.down('#filBillDateLVB datefield').value == null ? "" : win.down('#filBillDateLVB datefield').value
                },
                useDefaultXhrHeader: true,
                success: function (conn, response, options, eOpts) {
                    var data = Ext.decode(conn.responseText);
                    var store = win.down('#filACCNoLVB clearCombo').getStore();
                    store.loadData([], false);
                    win.down('#filACCNoLVB clearCombo').clearValue();
                    win.down('#filACCNoLVB clearCombo').getPicker().getSelectionModel().doMultiSelect([], false);
                    var dataVal = [];

                    for (var i = 0; data.data.length > i; i++) {
                        dataVal.push(data.data[i]);
                    }

                    store.loadData(dataVal, true);
                    win.down('#filACCNoLVB clearCombo').valueField = 'Number';
                    win.down('#filACCNoLVB clearCombo').displayField = 'Name';

                    if (win && win.dataRecord && Ext.isObject(win.dataRecord) && win.dataRecord.AccNumber > 0) {
                        win.down('#filACCNoLVB clearCombo').setValue(win.dataRecord.AccNumber);
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
    //Update Invoice Check Information
    updateInvCheckInfo: function updateInvCheckInfo(win) {
        // This function is the main call to update the Invoice Check Information.
        //As of 3/25/2016, this function only updates these columns Check_date,Check_amt_nbr,Bank_info,Pymt_upd_user,GL_Currency_rate, pay_alone_flag, value_pay_invoice_type_code 

        var invoice_id = win.down('#Inv_ID').value;
        BIA.Ajax.request({
            url: 'api/WebAPIReport/UpdateInvCheckInfo',
            method: "POST",
            async: false,
            cache: false,
            dataType: "html",
            headers: {
                "Content-Type": "application/json"
            },
            jsonData: {
                InvoiceId: invoice_id,
                CheckDate: win.down('#filCheckDateLVB datefield').rawValue,
                CheckNumber: win.down('#filCheckNoLVB2 textfield').value,
                CheckAmtNbr: win.down('#filCheckAmtLVB textfield').value != '' ? parseFloat(win.down('#filCheckAmtLVB textfield').value) : 0,
                BankInfo: win.down('#filBankInfoLVB textfield').value,
                PymtUpdUser: BIACore.Security.User.permissions[PgAtt.getGeoIndex()].userId
            },
            useDefaultXhrHeader: true,            
            failure: function (conn, response, options, eOpts) {
                BIACore.Exception(conn.responseText);
                BIACore.Message(response);
            },
            scope: this
        });
    },
    GetTWHCodesByLoc: function GetTWHCodesByLoc(locCode) {
        if (locCode == null || locCode == undefined) {
            locCode = PgAtt.getLocation_code();
        }
        BIA.Ajax.request({
            url: 'api/WebAPIReport/GetTWHCodesByLoc',
            method: "POST",
            async: false,
            cache: false,
            dataType: "html",
            headers: {
                "Content-Type": "application/json"
            },
            jsonData: {
                LocCode: locCode

            },
            useDefaultXhrHeader: true,
            success: function (conn, response, options, eOpts) {
                var data = Ext.decode(conn.responseText);
                if (data != null && data != undefined) {
                    LogVendorSCls.setTaxWthgInd(data.TAX_WTHG_IND);
                    LogVendorSCls.setVatCodeInd(data.VAT_CODE_IND);
                    LogVendorSCls.setExcelUpldInd(data.EXCEL_UPLD_IND);
                    LogVendorSCls.setVocInd(data.VOC_IND);
                    LogVendorSCls.setCountryCode(data.CountryCode);
                } else {
                    LogVendorSCls.setTaxWthgInd('N');
                    LogVendorSCls.setVatCodeInd('N');
                    LogVendorSCls.setExcelUpldInd('N');
                    LogVendorSCls.setVocInd('N');
                    LogVendorSCls.setCountryCode('');
                }
            },
            failure: function (conn, response, options, eOpts) {
                BIACore.Exception(conn.responseText);
                BIACore.Message(response);
            },
            scope: this
        });

    },
    calculateVatAmount: function calculateVatAmount(record, amt) {
        if (amt != '') {
            var num = amt * (parseFloat(record.get('vat_percent')) / 100)
            if (record.get('RetentionFlag')) num = num * -1;
            return parseFloat(num).toFixed(2);
        }
    },
    calTotalBillAmount: function calTotalBillAmount(win) {
        var totalBillAmount = 0.00;
        var totalVATAmount = 0.00;
        var totalTAXAmount = 0.00;
        var totalTWHAmount = 0.00;
        var totalOSOffset = 0.00;

        var vatCodeGrid = Ext.Array.pluck(win.down('App-View-LogVendor-VatTaxAmt').store.data.items, 'data')
        if (Ext.isArray(vatCodeGrid)) {
            for (var i = 0; i < vatCodeGrid.length; i++) {
                var vatPercent = vatCodeGrid[i].vat_percent,                    
                    amount = vatCodeGrid[i].Amount,
                    twhAmount = 0,
                    vatAmt = vatCodeGrid[i].VAT_Amount,                    
                    OSOffset = vatCodeGrid[i].OSOffset;

                if (amount == '') {
                    amount = 0;
                }

                if (win.down('#TWHFlag').value == 'Y') {
                    twhAmount = vatCodeGrid[i].TWH_Amount;
                    if (twhAmount == '')
                        twhAmount = 0;
                } else {
                    twhAmount = 0;
                }

                if (vatPercent == 0 && twhAmount != 0 && vatCodeGrid[i].Amount == 0) {
                    amount = 0;
                }

                if (OSOffset == '') {
                    OSOffset = 0;
                }

                totalVATAmount = totalVATAmount + vatAmt;
                totalTAXAmount = totalTAXAmount + amount;
                totalTWHAmount = totalTWHAmount + twhAmount;
                totalOSOffset = totalOSOffset + OSOffset;
            }


            if (!Ext.isNumeric(win.down('#filTaxExptAmtLVB textfield').getValue())) { win.down('#filTaxExptAmtLVB textfield').setValue(0); }
            totalBillAmount = parseFloat(totalVATAmount) + parseFloat(totalTAXAmount) + parseFloat(win.down('#filTaxExptAmtLVB textfield').getValue()) + parseFloat(totalTWHAmount) + parseFloat(totalOSOffset);
            win.down('#lblVendorLogBillVal').setText(parseFloat(totalBillAmount).toFixed(2));
        }
    }

});