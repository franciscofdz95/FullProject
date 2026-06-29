/* ====================================================================================================
NAME:			[LV Inv Type]
BEHAVIOR:		Shows LV Inv Type Filter.
_______________________________________________________________________________________________________
REVISION HISTORY
-------------------------------------------------------------------------------------------------------
Date			    Modified By			  Modifications
-------------------------------------------------------------------------------------------------------
08/26/2016          Sheetal Karre		 Created.
 ======================================================================================================*/
Ext.define('App.View.LogVendor.Filter.InvoiceType', {
    extend: 'BIA.container.FilterContainer',
    alias: 'widget.App-View-LogVendor-Filter-InvoiceType',
    layout: 'vbox',
    items: [
         { xtype: 'label', text: 'Invoice Type:', baseCls: 'UPS_Black' },
        {
            xtype: 'clearCombo',
            itemId: 'InvoiceTypeName',
            emptyText: 'Select',
            width: 150,
            store: new Ext.data.SimpleStore({
                data: [
                    [0, 'Select'],
                    [21, '21-Electronic Invoice'],
                    [25, '25-Cash Register'],
                    [29, '29-Receipt']
                ],
                fields: ['value', 'text']
            }),
            valueField: 'value',
            value: 0,
            displayField: 'text',
            triggerAction: 'all',
            editable: false
        }
    ],
    GetFilterDisplay: function () {
        var value = this.down('#InvoiceTypeName').getRawValue();
        return (value) ? 'InvoiceTypeName: ' + value : '';
    }
});