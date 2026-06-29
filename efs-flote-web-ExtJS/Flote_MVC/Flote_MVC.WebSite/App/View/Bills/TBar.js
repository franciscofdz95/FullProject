/* ====================================================================================================
NAME:			[Bill Reports TBar Fields]
BEHAVIOR:		Shows Bill Reports Tbar Info.
_______________________________________________________________________________________________________
REVISION HISTORY
-------------------------------------------------------------------------------------------------------
Date			    Modified By			  Modifications
-------------------------------------------------------------------------------------------------------
10/13/2016        Sudhir Dandale		 Created.
 ======================================================================================================*/
Ext.define('App.View.Bills.TBar', {
    extend: 'Ext.FormPanel',
    alias: 'widget.App-View-Bills-TBar',
    width: '100%',
    bodyStyle: 'background:#DFE8F6',
    layout: 'hbox',
    items: [
        { xtype: 'label', itemId: 'lblTitle', margin: '0 10 0 5', style: 'font-weight: bold', text: 'Bill Summary:' },
        { xtype: 'button', hidden: true, margin: '0 5 0 5', itemId: 'btnRejectBills', cls: 'uButton', text: '<div style="font-weight: bold; color:white;">Reject</div>' },
        { xtype: 'button', hidden: true, margin: '0 5 0 5', itemId: 'btnResendBills', cls: 'uButton', text: '<div style="font-weight: bold; color:white;">Resend</div>' },
        { xtype: 'button', hidden: true, margin: '0 5 0 5', itemId: 'btnAddToQueue', cls: 'uButton', text: '<div style="font-weight: bold; color:white;">Add To Queue</div>' },
        { xtype: 'button', hidden: true, margin: '0 5 0 5', itemId: 'btnSendQueuedBills', cls: 'uButton', text: '<div style="font-weight: bold; color:white;">Send Queued Bills (0)</div>' },
        { xtype: 'button', hidden: true, margin: '0 5 0 5', itemId: 'btnSendSelectedBills', cls: 'uButton', text: '<div style="font-weight: bold; color:white;">Send To APUT</div>' },
        { xtype: 'button', hidden: true, margin: '0 5 0 5', itemId: 'btnRemoveFromQueue', cls: 'uButton', text: '<div style="font-weight: bold; color:white;">Remove from Queue</div>' },
        { xtype: 'tbfill', itemId: 'tbSep35' },
        { xtype: 'button', hidden: true, width: '100px', margin: '0 0 0 5', itemId: 'btnLogVendorBill', cls: 'uButton', text: '<div style="font-weight: bold; color:white;">Log Vendor Bill</div>' },
        { xtype: 'tbfill', itemId: 'tbSep30' },
        {
            xtype: 'label', width: '180px', itemId: 'incompleteApproveInvoicesId', margin: '0 0 0 5', style: 'color:red;font-weight:bold;align-left:10px; font-size:12px;text-decoration: underline;', text: '',
            autoEl: {
                tag: 'label',
                'data-qtip': 'Invoices are older than one week and are stuck in Approved or Printed status. Please ensure these get moved to Scanned status.',
                style: 'color:red;font-weight:bold;align-left:10px; font-size:12px;'
            }
        },
        { xtype: 'tbseparator', itemId: 'tbSep2', margin: '0 0 0 5', width: '2%' },
        { xtype: 'tbfill', itemId: 'tbSep2' },
        {
            xtype: 'button', itemId: 'btnExcelExportBillsId', icon: 'images/excel_button_16.png', margin: '0 5 0 5',
            listeners: {
                click: function () {
                    var me = this;
                    var grid = me.up('grid')
                    var colNames = '';
                    var dataIndexVal = '';
                    var array = [];
                    var apiUrl = grid.store.getProxy().api.read;
                    var params = grid.store.getProxy().extraParams;
                    Ext.each(grid.store.sorters.items, function (item) { array.push(item.getState()) });
                    if (grid) {
                        for (var i = 0; i < grid.columns.length; i++) {
                            if (!grid.columns[i].hidden && grid.columns[i].text !== "" && grid.columns[i].dataIndex !== null) {
                                colNames = colNames + grid.columns[i].text;
                                dataIndexVal = dataIndexVal + grid.columns[i].dataIndex;
                                if (grid.columns.length - 1 > i && grid.columns.length > 1) {
                                    colNames = colNames + ",";
                                    dataIndexVal = dataIndexVal + ",";
                                }
                            }
                        }
                    }
                    me.fireEvent('btnExcelExport', "Bills", colNames, dataIndexVal, array, '', apiUrl, params);
                }
            }
        }

    ]

});