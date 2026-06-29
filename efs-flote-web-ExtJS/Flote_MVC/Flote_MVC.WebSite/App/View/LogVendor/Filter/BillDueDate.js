/* ====================================================================================================
NAME:			[LV Invoice Due Date]
BEHAVIOR:		Shows LV Invoice Due Date Filter.
_______________________________________________________________________________________________________
REVISION HISTORY
-------------------------------------------------------------------------------------------------------
Date			    Modified By			  Modifications
-------------------------------------------------------------------------------------------------------
07/26/2016        Sudhir Dandale		 Created.
 ======================================================================================================*/
Ext.define('App.View.LogVendor.Filter.BillDueDate', {
    extend: 'BIA.container.FilterContainer',
    alias: 'widget.App-View-LogVendor-Filter-BillDueDate',
    layout: 'vbox',
    items: [
        { xtype: 'label', text: 'Bill Due Date (mm/dd/yyyy):', baseCls: 'UPS_Black' },
        {
            xtype: 'datefield',
            anchor: '100%',
            allowBlank: false,
            forceSelection: true,            
            name: 'InvoiceDueDate',
            readOnly: true,
            editable: false
        }
    ]
});