/* ====================================================================================================
NAME:			[DestCc Filter Controller ]
BEHAVIOR:		DestCc  filter criteria.
_______________________________________________________________________________________________________
REVISION HISTORY
-------------------------------------------------------------------------------------------------------
Date			    Modified By			  Modifications
-------------------------------------------------------------------------------------------------------
02/18/2020        Rama Yagati		 Created.
 ======================================================================================================*/
Ext.define('App.Controller.Component.Filter.DestCc', {
    extend: 'Ext.app.Controller',
    init: function () {
        this.control({
            'App-View-Component-Filter-DestCc clearCombo': {
                afterrender: this.DestCcAfterRender,
                change: this.DestCcChange,
                clear: this.DestCcClear
            }
        });
    },
    DestCcChange: function DestCcChange(me, newValue, oldValue, eOpts) {
        if (!Ext.isEmpty(newValue) && newValue.length > 0) {
            me.getTrigger('clear').show();
            PgAtt.setDestCc(newValue);
        } else {
            me.getTrigger('clear').hide();
            PgAtt.setDestCc('All');
        }
        me.updateLayout();
    },
    DestCcAfterRender: function DestCcAfterRender(me) {
        if (me.getValue() != '') {
            me.getTrigger('clear').show();
        }
    },
    DestCcClear: function DestCcClear(me) {
        me.reset();
        me.getTrigger('clear').hide();
        me.fireEvent('onclear', me, me.getValue());
        me.updateLayout();
        PgAtt.setDestCc('All');
        this.DestCcChange(me, '');
    }
});