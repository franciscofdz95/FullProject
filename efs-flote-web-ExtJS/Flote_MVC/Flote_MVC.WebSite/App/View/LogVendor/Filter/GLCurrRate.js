/* ====================================================================================================
NAME:			[LV GL Currency Rate]
BEHAVIOR:		Shows LV GL Currency Rate Filter.
_______________________________________________________________________________________________________
REVISION HISTORY
-------------------------------------------------------------------------------------------------------
Date			    Modified By			  Modifications
-------------------------------------------------------------------------------------------------------
08/26/2016          Sheetal Karre		 Created.
 ======================================================================================================*/
Ext.define('App.View.LogVendor.Filter.GLCurrRate', {
    extend: 'BIA.container.FilterContainer',
    alias: 'widget.App-View-LogVendor-Filter-GLCurrRate',
    layout: 'vbox',
    items: [
            { xtype: 'label', text: '', baseCls: 'UPS_Black' },
            {
                xtype: 'textfield',
                emptyText: '0',
                width: 150,
                inputWidth: 150,
                minChars: 3
            }
    ]
});