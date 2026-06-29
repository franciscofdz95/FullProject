/* ====================================================================================================
NAME:			[Vendor Code Filter]
BEHAVIOR:		Shows Vendor Code Filter.
_______________________________________________________________________________________________________
REVISION HISTORY
-------------------------------------------------------------------------------------------------------
Date			    Modified By			  Modifications
-------------------------------------------------------------------------------------------------------
07/26/2016        Sudhir Dandale		 Created.
 ======================================================================================================*/
Ext.define('App.View.Component.Filter.VendorCode', {
    extend: 'BIA.container.FilterContainer',
    alias: 'widget.App-View-Component-Filter-VendorCode',
    layout: 'column',
    width: 210,
    items: [
         { xtype: 'label', text: 'Vendor:', baseCls: 'UPS_White', width: '48%' },
         {
             xtype: 'clearCombo',
             store: {
                 type: 'webapi',
                 api: {
                     read: 'api/WebAPIFilter/VendorCode'
                 },
                 remoteFilter: false
             },
             itemId: 'VendorCode',
             emptyText: 'Vendor Code',
             allowBlank: true,
             width: '48%',
             value: '',
             hideLabel: true,
             hideTrigger: true,
             typeAhead: false,
             minChars: 3,
             valueField: 'vendor_code',
             displayField: 'vendor_code',
             listConfig: {
                 loadingText: 'Searching...',
                 emptyText: 'No matching posts found.',
                 // Custom rendering template for each item
                 getInnerTpl: function () {
                     return '<div>' + '{vendor_code} - {vendor_name_english} - {ap_vendor_id} - {ap_remit_id} - {vendor_address_1}' + '</div>';
                 }
             }
         }

    ]
});