/* ====================================================================================================
NAME:			[Bill Grid Report]
BEHAVIOR:		Shows Bill Report.
_______________________________________________________________________________________________________
REVISION HISTORY
-------------------------------------------------------------------------------------------------------
Date			    Modified By			  Modifications
-------------------------------------------------------------------------------------------------------
07/26/2016        Sudhir Dandale		 Created.
 ======================================================================================================*/
Ext.define('App.View.Bills.Grid', {
    extend: 'App.View.Component.Grid.Base',
    alias: 'widget.App-View-Bills-Grid',
    border: true,
    loadMask: true,
    headerclick: true,
    store: {
        type: 'webapi',
        pageSize: 20,
        api: {
            read: 'api/WebAPIReport/BillsReport'
        },
        sorters: [
            { property: 'invoice_id', direction: 'DESC' },
            { property: 'InvRefNo', direction: 'DESC' }
        ],
        autoLoad: false,
        noCache: true
    },
    viewConfig: {
        deferEmptyText: false,
        enableTextSelection: true,
        emptyText: 'No Matches Found! Verify the selected filter criteria.',
        forceFit: true,
        //getRowClass: function (record, rowIndex, rowParams, store) {
        //    if (['Approved', 'Printed'].indexOf(PgAtt.getInvoice_status()) >= 0) { return 'rowIncompleteInvoices'; }
        //}  //	Change grid background color on Approved tab to match other tabs
    },
    tbar: [
        { xtype: 'App-View-Bills-TBar', width: '100%', itemId: 'BillsTBar' }
    ],
    columnLines: true,
    autoPageSize: false,
    columns: {
        defaults: { menuDisabled: false, align: 'left', border: 1, sortable: true, autoSizeColumn: true },
        cls: 'UBlue',
        items: [
            { text: 'ROWID', dataIndex: 'ROWNUMBER', baseCls: 'UPS_Blue_2', hidden: true },
            {
                xtype: 'actioncolumn', width: '5%', text: '', itemId: 'actionColBillsIcons', sortable: false, tdCls: 'x-grid-cell-Other',
                renderer: function (value, metaData, record, row, col, store, gridView) {
                    var me = this;
                    return BillsSingCls.billActionColRendered(me, value, metaData, record, row, col, store, gridView);
                },
                items: [{
                    icon: '',
                    itemId: 'billsActionColIconI',
                    tooltip: 'begin Invoice Processing',
                    handler: function (grid, rowIndex, colIndex) {
                        var me = this;
                        if (['Pending', 'Logged'].indexOf(PgAtt.getInvoice_status()) >= 0) {
                            me.fireEvent('billsActionColIconI', me, grid, rowIndex, colIndex);
                        }
                    }
                }, {
                    icon: 'images/search_add.png',
                    itemId: 'billsActionColIconII',
                    tooltip: 'search invoice by invoice ref number',
                    handler: function (grid, rowIndex, colIndex) {
                        var rec = grid.getStore().getAt(rowIndex);
                        if (BIACore.Security.User.permissions[PgAtt.getGeoIndex()].EA_APUT_RejectionScanned == 1 && ['Printed', 'Queued', 'Sent'].indexOf(PgAtt.getInvoice_status()) >= 0 && rec.get("ImageNumber") == "" && (BillsSingCls.getByPassIM() == undefined || BillsSingCls.getByPassIM() == 'N')) {
                            var win = Ext.widget('App-View-Bills-PopUps-ScannedImage-SearchW');
                            win.rowDetScan = rec;
                            win.show();
                        }
                    }
                }, {
                    icon: 'images/warning.png',
                    tooltip: 'Remove From Archived Status',
                    itemId: 'billsActionColIconIII',
                    handler: function (grid, rowIndex, colIndex) {
                        var me = this;
                        if (PgAtt.getInvoice_status() == 'Archived' && (BIACore.Security.User.permissions[PgAtt.getGeoIndex()].EA_APUT_ViewNSubmitApproval == 1 || BIACore.Security.User.permissions[PgAtt.getGeoIndex()].EA_APUT_Rejection == 1)) {
                            me.fireEvent('billsActionColIconIII', me, grid, rowIndex, colIndex);
                        }
                    }
                },
                {
                    icon: '',
                    tooltip: '<span style=color:blue;font-weight:bold;>' + 'Duplicate invoice image found in imaging' + '</span>'
                }
                ]
            },
            {
                xtype: 'actioncolumn', text: 'View', sortable: false, tdCls: 'x-grid-cell-Other',
                renderer: function (value, metaData, record) {
                    return '<span style="font-weight:bold; font-size:12px;"></span>';
                },
                items: [{
                    icon: 'images/go-24x24.png',  // Use a URL in the icon config
                    tooltip: 'Invoice details and Approve bill',
                    handler: function (grid, rowIndex, colIndex) {
                        var win = Ext.widget('App-View-Bills-Detail-Report');
                        win.rec = grid.getStore().getAt(rowIndex);
                        win.show();

                    }
                }]
            },
            {
                xtype: 'actioncolumn', itemId: 'actionColEditScan', text: 'Edit/<BR>Scan', sortable: false, tdCls: 'x-grid-cell-Other',
                renderer: function (value, metaData, record) {
                    var me = this;
                    return BillsSingCls.billEditScanColRender(me, record);
                },
                items: [{
                    icon: 'images/edit_icon.gif',  // Use a URL in the icon config
                    tooltip: 'Edit Invoice',
                    handler: function (grid, rowIndex, colIndex, record) {
                        var rec = grid.getStore().getAt(rowIndex);
                        LogVendorSCls.setSelectedRecord(rec);
                        LogVendorSCls.setInvoiceId(rec.get('invoice_id'));
                        var locCode = rec.get('location_code') == '' ? PgAtt.getLocation_code() : rec.get('location_code');
                        LogVendorSCls.GetTWHCodesByLoc(locCode);
                        var win = Ext.widget('App-View-LogVendor-LogVendorBill');
                        win.rec = rec;
                        win.show();
                    }
                }
                    , {
                    icon: 'images/table_16.png',
                    tooltip: 'Bill Coversheet',
                    itemId: 'colBillCoversheet',
                    handler: function (grid, rowIndex, colIndex, item, e, record, row) {
                        var rec = grid.getStore().getAt(rowIndex);
                        var win = Ext.widget('App-View-Bills-PopUps-CodingSheet-ReportW');
                        win.rec = rec;
                        win.grid = grid;
                        win.show();
                    }
                }, {
                    icon: 'images/scanned_16.png',
                    tooltip: 'View Scanned Invoice',
                    itemId: 'colScanDocument',
                    handler: function (grid, rowIndex, colIndex) {
                        var rec = grid.getStore().getAt(rowIndex);
                        var win = Ext.widget('App-View-Bills-PopUps-ScannedImage-DocViewer');
                        win.rec = rec;
                        win.recImg = BillsSingCls.GetImage(rec);
                        win.type = 'Image';
                        win.show();
                    }
                }
                ]
            },
            {
                xtype: 'actioncolumn', itemId: 'actionColDelete', hidden: true, text: 'Delete', sortable: false, tdCls: 'x-grid-cell-Other',
                renderer: function (value, metaData, record) {
                    return '<span style="font-weight:bold; font-size:12px;"></span>';
                },
                items: [{
                    icon: 'images/remove-24x24.gif',
                    tooltip: 'Delete',
                    handler: function (grid, rowIndex, colIndex) {
                        var me = this;
                        me.fireEvent('actionColDelete', me, grid, rowIndex);
                    }
                }]
            },
            {
                text: 'Bill ID', dataIndex: 'invoice_id', itemId: 'colBillID',
                renderer: function (value, metaData, record, row, col, store, gridView) {
                    var imgIcon = ' <img class="forceBillPopup" style="width: 14px; height: 16px; vertical-align: middle; cursor: pointer;" src="images/ellipsis.png"  />'; /*  Make sure hand cursor activates on all clickable objects     Sriram*/
                    BillsSingCls.getGridRecords().push(value.toString());
                    metaData.tdAttr = 'data-qtip="' + Ext.String.htmlEncode(value) + '"';
                    return value + imgIcon;
                }
            },
            { text: 'Bill. Ref <BR> Number', dataIndex: 'InvRefNo' },
            { text: 'Charge<BR>Count', dataIndex: 'detail_cnt' },
            { text: 'Remit<BR>ID', dataIndex: 'AP_Remit_id' },
            { text: 'Loc<BR>Code', dataIndex: 'Location_Code' },
            { text: 'Assigned Folder', dataIndex: 'ScanFolder' },
            { text: 'Vendor<BR>Number', dataIndex: 'AP_Vendor_id' },
            {
                text: 'Vendor / (Legal)<BR>Name', dataIndex: 'vendor_name_english', width: 200,
                renderer: function (value, metaData, record, row, col, store, gridView) {
                    value = Ext.String.htmlEncode(value);
                    metaData.tdAttr = 'data-qtip="' + Ext.String.htmlEncode(value) + '"';
                    return value;
                }
            },
            { text: 'Scan Dest', dataIndex: 'Scandest_Mod', itemId: 'colScanDest' },
            {
                text: 'Document<BR>Image ID', dataIndex: 'ImageNumber', itemId: 'colDocumentImage',
                renderer: function (value, metaData, record, row, col, store, gridView) {
                    if (value != '' && value != 'NULL') { metaData.style = "text-decoration: underline;cursor: pointer"; }
                    else { value = ''; }
                    return '<a><span style="color:#1D598E;" >' + value + '</span></a>';
                }
            },



            { text: 'Modified Date<BR> EST(mm/dd/yy hh:mm)', dataIndex: 'ModifiedDT', renderer: BIA.util.Format.dateRenderer('m/d/y h:m A') },
            { text: 'Modified<BR>UserId', dataIndex: 'ModifiedBy', border: 1, itemId: 'colModifiedBy', renderer: BillsSingCls.billColumnRenderSort },
            {
                text: '',
                columns: [
                    {
                        text: 'Batch Id', itemId: 'colBatchId', dataIndex: 'batch_id', hidden: true, cls: 'colColBlueBorderThin',
                        renderer: function (value, metaData, record, row, col, store, gridView) {
                            if (PgAtt.getInvoice_status() != 'Archived') {
                                metaData.style = "text-decoration: underline;cursor: pointer";
                            }
                            else {
                                if (value == 0) { value = ''; }
                            }
                            return value;
                        }

                    },
                    { text: '', itemId: 'colBatchIdFil', dataIndex: 'batch_id', hidden: true, sortable: false, cls: 'colColBlueBorderThin', renderer: BillsSingCls.billColumnRenderSort }
                ]
            },
            { text: 'Bill Total<BR>Amt (Local)', align: 'right', dataIndex: 'invoice_amt', renderer: Utility.Formatting.NumFormat_Thousands_2Decimals },
            { text: 'Bill<BR>Currency', dataIndex: 'Invoice_CID' },
            {
                text: 'Paid', dataIndex: 'Paid', itemId: 'colPaidStatus', renderer: function (value, metaData, record, row, col, store, gridView) {
                    value = Ext.String.htmlEncode(value);
                    if (value !== "" && value !== undefined && value !== 0) {
                        metaData.tdAttr = 'data-qtip="' + Ext.String.htmlEncode(value) + '"';
                        return '<img src="images/Check_16x16.png">';
                    }
                    else { return '' }

                }
            }
        ]
    }    

});

