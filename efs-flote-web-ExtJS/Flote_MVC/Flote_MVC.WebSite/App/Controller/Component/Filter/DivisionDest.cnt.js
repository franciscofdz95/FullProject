/* ====================================================================================================
NAME:			[Division Dest Filter Controller ]
BEHAVIOR:		Division Dest  filter criteria.
_______________________________________________________________________________________________________
REVISION HISTORY
-------------------------------------------------------------------------------------------------------
Date			    Modified By			  Modifications
-------------------------------------------------------------------------------------------------------
03/16/2020        Rama Yagati		 Created.
 ======================================================================================================*/
Ext.define('App.Controller.Component.Filter.DivisionDest', {
    extend: 'Ext.app.Controller',
    init: function () {
        this.control({
            'App-View-Component-Filter-DivisionDest clearCombo': {
                afterrender: this.DivisionDestAfterRender,
                change: this.DivisionDestChange,
                clear: this.DivisionDestClear
            }
        });
    },
    DivisionDestChange: function DivisionDestChange(me, newValue, oldValue, eOpts) {
        if (!Ext.isEmpty(newValue) && newValue.length > 0) {
            me.getTrigger('clear').show();
            PgAtt.setDivisionDest(newValue);
        } else {
            me.getTrigger('clear').hide();
            PgAtt.setDivisionDest('All');
        }
        me.updateLayout();
    },
    DivisionDestAfterRender: function DivisionDestAfterRender(me) {
        if (me.getValue() != '') {
            me.getTrigger('clear').show();
        }
    },
    DivisionDestClear: function DivisionDestClear(me) {
        me.reset();
        me.getTrigger('clear').hide();
        me.fireEvent('onclear', me, me.getValue());
        me.updateLayout();
        PgAtt.setDivisionDest('All');
        this.DivisionDestChange(me, '');
    }
});