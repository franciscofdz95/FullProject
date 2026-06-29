/* ====================================================================================================
NAME:			[LV Invoice Date]
BEHAVIOR:		Shows LV Invoice Date Filter.
_______________________________________________________________________________________________________
REVISION HISTORY
-------------------------------------------------------------------------------------------------------
Date			    Modified By			  Modifications
-------------------------------------------------------------------------------------------------------
07/26/2016        Sudhir Dandale		 Created.
 ======================================================================================================*/
Ext.define('App.View.LogVendor.FormField.BillDate', {
    extend: 'BIA.container.FilterContainer',
    alias: 'widget.App-View-LogVendor-Filter-BillDate',
    layout: 'vbox',
    items: [
        { xtype: 'label', text: 'Bill Date (mm/dd/yyyy):', baseCls: 'UPS_Black' },
        {
            xtype: 'datefield',
            anchor: '100%',
            name: 'InvoiceDate',           
            maxValue: new Date(),
            allowBlank: false,            
            forceSelection: true,
            enableKeyEvents: true,  // Kaizen #14118  Sriram
            listeners: {
                'select': {
                    fn: function (field, date) {                        
                        var win = this.up('window');                      
                        LogVendorSCls.check_main_date(field, 'during_form_population');
                        LogVendorSCls.getAccName(field,win,false);
                    }
                },
                'blur': {
                    fn: function (field, date) {
                        var win = this.up('window');
                        LogVendorSCls.check_main_date(field, 'during_form_population');
                        LogVendorSCls.getAccName(field, win, false);
                    }
                }
            } // Kaizen #14118  Sriram
        }
    ]
});