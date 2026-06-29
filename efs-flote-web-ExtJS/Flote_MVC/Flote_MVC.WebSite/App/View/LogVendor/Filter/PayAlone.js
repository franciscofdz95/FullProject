/* ====================================================================================================
NAME:			[LV Pay Alone]
BEHAVIOR:		Shows LV Pay Alone Filter.
_______________________________________________________________________________________________________
REVISION HISTORY
-------------------------------------------------------------------------------------------------------
Date			    Modified By			  Modifications
-------------------------------------------------------------------------------------------------------
08/26/2016          Sheetal Karre		 Created.
 ======================================================================================================*/
Ext.define('App.View.LogVendor.Filter.PayAlone', {
    extend: 'BIA.container.FilterContainer',
    alias: 'widget.App-View-LogVendor-Filter-PayAlone',
    layout: 'vbox',
    items: [
         { xtype: 'label', text: 'Pay Alone:', baseCls: 'UPS_Black' },
        {
            xtype: 'checkbox',
            itemId: 'PayAlone',
            boxLabel: ''
        }
    ]
});