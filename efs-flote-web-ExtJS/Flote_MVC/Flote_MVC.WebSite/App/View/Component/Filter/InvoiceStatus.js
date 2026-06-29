/* ====================================================================================================
NAME:			[Invoice Status Filter]
BEHAVIOR:		Shows Invoice Status Filter.
_______________________________________________________________________________________________________
REVISION HISTORY
-------------------------------------------------------------------------------------------------------
Date			    Modified By			  Modifications
-------------------------------------------------------------------------------------------------------
07/26/2016        Sudhir Dandale		 Created.
 ======================================================================================================*/
Ext.define('App.View.Component.Filter.InvoiceStatus', {
    extend: 'BIA.container.FilterContainer',
    alias: 'widget.App-View-Component-Filter-InvoiceStatus',
    layout: 'column',
    width: 210,
    items: [
         { xtype: 'label', text: 'Invoice Status:', baseCls: 'UPS_White', width: '48%' },
        {
            xtype: 'textfield',
            itemId: 'InvoiceStatus',
            emptyText: 'Invoice Status',
            allowBlank: false,
            //readOnly: true,
            hideLabel: true,
            hideTrigger: true,
            typeAhead: false,
            width: '48%',
            inputWidth: 100
        }
    ],
    GetFilterDisplay: function () {
        var value = this.down('#InvoiceStatus').getRawValue();
        // forceSelection: true makes this a bit retarded.
        return (value) ? 'Invoice Status: ' + value : '';
    }
});