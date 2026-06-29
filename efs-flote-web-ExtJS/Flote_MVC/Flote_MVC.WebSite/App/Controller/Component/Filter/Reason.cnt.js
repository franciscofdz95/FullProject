/* ====================================================================================================
NAME:			[Reason Filter Controller ]
BEHAVIOR:		Reason filter criteria.
_______________________________________________________________________________________________________
REVISION HISTORY
-------------------------------------------------------------------------------------------------------
Date			    Modified By			  Modifications
-------------------------------------------------------------------------------------------------------
02/14/2020        Rama Yagati		 Created.
 ======================================================================================================*/
Ext.define('App.Controller.Component.Filter.Reason', {
    extend: 'Ext.app.Controller',
    init: function () {
        this.control({
            'App-View-Component-Filter-Reason clearCombo': {
                afterrender: this.ReasonAfterRender,
                change: this.ReasonChange,
                clear: this.ReasonClear
            }
        });
    },
    ReasonChange: function ReasonChange(me, newValue, oldValue, eOpts) {
        if (!Ext.isEmpty(newValue) && newValue.length > 0) {
            me.getTrigger('clear').show();
            PgAtt.setReason(newValue);
        } else {
            me.getTrigger('clear').hide();
            PgAtt.setReason('All');
        }
        me.updateLayout();
    },
    ReasonAfterRender: function ReasonAfterRender(me) {
        if (me.getValue() != '') {
            me.getTrigger('clear').show();
        }
    },
    ReasonClear: function ReasonClear(me) {
        me.reset();
        me.getTrigger('clear').hide();
        me.fireEvent('onclear', me, me.getValue());
        me.updateLayout();
        PgAtt.setReason('');
        this.ReasonChange(me, '');
    }
});