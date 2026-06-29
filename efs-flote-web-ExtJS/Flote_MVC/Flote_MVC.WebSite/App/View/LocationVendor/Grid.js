/* ====================================================================================================
NAME:			[Location Vendor Report Grid]
BEHAVIOR:		Shows Location Vendor Report Grid.
_______________________________________________________________________________________________________
REVISION HISTORY
-------------------------------------------------------------------------------------------------------
Date			    Modified By			  Modifications
-------------------------------------------------------------------------------------------------------
07/26/2016        Sudhir Dandale		 Created.
 ======================================================================================================*/
Ext.define('App.View.LocationVendor.Grid', {
    extend: 'App.View.Component.Grid.Base',
    alias: 'widget.App-View-LocationVendor-Grid',
    border: true,
    pageSize: 20,
    rowData: '',
    autoPageSize: false,
    addAPUT: false,
    store: {
        type: 'webapi',        
        api: {
            read: 'api/WebAPIReport/LocVendorsRpt'
        },
        sorters: [
            { property: 'vendor_code', direction: 'ASC' },
        { property: 'dateVal', direction: 'DESC' }
        ]
    },
    viewConfig: {
        enableTextSelection: true,
        deferEmptyText: false,
        emptyText: 'No Matches Found! Verify the selected filter criteria.'
    },
    tbar: [
         {
             xtype: 'App-View-Component-Common-TbarPanel', reportType: 'locationvendor', listeners: {
                 afterrender: function () {
                     this.down('label').setText('Location Vendor Summary');
                 }
             }
         }
    ],
    columnLines: true,
    columns: {
        defaults: { menuDisabled: false, align: 'left', border: 1,  sortable: true, autoColumnResize: true },
        cls: 'UBlue',
        items: [
        {
            text: 'Date', dataIndex: 'dateVal'
        },
        {
            text: 'Location', dataIndex: 'location_code'
        },
        {
            text: 'Vendor', itemId: 'colVendorCode', dataIndex: 'vendor_code',
            renderer: function (value, metaData, record) {
                return '<a><span style="color:#1D598E;cursor: pointer;" >' + value + '</span></a>'; // Make sure hand cursor activates on all clickable objects by  sriram
            }
        },
        {
            text: 'Shipment</BR>Count', dataIndex: 'ShipmentCount', align: 'right'
        },
        {
            text: 'Currency Code', dataIndex: 'currency_code'
        },
        {
            text: 'Total Sell Amt', align: 'right', dataIndex: 'TotalSellAmtLocal', renderer: Utility.Formatting.NumFormat_Thousands_2Decimals
        },
        {
            text: 'Total Buy Amt', align: 'right', dataIndex: 'TotalBuyAmtLocal', renderer: Utility.Formatting.NumFormat_Thousands_2Decimals
        },
        {
            text: 'Total Diff Amt', align: 'right', dataIndex: 'TotalDiffAmtLocal', renderer: Utility.Formatting.NumFormat_Thousands_2Decimals
        }
        ]

    }

});