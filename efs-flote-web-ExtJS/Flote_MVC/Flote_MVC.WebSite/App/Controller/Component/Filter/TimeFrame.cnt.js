/* ====================================================================================================
NAME:			[Time Frame Filter Controller ]
BEHAVIOR:		Time Frame  filter criteria.
_______________________________________________________________________________________________________
REVISION HISTORY
-------------------------------------------------------------------------------------------------------
Date			    Modified By			  Modifications
-------------------------------------------------------------------------------------------------------
02/20/2020        Rama Yagati		 Created.
 ======================================================================================================*/
Ext.define('App.Controller.Component.Filter.TimeFrame', {
    extend: 'Ext.app.Controller',
    init: function () {
        this.control({
            'App-View-Component-Filter-TimeFrame clearCombo': {
                afterrender: this.TimeFrameAfterRender,
                change: this.TimeFrameChange,
                clear: this.TimeFrameClear
            }
        });
    },
    TimeFrameChange: function TimeFrameChange(me, newValue, oldValue, eOpts) {
        if (!Ext.isEmpty(newValue) && newValue.length > 0) {
            me.getTrigger('clear').show();
            PgAtt.setTimeFrame(newValue);
        } else {
            me.getTrigger('clear').hide();
            PgAtt.setTimeFrame('All');
        }
        me.updateLayout();
    },
    TimeFrameAfterRender: function TimeFrameAfterRender(me) {
        if (me.getValue() != '') {
            me.getTrigger('clear').show();
        }
    },
    TimeFrameClear: function TimeFrameClear(me) {
        me.reset();
        me.getTrigger('clear').hide();
        me.fireEvent('onclear', me, me.getValue());
        me.updateLayout();
        PgAtt.setTimeFrame('All');
        this.TimeFrameChange(me, '');
    }
});