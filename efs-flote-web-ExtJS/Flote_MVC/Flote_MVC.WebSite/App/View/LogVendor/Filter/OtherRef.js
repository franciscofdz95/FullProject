/* ====================================================================================================
NAME:			[LV Other Ref]
BEHAVIOR:		Shows LV Other Ref Filter.
_______________________________________________________________________________________________________
REVISION HISTORY
-------------------------------------------------------------------------------------------------------
Date			    Modified By			  Modifications
-------------------------------------------------------------------------------------------------------
07/26/2016        Sudhir Dandale		 Created.
 ======================================================================================================*/
Ext.define('App.View.LogVendor.Filter.OtherRef', {
    extend: 'BIA.container.FilterContainer',
    alias: 'widget.App-View-LogVendor-Filter-OtherRef',
    layout: 'vbox',    
    items: [
         { xtype: 'label', text: 'Other Reference/KID/RUC:', baseCls: 'UPS_Black' },
        {
            xtype: 'textfield',
            emptyText: 'Other Reference/KID/RUC',
            width: 150,
            inputWidth: 150,
            minChars: 3
        }
    ]
});