Ext.define('App.Controller.User.List.Item.Email', {
    extend: 'Ext.app.Controller',

    init: function init() {
        this.control({
            'App-View-User-Component-Email #UserEmailLink': {
                beforerender: this.UserEmailLinkBeforeRender
            },
            'App-View-User-Component-Email #UserIMLink': {
                beforerender: this.UserIMLinkBeforeRender
            }
        });
    },
    UserEmailLinkBeforeRender: function UserEmailLinkBeforeRender(me) {
        if (me.up('[user]').user.UPSEmail)
            me.setConfig({ html: '<a href="mailto:' + me.up('[user]').user.Email + '">' + me.icon + '</a>' });
        else me.hide();
    },
    UserIMLinkBeforeRender: function UserIMLinkBeforeRender(me) {
        if (me.up('[user]').user.UPSEmail) 
            me.setConfig({ html: '<a href="https://teams.microsoft.com/l/chat/0/0?users=' + me.up('[user]').user.Email + '">' + me.icon + '</a>' });
        else me.hide();
    }
});