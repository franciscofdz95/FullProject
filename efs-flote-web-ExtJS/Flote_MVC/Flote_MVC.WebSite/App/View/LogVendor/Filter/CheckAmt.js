/* ====================================================================================================
NAME:			[LV Check Amt]
BEHAVIOR:		Shows LV Check Amt Filter.
_______________________________________________________________________________________________________
REVISION HISTORY
-------------------------------------------------------------------------------------------------------
Date			    Modified By			  Modifications
-------------------------------------------------------------------------------------------------------
08/26/2016          Sheetal Karre		 Created.
 ======================================================================================================*/
Ext.define('App.View.LogVendor.Filter.CheckAmt', {
    extend: 'BIA.container.FilterContainer',
    alias: 'widget.App-View-LogVendor-Filter-CheckAmt',
    layout: 'vbox',
    items: [
            { xtype: 'label', text: 'Check Amt:', baseCls: 'UPS_Black' },
            {
                xtype: 'textfield',
                emptyText: '0',
                width: 150,
                inputWidth: 150,
                minChars: 3
            }
    ]
});