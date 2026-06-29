/* ====================================================================================================
NAME:			[Charge Code Filter Controller ]
BEHAVIOR:		Charge Code filter criteria.
_______________________________________________________________________________________________________
REVISION HISTORY
-------------------------------------------------------------------------------------------------------
Date			    Modified By			  Modifications
-------------------------------------------------------------------------------------------------------
07/24/2017        Sudhir Dandale		 Created.
 ======================================================================================================*/
Ext.define('App.Controller.Component.Filter.ChargeCode', {
    extend: 'Ext.app.Controller',
    init: function () {
        this.control({
            'App-View-Component-Filter-ChargeCode clearCombo': {
                afterrender: this.ChargeCodeAfterRender,
                change: this.ChargeCodeChange,
                clear: this.ChargeCodeClear
            }
        });
    },
    ChargeCodeChange: function ChargeCodeChange(me, newValue, oldValue, eOpts) {
        if (!Ext.isEmpty(newValue) && newValue.length > 0) {
            me.getTrigger('clear').show();
            PgAtt.setCharge_code(newValue);
        } else {
            me.getTrigger('clear').hide();
            PgAtt.setCharge_code('');
        }
        me.updateLayout();
    },
    ChargeCodeAfterRender: function ChargeCodeAfterRender(me) {
        if (me.getValue() != '') {
            me.getTrigger('clear').show();
        }
    },
    ChargeCodeClear: function ChargeCodeClear(me) {
        me.reset();
        me.getTrigger('clear').hide();
        me.fireEvent('onclear', me, me.getValue());
        me.updateLayout();
        PgAtt.setCharge_code('');
        this.ChargeCodeChange(me, '');
    }
});