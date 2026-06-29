/* ====================================================================================================
NAME:			[Display Currency Filter]
BEHAVIOR:		Shows Display Currency Filter.
_______________________________________________________________________________________________________
REVISION HISTORY
-------------------------------------------------------------------------------------------------------
Date			    Modified By			  Modifications
-------------------------------------------------------------------------------------------------------
07/26/2016        Sudhir Dandale		 Created.
 ======================================================================================================*/
Ext.define('App.View.Component.Filter.DisplayCurr', {
    extend: 'BIA.container.FilterContainer',
    alias: 'widget.App-View-Component-Filter-DisplayCurr',
    layout: 'column',
    width: 210,
    items: [
        { xtype: 'label', text: 'Display Currency:', baseCls: 'UPS_White', width: '48%' },
        {
            xtype: 'combobox',
            itemId: 'DisplayCurr',
            emptyText: 'Display Currency',
            width: '48%',
            mode: 'local',
            store: {
                type: 'webapi',
                api: {
                    read: 'api/WebAPIFilter/DisplayCurrency'
                },
                listeners: {
                    beforeload: function (store, operation, eOpts) {
                        var query = PgAtt.getLocation_code() + ',' + PgAtt.getCountry_code();
                        operation._params.query = query;
                    }
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
        var value = this.down('#DisplayCurr').getRawValue();
        return (value) ? 'DisplayCurr: ' + value : '';
    }
});