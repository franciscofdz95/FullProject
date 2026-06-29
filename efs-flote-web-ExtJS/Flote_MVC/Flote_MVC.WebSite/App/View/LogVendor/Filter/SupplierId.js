/* ====================================================================================================
NAME:			[LV Supplier Id]
BEHAVIOR:		Shows LV Supplier Id Filter.
_______________________________________________________________________________________________________
REVISION HISTORY
-------------------------------------------------------------------------------------------------------
Date			    Modified By			  Modifications
-------------------------------------------------------------------------------------------------------
07/26/2016        Sudhir Dandale		 Created.
 ======================================================================================================*/
Ext.define('App.View.LogVendor.Filter.SupplierId', {
    extend: 'BIA.container.FilterContainer',
    alias: 'widget.App-View-LogVendor-Filter-SupplierId',
    layout: 'vbox',
    items: [
         { xtype: 'label', text: 'Supplier Id Site Code:', baseCls: 'UPS_Black' },
        {
            xtype: 'textfield',            
            emptyText: '',
            width: 150,
            autoLoad: false,
            // made it readonly field
            editable: false,
            value: '',
            readOnly: true
            // made it readonly field
        }
    ]
});

