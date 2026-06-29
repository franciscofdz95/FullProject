/* ====================================================================================================
NAME:			[E2k Carrier Code Filter Controller ]
BEHAVIOR:		E2k Carrier Code filter criteria.
_______________________________________________________________________________________________________
REVISION HISTORY
-------------------------------------------------------------------------------------------------------
Date			    Modified By			  Modifications
-------------------------------------------------------------------------------------------------------
07/24/2017        Sudhir Dandale		 Created.
 ======================================================================================================*/
Ext.define('App.Controller.Component.Filter.E2kCarrierCode', {
    extend: 'Ext.app.Controller',
    init: function () {
        this.control({
            'App-View-Component-Filter-E2kCarrierCode textfield': {
                change: this.E2kCarrierCodeChange
            }
        });
    },
    E2kCarrierCodeChange: function E2kCarrierCodeChange(me, newValue, oldValue, eOpts) {
        if (!Ext.isEmpty(newValue) && newValue.length > 0) {
            me.getTrigger('clear').show();
            PgAtt.setE2k_Carrier_Code(newValue);
        } else {
            me.getTrigger('clear').hide();
            PgAtt.setE2k_Carrier_Code('');
        }
        me.updateLayout();
    }

});