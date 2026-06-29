/* ====================================================================================================
NAME:			[Carrier Id Filter Controller ]
BEHAVIOR:		Carrier Id filter criteria.
_______________________________________________________________________________________________________
REVISION HISTORY
-------------------------------------------------------------------------------------------------------
Date			    Modified By			  Modifications
-------------------------------------------------------------------------------------------------------
07/24/2017        Sudhir Dandale		 Created.
 ======================================================================================================*/
Ext.define('App.Controller.Component.Filter.CarrierId', {
    extend: 'Ext.app.Controller',
    init: function () {
        this.control({
            'App-View-Component-Filter-CarrierId textfield': {
                change: this.CarrierIdChange
            }
        });
    },
    CarrierIdChange: function CarrierIdChange(me, newValue, oldValue, eOpts) {
        if (!Ext.isEmpty(newValue) && newValue.length > 0) {
            me.getTrigger('clear').show();
            PgAtt.setCarrier_id(newValue);
        } else {
            me.getTrigger('clear').hide();
            PgAtt.setCarrier_id('');
        }
        me.updateLayout();
    }
});