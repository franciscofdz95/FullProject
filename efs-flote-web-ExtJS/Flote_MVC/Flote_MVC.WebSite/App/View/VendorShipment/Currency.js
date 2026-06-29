/* ====================================================================================================
NAME:			[Vendor Shipment Currency]
BEHAVIOR:		Shows Vendor Shipment  Currency Filter.
_______________________________________________________________________________________________________
REVISION HISTORY
-------------------------------------------------------------------------------------------------------
Date			    Modified By			  Modifications
-------------------------------------------------------------------------------------------------------
06/26/2017        Sheetal Karre		 Created.
 ======================================================================================================*/
Ext.define('App.View.VendorShipment.Currency', {
    extend: 'BIA.container.FilterContainer',
    alias: 'widget.App-View-VendorShipment-Currency',
    layout: 'column',
    items: [
        {
            xtype: 'combobox',
            itemId: 'vendorShipCurr',
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
                    var grid = win.down('#ShipmentDetailId');
                    var record = win.rec
                    win.currency = combo.getValue();
                    // Change currency in Excel by Sriram Sundara
                    PgAtt.setDisplay_currency(combo.getValue());
                    // Change currency in Excel by Sriram Sundara
                    var store = grid.getStore();
                    store.getProxy().extraParams.DisplayCurr = combo.getValue();
                    store.getProxy().extraParams.ShipmentNumber = record.get('shpmnt_nbr');
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