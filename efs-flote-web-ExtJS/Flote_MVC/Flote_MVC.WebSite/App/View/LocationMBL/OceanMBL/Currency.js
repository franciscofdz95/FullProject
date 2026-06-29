/* ====================================================================================================
NAME:			[Ocean MBL Currency]
BEHAVIOR:		Shows Ocean MBL Currency Filter.
_______________________________________________________________________________________________________
REVISION HISTORY
-------------------------------------------------------------------------------------------------------
Date			    Modified By			  Modifications
-------------------------------------------------------------------------------------------------------
06/26/2017        Sudhir Dandale		 Created.
 ======================================================================================================*/
Ext.define('App.View.LocationMBL.OceanMBL.Currency', {
    extend: 'BIA.container.FilterContainer',
    alias: 'widget.App-View-LocationMBL-OceanMBL-Currency',
    layout: 'column',
    //width: 210,
    items: [
        //{ xtype: 'label', text: 'Display Currency:', baseCls: 'UPS_White', width: '48%' },
        {
            xtype: 'combobox',
            itemId: 'oceanMBLCurr',
            emptyText: 'Display Currency',
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
            editable: false,
            onChange: function (newValue, oldValue, eOpts) {
                var me = this;
                me.updateLayout();
            },
            listeners: {
                afterrender: function (combo) {
                    PgAtt.getCurrencyCodes(PgAtt.getLocation_code(), combo);
                },
                'select': function (combo, records) {
                    var win = combo.up('window');
                    var grid = combo.up('grid');
                    var record = win.record
                    win.currency = combo.getValue();
                    var store = grid.getStore();
                    store.getProxy().extraParams.DisplayCurr = combo.getValue();
                    store.getProxy().extraParams.MBLNumber = record.get('mbl_nbr')
                    store.load();
                }
            }
        }
    ],
    GetFilterDisplay: function () {
        var value = this.down('#DisplayCurr').getRawValue();
        return (value) ? 'DisplayCurr: ' + value : '';
    }
});