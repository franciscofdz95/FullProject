Ext.define('App.Controller.Component.UserAccess.UserAccessProfile', {
    extend: 'Ext.app.Controller',
    init: function () {
        this.control({
            'App-View-Component-UserAccess-UserAccessProfile clearCombo': {
                afterrender: this.UserAccessProfileAfterRender,
                change: this.UserAccessProfileChange,
                clear: this.UserAccessProfileClear
            }
        });
    },
    UserAccessProfileChange: function UserAccessProfileChange(me, newValue, oldValue, eOpts) {
        if (!Ext.isEmpty(newValue) && newValue.length > 0) {
            me.getTrigger('clear').show();
            PgAtt.setUser_Profile(newValue);
        } else {
            me.getTrigger('clear').hide();
        }
        me.updateLayout();
    },
    UserAccessProfileAfterRender: function UserAccessProfileAfterRender(me) {
        if (me.getValue() != '') {
            me.getTrigger('clear').show();
        }
    },
    UserAccessProfileClear: function UserAccessProfileClear(me) {
        me.reset();
        me.getTrigger('clear').hide();
        me.fireEvent('onclear', me, me.getValue());
        me.updateLayout();
        this.ServiceCodeChange(me, '');
    }
});