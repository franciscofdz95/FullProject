/* ====================================================================================================
NAME:			[LV VAT Point Date]
BEHAVIOR:		Shows LV VAT Point Date Filter.
_______________________________________________________________________________________________________
REVISION HISTORY
-------------------------------------------------------------------------------------------------------
Date			    Modified By			  Modifications
-------------------------------------------------------------------------------------------------------
07/26/2016        Sudhir Dandale		 Created.
 ======================================================================================================*/
Ext.define('App.View.LogVendor.Filter.VatPtDate', {
    extend: 'BIA.container.FilterContainer',
    alias: 'widget.App-View-LogVendor-Filter-VatPtDate',
    layout: 'vbox',
    items: [
        { xtype: 'label', text: 'Vat Point Date (mm/dd/yyyy):', baseCls: 'UPS_Black' },
        {
            xtype: 'datefield',
            anchor: '100%',           
            name: 'date',
            value: new Date()
        }
    ]
});