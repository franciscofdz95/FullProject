/* ====================================================================================================
NAME:			[Payment Details Grid Report]
BEHAVIOR:		Shows Payment Detail Grid Report.
_______________________________________________________________________________________________________
REVISION HISTORY
-------------------------------------------------------------------------------------------------------
Date			    Modified By			  Modifications
-------------------------------------------------------------------------------------------------------
04/2/2021        Sudhir Dandale		 Created.
 ======================================================================================================*/
Ext.define('App.View.Bills.PaymentDetails.Grid', {
    extend: 'App.View.Component.Grid.Base',
    alias: 'widget.App-View-Bills-PaymentDetails-Grid',
    border: true,
    loadMask: true,
    headerclick: true,
    store: {
        type: 'webapi',
        pageSize: 20,
        api: {
            read: 'api/WebAPIReport/PaymentDetailsGridData'
        },
        sorters: [
            { property: 'InvRefNo', direction: 'ASC' },
            { property: 'Location_Code', direction: 'ASC' }
        ],
        autoLoad: false,
        noCache: true
    },
    viewConfig: {
        deferEmptyText: false,
        enableTextSelection: true,
        emptyText: 'No Matches Found! Verify the selected filter criteria.',
        forceFit: true,
    },
    tbar: [
        {
            xtype: 'App-View-Component-Common-TbarPanel', reportType: 'paymentdetails', listeners: {
                afterrender: function () {
                    this.down('label').setText('Payment Details');
                }
            }
        }
    ],
    bbar: [{ xtype: 'App-View-Bill-PaymentDetails-BBar', width: '100%' }],
    columnLines: true,
    autoPageSize: false,
    defaults: { menuDisabled: false, align: 'left', border: 1, sortable: true, autoColumnResize: true },
    cls: 'UBlue',
    columns: [
        { text: 'ROWID', dataIndex: 'ROWNUMBER', hidden: true },
        {
            text: '<Div style="color:white;">Location Code</Div>', dataIndex: 'Location_Code'
        },
        {
            text: '<Div style="color:white;">Bill. Ref</BR>Number</Div>', dataIndex: 'Invoice_Num'
        },
        {
            text: '<Div style="color:white;">Bill ID</Div>', dataIndex: 'Invoice_Id'
        },
        {
            text: '<Div style="color:white;">Invoice <BR> Status</Div>', dataIndex: 'Invoice_Status'
        },
        {
            text: '<Div style="color:white;">Supplier Number</Div>', dataIndex: 'Vendor_Num'
        },
        {
            text: '<Div style="color:white;">Supplier <BR> Name</Div>', dataIndex: 'Vendor_Name'
        },
        {
            text: '<Div style="color:white;">Supplier </BR>Site</Div>', dataIndex: 'Site_Code'
        },
        {
            text: '<Div style="color:white;">Document <BR>Image</BR> ID</Div>', dataIndex: 'Invoice_Image_Num'
        },
        {
            text: '<Div style="color:white;">Payment</BR> Status</Div>', dataIndex: 'Payment_Status'
        },
        {
            text: '<Div style="color:white;">Payment <BR>Date</Div>', dataIndex: 'Check_Date', renderer: BIA.util.Format.dateRenderer('m/d/Y')
        },
        {
            text: '<Div style="color:white;">Amount <BR>Paid</Div>', dataIndex: 'Payment_Amount',
            renderer: function (value, metaData, record, row, col, store, gridView) {
                return Utility.Formatting.NumFormat_Thousands_2Decimals(value, metaData);
            }
        },
        {
            text: '<Div style="color:white;">Payment <BR>Currency</Div>', dataIndex: 'Check_Currency_Code'
        },
        {
            text: '<Div style="color:white;">Payment <BR> Method</Div>', dataIndex: 'Payment_Method'
        },
        {
            text: '<Div style="color:white;">Document <BR>Number</Div>', dataIndex: 'Check_Num'

        },
        {
            text: '<Div style="color:white;">Scheduled <BR>Date</Div>', dataIndex: 'Payment_Due_Date', renderer: BIA.util.Format.dateRenderer('m/d/Y')
        }
    ]

});