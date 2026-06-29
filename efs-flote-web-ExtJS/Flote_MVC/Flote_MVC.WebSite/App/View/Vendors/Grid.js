/* ====================================================================================================
NAME:			[Vendor List Report Grid]
BEHAVIOR:		Shows Vendor List Report Grid.
_______________________________________________________________________________________________________
REVISION HISTORY
-------------------------------------------------------------------------------------------------------
Date			    Modified By			  Modifications
-------------------------------------------------------------------------------------------------------
07/26/2016        Sudhir Dandale		 Created.
 ======================================================================================================*/
Ext.define('App.View.Vendors.Grid', {
    extend: 'App.View.Component.Grid.Base',
    alias: 'widget.App-View-Vendors-Grid',    
    autoScroll: true,
    viewConfig: {
        enableTextSelection: true,
        deferEmptyText: false,
        emptyText: 'No Matches Found! Verify the selected filter criteria.'
    },
    store: {
        type: 'webapi',
        pageSize: 25,
        api: {
            read: 'api/WebAPIReport/VendorsRpt'
        }
    },
    selType: 'cellmodel',
    plugins: [
        Ext.create('Ext.grid.plugin.CellEditing', {
            clicksToEdit: 1
        })
    ],
    tbar: [
         {
             xtype: 'App-View-Component-Common-TbarPanel', reportType: 'vendorlist', listeners: {
                 afterrender: function () {
                     this.down('label').setText('Vendors Summary');
                 }
             }
         }
    ],
    columnName: '',
    columnLines: true,
    defaults: { menuDisabled: false, align: 'left', border: 1,  sortable: true, autoColumnResize: true },
    cls: 'UBlue',
    border: 1,
    columns: [
    {
        xtype: 'checkcolumn',
        header: 'Preferred',
        dataIndex: 'PreferredVendor',
        stopSelection: false,
        editor: 'checkbox-selection',
        type: 'bool'
    },
    {
        text: 'Vendor<BR>Code', dataIndex: 'Vendor_Code'
    },
    {
        text: 'AP<BR>Vendor<BR>ID', itemId: 'colApVendorId', dataIndex: 'AP_Vendor_id',
        renderer: VendorsSinCls.VendorsColumnRenderSort
    },
    {
        text: 'E2k<BR>Carrier<BR>Code', itemId: 'colE2kCarrCode', dataIndex: 'E2K_CARRIER_CODE',
        renderer: VendorsSinCls.VendorsColumnRenderSort
    },

    {
        text: 'Vendor<BR>Name', itemId: 'colVenEngName', dataIndex: 'Vendor_Name_English',
        renderer: VendorsSinCls.VendorsColumnRenderSort

    },
    {
        text: 'Vendor<BR>Legal<BR>Name', itemId: 'colVenLegName', dataIndex: 'VENDOR_LEGAL_NAME',
        renderer: VendorsSinCls.VendorsColumnRenderSort
    },
    {
        text: 'AP<BR>Remit<BR>ID', itemId: 'colRemitId', dataIndex: 'AP_Remit_id',
        renderer: VendorsSinCls.VendorsColumnRenderSort
    },
    {
        text: 'Site<br>Creation<br>Code', dataIndex: 'SITE_CURRENCY_CODE'
    },
    {
        text: 'Term Id', dataIndex: 'Terms_Id'
    },
    {
        text: 'Site<br>Creation<br>Date', dataIndex: 'SITE_CREATION_DATE'
    },
    {
        text: 'Pay<br>Group', dataIndex: 'Pay_Group'
    },
    {
        text: 'Site<br>Payment<br>Method', dataIndex: 'Site_Pay_Method'
    },
    {
        text: 'Default<br>Company<br>Code', dataIndex: 'DEFAULT_COMPANY_CODE'
    },
    {
        text: 'AP<BR>Company<BR>ID', dataIndex: 'AP_Company_id'
    },
    {
        text: 'Address', dataIndex: 'Vendor_Address_1'
    },
    {
        text: 'Vendor<BR>City', dataIndex: 'Vendor_City'
    },
    {
        text: 'Country', dataIndex: 'Vendor_Country'
    }
    ]

});