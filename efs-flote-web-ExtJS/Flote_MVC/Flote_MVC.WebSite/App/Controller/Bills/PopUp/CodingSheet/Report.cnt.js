/* ====================================================================================================
NAME:			[Accruals Controller]
BEHAVIOR:		Shows Accruals Controller.
_______________________________________________________________________________________________________
REVISION HISTORY
-------------------------------------------------------------------------------------------------------
Date			    Modified By			  Modifications
-------------------------------------------------------------------------------------------------------
02/10/2017        Sudhir Dandale		 Created.
 ======================================================================================================*/
Ext.define('App.Controller.Bills.CodingSheet.Report', {
    extend: 'Ext.app.Controller',
    refs: [
        { ref: 'Current', selector: 'App-View-Main-TabPanel' },
        { ref: 'FilterPanel', selector: 'App-View-Component-Container-FilterPanelBase' }
    ],
    init: function () {
        var me = this;
        me.control({
            '[xtype="App-View-Bills-PopUps-CodingSheet-ReportW"] #btnCodingSheetExport ': {
                click: me.CodingSheetExportToExcel
            },
            '[xtype="App-View-Bills-PopUps-CodingSheet-ReportW"] #btnExportToPdf': {
                click: me.CodingSheetExportToPdf
            },
            '[xtype="App-View-Bills-PopUps-CodingSheet-ReportW"] #btnCancel': {
                click: me.CancelOperation
            },
            '[xtype="App-View-Bills-PopUps-CodingSheet-ReportW"] #btnRejectScanPC': {
                click: me.RejectedScan
            },
            '[xtype="App-View-Bills-PopUps-CodingSheet-ReportW"] ': {
                beforerender: me.CodingSheetBeforeRender
            },
            'App-View-Bills-PopUps-CodingSheet-ReviewCodingSheetW': {
                beforerender: me.ReviewCodingSheetBeforeRender
            },
            '[xtype="checkbox"]': {
                chkRejectPC: me.updateRejectedStatus
            },
            'App-View-Bills-PopUps-CodingSheet-ReviewCodingSheetGrid textfield': {
                blur: me.OnSheetValueChange
            }
        });
    },
    CodingSheetExportToPdf: function CodingSheetExportToPdf(me) {
        var filter = this.getActiveFilterPanel();
        if (filter == null) {
            filter = this.getAllFilterPanel()[0];
        }
        var win = me.up('window');
        var rec = win.rec;
        var subFold = win.down('#CodingSheetDD combobox').getValue();
        if (subFold == null || subFold == '') {
            alert('Please select coding sheet export subfolder');
        }
        else {
            var exportType = 'PDF';
            this.CodingSheetExport(exportType, rec);
            PgAtt.setFilterGoFlag(true);
            filter.fireEvent('btnApply');
            win.close();
        }
    },
    CodingSheetExportToExcel: function CodingSheetExportToExcel(me) {
        var filter = this.getActiveFilterPanel();
        if (filter == null) {
            filter = this.getAllFilterPanel()[0];
        }
        var win = me.up('window');
        var rec = win.rec;
        var subFold = win.down('#CodingSheetDD combobox').getValue();
        if (subFold == null || subFold == '') {
            alert('Please select coding sheet export subfolder');
        }
        else {
            var exportType = 'EXCEL';
            this.CodingSheetExport(exportType, rec);
            PgAtt.setFilterGoFlag(true);
            filter.fireEvent('btnApply');
            win.close();
        }
    },
    CancelOperation: function CancelOperation(me) {
        me.up('window').close();
    },
    CodingSheetBeforeRender: function CodingSheetBeforeRender(me) {
        var win = me;
        var rec = win.rec;        
        BillsSingCls.getByPassImgByLocCmpCode();
        win.down('#AP_Vendor_id').setValue(rec.get('AP_Vendor_id'));
        win.down('#ap_remit_id').setValue(rec.get('AP_Remit_id'));
        win.down('#vendor_code').setValue(rec.get('vendor_code'));
        win.down('#pay_group_popup').setValue(rec.get('pay_group_popup'));
        if (BillsSingCls.getByPassIM() == 'Y' && PgAtt.getInvoice_status() == 'Scanned' && BIACore.Security.User.permissions[PgAtt.getGeoIndex()].EA_ProfileId != 1 && BIACore.Security.User.permissions[PgAtt.getGeoIndex()].EA_ProfileId != 3) {
            win.down('#cmtRejectScanPC').setVisible(true);
            win.down('#btnRejectScanPC').setVisible(true);
        }
        if (['Printed', 'Approved'].indexOf(PgAtt.getInvoice_status()) >= 0 && rec.get('Rejected') == 'Y') {
            win.down('#chkRejectPC').setVisible(true);
            win.down('#rejectCommentPC').setVisible(true);
            win.down('#rejectCommentPC').setText("Rejected Comment:" + BillsSingCls.getUserNameById(BIACore.Security.User.permissions[PgAtt.getGeoIndex()].userId) + '-' + rec.get('Comment'));
            if (rec.get('RejectedRecall') == 'Y') {
                win.RejectFlag = 'N';
                win.down('#chkRejectPC').setValue(true);
            }

            if (PgAtt.getInvoice_status() == 'Printed') {
                win.down('#chkRejectPC').setDisabled(true);
            }
        }
    },
    ReviewCodingSheetBeforeRender: function ReviewCodingSheetBeforeRender(me) {
        var grid = '', store = '', pager = '';
        if (me.rec != "") {
            var params = {
                InvoiceId: me.rec.get('invoice_id')
            };
            grid = me.down('grid');
            store = me.down('grid').getStore();
            pager = grid.down('[xtype="pagingtoolbar"]');
            store.getProxy().extraParams = params;
            // load new data
            grid.getView().emptyText = '<div class="x-grid-empty"> No results were found for this Invoice Id. </div>';
            if (pager) pager.moveFirst(); else store.load();
        } else {
            alert("Invoice Id is not provided, Please try it again ")
        }

    },
    updateRejectedStatus: function (rejStatus, invoiceId) {
        var filter = this.getActiveFilterPanel();
        if (filter == null) {
            filter = this.getAllFilterPanel()[0];
        }
        var params = {
            InvoiceId: invoiceId,
            RejectedFlag: rejStatus
        };

        BIA.Ajax.request({
            url: 'api/WebAPIReport/UpdateRejectedStatus',
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
                PgAtt.setFilterGoFlag(true);
                filter.fireEvent('btnApply');
            },
            failure: function (conn, response, options, eOpts) {
                BIACore.Exception(conn.responseText);
                BIACore.Message(response);
            },
            scope: this
        });
    },
    CodingSheetExport: function CodingSheetExport(exportType, rec) {

        if (rec != '' && rec != null && Ext.isObject(rec)) {

            var params = {
                InvoiceId: rec.get("invoice_id"),
                ExportType: exportType
            };
            var form = Ext.create('Ext.form.Panel', {
                standardSubmit: true,
                url: 'api/WebAPIReport/CodingSheetExport',
                method: 'POST'
            });

            form.submit({
                target: '_blank',
                params: params
            });

            if (['Printed', 'Approved'].indexOf(PgAtt.getInvoice_status()) >= 0) {
                if (BIACore.Security.User.permissions[PgAtt.getGeoIndex()].EA_ProfileId != 1) {
                    if (rec.get('Rejected') == "Y") {
                        if (rec.get('RejectedRecall') == "Y") {
                            this.SetInvoiceStatus(rec.get('invoice_id'), 'Printed', BIACore.Security.User.permissions[PgAtt.getGeoIndex()].userId, '', rec.get('ImageNumber'));
                            if (BillsSingCls.getByPassIM() == "Y") {
                                this.SetInvoiceStatus(rec.get('invoice_id'), 'Scanned', BIACore.Security.User.permissions[PgAtt.getGeoIndex()].userId, '', rec.get('ImageNumber'));
                            }
                        }
                    }
                    else {
                        this.SetInvoiceStatus(rec.get('invoice_id'), 'Printed', BIACore.Security.User.permissions[PgAtt.getGeoIndex()].userId, '', rec.get('ImageNumber'));
                        if (BillsSingCls.getByPassIM() == "Y") {
                            this.SetInvoiceStatus(rec.get('invoice_id'), 'Scanned', BIACore.Security.User.permissions[PgAtt.getGeoIndex()].userId, '', rec.get('ImageNumber'));
                        }
                    }
                }
            }
        }


    },
    RejectedScan: function RejectedScan(me) {
        var filter = this.getActiveFilterPanel();
        if (filter == null) {
            filter = this.getAllFilterPanel()[0];
        }
        var win = me.up('window');
        var rec = win.rec;
        if (win.down('#cmtRejectScanPC').getValue() != '') {

            var params = {
                InvoiceId: rec.get('invoice_id'),
                BatchId: 0,
                Comments: win.down('#cmtRejectScanPC').getValue(),
                UserId: BIACore.Security.User.permissions[PgAtt.getGeoIndex()].userId,
                RejectedStatus: 'Rejected',
                InvoiceStatusTo: 'Approved'
            };
            BIA.Ajax.request({
                url: 'api/WebAPIReport/MoveInvoiceToApproveOrScanned',
                method: "POST",
                async: false,
                cache: false,
                dataType: "html",
                headers: {
                    "Content-Type": "application/json"
                },
                jsonData: params,
                success: function (data) {
                    PgAtt.setFilterGoFlag(true);
                    filter.fireEvent('btnApply');
                    win.close();
                }
            });
        }
        else {
            win.down('#cmtRejectScanPC').addCls('red-btn');
        }
    },
    SetInvoiceStatus: function SetInvoiceStatus(invId, invStatusTo, user, cmt, DocumentId) {
        var userId = BIACore.Security.User.permissions[PgAtt.getGeoIndex()].userId;
        if (user != undefined && user.length > 1) { userId = user; }

        var params = {
            InvoiceId: invId,
            InvoiceStatusTo: invStatusTo,
            UserId: userId,
            Comments: cmt,
            ImageNumber: DocumentId
        };

        BIA.Ajax.request({
            url: 'api/WebAPIReport/SetInvoiceStatus',
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

    },
    OnSheetValueChange: function OnSheetValueChange(field, newVal, oldVal) {
        var userId = BIACore.Security.User.permissions[PgAtt.getGeoIndex()].userId;
        if (field.getItemId() === 'center_code' || field.getItemId() === 'account_code' || field.getItemId() === 'product' || field.getItemId() === 'PO_number' || field.getItemId() === 'ops_type_code') {
            var widRec = field.getWidgetRecord(),
                codeId = widRec.get('coding_id');
            var params = {
                CodeId: codeId,
                Field: field.getItemId(),
                Value: field.getValue(),
                UserId: userId
            };

            BIA.Ajax.request({
                url: 'api/WebAPIReport/PostCodeSheet',
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
                }
            });
        }
    }
});