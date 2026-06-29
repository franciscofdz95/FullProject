/* ====================================================================================================
NAME:			[Bills Details report Controller ]
BEHAVIOR:		Performs Action and  data for Bills & Bills Reports action event.
_______________________________________________________________________________________________________
REVISION HISTORY
-------------------------------------------------------------------------------------------------------
Date			    Modified By			  Modifications
-------------------------------------------------------------------------------------------------------
11/26/2016        Sudhir Dandale		 Created.
 ======================================================================================================*/


Ext.define('App.Controller.Bills.Details', {
    extend: 'Ext.app.Controller',
    refs: [
        { ref: 'Current', selector: 'App-View-Bills-Detail-Report' },
        { ref: 'FilterPanel', selector: 'App-View-Component-Container-FilterPanelBase' }

    ],
    init: function () {
        var me = this;
        me.control({
            '[xtype="App-View-Bills-Detail-Grid"] ': {
                cellclick: me.BillsDetailsReportCellClick
            },
            '[xtype="button"]': {
                btnRejectScanSD: me.SetInvoiceStatus,
                btnResendBills: me.SetInvoiceStatus
            },
            '[xtype="App-View-Bills-Detail-TBar"] #btnContainerBD': {
                afterrender: me.TbarContainerAfterRender
            },
            'App-View-Bills-Detail-Report': {
                beforerender: me.ReportTabBeforeRender
            },
            '[xtype="App-View-Bills-Detail-Report"] #btnPrintBillDetailsReportEXCEL': {
                click: me.BillDetailsReport
            },
            '[xtype="App-View-Bills-Detail-Report"] #btnPrintBillDetailsReportPDF': {
                click: me.BillDetailsReport
            },
            '[xtype="App-View-Bills-Detail-TBar"] #btnApprove,#btnReturn,#btnUnApprove,#btnRetToApprove,#btnRvwEtCodding,#btnAddToAputQ,#btnRmvFrmAputQ': {
                click: me.BillDetailTBarClick
            },
            '[xtype="App-View-Bills-Detail-Grid"]': {
                colReferenceId: me.UpateReferenceValue
            }
        });

    },
    // Get Bills Details Reports cell click event.
    BillsDetailsReportCellClick: function BillsDetailsReportCellClick(me, td, cellIndex, record) {
        var colName = me.grid.columns[cellIndex].itemId;

        if (colName != '') {
            if (colName == 'colShipNoBDG') {
                var win = Ext.widget('App-View-ShipmentSummary-Report');
                win.rec = record;
                win.show();
            }
        }
    },
    DisableUnapproved: function DisableUnapproved(invId) {
        var params = {
            InvoiceId: invId
        };
        BIA.Ajax.request({
            url: 'api/WebAPIReport/DisableUnapproved',
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
    IsReProcessInvoice: function IsReProcessInvoice(invId) {
        var params = {
            InvoiceId: invId
        };
        var data = new Object();
        BIA.Ajax.request({
            url: 'api/WebAPIReport/IsReProcessInvoice',
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
            },
            failure: function (conn, response, options, eOpts) {
                BIACore.Exception(conn.responseText);
                BIACore.Message(response);
            },
            scope: this
        })
        return data;
    },
    SetInvoiceStatusRedirect: function SetInvoiceStatusRedirect(invId, invStatTo, user, invStatFrom, DocumentId) {
        var me = this;
        me.EnableDisabledButtons(invStatFrom, true);
        var isTrue = me.IsReProcessInvoice(invId);

        if (isTrue && invStatTo == "Approved" && invStatFrom == "Verified") {
            Ext.Msg.confirm("Confirmation", "Bill Id (" + invId + ") has charges that have been deleted in e2k and so it will need to be reprocessed. Would you like to move this invoice to pending status now?", function (btnText) {
                if (btnText === "yes") {
                    me.SetInvoiceStatus(invId, "Pending", user, "Inactivated the deleted e2k changes in Flote", DocumentId);
                    if (invStatTo == "Verified") {
                        me.DisableUnapproved(invId);
                    }
                }
            }, this);
        }
        else {
            me.SetInvoiceStatus(invId, invStatTo, user, "", DocumentId);
            if (invStatTo == "Verified") {
                me.DisableUnapproved(invId);
            }
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
            success: function (conn, response, options, eOpts) {
                var data = Ext.decode(conn.responseText);
                if (data != "Completed") {
                    alert(data);
                }
            },
            failure: function (conn, response, options, eOpts) {
                BIACore.Exception(conn.responseText);
                BIACore.Message(response);
            },
            scope: this
        });

    },
    EnableDisabledButtons: function EnableDisabledButtons(invStatus, flag) {
        var win = this.getActiveCurrent();
        if (win == null) {
            win = this.getAllCurrent();
        }

        if (invStatus == "Verified") {
            win.down('#btnApprove').setVisible(flag);
            win.down('#btnReturn').setVisible(flag);
        }
        else if (invStatus == "Approved") {
            win.down('#btnUnApprove').setVisible(flag);
        }
        else if (invStatus == "Printed") {
            win.down('#btnRetToApprove').setVisible(flag);
        }
        else if (invStatus == "Scanned") {
            win.down('#btnAddToAputQ').setVisible(flag);
        }
    },
    BillDetailsReport: function BillDetailsReport(me) {
        var rec = me.up('window').down('grid').rowData;
        var grid = me.up('window').down('grid');
        var colNames = '';
        var dataIndexVal = '';
        var sorters = [];
        var exportType = 'PDF';
        if (me.itemId == 'btnPrintBillDetailsReportEXCEL') {
            exportType = 'EXCEL';
        }

        Ext.each(grid.store.sorters.items, function (item) { sorters.push(item.getState()) });
        if (grid) {
            for (var i = 0; i < grid.columns.length; i++) {
                if (!(grid.columns[i].hidden) && grid.columns[i].text !== "" && grid.columns[i].dataIndex !== null) {
                    colNames = colNames + grid.columns[i].text;
                    dataIndexVal = dataIndexVal + grid.columns[i].dataIndex;
                    if (grid.columns.length - 1 > i && grid.columns.length > 1) {
                        colNames = colNames + ",";
                        dataIndexVal = dataIndexVal + ",";
                    }
                }
            }
        }
        var sort = ''
        if (sorters != null) {
            for (var k = 0; k < sorters.length; k++) {
                sort += sorters[k].property + '  ' + sorters[k].direction;
                if (sorters.length > 1 && sorters.length - 1 != k) {
                    sort = sort + ',';
                }
            }
        }

        var params = {
            InvoiceId: rec.get("invoice_id"),
            ExportType: exportType,
            ColumnNames: colNames,
            DataIndexes: dataIndexVal,
            SortParam: sort
        };

        var form = Ext.create('Ext.form.Panel', {
            standardSubmit: true,         // this is the important part 
            url: 'api/WebAPIReport/BillDetailsReport',
            method: 'POST'
        });

        form.submit({
            target: '_blank',
            params: params
        });
    },
    TbarContainerAfterRender: function TbarContainerAfterRender(me) {
        var baseRegex = '/';
        var rec = me.up('grid').rowData;
        //By Sriram to check for  ModifiedBy  parameter is undefined
        if (rec.get('invoice_status') == 'Verified' && rec.get('ModifiedBy') && ((rec.get('ModifiedBy').toUpperCase() != BIACore.Security.User.userId.toUpperCase() && BIACore.Security.User.permissions[PgAtt.getGeoIndex()].EA_Invoice_ApproveUnApproveDelete) || (BIACore.Security.User.permissions[PgAtt.getGeoIndex()].EA_ProfileId == 2))) {
            baseRegex = baseRegex + '|btnApprove';
        }

        if (rec.get('invoice_status') == 'Verified' && (BIACore.Security.User.permissions[PgAtt.getGeoIndex()].EA_Invoice_LogProcess == 1 || BIACore.Security.User.permissions[PgAtt.getGeoIndex()].EA_Invoice_ApproveUnApproveDelete == 1)) {
            baseRegex = baseRegex + '|btnReturn';
        }

        if (rec.get('invoice_status') == 'Approved' && (BIACore.Security.User.permissions[PgAtt.getGeoIndex()].EA_Invoice_ApproveUnApproveDelete == 1 || BIACore.Security.User.permissions[PgAtt.getGeoIndex()].EA_ProfileId == 2 || BIACore.Security.User.permissions[PgAtt.getGeoIndex()].EA_ProfileId == 6)) {
            baseRegex = baseRegex + '|btnUnApprove';
        }

        if (['Approved', 'Archived', 'Scanned', 'Printed', 'Queued', 'Sent'].indexOf(rec.get('invoice_status')) >= 0 && (BIACore.Security.User.permissions[PgAtt.getGeoIndex()].EA_Invoice_ApproveUnApproveDelete == 1 || BIACore.Security.User.permissions[PgAtt.getGeoIndex()].EA_ProfileId == 2 || BIACore.Security.User.permissions[PgAtt.getGeoIndex()].EA_ProfileId == 6)) {
            baseRegex = baseRegex + '|btnRvwEtCodding';
        }

        if (rec.get('invoice_status') == 'Printed' && (BIACore.Security.User.permissions[PgAtt.getGeoIndex()].EA_Invoice_ApproveUnApproveDelete == 1 || BIACore.Security.User.permissions[PgAtt.getGeoIndex()].EA_ProfileId == 2 || BIACore.Security.User.permissions[PgAtt.getGeoIndex()].EA_ProfileId == 6)) {
            baseRegex = baseRegex + '|btnRetToApprove';
        }

        baseRegex = baseRegex + '|msgIncompleteInvDet|tbSepBillDet|btnPrintBillDetailsReportEXCEL|btnPrintBillDetailsReportPDF';

        if (rec.get('invoice_status') == 'Scanned' && BIACore.Security.User.permissions[PgAtt.getGeoIndex()].EA_APUT_ViewNSubmitApproval == 1) {
            var scanDest = rec.get('scan_dest').split(":")
            var fScan = true;
            for (var i = 0; i < scanDest.length; i++) {
                if (['PRIORITY_RCK', 'PRIORITY_GG1'].indexOf(scanDest[i].toUpperCase()) >= 0) {
                    fScan = false;
                }
            }
            if (BIACore.Security.User.permissions[PgAtt.getGeoIndex()].EA_APUT_ViewNSubmitApproval == 1 && fScan) {
                if (rec.get('showchkbox') !== 'false') {
                    me.up('grid').addAPUT = true;
                }
            }
        }

        var regex = new RegExp(baseRegex + '|/', 'i');

        for (var k = 0; k < me.items.length; k++) {
            if (regex.test(me.items.items[k].itemId)) {
                me.items.items[k].setVisible(true);
            }
            else { me.items.items[k].setVisible(false); }
        }
    },
    ReportTabBeforeRender: function ReportTabBeforeRender(win) {
        var rec = win.rec;
        win.width = Ext.getBody().getViewSize().width / 100 * 90 + 'px';
        win.height = Ext.getBody().getViewSize().height + 'px';
        var data = BillsSingCls.billDetailsInfo(rec.get('invoice_id'));
        win.down('form').loadValues(data);
        var grid = win.down('grid');
        win.rowDetails = data;
        grid.rowData = rec;

        var params = {
            InvoiceId: rec.get('invoice_id')
        };
        var store = win.down('grid').getStore();
        var pager = grid.down('[xtype="pagingtoolbar"]');
        // set the parameters on the proxy                                              
        store.getProxy().extraParams = params;
        // load new data
        if (pager) pager.moveFirst(); else store.load();

    },
    BillDetailTBarClick: function BillDetailTBarClick(me) {
        var filter = this.getActiveFilterPanel();
        if (filter == null) {
            filter = this.getAllFilterPanel()[0];
        }
        var grid = me.up('grid');
        grid.mask('Performing');// + me.text + 'operation...');
        var rec = me.up('grid').rowData;
        var setFlag = false;
        Ext.defer(function () {
            if (me.itemId == 'btnApprove') {
                this.SetInvoiceStatusRedirect(rec.get('invoice_id'), "Approved", BIACore.Security.User.permissions[PgAtt.getGeoIndex()].userId, "Verified", rec.get('ImageNumber'));
                setFlag = true;
            }
            if (me.itemId == 'btnReturn') {
                this.SetInvoiceStatusRedirect(rec.get('invoice_id'), "Pending", BIACore.Security.User.permissions[PgAtt.getGeoIndex()].userId, "Verified", rec.get('ImageNumber'));
                setFlag = true;
            }
            if (me.itemId == 'btnUnApprove') {
                this.SetInvoiceStatusRedirect(rec.get('invoice_id'), "Verified", BIACore.Security.User.permissions[PgAtt.getGeoIndex()].userId, "Approved", rec.get('ImageNumber'));
                setFlag = true;
            }
            if (me.itemId == 'btnRetToApprove') {
                this.SetInvoiceStatusRedirect(rec.get('invoice_id'), "Approved", BIACore.Security.User.permissions[PgAtt.getGeoIndex()].userId, "Printed", rec.get('ImageNumber'));
                setFlag = true;
            }
            if (me.itemId == 'btnRvwEtCodding') {
                var win = Ext.widget('App-View-Bills-PopUps-CodingSheet-ReviewCodingSheetW');
                win.rec = rec;
                win.show();
            }
            if (me.itemId == 'btnAddToAputQ') {
                if (BillsSingCls.IsNullCheckForInvoice(rec.get('invoice_id'))) {
                    alert("This invoice cannot be submitted to the APUT Queue because there is a NULL value in one of the following fields: \nCenter, Ops, Account, Product, PO, Number\n\nPlease use the \'Review\/Edit Coding Sheet\' link on this page to edit these fields.");
                } else {
                    this.SetInvoiceStatusRedirect(rec.get('invoice_id'), "Queued", BIACore.Security.User.permissions[PgAtt.getGeoIndex()].userId, "Scanned", rec.get('ImageNumber'));
                    setFlag = true;
                }

            }
            if (me.itemId == 'btnRmvFrmAputQ') {
                this.SetInvoiceStatus(rec.get('invoice_id'), "Approved", BIACore.Security.User.permissions[PgAtt.getGeoIndex()].userId, "", rec.get('ImageNumber'));
                setFlag = true;
            }
            if (setFlag) {
                PgAtt.setFilterGoFlag(true);
                filter.fireEvent('btnApply', me);
                me.up('window').close();
            }
        }, 100, this, [grid]);

        grid.unmask();

    },
    UpateReferenceValue: function UpateReferenceValue(record, comment, userId) {
        var params = {
            InvoiceDetId: record.get("Invoice_detail_id"),
            Comments: comment,
            UserId: userId
        };
        BIA.Ajax.request({
            url: 'api/WebAPIReport/UpateReferenceValue',
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
    }
});

