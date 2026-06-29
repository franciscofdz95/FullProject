/* ====================================================================================================
NAME:			[OriginCc Filter Controller ]
BEHAVIOR:		OriginCc  filter criteria.
_______________________________________________________________________________________________________
REVISION HISTORY
-------------------------------------------------------------------------------------------------------
Date			    Modified By			  Modifications
-------------------------------------------------------------------------------------------------------
02/18/2020        Rama Yagati		 Created.
 ======================================================================================================*/
Ext.define('App.Controller.Component.Filter.OriginCc', {
    extend: 'Ext.app.Controller',
    init: function () {
        this.control({
            'App-View-Component-Filter-OriginCc clearCombo': {
                afterrender: this.OriginCcAfterRender,
                change: this.OriginCcChange,
                clear: this.OriginCcClear
            }
        });
    },
    OriginCcChange: function OriginCcChange(me, newValue, oldValue, eOpts) {
        if (!Ext.isEmpty(newValue) && newValue.length > 0) {
            me.getTrigger('clear').show();
            PgAtt.setOriginCc(newValue);
        } else {
            me.getTrigger('clear').hide();
            PgAtt.setOriginCc('All');
        }
        me.updateLayout();
    },
    OriginCcAfterRender: function OriginCcAfterRender(me) {
        if (me.getValue() != '') {
            me.getTrigger('clear').show();
        }
    },
    OriginCcClear: function OriginCcClear(me) {
        me.reset();
        me.getTrigger('clear').hide();
        me.fireEvent('onclear', me, me.getValue());
        me.updateLayout();
        PgAtt.setOriginCc('All');
        this.OriginCcChange(me, '');
    }
});