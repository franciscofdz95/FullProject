/* ====================================================================================================
NAME:			[MBL_nbr Flag Filter Controller ]
BEHAVIOR:		MBL_nbr Flag  filter criteria.
_______________________________________________________________________________________________________
REVISION HISTORY
-------------------------------------------------------------------------------------------------------
Date			    Modified By			  Modifications
-------------------------------------------------------------------------------------------------------
03/17/2020        Rama Yagati		 Created.
 ======================================================================================================*/
Ext.define('App.Controller.Component.Filter.MblNbrFlag', {
    extend: 'Ext.app.Controller',
    init: function () {
        this.control({
            'App-View-Component-Filter-MblNbrFlag clearCombo': {
                afterrender: this.MblNbrFlagAfterRender,
                change: this.MblNbrFlagChange,
                clear: this.MblNbrFlagClear
            }
        });
    },
    MblNbrFlagChange: function MblNbrFlagChange(me, newValue, oldValue, eOpts) {
        if (!Ext.isEmpty(newValue) && newValue.length > 0) {
            me.getTrigger('clear').show();
            PgAtt.setMblNbrFlag(newValue);
        } else {
            me.getTrigger('clear').hide();
            PgAtt.setMblNbrFlag('All');
        }
        me.updateLayout();
    },
    MblNbrFlagAfterRender: function MblNbrFlagAfterRender(me) {
        if (me.getValue() != '') {
            me.getTrigger('clear').show();
        }
    },
    MblNbrFlagClear: function MblNbrFlagClear(me) {
        me.reset();
        me.getTrigger('clear').hide();
        me.fireEvent('onclear', me, me.getValue());
        me.updateLayout();
        PgAtt.setMblNbrFlag('All');
        this.MblNbrFlagChange(me, '');
    }
});