/* ====================================================================================================
NAME:			[Charge Status Filter Controller ]
BEHAVIOR:		Charge Status filter criteria.
_______________________________________________________________________________________________________
REVISION HISTORY
-------------------------------------------------------------------------------------------------------
Date			    Modified By			  Modifications
-------------------------------------------------------------------------------------------------------
07/24/2016        Sudhir Dandale		 Created.
 ======================================================================================================*/
Ext.define('App.Controller.Component.Filter.ChargeStatus', {
    extend: 'Ext.app.Controller',
    init: function () {
        this.control({
            'App-View-Component-Filter-ChargeStatus clearCombo': {
                afterrender: this.ChargeStatusAfterRender,
                change: this.ChargeStatusChange
            }
        });
    },
    ChargeStatusChange: function ChargeStatusChange(me, newValue, oldValue, eOpts) {
        if (!Ext.isEmpty(newValue) && newValue.length > 0) {
            me.getTrigger('clear').show();
            PgAtt.setCharge_status(newValue);
        } else {
            me.getTrigger('clear').hide();
            PgAtt.setCharge_status('All');
        }
    },
    ChargeStatusAfterRender: function ChargeStatusAfterRender(me) {
        if (me.getValue() != '') {
            me.getTrigger('clear').show();
        }
    }
});