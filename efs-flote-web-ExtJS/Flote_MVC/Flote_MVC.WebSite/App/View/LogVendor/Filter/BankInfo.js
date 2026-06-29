/* ====================================================================================================
NAME:			[LV Bank Info]
BEHAVIOR:		Shows LV Bank Info Filter.
_______________________________________________________________________________________________________
REVISION HISTORY
-------------------------------------------------------------------------------------------------------
Date			    Modified By			  Modifications
-------------------------------------------------------------------------------------------------------
08/26/2016          Sheetal Karre		 Created.
 ======================================================================================================*/
Ext.define('App.View.LogVendor.Filter.BankInfo', {
    extend: 'BIA.container.FilterContainer',
    alias: 'widget.App-View-LogVendor-Filter-BankInfo',
    layout: 'vbox',
    items: [
            { xtype: 'label', text: 'Bank Info:', baseCls: 'UPS_Black' },
            {
                xtype: 'textfield',
                emptyText: '',
                width: 150,
                inputWidth: 150,
                minChars: 3
            }
    ]
});