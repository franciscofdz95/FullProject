/* ====================================================================================================
NAME:			[Paid Differently  Report Grid]
BEHAVIOR:		Shows Paid Differently  Report Grid.
_______________________________________________________________________________________________________
REVISION HISTORY
-------------------------------------------------------------------------------------------------------
Date			    Modified By			  Modifications
-------------------------------------------------------------------------------------------------------
02/06/2020           Rama Yagati 		 Created.
 ======================================================================================================*/
Ext.define('App.View.PaidDifferently.Grid', {
    extend: 'App.View.Component.Grid.Base',
    alias: 'widget.App-View-PaidDifferently-Grid',
    border: false,
    autoScroll: true,
    pageSize: 20,
    viewConfig: {
        enableTextSelection: true,
        deferEmptyText: false,
        emptyText: 'No Matches Found! Verify the selected filter criteria.'
    },
    store: {
        type: 'webapi',
        api: {
            read: 'api/WebAPIReport/PaidDifferently'
        },
        autoLoad: false
    },
    autoPageSize: false,
    selType: 'cellmodel',
    plugins: [
        Ext.create('Ext.grid.plugin.CellEditing', {
            clicksToEdit: 1
        })
    ],
    tbar: [
        {
            xtype: 'App-View-Component-Common-TbarPanel', reportType: 'PaidDifferently', listeners: {
                afterrender: function () {
                    this.down('label').setText('Paid Differently Summary');
                }
            }
        }
    ],
    columnName: '',
    columnLines: true,
    defaults: { menuDisabled: false, align: 'left', border: 1, sortable: true, autoColumnResize: true },
    cls: 'UBlue',
    //border: 1,
    columns: [
        {
            text: 'Loc<BR> Code', dataIndex: 'Location_Code'
        },
        {
            text: 'Loc<BR> Country', dataIndex: 'Loc_Country'
        },
        {
            text: 'Location<BR> Region', dataIndex: 'Loc_Region'
        },
        {
            text: 'EPA <BR>Origin ', dataIndex: 'EPA_LOC_Orig'
        },
        {
            text: 'EPA <BR>Destination ', dataIndex: 'EPA_LOC_Dest'
        },
        {
            text: 'Shipment <BR> Orig', dataIndex: 'Shipment_Orig'
        },
        {
            text: 'Shipment <BR> Dest', dataIndex: 'Shipment_dest'
        },
        {
            text: 'Service <BR>Level', dataIndex: 'Service_Level'
        },
        {
            text: 'Vendor Name', dataIndex: 'Vendor_name'
        },
        {
            text: 'Reason', dataIndex: 'Reason'
        },
        {
            text: 'Comment', dataIndex: 'Comment'
        },
        {
            text: 'Last Invoice<BR> Modified Date', dataIndex: 'Time_Frame', renderer: BIA.util.Format.dateRenderer('m/d/y h:m A')
        },
        {
            text: 'Logged <BR>User', dataIndex: 'Logged_User', hidden: true
        },
        {
            text: 'Verified <BR>User', dataIndex: 'Verified_User', hidden: true
        },
        {
            text: 'Approved <BR>User', dataIndex: 'Approved_User', hidden: true
        },
        {
            text: 'Shipment Number', dataIndex: 'shipment_Number'
        },
        {
            text: 'Invoice Number', dataIndex: 'Invoice_Number'
        },
        {
            text: 'Invoice Paid Date', dataIndex: 'Invoice_Paid_Date', renderer: BIA.util.Format.dateRenderer('m/d/Y')            
        },
        {
            text: 'Mode', dataIndex: 'mode'
        },
        {
            text: 'Masterbill', dataIndex: 'Masterbill'
        },
        {
            text: 'Charge Code', dataIndex: 'charge_code'
        },
        {
            text: 'CHARGE DESCRIPTION', dataIndex: 'CHARGE_DESCRIPTION'
        },
        {
            text: 'E2K <BR>Sell <BR>Local', dataIndex: 'Charge_amount_Local'
        },
        {
            text: 'E2k <BR>Sell <BR>Currency', dataIndex: 'Charge_Currency'
        },
        {
            text: 'E2K <BR>Buy <BR>Local', dataIndex: 'Original_Buy_Local'
        },
        {
            text: 'E2k <BR>Buy <BR>Currency', dataIndex: 'E2k_Buy_Currency'
        },
        {
            text: 'E2K <BR>Sell <BR>USD', dataIndex: 'Charge_amount_USD'
        },
        {
            text: 'E2K <BR>Buy <BR>USD', dataIndex: 'Original_Buy_USD'
        },
        {
            text: 'FLOTE <BR>Inv Amt <BR>USD', dataIndex: 'Bill_Amount'
        },
        {
            text: 'Paid <BR>Diff Amt <BR>USD', dataIndex: 'Difference'
        }
    ]

});