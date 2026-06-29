/* ====================================================================================================
NAME:			[LV Vendor]
BEHAVIOR:		Shows LV Vendor Filter.
_______________________________________________________________________________________________________
REVISION HISTORY
-------------------------------------------------------------------------------------------------------
Date			    Modified By			  Modifications
-------------------------------------------------------------------------------------------------------
07/26/2016        Sudhir Dandale		 Created.
 ======================================================================================================*/
Ext.define('App.View.LogVendor.Filter.Vendor', {
    extend: 'BIA.container.FilterContainer',
    alias: 'widget.App-View-LogVendor-Filter-Vendor',
    layout: 'vbox',
    items: [
         { xtype: 'label', text: 'Vendor:', baseCls: 'UPS_Black' },

         {
             xtype: 'clearCombo',
             itemId: 'vendorID',
             matchFieldWidth: false,
             store: {
                 type: 'webapi',
                 api: {
                     read: 'api/WebAPIFilter/Vendor'
                 },
                 listeners: {
                     beforeload: function (store, operation, eOpts) {
                         var vendorLocation = Ext.ComponentQuery.query('#VendorLocationID')[0].getValue();
                         var vendor = Ext.ComponentQuery.query('#vendorID')[0].getValue();
                         var record = LogVendorSCls.getDataRecord();
                         if (record != null && record != "") {
                             store.getProxy().extraParams = {
                                 'loc_code': vendorLocation,
                                 'vendor': record.VendorValueField
                             };
                         } else {
                             store.getProxy().extraParams = {
                                 'loc_code': vendorLocation,
                                 'vendor': vendor
                             };
                         }
                     }
                 },
                 remoteFilter: false
             },
             valueField: 'VendorValueField',
             displayField: 'VendorValueField',
             triggerAction: 'query',
             typeAhead: false,
             hideLabel: true,
             allowBlank: false,
             hideTrigger: true,
             anchor: '100%',
             width: 180,
             minChars: 2,
             listConfig: {
                 loadingText: 'Searching...',
                 emptyText: 'No matching posts found.',
                 // Custom rendering template for each item
                 getInnerTpl: function () {                     
                     return '<div>' + '{VendorLVB}' + '</div>';
                 }
             },
             triggers: {
                 clear: {
                     weight: 0,
                     cls: Ext.baseCSSPrefix + 'form-clear-trigger',
                     hidden: true,
                     handler: 'onClearClick',
                     scope: 'this'
                 }
             },
             onClearClick: function () {
                 var me = this;
                 var win = me.up('window')
                 win.down('#VendorHiddenId').setValue('');
                 me.reset();
                 me.getTrigger('clear').hide();
                 me.fireEvent('onclear', me, me.getValue());
                 me.updateLayout();
             },
             onChange: function (newValue, oldValue, eOpts) {
                 var me = this;
                 if (!Ext.isEmpty(newValue) && newValue.length > 0) {
                     me.getTrigger('clear').show();
                 } else {
                     me.getTrigger('clear').hide();
                 }
                 me.updateLayout();
             },
             listeners: {
                 beforerender: function (me) {
                     var win = me.up('window');
                     if (win && win.dataRecord && Ext.isObject(win.dataRecord) && win.dataRecord.Invoice_id > 0) {
                         me.setValue(win.dataRecord.VendorValueField);
                         me.store.getProxy().extraParams = { vendor: win.dataRecord.VendorValueField };
                         me.store.load();
                     }
                 },                 
                 'select': function (combo, records) {
                     var me = this;
                     var win = me.up('window');
                     win.down('#VendorHiddenId').setValue(records.data.VendorKeyField);
                     win.down('#SiteCodeCurr').setValue(records.data.SITE_CURRENCY_CODE);
                     if (records.data.VendorLVB.indexOf('[') === -1) {
                         win.down('#SupplierId').setValue(records.data.VendorLVB.split(' - ')[2] + ' - ' + records.data.VendorLVB.split(' - ')[3]);
                         win.down('#filSupplierIdLVB textfield').setValue(records.data.VendorLVB.split(' - ')[2] + ' - ' + records.data.VendorLVB.split(' - ')[3]);
                         //filSupplierIdLVB
                     }
                     else {
                         win.down('#SupplierId').setValue(records.data.VendorLVB.split(' - ')[3] + ' - ' + records.data.VendorLVB.split(' - ')[4]);
                         win.down('#filSupplierIdLVB textfield').setValue(records.data.VendorLVB.split(' - ')[3] + ' - ' + records.data.VendorLVB.split(' - ')[4]);
                     }
                   
                 }
             }
         }

    ]
});