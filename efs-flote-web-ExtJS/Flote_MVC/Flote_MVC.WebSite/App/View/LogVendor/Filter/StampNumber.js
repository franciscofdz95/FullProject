/* ====================================================================================================
NAME:			[LV Stamp Number]
BEHAVIOR:		Shows LV Stamp Number Filter.
_______________________________________________________________________________________________________
REVISION HISTORY
-------------------------------------------------------------------------------------------------------
Date			    Modified By			  Modifications
-------------------------------------------------------------------------------------------------------
07/26/2016        Sudhir Dandale		 Created.
 ======================================================================================================*/
Ext.define('App.View.LogVendor.Filter.StampNumber', {
    extend: 'BIA.container.FilterContainer',
    alias: 'widget.App-View-LogVendor-Filter-StampNumber',
    layout: 'vbox',
    items: [
         { xtype: 'label', text: 'Stamp Number:', baseCls: 'UPS_Black' },
        {
            xtype: 'textfield',
            emptyText: 'Stamp Number',
            width: 150,
            inputWidth: 150,
            minChars: 3
        }
    ]   
});