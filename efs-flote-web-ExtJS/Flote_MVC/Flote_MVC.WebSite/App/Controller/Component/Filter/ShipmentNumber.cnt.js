/* ====================================================================================================
NAME:			[Shipment Number Filter Controller ]
BEHAVIOR:		Shipment Number  filter criteria.
_______________________________________________________________________________________________________
REVISION HISTORY
-------------------------------------------------------------------------------------------------------
Date			    Modified By			  Modifications
-------------------------------------------------------------------------------------------------------
07/24/2017        Sudhir Dandale		 Created.
 ======================================================================================================*/
Ext.define('App.Controller.Component.Filter.ShipmentNumber', {
    extend: 'Ext.app.Controller',
    init: function () {
        this.control({
            'App-View-Component-Filter-ShipmentNumber clearCombo': {
                afterrender: this.ShipmentNumberAfterRender,
                change: this.ShipmentNumberChange,
                clear: this.ShipmentNumberClear
            }
        });
    },
    ShipmentNumberChange: function ShipmentNumberChange(me, newValue, oldValue, eOpts) {
        if (!Ext.isEmpty(newValue) && newValue.length > 0) {
            me.getTrigger('clear').show();
            PgAtt.setShipment_number(newValue);
        } else {
            me.getTrigger('clear').hide();
            PgAtt.setShipment_number('');
        }
        me.updateLayout();
    },
    ShipmentNumberAfterRender: function ShipmentNumberAfterRender(me) {
        if (me.getValue() != '') {
            me.getTrigger('clear').show();
        }
    },
    ShipmentNumberClear: function ShipmentNumberClear(me) {
        me.reset();
        me.getTrigger('clear').hide();
        me.fireEvent('onclear', me, me.getValue());
        me.updateLayout();
        PgAtt.setShipment_number('');
        this.ShipmentNumberChange(me, '');
    }
});