Ext.define('App.Controller.Access.Request.User', {
    extend: 'Ext.app.Controller',

    init: function init() {
        this.control({
            'App-View-Access-Request-User': {
                beforerender: this.BeforeRender
            },
            'App-View-Access-Request-Window #userField': {
                select: this.UserChange,
                focus: this.UserFocus
            }
        });
    },
    BeforeRender: function BeforeRender(me) {
        var win = me.up('window');

        me.store.getProxy().extraParams = { userId: win.userId ? win.userId : App.Utility.UserMapping.getCurrentUserId() };
        me.store.load();
    },
    UserChange: function UserChange(me, rec) {
        var win = me.up('window'),
            container = win.down('App-View-Access-Request-User');

        container.store.getProxy().extraParams = { userId: me.getValue() };
        container.store.load();
    },
    UserFocus: function UsesFocus(me) {
        var reqWindow = me.up('App-View-Access-Request-Window'),
            helpField = reqWindow.down('#FieldHelpHint');

        helpField.setHtml("<b>User Field:</b> Please select the user by using either the drop-down or simply typing in the name or any valid ID of the user. (e.g. AD ID, Emp ID, Azure ID, etc).");
    }
});