/* ====================================================================================================
NAME:			[LV Check Date]
BEHAVIOR:		Shows Log Vendor Bill Check Date Filter.
_______________________________________________________________________________________________________
REVISION HISTORY
-------------------------------------------------------------------------------------------------------
Date			    Modified By			  Modifications
-------------------------------------------------------------------------------------------------------
08/26/2016          Sheetal Karre		 Created.
 ======================================================================================================*/
Ext.define('App.View.LogVendor.Filter.CheckDate', {
    extend: 'BIA.container.FilterContainer',
    alias: 'widget.App-View-LogVendor-Filter-CheckDate',
    layout: 'vbox',
    items: [
        { xtype: 'label', text: 'Check Date (mm/dd/yyyy):', baseCls: 'UPS_Black' },
        {
            xtype: 'datefield',
            anchor: '100%',
            name: 'CheckDate',         
            maxValue: new Date(),
            allowBlank: false,
            forceSelection: true
        }
    ]
});