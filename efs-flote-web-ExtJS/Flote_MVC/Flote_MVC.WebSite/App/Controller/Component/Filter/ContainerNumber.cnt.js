/* ====================================================================================================
NAME:			[Container Number Filter Controller ]
BEHAVIOR:		Container Number filter criteria.
_______________________________________________________________________________________________________
REVISION HISTORY
-------------------------------------------------------------------------------------------------------
Date			    Modified By			  Modifications
-------------------------------------------------------------------------------------------------------
07/24/2017        Sudhir Dandale		 Created.
 ======================================================================================================*/
Ext.define('App.Controller.Component.Filter.ContainerNumber', {
    extend: 'Ext.app.Controller',
    init: function () {
        this.control({
            'App-View-Component-Filter-ContainerNumber clearCombo': {
                afterrender: this.ContainerNumberAfterRender,
                change: this.ContainerNumberChange,
                clear: this.ContainerNumberClear
            }
        });
    },
    ContainerNumberChange: function ContainerNumberChange(me, newValue, oldValue, eOpts) {
        if (!Ext.isEmpty(newValue) && newValue.length > 0) {
            me.getTrigger('clear').show();
            PgAtt.setContainer_number(newValue);
        } else {
            me.getTrigger('clear').hide();
            PgAtt.setContainer_number('');
        }
        me.updateLayout();
    },
    ContainerNumberAfterRender: function ContainerNumberAfterRender(me) {
        if (me.getValue() != '') {
            me.getTrigger('clear').show();
        }
    },
    ContainerNumberClear: function ContainerNumberClear(me) {
        me.reset();
        me.getTrigger('clear').hide();
        me.fireEvent('onclear', me, me.getValue());
        me.updateLayout();
        PgAtt.setContainer_number('');
        this.ContainerNumberChange(me, '');
    }
});