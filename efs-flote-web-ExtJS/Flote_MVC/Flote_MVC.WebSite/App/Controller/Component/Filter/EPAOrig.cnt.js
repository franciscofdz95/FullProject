/* ====================================================================================================
NAME:			[EPAOrig Filter Controller ]
BEHAVIOR:		EPAOrig  filter criteria.
_______________________________________________________________________________________________________
REVISION HISTORY
-------------------------------------------------------------------------------------------------------
Date			    Modified By			  Modifications
-------------------------------------------------------------------------------------------------------
03/13/2020        Rama Yagati		 Created.
 ======================================================================================================*/
Ext.define('App.Controller.Component.Filter.EPAOrig', {
    extend: 'Ext.app.Controller',
    init: function () {
        this.control({
            'App-View-Component-Filter-EPAOrig clearCombo': {
                afterrender: this.EPAOrigAfterRender,
                change: this.EPAOrigChange,
                clear: this.EPAOrigClear
            }
        });
    },
    EPAOrigChange: function EPAOrigChange(me, newValue, oldValue, eOpts) {
        if (!Ext.isEmpty(newValue) && newValue.length > 0) {
            me.getTrigger('clear').show();
            PgAtt.setEPAOrig(newValue);
        } else {
            me.getTrigger('clear').hide();
            PgAtt.setEPAOrig('All');
        }
        me.updateLayout();
    },
    EPAOrigAfterRender: function EPAOrigAfterRender(me) {
        if (me.getValue() != '') {
            me.getTrigger('clear').show();
        }
    },
    EPAOrigClear: function EPAOrigClear(me) {
        me.reset();
        me.getTrigger('clear').hide();
        me.fireEvent('onclear', me, me.getValue());
        me.updateLayout();
        PgAtt.setEPAOrig('All');
        this.EPAOrigChange(me, '');
    }
});