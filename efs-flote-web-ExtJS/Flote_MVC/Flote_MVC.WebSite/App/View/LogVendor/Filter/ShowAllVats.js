/* ====================================================================================================
NAME:			[Log Vendor Bill Show All Vats checkbox]
BEHAVIOR:		Shows Log Vendor Bill Show All Vats checkbox.
_______________________________________________________________________________________________________
REVISION HISTORY
-------------------------------------------------------------------------------------------------------
Date			    Modified By			  Modificationsf t
-------------------------------------------------------------------------------------------------------
07/26/2016        Sudhir Dandale		 Created.
 ======================================================================================================*/

Ext.define('App.View.LogVendor.Filter.ShowAllVats', {
    extend: 'BIA.container.FilterContainer',
    alias: 'widget.App-View-LogVendor-Filter-ShowAllVats',
    layout: 'vbox',
    items: [

        {
            xtype: 'checkbox',
            boxLabel: 'Show All Vat Codes',
            baseCls: 'UPS_BlackRight',
            onChange: function (newValue, oldValue, eOpts) {
                var me = this;
                var win = this.up('window');
                var grid = win.down('grid'),
                    store = grid.getStore();
                // set the parameters on the proxy                                              
                store.getProxy().extraParams.LocCode = win.down('#filVendorLoctionLVB clearCombo').getValue();
                store.getProxy().extraParams.InvoiceId = LogVendorSCls.getInvoiceId();
                // load new data
                store.load();
                me.updateLayout();
            }
        }
    ]
});