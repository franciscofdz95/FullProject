/* ====================================================================================================
NAME:			[  Filter Controller ]
BEHAVIOR:		EPADest  filter criteria.
_______________________________________________________________________________________________________
REVISION HISTORY
-------------------------------------------------------------------------------------------------------
Date			    Modified By			  Modifications
-------------------------------------------------------------------------------------------------------
03/13/2020        Rama Yagati		 Created.
 ======================================================================================================*/
Ext.define('App.Controller.Component.Filter.EPADest', {
    extend: 'Ext.app.Controller',
    init: function () {
        this.control({
            'App-View-Component-Filter-EPADest clearCombo': {
                afterrender: this.EPADestAfterRender,
                change: this.EPADestChange,
                clear: this.EPADestClear
            }
        });
    },
    EPADestChange: function EPADestChange(me, newValue, oldValue, eOpts) {
        if (!Ext.isEmpty(newValue) && newValue.length > 0) {
            me.getTrigger('clear').show();
            PgAtt.setEPADest(newValue);
        } else {
            me.getTrigger('clear').hide();
            PgAtt.setEPADest('All');
        }
        me.updateLayout();
    },
    EPADestAfterRender: function EPADestAfterRender(me) {
        if (me.getValue() != '') {
            me.getTrigger('clear').show();
        }
    },
    EPADestClear: function EPADestClear(me) {
        me.reset();
        me.getTrigger('clear').hide();
        me.fireEvent('onclear', me, me.getValue());
        me.updateLayout();
        PgAtt.setEPADest('All');
        this.EPADestChange(me, '');
    }
});