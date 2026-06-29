/* ====================================================================================================
NAME:			[LV Invoice Ref No]
BEHAVIOR:		Shows LV Invoice ref No Filter.
_______________________________________________________________________________________________________
REVISION HISTORY
-------------------------------------------------------------------------------------------------------
Date			    Modified By			  Modifications
-------------------------------------------------------------------------------------------------------
07/26/2016        Sudhir Dandale		 Created.
 ======================================================================================================*/
Ext.define('App.View.LogVendor.Filter.BillRefNo', {
    extend: 'BIA.container.FilterContainer',
    alias: 'widget.App-View-LogVendor-Filter-BillRefNo',
    layout: 'vbox',
    items: [
         { xtype: 'label', text: 'Vendor Invoice/ Bill Ref No:', baseCls: 'UPS_Black' },
        {
            xtype: 'textfield',
            fieldStyle: 'text-transform:uppercase',
            emptyText: 'Vendor Invoice/ Bill Ref No',
            width: 150,
            allowBlank: false,
            forceSelection: true,
            maskRe: /^[a-zA-Z0-9-_-|]*$/,
            inputWidth: 150
        }
    ]
});