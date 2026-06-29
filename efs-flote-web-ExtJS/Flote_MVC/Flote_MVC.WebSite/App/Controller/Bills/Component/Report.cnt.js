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
var selectionCount = true;
Ext.define('App.Controller.Bills.Component.Report', {
    extend: 'Ext.app.Controller',
    refs: [
        { ref: 'Current', selector: 'App-View-Main-TabPanel' },
        { ref: 'FilterPanel', selector: 'App-View-Component-Container-FilterPanelBase' }
    ],
    secCount: 0,
    headerChecked: false,
    init: function () {
        this.control({
            'App-View-Bills-Component-Report': {
                activate: this.ReportTabActivate,
                beforeactivate: this.ReportTabBeforeActivate

            }, 'App-View-Bills-Grid': {
                cellclick: this.BillsReportCellClick,
                itemmouseenter: this.BillsCellMouseUp
            },
            'App-View-Bills-GridShowCheckBox': {
                headerclick: this.OnHeaderClickMethod,
                selectionchange: this.OnSelectionChange,
                beforeselect: this.BeforeSelectRecord
            },
            '[xtype="actioncolumn"] ': {
                actionColDelete: this.ClearInvoice,
                billsActionColIconI: this.ActionColHandlerI,
                billsActionColIconIII: this.ActionColHandlerIII
            },
            'App-View-Bills-TabPanel': {
                activate: this.BillsTabActivate
            }
        });
    },
    OnHeaderClickMethod: function (ct, col, e) {
        if (col.cls !== undefined) {
            var selectedCount = ct.up().getSelectionModel().getCount(),
                checkCount = BillsSingCls.getCheckRecCount();
            if (selectedCount === checkCount) {
                selectionCount = false;
            } else {
                selectionCount = true;
            }
        }
    },
    BeforeSelectRecord: function BeforeSelectRecord(me, record, index, eOpts) {
        var returnFlag = false;
        if (selectionCount === true) {
            var scanFlag = true;
            if (BIACore.Security.User.permissions[PgAtt.getGeoIndex()].EA_Invoice_LogProcess == 1 || BIACore.Security.User.permissions[PgAtt.getGeoIndex()].EA_APUT_ViewNSubmitApproval == 1 || BIACore.Security.User.permissions[PgAtt.getGeoIndex()].EA_APUT_Rejection == 1 || BIACore.Security.User.permissions[PgAtt.getGeoIndex()].EA_APUT_RejectionScanned == 1) {
                var bScan = record.data.scan_dest;
                if (bScan.length > 0) {
                    var bScanDest = bScan.split(":");
                    for (var j = 0; j < bScanDest.length; j++) {
                        if (['PRIORITY_RCK', 'PRIORITY_GG1'].indexOf(bScanDest[j].toUpperCase()) >= 0) {
                            scanFlag = false;
                        }
                    }
                }
            }
            var showcheck = record.data.showcheckbox;
            if (showcheck == "true" && ['Scanned', 'Queued', 'Sent'].indexOf(PgAtt.getInvoice_status()) >= 0) {
                if (BillsSingCls.getOnAputFlag() == 'Y' && scanFlag && (BIACore.Security.User.permissions[PgAtt.getGeoIndex()].EA_APUT_ViewNSubmitApproval == 1 || BIACore.Security.User.permissions[PgAtt.getGeoIndex()].EA_APUT_Rejection == 1)) {
                    returnFlag = true;
                }
            }
            return returnFlag;
        }
        else {
            me.deselectAll();
        }
    },
    OnSelectionChange: function OnSelectionChange(ct, selected, eOpts) {
        var me = this,
            report = ct.view.up('App-View-Bills-Component-Report');
        me.secCount = selected.length;
        if (selected.length > 0) {
            var grid = ct.view.up();
            if (selected.length === BillsSingCls.getCheckRecCount()) {
                grid.getColumns()[0].el.dom.setAttribute('class', 'x-column-header x-column-header-checkbox x-column-header-align-left x-box-item x-column-header-default x-unselectable x-column-header-first x-focus x-column-header-focus x-column-header-default-focus x-grid-hd-checker-on');
            } else {
                grid.getColumns()[0].el.dom.setAttribute('class', 'x-column-header x-column-header-checkbox x-column-header-align-left x-box-item x-column-header-default x-unselectable x-column-header-first x-focus x-column-header-focus x-column-header-default-focus');
            }
            me.ShowHideTbarButtons(report, selected.length);
        } else {
            ct.deselectAll();
            me.ShowHideTbarButtons(report, selected.length);
        }
        if (selectionCount === false) {
            ct.deselectAll();
            selectionCount = true;
        }
    },
    ShowHideTbarButtons: function ShowHideTbarButtons(report, count) {
        if (BillsSingCls.getOnAputFlag() == 'Y') {
            if (PgAtt.getInvoice_status() == 'Queued' && BIACore.Security.User.permissions[PgAtt.getGeoIndex()].EA_APUT_ViewNSubmitApproval == 1) {
                var aputBtn = report.down('#btnSendSelectedBills');
                var aputQueuedBtn = report.down('#btnSendQueuedBills');
                if (count > 0 && 'All') {
                    aputBtn.show();
                    aputQueuedBtn.show();
                } else {
                    aputBtn.hide();
                }
            }
        }
        if (['Scanned'].indexOf(PgAtt.getInvoice_status()) >= 0 && BIACore.Security.User.permissions[PgAtt.getGeoIndex()].EA_APUT_ViewNSubmitApproval == 1) {
            var addToQueueButton = report.down('#btnAddToQueue');
            if (count > 0) {
                addToQueueButton.show();
            } else {
                addToQueueButton.hide();
            }
        }
    },
    BillsTabActivate: function BillsTabActivate(tab) {
        BillsSingCls.getAPUTFlag();
        BillsSingCls.getByPassImgByLocCmpCode();
        if (tab.tab.text == "Bills" && (tab.previousTab == "Invoice Processing" || tab.previousTab == "Vendor Statement Summary")) {
            var activeTab = tab.activeTab;
            activeTab.fireEvent('activate', activeTab);
        }
    },
    ReportTabBeforeActivate: function ReportTabBeforeActivate(tab) {
        BillsSingCls.getByPassImgByLocCmpCode();
        BillsSingCls.setGridRecords([]);
        PgAtt.setInvoice_status(tab.InvoiceStatusName);
        if (BillsSingCls.getBillPanelTab() == "Payment Details") {
            var filter = this.getActiveFilterPanel();
            if (filter == null) {
                filter = this.getAllFilterPanel()[0];
            }
            filter.down('#filInvoiceId textfield').setValue('0');
            filter.down('#filVendorCode textfield').setValue(null);
            filter.down('#filInvoiceRefNo textfield').setValue(null);
        }
    },
    ReportTabActivate: function ReportTabActivate(tab) {
        if (tab.title == 'Payment Details') {
            BillsSingCls.setBillPanelTab('Payment Details')
            this.BillPaymentDtlsTabActivate(tab);
        }
        else {
            BillsSingCls.setBillPanelTab('');
            var filter = this.getActiveFilterPanel();
            if (filter == null) {
                filter = this.getAllFilterPanel()[0];
            }
            var tabPanel = this.getActiveCurrent();
            if (tabPanel == null) {
                tabPanel = this.getAllCurrent();
            }
            var recordData,
                title = "",
                totalCount = 0,
                extraParams = {},
                me = this;
            BillsSingCls.liveInvoiceBKGRDProcess(PgAtt.getLocation_code(), 'Scanned');
            BillsSingCls.liveInvoiceBKGRDProcess(PgAtt.getLocation_code(), 'Archived');
            filter.down('#filInvoiceStatus').show();
            filter.down('#filInvoiceStatus textfield').setValue(tab.InvoiceStatusName);
            filter.down('#msgWarning').hide();

            var pageName = "Bills";
            var grid = '';
            if (localStorage) { localStorage.setItem('pageName', 'Bills'); }

            filter.showHideFilter();

            // To remove Duplicate records in Bill Tab for all status    by Sriram
            if (tab.InvoiceStatusName == 'Scanned' || tab.InvoiceStatusName == 'Queued' || tab.InvoiceStatusName == 'Sent' && (BIACore.Security.User.permissions[PgAtt.getGeoIndex()].EA_APUT_ViewNSubmitApproval == 1 || BIACore.Security.User.permissions[PgAtt.getGeoIndex()].EA_APUT_Rejection == 1)) {
                grid = tab.down('App-View-Bills-GridShowCheckBox');
            }
            else {
                grid = tab.down('App-View-Bills-Grid');
            }

            var store = grid.getStore();
            var pager = grid.down('[xtype="pagingtoolbar"]');
            if (PgAtt.getGeoCode() !== 'CO') {
                Ext.Object.merge(extraParams, filter.GetParameters(), { GeoId: PgAtt.getGeoId(), GeoCode: PgAtt.getGeoCode() });
            } else {
                Ext.Object.merge(extraParams, filter.GetParameters());
            }
            store.getProxy().extraParams = extraParams;
            PgAtt.getGridCustomMsg(pageName);
            PgAtt.getApproveInvCountByWeek(tab.down('#incompleteApproveInvoicesId'));
            if (grid) {
                var hiddenColumns = grid.getColumns().filter(function (c) {
                    return tab.columnsToHide.indexOf(c.dataIndex) > 0;
                });
                for (var i = 0; i < hiddenColumns.length; i++) { hiddenColumns[i].setVisible(false); }

                var colBatchIdFil = Ext.Array.findBy(grid.getColumns(), function (c) { return c.itemId == 'colBatchIdFil'; });
                var colBatchId = Ext.Array.findBy(grid.getColumns(), function (c) { return c.itemId == 'colBatchId'; });
                if (['', 'Sent', 'Archived'].indexOf(tab.InvoiceStatusName) >= 0) {
                    if (colBatchIdFil) colBatchIdFil.setVisible(true);
                    if (colBatchId) colBatchId.setVisible(true);
                } else {
                    if (colBatchIdFil) colBatchIdFil.setVisible(false);
                    if (colBatchId) colBatchId.setVisible(false);
                }
            }
            title = Ext.isDefined(grid.up().title) ? grid.up().title : "";
            //Re-load the grid.
            if (PgAtt.getMsgEmptyDataFlag()) {
                recordData = BillsSingCls.GetBillSummaryStatus(tabPanel);
                totalCount = recordData[title];
                grid.on({
                    afterlayout: {
                        single: true,
                        fn: function () {
                            me.LoadGridStore(store, pager, totalCount);
                        }
                    }
                });
                if (PgAtt.getBillsStoreCounter() === 0 || PgAtt.getFilterGoFlag()) {
                    me.LoadGridStore(store, pager, totalCount);
                    PgAtt.setFilterGoFlag(false);
                    PgAtt.setBillsStoreCounter(1);
                }
                grid.getView().emptyText = '<div class="x-grid-empty"> No Matches Found! Verify the selected filter criteria.</div>';
            } else {
                store = null;
                recordData = { Logged: 0, Pending: 0, Verified: 0, Approved: 0, Scanned: 0, Queued: 0, Sent: 0, Archived: 0 };
                tabPanel.down('#billLogged').tab.setText('Logged (' + 0 + ')');
                tabPanel.down('#billPending').tab.setText('Pending (' + 0 + ')');
                tabPanel.down('#billVerified').tab.setText('Verified (' + 0 + ')');
                tabPanel.down('#billApproved').tab.setText('Approved (' + 0 + ')');
                tabPanel.down('#billPrinted').tab.setText('Printed (' + 0 + ')');
                tabPanel.down('#billScanned').tab.setText('Scanned (' + 0 + ')');
                tabPanel.down('#billQueued').tab.setText('Queued (' + 0 + ')');
                tabPanel.down('#billSent').tab.setText('Sent (' + 0 + ')');
                tabPanel.down('#billArchived').tab.setText('Archived (' + 0 + ')');
                var view = grid.getView();
                view.getStore().clearFilter(true);
                view.getStore().removeAll(true);
                view.emptyText = '<div class="x-grid-empty">' + PgAtt.getMsgEmptyDataCustom() + '</div>';
                view.refresh();
            }
            if (BillsSingCls.getOnAputFlag() == 'Y' && ['Scanned', 'Queued', 'Sent'].indexOf(PgAtt.getInvoice_status()) >= 0
                && (BIACore.Security.User.permissions[PgAtt.getGeoIndex()].EA_APUT_ViewNSubmitApproval == 1 ||
                    BIACore.Security.User.permissions[PgAtt.getGeoIndex()].EA_APUT_Rejection == 1)) {
                if (['Scanned'].indexOf(PgAtt.getInvoice_status()) >= 0 && recordData.Scanned == 0
                    && (['Queued'].indexOf(PgAtt.getInvoice_status()) == -1)
                    && (['Sent'].indexOf(PgAtt.getInvoice_status()) == -1)) {
                    grid.getView().getGridColumns()[0].el.select('.x-column-header-text').setStyle('display', 'none');
                }
                else if (['Queued'].indexOf(PgAtt.getInvoice_status()) >= 0 && recordData.Queued == 0
                    || ['Sent'].indexOf(PgAtt.getInvoice_status()) >= 0 && recordData.Sent == 0 &&
                    (['Scanned'].indexOf(PgAtt.getInvoice_status() == -1))) {
                    if (grid.headerCt.items.items[0].protoEl != null)
                        grid.headerCt.items.items[0].protoEl.removeCls("x-column-header-checkbox");
                    else if (grid.getView().getGridColumns()[0].el != undefined)
                        grid.getView().getGridColumns()[0].el.select('.x-column-header-text').setStyle('display', 'none');
                }
            }
        }
    },
    LoadGridStore: function LoadGridStore(store, pager, totalCount) {
        var me = this,
            pageNum = 1,
            curentPage = store.currentPage;
        if (curentPage !== 1) {
            var val = totalCount / store.pageSize;
            var isFt = Number(val) === val && val % 1 !== 0;
            if (isFt) {
                pageNum = parseInt(val) + 1;
            } else {
                pageNum = parseInt(val);
            }
        }
        store.on("beforeload", me.BeforeStoreLoad, this);
        store.loadPage(pageNum, {
            callback: function (records) {
                var grid = '', btn = '';
                if (['Queued'].indexOf(PgAtt.getInvoice_status()) >= 0 && BIACore.Security.User.permissions[PgAtt.getGeoIndex()].EA_APUT_ViewNSubmitApproval == 1) {
                    grid = pager.up('grid');
                    btn = grid.down('#btnSendQueuedBills');
                    if (records.length > 0) {
                        btn.show();
                        btn.setText('<div style = "font-weight: bold; color:white;" > Send Queued Bills (' + store.getTotalCount() + ')</div >');
                    } else {
                        btn.hide();
                    }
                }
                else {
                    grid = pager.up('grid');
                    btn = grid.down('#btnSendQueuedBills');
                    var aputBtn = grid.down('#btnSendSelectedBills');
                    btn.hide();
                    aputBtn.hide();
                }
                me.UpdateInfo(pager);
            }
        });
    },
    BeforeStoreLoad: function BeforeStoreLoad(store, operations, eOpts) {
        BillsSingCls.setCheckRecCount(0);
    },
    UpdateInfo: function UpdateInfo(me) {
        var displayItem = me.child('#displayItem'),
            store = me.store,
            pageData = me.getPageData(),
            count, msg;

        if (displayItem) {
            count = store.getCount();
            if (count === 0) {
                msg = me.emptyMsg;
            } else {
                msg = Ext.String.format(
                    me.displayMsg,
                    Ext.util.Format.number(pageData.fromRecord, '0,000'),
                    Ext.util.Format.number(count, '0,000'),
                    Ext.util.Format.number(pageData.total, '0,000,000')
                );
            }
            displayItem.setText(msg);
        }
    },
    GridViewReady: function GridViewReady(grid) {
        grid.getStore().load();
    },
    BillsReportCellClick: function BillsReportCellClick(me, td, cellIndex, record, tr, rowIndex) {

        var filter = this.getActiveFilterPanel(),
            tBar = me.up('App-View-Bills-Component-Report').down('App-View-Bills-TBar'),
            addToQueueButton = tBar.down('#btnAddToQueue'),
            win = '', pager = '', invoiceId = '', vCode = '', invRefNo,
            aputBtn = tBar.down('#btnSendSelectedBills');
        if (filter == null) {
            filter = this.getAllFilterPanel()[0];
        }
        if (cellIndex > 0) {
            var colName = '';
            if (cellIndex == 16 || cellIndex == 5) { cellIndex = cellIndex + 1 }
            if (PgAtt.getInvoice_status() == 'Archived' && (me.grid.columns[cellIndex - 1].itemId != 'undefined'
                && (me.grid.columns[cellIndex - 1].itemId == 'colScanDest' || me.grid.columns[cellIndex - 1].itemId == 'colBatchId' || me.grid.columns[cellIndex].itemId == 'colBatchId'))) {
                cellIndex = cellIndex + 1;
            }
            colName = me.grid.columns[cellIndex - 1].itemId != undefined ? me.grid.columns[cellIndex - 1].itemId : me.grid.columns[cellIndex].itemId;
            var colValue = Ext.util.Format.trim(td.innerText);

            if (colName != '' && ['colBatchId', 'colBatchIdFil', 'colModifiedBy', 'colDocumentImage', 'colBillID', 'colPaidStatus'].indexOf(colName) >= 0) {

                if (colName == 'colBatchId' && PgAtt.getInvoice_status() != 'Archived') {
                    win = Ext.widget('App-View-Bills-PopUps-BatchDetails-ReportW');
                    win.rowDetails = record;
                    win.show();
                }
                if (colName == 'colBillID') {
                    if (!Ext.isEmpty(record.get('invoice_id'))) {
                        invoiceId = record.get('invoice_id');
                        vCode = record.get('vendor_code');
                        invRefNo = record.get('InvRefNo');
                        var vNameEng = record.get('vendor_name_english'), invStatus = record.get('invoice_status');
                        var params = {
                            Invoice_Id: invoiceId
                        };
                        win = Ext.widget('App-View-Bills-PopUps-BillReference-Window');

                        win.down('#billRefId').setText('Bill. Ref Number - ' + invRefNo);
                        win.down('#VendorCode').setText('Vendor Code: - ' + vCode);
                        win.down('#VendorName').setText('Vendor Name: - ' + vNameEng);
                        win.down('#billStatus').setText('Bill Status: - ' + invStatus);
                        var store = win.down('App-View-Bills-PopUps-BillReference-Grid').getStore();
                        store.getProxy().extraParams = params;
                        store.load();
                        win.show();
                    }
                }
                if (colName == 'colBatchIdFil') {
                    colValue = record.get('batch_id');
                    if (colValue != '') {
                        if (colValue != PgAtt.getInvBatchID()) {
                            PgAtt.setInvBatchID(colValue);
                            filter.down('#filBatchId textfield').setValue(colValue)
                            filter.down('#filBatchId textfield').getTrigger('clear').show();

                        }
                        else {
                            PgAtt.setInvBatchID('');
                            filter.down('#filBatchId textfield').setValue('')
                        }

                    }
                }

                if (colName == 'colModifiedBy') {
                    if (colValue != PgAtt.getModifiedBy()) {
                        PgAtt.setModifiedBy(colValue);
                        filter.down('#filModifiedBy textfield').setValue(colValue)
                        filter.down('#filModifiedBy textfield').getTrigger('clear').show();
                    }
                    else {
                        PgAtt.setModifiedBy('');
                        filter.down('#filModifiedBy textfield').setValue('')
                    }
                }

                if (colName != 'colBatchId' && colName != 'colDocumentImage' && colName != 'colPaidStatus') {
                    filter.showHideFilter();
                    pager = me.grid.down('[xtype="pagingtoolbar"]');
                    me.grid.getStore().getProxy().extraParams = filter.GetParameters();
                    // load new data
                    if (pager) pager.moveFirst(); else me.grid.getStore().load();

                }
                if (colName == 'colDocumentImage') {
                    var rec = me.grid.getStore().getAt(rowIndex);
                    win = Ext.widget('App-View-Bills-PopUps-ScannedImage-DocViewer');
                    win.rec = rec;
                    win.recImg = BillsSingCls.GetImage(rec);
                    win.type = 'Image';
                    win.show();
                }
                if (colName == 'colPaidStatus') {
                    if (!Ext.isEmpty(record.get('invoice_id')) && record.get('Paid') > 0) {
                        invoiceId = record.get('invoice_id')
                        vCode = record.get('vendor_code');
                        invRefNo = record.get('InvRefNo');
                        filter.down('#filInvoiceId textfield').setValue(invoiceId);
                        filter.down('#filVendorCode textfield').setValue(vCode);
                        filter.down('#filInvoiceRefNo textfield').setValue(invRefNo);
                        filter.down('#filPaidStatus textfield').setValue('Paid');
                        var activeTab = me.up('tabpanel');
                        activeTab.setActiveTab(9);
                    }
                }
            }
        }
        else {
            if (me.up('App-View-Bills-Component-Report').xtype === "App-View-Bills-Scanned-Report") {
                if (me.grid.getSelection().length > 0)
                    addToQueueButton.show();
                else
                    addToQueueButton.hide();
            }
            if (BillsSingCls.getOnAputFlag() == 'Y') {
                if (PgAtt.getInvoice_status() == 'Queued' && BIACore.Security.User.permissions[PgAtt.getGeoIndex()].EA_APUT_ViewNSubmitApproval == 1) {
                    if (me.grid.getSelectionModel().getCount() > 0) {
                        aputBtn.show();
                    } else {
                        aputBtn.hide();
                    }
                }
            }

        }
    },
    BillsCellMouseUp: function BillsCellMouseUp(me, record, item, index, e, eOpts) {
        if (!Ext.isEmpty(record.get('invoice_id'))) {
            var invId = record.get('invoice_id').toString();
            if (BillsSingCls.getGridRecords().indexOf(invId) >= -1) {
                var rows = item.children[0].children[0];
                Ext.Array.each(rows.children, function (value) {
                    if (value.innerText.toString().trim() === invId) {
                        var invoiceId = record.get('invoice_id'), vCode = record.get('vendor_code'), vNameEng = record.get('vendor_name_english'), invStatus = record.get('invoice_status'), invRefNo = record.get('InvRefNo');
                        BillsSingCls.GetInvoiceStatusDetails(invoiceId, vCode, vNameEng, invStatus, invRefNo, value);
                    }
                });
            }
        }
    },
    ClearInvoice: function ClearInvoice(me, grid, rowIndex) {
        var filter = this.getActiveFilterPanel();
        if (filter == null) {
            filter = this.getAllFilterPanel()[0];
        }
        var rec = grid.getStore().getAt(rowIndex);
        if (rec.get("ROWNUMBER") != "") {
            Ext.Msg.confirm('Remove the Selected records', 'Are you sure you want to delete Invoice ID ' + rec.get("invoice_id") + '?<BR>  Invoice Reference Number: ' + rec.get('InvRefNo') + '\nfor Vendor: ' + rec.get('vendor_name_english'), function (button) {
                if (button === 'yes') {
                    grid.getStore().removeAt(rowIndex);
                    var params = {
                        Invoice_Id: rec.get("invoice_id"),
                        User_Id: BIACore.Security.User.permissions[PgAtt.getGeoIndex()].userId
                    };
                    BIA.Ajax.request({
                        url: 'api/WebAPIReport/ClearInvoice',
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
                    PgAtt.setFilterGoFlag(true);
                    filter.fireEvent('btnApply');
                }
            }, this);
        }


    },
    ActionColHandlerI: function ActionColHandlerI(me, grid, rowIndex, colIndex) {
        var rec = grid.getStore().getAt(rowIndex);
        var tabPanel = me.up('#tabPanelId');
        me.up('App-View-Viewport').down('#filInvoiceId textfield').setValue(rec.get('invoice_id'));
        PgAtt.setInvoice_id(rec.get('invoice_id'));
        IProcessingSCls.setInvoice_id(rec.get('invoice_id'));
        if (['Pending', 'Logged'].indexOf(PgAtt.getInvoice_status()) >= 0) {
            if (rec.get('ReferenceFilter') != 'ExcelUploadCBOL') {
                rec.set('pageType', 'Bills')
                IProcessingSCls.setPageType('Bills');
                IProcessingSCls.setRecDetails(rec);
                PgAtt.setInvRecFlag(true);
                PgAtt.setSearchTextApplied(false);
                tabPanel.down('#InvoiceProcessingId').setDisabled(false);
                tabPanel.setActiveTab(9);
            }
            else {
                IProcessingSCls.setRecDetails(rec);
                tabPanel.down('#appCbolSumId').setDisabled(false);
                tabPanel.setActiveTab(8);
                if (rec.get('ReferenceFilter') == 'ExcelUploadCBOL') {
                    var filter = this.getActiveFilterPanel();
                    if (filter == null) {
                        filter = this.getAllFilterPanel()[0];
                    }
                    filter.down('#filInvoiceId textfield').setValue(PgAtt.getInvoice_id());
                    filter.fireEvent('btnApply');


                }
            }

        }
    },
    ActionColHandlerIII: function ActionColHandlerIII(me, grid, rowIndex, colIndex) {
        var filter = this.getActiveFilterPanel();
        if (filter == null) {
            filter = this.getAllFilterPanel()[0];
        }
        var record = grid.getStore().getAt(rowIndex);
        var msg = '';
        var status = 'Scanned';
        if (me.items[2].icon == "images/warning.png") {
            if (record.get('ImageNumber') != "") {
                if (BillsSingCls.getByPassIM() == 'N') {
                    msg = 'Please delete invoice from image management system as well so processing station can rescan the document.';
                }
                else {
                    msg = 'Invoice will be sent back to Scanned status.';
                }
            }
            else {
                msg = 'Invoice will be sent back to Approved status.';
                status = 'Approved';
            }
            Ext.MessageBox.show({
                msg: msg,
                buttons: Ext.MessageBox.OKCANCEL,
                icon: Ext.MessageBox.WARNING,
                fn: function (btn) {
                    if (btn == 'ok') {
                        me.fireEvent('actionColBillsIcons', record, msg, status);
                        PgAtt.setFilterGoFlag(true);
                        filter.fireEvent('btnApply');
                    } else {
                        return;
                    }
                }
            });
        }
    },
    onTabChange: function onTabChange(tabPanel, tab) {
        var tokenDelimiter = ':';
        var tabs = [],
            ownerCt = tabPanel.ownerCt,
            oldToken, newToken;

        tabs.push(tab.id);
        tabs.push(tabPanel.id);

        while (ownerCt && ownerCt.is('tabpanel')) {
            tabs.push(ownerCt.id);
            ownerCt = ownerCt.ownerCt;
        }

        newToken = tabs.reverse().join(tokenDelimiter);

        oldToken = Ext.History.getToken();

        if (oldToken === null || oldToken.search(newToken) === -1) {
            Ext.History.add(newToken);
        }
    },
    BillPaymentDtlsTabActivate: function BillPaymentDtlsTabActivate(tab) {
        var filter = this.getActiveFilterPanel();
        if (filter == null) {
            filter = this.getAllFilterPanel()[0];
        }
        if ((filter.down('#filInvoiceRefNo textfield').getValue() == '' || filter.down('#filInvoiceRefNo textfield').getValue() == null) && (filter.down('#filVendorCode textfield').getValue() == '' || filter.down('#filVendorCode textfield').getValue() == null)) {
            filter.down('#filInvoiceStatus textfield').setValue('All');
        }
        var extraParams = {};
        filter.down('#msgWarning').hide();
        var pageName = "Payment Details";
        if (localStorage) { localStorage.setItem('pageName', 'Payment Details'); }

        filter.showHideFilter();

        var grid = tab.down('App-View-Bills-PaymentDetails-Grid');
        var store = grid.getStore();
        Ext.Object.merge(extraParams, filter.GetParameters());
        store.getProxy().extraParams = extraParams;
        PgAtt.getGridCustomMsg(pageName);

        //Re-load the grid.
        if (grid) {
            PgAtt.getGridCustomMsg("Payment Details");
            store = grid.getStore();
            if (store) {
                var pager = grid.down('[xtype="pagingtoolbar"]');
                store.getProxy().extraParams = filter.GetParameters();
                //Re-load the grid.
                if (PgAtt.getMsgEmptyDataFlag()) {
                    if (pager) pager.moveFirst(); else store.load();
                } else {
                    store = null;
                    var view = grid.getView();
                    view.getStore().clearFilter(true);
                    view.getStore().removeAll(true);
                    view.emptyText = '<div class="x-grid-empty">' + PgAtt.getMsgEmptyDataCustom() + '</div>';
                    view.refresh();
                }
            }
        }
    }
});