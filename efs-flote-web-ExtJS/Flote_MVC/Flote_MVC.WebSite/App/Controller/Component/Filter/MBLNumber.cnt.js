/* ====================================================================================================
NAME:			[MBL Number Filter Controller ]
BEHAVIOR:		MBL Number filter criteria.
_______________________________________________________________________________________________________
REVISION HISTORY
-------------------------------------------------------------------------------------------------------
Date			    Modified By			  Modifications
-------------------------------------------------------------------------------------------------------
07/24/2017        Sudhir Dandale		 Created.
 ======================================================================================================*/
Ext.define('App.Controller.Component.Filter.MBLNumber', {
    extend: 'Ext.app.Controller',
    init: function () {
        this.control({
            'App-View-Component-Filter-MBLNumber clearCombo': {
                afterrender: this.MBLNumberAfterRender,
                change: this.MBLNumberChange,
                clear: this.MBLNumberClear
            }
        });
    },
    MBLNumberChange: function MBLNumberChange(me, newValue, oldValue, eOpts) {
        if (!Ext.isEmpty(newValue) && newValue.length > 0) {
            me.getTrigger('clear').show();
            PgAtt.setMbl_number(newValue);
        } else {
            me.getTrigger('clear').hide();
            PgAtt.setMbl_number('');
        }
        me.updateLayout();
    },
    MBLNumberAfterRender: function MBLNumberAfterRender(me) {
        if (me.getValue() != '') {
            me.getTrigger('clear').show();
        }
    },
    MBLNumberClear: function MBLNumberClear(me) {
        me.reset();
        me.getTrigger('clear').hide();
        me.fireEvent('onclear', me, me.getValue());
        me.updateLayout();
        PgAtt.setMbl_number('');
        this.MBLNumberChange(me, '');
    }
});