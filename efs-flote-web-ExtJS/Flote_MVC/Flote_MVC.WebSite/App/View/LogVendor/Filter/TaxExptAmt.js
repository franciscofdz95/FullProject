/* ====================================================================================================
NAME:			[LV Tax Exampt Amt]
BEHAVIOR:		Shows LV Tax Exampt Amt Filter.
_______________________________________________________________________________________________________
REVISION HISTORY
-------------------------------------------------------------------------------------------------------
Date			    Modified By			  Modifications
-------------------------------------------------------------------------------------------------------
07/26/2016        Sudhir Dandale		 Created.
 ======================================================================================================*/
Ext.define('App.View.LogVendor.Filter.TaxExptAmt', {
    extend: 'BIA.container.FilterContainer',
    alias: 'widget.App-View-LogVendor-Filter-TaxExptAmt',
    layout: 'vbox',
    items: [
            { xtype: 'label', text: 'Tax Exempt Amt:', baseCls: 'UPS_Black' },
            {
                xtype: 'textfield',                
                value: 0,
                width: 150,
                inputWidth: 150,
                minChars: 3
            }
    ]
});