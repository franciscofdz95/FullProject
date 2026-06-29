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
Ext.define('App.Controller.Bills.SingletonCls', {
    alias: 'widget.App-Controller-Bills-SingletonCls',
    alternateClassName: ['BillsSingCls'],
    singleton: true,
    session: true,
    config: {
        gridRecords: [],
        billID: '',
        onAputFlag: 'N',
        byPassIM: 'N',
        checkBoxFlag: false,
        checkRecCount: 0,
        billPanelTab: ''

    },
    billActionColRendered: function billActionColRendered(me, value, metaData, record, row) {
        var strReturn = '<span style="font-weight:bold; font-size:12px;"></span>';
        if (row >= 0) {
            if (['Pending', 'Logged'].indexOf(PgAtt.getInvoice_status()) >= 0) {
                if (record.get("ReferenceFilter") != 'ExcelUploadCBOL' && record.get("ReferenceFilter") != '') {
                    if (record.get("reference_id") != '' && record.get("reference_id") != null) {
                        me.items[0].icon = 'images/add-24x24.png';
                        me.items[0].tooltip = 'Begin Verifying Bill';
                    } else {
                        me.items[0].icon = 'images/warning.png';
                        me.items[0].tooltip = 'Please update UPS reference and UPS Type in Log Vendor Bill.';
                    }
                } else {
                    if (record.get("ReferenceFilter") == 'ExcelUploadCBOL' && record.get("ReferenceFilter") != '') {
                        me.items[0].icon = 'images/excel_button_16.png';
                        me.items[0].tooltip = 'Begin Verifying CBOL For Bill';
                    }
                    else {
                        me.items[0].icon = 'images/warning.png';
                        me.items[0].tooltip = 'Please update UPS reference and UPS Type in Log Vendor Bill.';
                    }
                }
                me.items[1].icon = '';
                me.items[1].tooltip = '';
                me.items[2].icon = '';
                me.items[2].tooltip = '';
                me.items[3].icon = '';
                me.items[3].tooltip = '';
            }
            else {
                me.items[0].icon = '';
                me.items[0].tooltip = '';
                me.items[2].icon = '';
                me.items[2].tooltip = '';
                if (BIACore.Security.User.permissions[PgAtt.getGeoIndex()].EA_APUT_RejectionScanned == 1 && ['Printed', 'Queued', 'Sent'].indexOf(PgAtt.getInvoice_status()) >= 0 && record.get("ImageNumber") == "" && BillsSingCls.getByPassIM() == 'N') {
                    me.items[1].icon = 'images/search_add.png';
                    me.items[1].tooltip = 'Search Image for Invoice Number';
                }
                else {
                    me.items[1].icon = '';
                    me.items[1].tooltip = '';
                }
            }
            if (PgAtt.getInvoice_status() == 'Archived' && (BIACore.Security.User.permissions[PgAtt.getGeoIndex()].EA_APUT_ViewNSubmitApproval == 1 || BIACore.Security.User.permissions[PgAtt.getGeoIndex()].EA_APUT_Rejection == 1)) {
                me.items[2].icon = 'images/warning.png';
                me.items[2].tooltip = 'Remove From Archived Status';
            }
            if (record.get('invoice_status') == 'Approved' && record.get('Rejected') == 'Y' && record.get('RejectedRecall') == 'N') {
                var rejVal = this.getUserNameById(record.get('RejectedBy'));
                rejVal = !Ext.isEmpty(rejVal) ? rejVal + ' : ' : '';
                me.items[0].icon = 'images/rIcon.png';
                me.items[0].tooltip = '<span style=color:red;font-weight:bold;>' + rejVal + ' : ' + record.get('Comment') + '</span>';
            }

            if (record.get('invoice_status') == 'Printed' && record.get('invalidimage') == 'Y') {
                if (record.get('RejectScanComments').length > 0) {
                    var rejScVal = this.getUserNameById(record.get('ScanRejectedBy'));
                    rejScVal = !Ext.isEmpty(rejScVal) ? rejScVal + ' : ' : '';
                    me.items[0].tooltip = rejScVal + record.get('RejectScanComments') + '. Please manually attach image once corrected';
                } else {
                    me.items[0].tooltip = '<span style=color:red;font-weight:bold>' + 'Scanned invoice was rejected.' + '</span>';
                }
                me.items[0].icon = 'images/rsIcon.png';
            }

            if (record.get('ImageCount') > 1) {
                me.items[3].icon = 'images/dIcon.png';
            } else {
                me.items[3].icon = '';
                me.items[3].tooltip = '';
            }

            if (record.get('invoice_status') == 'Printed' && record.get('IncorrectScan') == 'Y') {
                me.items[2].icon = 'images/wIcon.png';
                me.items[2].tooltip = '<span style=color:red;font-weight:bold;cursor: hand; cursor: pointer;>' + 'Invoice with ‘RCK’ site code scanned to Term / Standard folder' + '</span>';
            }

        }
        return strReturn;
    },
    GetInvoiceStatusDetails: function GetInvoiceStatusDetails(invoiceId, vCode, vNameEng, invStatus, invRefNo, cell) {
        var params = {
            Invoice_Id: invoiceId
        };
        var data = new Object()
        BIA.Ajax.request({
            url: 'api/WebAPIReport/InvoiceStatusHistory',
            method: "POST",
            async: false,
            cache: false,
            dataType: "html",
            headers: {
                "Content-Type": "application/json"
            },
            jsonData: params,
            useDefaultXhrHeader: true,
            success: function (response, options) {
                data = response.responseJSON;
                var innerStr = '';
                if (data != null) {
                    for (var i = 0; i < data.data.length; i++) {

                        innerStr = innerStr + '<tr class="UPS_YGreen_0 tbBorder" ><td><span ><label name="InvoiceStatus' + i + '" id="InvoiceStatus' + i + '">' + data.data[i].InvoiceStatus + '</label></span></td>' +
                            ' <td class="tbBorder"><span><label name="StampDT' + i + '" id="StampDT_' + i + '">' + data.data[i].StampDT + '</label></span></td>' +
                            '<td class="tbBorder"><span ><label name="UserId' + i + ' id="UserId_' + i + '">' + data.data[i].UserId + '</label></span></td>' +
                            '<td class="tbBorder"><span><label name="FirstName' + i + '" id="FirstName_' + i + '">' + data.data[i].FirstName + '</label></span></td>' +
                            '<td class="tbBorder"><span ><label name="LastName' + i + '" id="LastName_' + i + '" >' + data.data[i].LastName + '</label></span></td>' +
                            '<td class="tbBorder"><span ><label name="ImageFolder' + i + '" id="ImageFolder_' + i + '" >' + data.data[i].ImageFolder + '</label></span></td>' +
                            '<td class="tbBorder"><span ><label name="ScanDest' + i + '" id="ScanDest_' + i + '" >' + data.data[i].ScanDest + '</label></span></td>' +
                            '<td class="tbBorder"><span ><label name="ImageNumber' + i + '" id="ImageNumber_' + i + '" >' + data.data[i].ImageNumber + '</label></span></td>' +
                            '<td class="tbBorder"><span ><label name="Comment' + i + '" id="Comment_' + i + '" >' + data.data[i].Comment + '</label></span></td>' +
                            '</tr>';
                    }
                }

                var staHistry = '<table class="tbBorder" style="margin:0px;background-color:white;" width="100%" cellpadding="2" cellspacing="0"> ' +
                    '<tr class="tbBorder">' +
                    '<td class="tbBorder" colspan="20" style="font-size: 10pt; font-weight: bold; background-color:#93A708;" >' +
                    '<span style="float:left;">Bill. Ref Number - ' + invRefNo + '</span>' +
                    '</td>' +
                    '</tr>' +
                    '<tr class="UPS_YGreen_0 tbBorder">' +
                    '<td class="HeaderBlack">Vendor Code :-' + vCode + '</td>' +
                    '</tr>' +
                    '<tr class="UPS_YGreen_0 tbBorder">' +
                    '<td class="HeaderBlack">Vendor Name :-' + vNameEng + '</td>' +
                    '</tr>' +
                    '<tr class="UPS_YGreen_0 tbBorder">' +
                    '<td class="HeaderBlack">Bill Status	:- ' + invStatus + ' </td>' +
                    '</tr> <tr>' +
                    '<table class="tbBorder" style=" border:1px; border-color:#DFB42C;;" width="100%">' +
                    '<tr class="UPS_YGreen_3" style="border:1px; border-color:#DFB42C;">' +
                    '<td class="HeaderBlack"><span style="font-weight:bold; text-align:center;">Invoice</BR>Status</span></td>' +
                    '<td class="HeaderBlack"><span style="font-weight:bold; text-align:center;">Stamp DT</span></td>' +
                    '<td class="HeaderBlack"><span style="font-weight:bold; text-align:center;">User Id</span></td>' +
                    '<td class="HeaderBlack"><span style="font-weight:bold; text-align:center;">First</BR>Name</span></td>' +
                    '<td class="HeaderBlack"><span style="font-weight:bold; text-align:center;">Last</BR>Name</span></td>' +
                    '<td class="HeaderBlack"><span style="font-weight:bold; text-align:center;">Image</BR>Folder</span></td>' +
                    '<td class="HeaderBlack"><span style="font-weight:bold; text-align:center;">Scan</BR>Dest</span></td>' +
                    '<td class="HeaderBlack"><span style="font-weight:bold; text-align:center;">Image</BR>Number</span></td>' +
                    '<td class="HeaderBlack"><span style="font-weight:bold; text-align:center;">Comment</span></td>' +
                    '</tr>' + innerStr +
                    '</table>' +
                    '</tr> </table>';
                cell.setAttribute('data-qtip', staHistry);
            },
            failure: function () {
                BIACore.Exception(conn.responseText);
                BIACore.Message(response);
            },
            scope: this
        });
    },
    getAPUTFlag: function getAPUTFlag() {
        var data = new Object()
        var params = {
            LocCode: PgAtt.getLocation_code(),
            CompanyCode: PgAtt.getCompany_code()
        };
        BIA.Ajax.request({
            url: 'api/WebAPIReport/GetAPUTFlag',
            method: "POST",
            async: false,
            cache: false,
            dataType: "html",
            headers: {
                "Content-Type": "application/json"
            },
            jsonData: params,
            useDefaultXhrHeader: true,
            success: function (response, options) {
                data = response.on_aput;
                BillsSingCls.setOnAputFlag(data);
            },
            failure: function (response, options) {
                BIACore.Exception(response.data);
                BIACore.Message(response);
            },
            scope: this
        });
        BillsSingCls.setOnAputFlag(data);
    },
    getByPassImgByLocCmpCode: function getByPassImgByLocCmpCode() {
        var params = {
            LocCode: PgAtt.getLocation_code(),
            CompanyCode: PgAtt.getCompany_code()
        };
        var result = BIA.Ajax.request({
            url: 'api/WebAPIReport/GetByPassImgByLocCode',
            method: "POST",
            async: false,
            cache: false,
            dataType: "html",
            headers: {
                "Content-Type": "application/json"
            },
            jsonData: params,
            useDefaultXhrHeader: true,
            failure: function (conn, response, options, eOpts) {
                BIACore.Exception(conn.responseText);
                BIACore.Message(response);
            },
            scope: this
        });
        BillsSingCls.setByPassIM(result.bypass_im);
    },
    getUserNameById: function getUserNameById(userId) {
        var params = {
            UserId: userId
        };
        var result = BIA.Ajax.request({
            url: 'api/WebAPIReport/GetUserNameById',
            method: "POST",
            async: false,
            cache: false,
            dataType: "html",
            headers: {
                "Content-Type": "application/json"
            },
            jsonData: params,
            useDefaultXhrHeader: true,
            failure: function (conn, response, options, eOpts) {
                BIACore.Exception(conn.responseText);
                BIACore.Message(response);
            },
            scope: this
        });

        if (result != null) {
            return result.fullname;
        } else {
            return '';
        }
    },
    liveInvoiceBKGRDProcess: function liveInvoiceBKGRDProcess(locCode, invStatus) {
        var params = {
            LocCode: locCode,
            InvoiceStatus: invStatus
        };
        BIA.Ajax.request({
            url: 'api/WebAPIReport/LiveInvoiceBKGRDProcess',
            method: "POST",
            async: false,
            cache: false,
            dataType: "html",
            headers: {
                "Content-Type": "application/json"
            },
            jsonData: params
        });
    },
    GetBillSummaryStatus: function GetBillSummaryStatus(current) {
        var filter = current.up('App-View-Viewport').down('App-View-Component-Container-FilterPanelBase');
        var parameter = {};
        if (PgAtt.getGeoCode() !== 'CO') {
            Ext.Object.merge(parameter, filter.GetParameters(), { GeoId: PgAtt.getGeoId(), GeoCode: PgAtt.getGeoCode() });
        } else {
            Ext.Object.merge(parameter, filter.GetParameters());
        }
        var responseData;
        BIA.Ajax.request({
            url: 'api/WebAPIReport/BillStatusCount',
            method: "POST",
            async: false,
            cache: false,
            headers: {
                "Content-Type": "application/json"
            },
            jsonData: parameter,
            useDefaultXhrHeader: true,
            success: function (response) {
                var data = Ext.decode(response.responseText);
                var tabPanel = current.down('#AppBillTabPanelId');
                tabPanel.down('#billLogged').tab.setText('Logged (' + data.Logged + ')');
                tabPanel.down('#billPending').tab.setText('Pending (' + data.Pending + ')');
                tabPanel.down('#billVerified').tab.setText('Verified (' + data.Verified + ')');
                tabPanel.down('#billApproved').tab.setText('Approved (' + data.Approved + ')');
                tabPanel.down('#billPrinted').tab.setText('Printed (' + data.Printed + ')');
                tabPanel.down('#billScanned').tab.setText('Scanned (' + data.Scanned + ')');
                tabPanel.down('#billQueued').tab.setText('Queued (' + data.Queued + ')');
                tabPanel.down('#billSent').tab.setText('Sent (' + data.Sent + ')');
                tabPanel.down('#billArchived').tab.setText('Archived (' + data.Archived + ')');
                responseData = data;
            },
            failure: function () {
                BIACore.Exception(conn.responseText);
                BIACore.Message(response);
            },
            scope: this
        });
        return responseData;

    },
    billDetailsInfo: function billDetailsInfo(invoiceId) {
        var params = {
            invoice_id: invoiceId
        };
        var result = BIA.Ajax.request({
            url: 'api/WebAPIReport/BillDetailInfo',
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
    newInvoiceData: function newInvoiceData(filter) {
        var parameter = filter.GetParameters();
        parameter.InvoiceId = IProcessingSCls.getInvoice_id();
        parameter.InvoiceStatus = '';
        var result = BIA.Ajax.request({
            url: 'api/WebAPIReport/BillsReport',
            method: "POST",
            async: false,
            cache: false,
            dataType: "html",
            headers: {
                "Content-Type": "application/json"
            },
            jsonData: parameter,
            useDefaultXhrHeader: true,
            failure: function () {
                BIACore.Exception(conn.responseText);
                BIACore.Message(response);
            },
            scope: this
        })

        if (result != null && result != '') {
            return result.data;
        }
        else {
            return '';
        }
    },
    getBillVATDetails: function getBillVATDetails(me, rec) {
        var params = {
            Invoice_Id: rec.Invoice_id
        };

        BIA.Ajax.request({
            url: 'api/WebAPIReport/BillVATDetail',
            method: "POST",
            async: false,
            cache: false,
            dataType: "html",
            headers: {
                "Content-Type": "application/json"
            },
            jsonData: params,
            useDefaultXhrHeader: true,
            success: function (response, options) {
                var data = response.responseJSON;
                me.update('');
                var vTotalChgAmt = rec.Invoice_Amt, vTotalVAT = 0, vTotalInvAmt = rec.Invoice_Amt
                var innerStr = '';
                if (data !== null && data.total != 0) {
                    if (data.data.length !== 0) {
                        for (var i = 0; i < data.data.length; i++) {
                            vTotalChgAmt = vTotalChgAmt + data.data[i].Amount
                            vTotalVAT = vTotalVAT + data.data[i].VAT_Amount
                            vTotalInvAmt = vTotalInvAmt + data.data[i].Amount + data.data[i].VAT_Amount
                            innerStr = innerStr + ' <tr>' +
                                '<td class="HeaderBlack" nowrap style="font-size:10pt;border: 1px solid white;border-color:#FFFFFF;">' + data.data[i].VAT_Code + '</td>' +
                                '<td style="font-size:10pt;border: 1px solid white;border-color:#FFFFFF;" nowrap align="right">' + Utility.Formatting.NumFormat_Thousands_2Decimals(data.data[i].Amount) + '</td>' +
                                '<td style="font-size:10pt;border: 1px solid white;border-color:#FFFFFF;" nowrap align="right">' + Utility.Formatting.NumFormat_Thousands_1Decimals(data.data[i].VAT_Percent) + '</td>' +
                                '<td style="font-size:10pt;border: 1px solid white;border-color:#FFFFFF;" nowrap align="right">' + Utility.Formatting.NumFormat_Thousands_2Decimals(data.data[i].VAT_Amount) + '</td>' +
                                '<td style="font-size:10pt;border: 1px solid white;border-color:#FFFFFF;" nowrap align="right">' + Utility.Formatting.NumFormat_Thousands_2Decimals(data.data[i].VAT_Amount + data.data[i].Amount) + '</td>' +
                                '</tr>';
                        }
                    }
                    else {
                        vTotalChgAmt = vTotalChgAmt + data.data.Amount
                        vTotalVAT = vTotalVAT + data.data.VAT_Amount
                        vTotalInvAmt = vTotalInvAmt + data.data.Amount + data.data[i].VAT_Amount
                        innerStr = innerStr + ' <tr>' +
                            '<td class="HeaderBlack" nowrap style="font-size:10pt;border: 1px solid white;border-color:#FFFFFF;">' + data.data.VAT_Code + '</td>' +
                            '<td style="font-size:10pt;border: 1px solid white;border-color:#FFFFFF;" nowrap align="right">' + Utility.Formatting.NumFormat_Thousands_2Decimals(data.data.Amount) + '</td>' +
                            '<td style="font-size:10pt;border: 1px solid white;border-color:#FFFFFF;" nowrap align="right">' + Utility.Formatting.NumFormat_Thousands_1Decimals(data.data.VAT_Percent) + '</td>' +
                            '<td style="font-size:10pt;border: 1px solid white;border-color:#FFFFFF;" nowrap align="right">' + Utility.Formatting.NumFormat_Thousands_2Decimals(data.data.VAT_Amount) + '</td>' +
                            '<td style="font-size:10pt;border: 1px solid white;border-color:#FFFFFF;" nowrap align="right">' + Utility.Formatting.NumFormat_Thousands_2Decimals(data.data.VAT_Amount + data.Amount) + '</td>' +
                            '</tr>';
                    }


                    var vatStr = '<table class="ccline" cellpadding="3" cellspacing="0">' +
                        '<tr><td class="HeaderBlack" nowrap style="font-size:10pt;border: 1px solid white;border-color:#FFFFFF;">VAT Code</td>' +
                        '<td class="HeaderBlack" nowrap style="font-size:10pt;border: 1px solid white;border-color:#FFFFFF;"" align="right">Amount</td> ' +
                        '<td class="HeaderBlack" nowrap style="font-size:10pt;border: 1px solid white;border-color:#FFFFFF;" align="right">VAT %</td>' +
                        '<td class="HeaderBlack" nowrap style="font-size:10pt;border: 1px solid white;border-color:#FFFFFF;" align="right">VAT Amt</td>' +
                        '<td class="HeaderBlack" nowrap style="font-size:10pt;border: 1px solid white;border-color:#FFFFFF;" align="right">SubTot Amt</td>' +
                        '</tr>';

                    vatStr = vatStr + innerStr + ' <tr> ' +
                        '<td class="HeaderBlack" nowrap style="font-size:10pt;border: 1px solid white;border-color:#FFFFFF;">VAT Exempt Amount</td>' +
                        '<td style="font-size:10pt;border: 1px solid white;border-color:#FFFFFF;" nowrap align="right">' + Utility.Formatting.NumFormat_Thousands_2Decimals(rec.Invoice_Amt) + '</td>' +
                        '<td style="font-size:10pt;border: 1px solid white;border-color:#FFFFFF;" nowrap align="right">0.0</td>' +
                        '<td style="font-size:10pt;border: 1px solid white;border-color:#FFFFFF;" nowrap align="right">0.00</td>' +
                        '<td style="font-size:10pt;border: 1px solid white;border-color:#FFFFFF;" nowrap align="right">' + Utility.Formatting.NumFormat_Thousands_2Decimals(rec.Invoice_Amt) + '</td>' +
                        '	</tr>' +
                        '<tr>' +
                        '<td class="HeaderBlack" nowrap style="font-size:10pt;border: 1px solid white;border-color:#FFFFFF;">Totals</td>' +
                        '<td style="font-size:10pt;border: 1px solid white;border-color:#FFFFFF;" nowrap align="right">' + Utility.Formatting.NumFormat_Thousands_2Decimals(vTotalChgAmt) + '</td>' +
                        '<td style="font-size:10pt;border: 1px solid white;border-color:#FFFFFF;"  nowrap ></td>' +
                        '<td style="font-size:10pt;border: 1px solid white;border-color:#FFFFFF;" nowrap align="right">' + Utility.Formatting.NumFormat_Thousands_2Decimals(vTotalVAT) + '</td>' +
                        '<td style="font-size:10pt;border: 1px solid white;border-color:#FFFFFF;" nowrap align="right">' + Utility.Formatting.NumFormat_Thousands_2Decimals(vTotalInvAmt) + '</td>' +
                        '</tr>' +
                        '	</table>'
                    me.update(vatStr);
                }
            },
            failure: function () {
                BIACore.Exception(conn.responseText);
                BIACore.Message(response);
            },
            scope: this
        });
    },
    IsNullCheckForInvoice: function IsNullCheckForInvoice(invId) {
        var params = {
            InvoiceId: invId
        };
        var result = BIA.Ajax.request({
            url: 'api/WebAPIReport/IsNullCheckForInvoice',
            method: "POST",
            async: false,
            cache: false,
            dataType: "html",
            headers: {
                "Content-Type": "application/json"
            },
            jsonData: params,
            useDefaultXhrHeader: true,
            failure: function (conn, response, options, eOpts) {
                BIACore.Exception(conn.responseText);
                BIACore.Message(response);
            },
            scope: this
        });
        return result.responseJSON;
    },
    getSCACCode: function getSCACCode(me, invId) {
        var params = {
            InvoiceId: invId
        };
        var result = BIA.Ajax.request({
            url: 'api/WebAPIReport/GetSCACCode',
            method: "POST",
            async: false,
            cache: false,
            dataType: "html",
            headers: {
                "Content-Type": "application/json"
            },
            jsonData: params,
            useDefaultXhrHeader: true,
            failure: function (conn, response, options, eOpts) {
                BIACore.Exception(conn.responseText);
                BIACore.Message(response);
            },
            scope: this
        });

        var scacCode = result.responseJSON;
        var scacFlag = false;
        if (scacCode != '' && scacCode.length != 0) {
            for (var i = 0; i < scacCode.length; i++) {
                if (me.up('window').rowDetails.e2k_carrier_code !== scacCode[i].vendor_code) {
                    scacFlag = true;
                }
            }
        }
        return scacFlag;

    },
    getBuyAmtRender: function getBuyAmtRender(me, value, metaData, record, row) {
        if (row == 0) {
            if (record.get("ON_APUT") == "Y" && me.addAPUT) {
                me.up('window').down('#btnAddToAputQ').setVisible(true);
            } else {
                me.up('window').down('#btnAddToAputQ').setVisible(false);
            }

            if (me.rowData.invoice_status == 'Queued' && (BIACore.Security.User.permissions[PgAtt.getGeoIndex()].EA_Invoice_ApproveUnApproveDelete == 1 || BIACore.Security.User.permissions[PgAtt.getGeoIndex()].EA_APUT_Rejection == 1) && record.get("ON_APUT") == "Y") {
                me.up('window').down('#btnRmvFrmAputQ').setVisible(true);
            } else {
                me.up('window').down('#btnRmvFrmAputQ').setVisible(false);
            }

        }
        return Utility.Formatting.NumFormat_Thousands_2Decimals(value, metaData);
    },
    billEditScanColRender: function billEditScanColRender(me, record) {

        if (BIACore.Security.User.permissions[PgAtt.getGeoIndex()].EA_ProfileId != 1) {
            if (record.get("ImageNumber") != "" && record.get("ImageNumber") != 'NULL') {
                me.items[2].icon = 'images/scanned_16.png';
            }
            else { me.items[2].icon = ''; }

            if (['Printed', 'Approved'].indexOf(PgAtt.getInvoice_status()) >= 0 || (BIACore.Security.User.permissions[PgAtt.getGeoIndex()].EA_APUT_RejectionScanned == 1 && record.get("ImageNumber") == "" && ['Scanned', 'Queued', 'Sent', 'Archived'].indexOf(PgAtt.getInvoice_status()) >= 0)) {
                me.items[1].icon = 'images/table_16.png';
            }
            else {
                me.items[1].icon = '';
            }
        }

        if (BIACore.Security.User.permissions[PgAtt.getGeoIndex()].EA_ProfileId == 1 && PgAtt.getInvoice_status() != 'Approved') {

            if (['Printed', 'Approved'].indexOf(PgAtt.getInvoice_status()) >= 0 || (record.get("ImageNumber") == "" && ['Scanned', 'Queued', 'Sent', 'Archived'].indexOf(PgAtt.getInvoice_status()) >= 0)) {
                me.items[1].icon = 'images/table_16.png';
            } else { me.items[1].icon = ''; }
            if (record.get("ImageNumber") != "") {
                me.items[2].icon = 'images/scanned_16.png';
            } else { me.items[2].icon = ''; }
        }
        return '<span style="font-weight:bold; font-size:12px;"></span>';
    },
    billCheckModalRender: function billCheckModalRender(me, value, metaData, record, rowIndex) {
        var scanFlag = '';
        if (rowIndex >= 0) {
            var baseCSSPrefix = Ext.baseCSSPrefix;
            metaData.tdCls = baseCSSPrefix + 'grid-cell-special ' + baseCSSPrefix + 'grid-cell-row-checker';
            if (['Pending', 'Logged', 'Verified', 'Printed', 'Approved', 'Archived'].indexOf(PgAtt.getInvoice_status()) >= 0) {
                me.column.hide();
                me.column.setDisabled(true);
            }
            else {
                scanFlag = true;
                if (BIACore.Security.User.permissions[PgAtt.getGeoIndex()].EA_Invoice_LogProcess == 1 || BIACore.Security.User.permissions[PgAtt.getGeoIndex()].EA_APUT_ViewNSubmitApproval == 1 || BIACore.Security.User.permissions[PgAtt.getGeoIndex()].EA_APUT_Rejection == 1 || BIACore.Security.User.permissions[PgAtt.getGeoIndex()].EA_APUT_RejectionScanned == 1) {
                    //<!--- Kaizen 7344 Exclude Priority and Next Day invoices from APUT queue --->
                    var bScan = record.get('scan_dest');
                    if (bScan.length > 0) {
                        bScan = record.get('scan_dest').split(":");
                        for (var i = 0; i < bScan.length; i++) {
                            if (['PRIORITY_RCK', 'PRIORITY_GG1'].indexOf(bScan[i].toUpperCase()) >= 0) {
                                scanFlag = false;
                            }
                            if (PgAtt.getScanDest() == 'All') {
                                if (['NEXT_DAY'].indexOf(bScan[i].toUpperCase()) >= 0) {
                                    scanFlag = false;
                                }
                            }
                        }
                    }
                }
                if (!BillsSingCls.getCheckBoxFlag()) {
                    if (BillsSingCls.getOnAputFlag() == 'Y' && ['Scanned', 'Queued', 'Sent'].indexOf(PgAtt.getInvoice_status()) >= 0
                        && (BIACore.Security.User.permissions[PgAtt.getGeoIndex()].EA_APUT_ViewNSubmitApproval == 1 ||
                            BIACore.Security.User.permissions[PgAtt.getGeoIndex()].EA_APUT_Rejection == 1) && record.get('showcheckbox') !== " "
                        && record.get('showcheckbox') !== null && record.get('showcheckbox') == "true") {
                        metaData.column.textEl.addCls('x-column-header-text');
                        metaData.column.addCls('x-column-header-checkbox');
                        BillsSingCls.setCheckBoxFlag(true);
                    }
                    else {
                        metaData.column.textEl.removeCls('x-column-header-text');
                        metaData.column.removeCls('x-column-header-checkbox');
                    }
                }
                if (record.get('showcheckbox') == "true" && ['Scanned', 'Queued'].indexOf(PgAtt.getInvoice_status()) >= 0) {
                    if (BillsSingCls.getOnAputFlag() == 'Y' && scanFlag && (BIACore.Security.User.permissions[PgAtt.getGeoIndex()].EA_APUT_ViewNSubmitApproval == 1 || BIACore.Security.User.permissions[PgAtt.getGeoIndex()].EA_APUT_Rejection == 1)) {
                        BillsSingCls.setCheckRecCount(rowIndex + 1);
                        return '<div class="' + baseCSSPrefix + 'grid-row-checker"> </div>';
                    } else {
                        metaData.tdCls = baseCSSPrefix + 'grid-cell-special';
                        return '';
                    }
                } else {
                    if ('Scanned' == PgAtt.getInvoice_status()) {
                        metaData.tdCls = baseCSSPrefix + 'grid-cell-special';
                        return ' <img class="fcicon" style="width: 14px; height: 16px; vertical-align: middle;" src="images/FCIcon.jpg"  />';
                    }
                }

                if (BillsSingCls.getOnAputFlag() == 'Y' && 'Sent' == PgAtt.getInvoice_status() && (BIACore.Security.User.permissions[PgAtt.getGeoIndex()].EA_APUT_ViewNSubmitApproval == 1 || BIACore.Security.User.permissions[PgAtt.getGeoIndex()].EA_APUT_Rejection == 1)) {
                    BillsSingCls.setCheckRecCount(rowIndex + 1);
                    return '<div class="' + baseCSSPrefix + 'grid-row-checker"> </div>';
                } else {
                    metaData.tdCls = baseCSSPrefix + 'grid-cell-special';
                    return '';
                }
            }
        }
    },
    billColumnRenderSort: function billColumnRenderSort(value, metaData, record, rowIndex, colIndex, store, view) {
        var retunVal = '';
        if (colIndex == 16) {
            if (value !== "") {
                if (PgAtt.getModifiedBy() != '' && PgAtt.getModifiedBy() != null) {
                    return value + ' ' + '<i title="Remove Modified By Filter" class="fa fa-search-minus"></i>';
                }
                else {
                    return value + ' ' + '<i title="Add Modified By Filter" class="fa fa-search-plus"></i>';
                }
            }
            else {
                return value;
            }
        }

        if (colIndex == 18 || colIndex == 19) {

            if (value !== 0) {
                if (PgAtt.getInvBatchID() != '') {
                    retunVal = '<i class ="fa fa-search-minus"> </i>';
                } else {
                    retunVal = '<i class ="fa fa-search-plus"> </i>';
                }
            }

            return retunVal;
        }
    },
    GetImage: function (rec) {
        if (rec != null && rec != '') {
            var params = {
                LocCode: rec.get("Location_Code"),
                InvoiceStatus: rec.get("invoice_status"),
                InvoiceRefNo: rec.get("InvRefNo"),
                DocumentId: rec.get("ImageNumber"),
                InvoiceId: rec.get("invoice_id"),
                AcctYear: PgAtt.getYear()
            };
            var result = BIA.Ajax.request({
                url: 'api/WebAPIReport/GetImage',
                method: "POST",
                async: false,
                cache: false,
                dataType: "html",
                headers: {
                    "Content-Type": "application/json"
                },
                jsonData: params,
                useDefaultXhrHeader: true,
                failure: function (conn, response, options, eOpts) {
                    BIACore.Exception(conn.responseText);
                    BIACore.Message(response);
                },
                scope: this
            });

            return result.responseJSON;
        }
    }
});