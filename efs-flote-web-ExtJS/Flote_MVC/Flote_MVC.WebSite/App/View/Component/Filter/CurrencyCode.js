/* ====================================================================================================
NAME:			[Currency Code Filter]
BEHAVIOR:		Shows Currency Code Filter.
_______________________________________________________________________________________________________
REVISION HISTORY
-------------------------------------------------------------------------------------------------------
Date			    Modified By			  Modifications
-------------------------------------------------------------------------------------------------------
07/26/2016        Sudhir Dandale		 Created.
 ======================================================================================================*/
Ext.define('App.View.Component.Filter.CurrencyCode', {
    extend: 'BIA.container.FilterContainer',
    alias: 'widget.App-View-Component-Filter-CurrencyCode',
    layout: 'column',
    width: 210,
    items: [
         { xtype: 'label', text: 'Currency Code:', baseCls: 'UPS_White' },
        {
            xtype: 'clearCombo',
            itemId: 'CurrencyCode',
            emptyText: 'Currency Code',
            width: '48%',
            store: {
                type: 'webapi',
                api: {
                    read: 'api/WebAPIFilter/DisplayCurrency'
                },
                remoteFilter: false
            },
            valueField: 'currency_code',
            value: 'USD',
            displayField: 'currency_code',
            triggerAction: 'all',
            editable: false

        }
    ],
    GetFilterDisplay: function () {
        var value = this.down('#currency_Code').getRawValue();
        return (value) ? 'Currency Code: ' + value : '';
    }
});