/* ====================================================================================================
NAME:			[LV Check No]
BEHAVIOR:		Shows LV Check No Filter.
_______________________________________________________________________________________________________
REVISION HISTORY
-------------------------------------------------------------------------------------------------------
Date			    Modified By			  Modifications
-------------------------------------------------------------------------------------------------------
07/26/2016        Sudhir Dandale		 Created.
 ======================================================================================================*/
Ext.define('App.View.LogVendor.Filter.CheckNo', {
    extend: 'BIA.container.FilterContainer',
    alias: 'widget.App-View-LogVendor-Filter-CheckNo',
    layout: 'vbox',
    items: [
            { xtype: 'label', text: 'Check Number:', baseCls: 'UPS_Black' },
            {
                xtype: 'textfield',
                emptyText: 'Check Number',
                width: 150,
                inputWidth: 150,
                minChars: 3
            }
    ]
});