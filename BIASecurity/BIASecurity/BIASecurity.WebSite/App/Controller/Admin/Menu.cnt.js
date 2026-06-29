Ext.define('App.Controller.Admin.Menu', {
    extend: 'Ext.app.Controller',
    refs: [
        { ref: 'AdminBtn', selector: 'App-View-Navigation-NavBar #NavBarAdminButton' }
    ],
    init: function init() {
        var me = this;

        me.control({
            'adminMenuItem': {
                added: this.AdminMenuItemAdded
            },
            'App-View-Admin-Logs-AdminMenuItem': {
                beforerender: this.LogsMenuItemBeforeRender
            },
            'App-View-Admin-Logs-MenuItem': {
                beforerender: this.LogsMenuItemBeforeRender
            }
        });
        me.listen({});
    },
    LogsMenuItemBeforeRender: function LogsMenuItemBeforeRender(me) {
        if (App.Utility.ConnectionSecurity.isBIADeveloper()) me.show();
        else me.hide();
    },
    AdminMenuItemAdded: function AdminMenuItemAdded(me, eOpts) {
        if (me.itemText) {
            me.viewModel = new Ext.app.ViewModel({
                data: {
                    menuItemText: me.itemText
                }
            });
        }
        me.setBind({
            html: '{menuItemText}'
        });

        me.addListener({
            click: {
                element: 'el',
                fn: this.AdminMenuItemClicked,
                scope: this,
                args: [me]
            }
        });
    },
    AdminMenuItemClicked: function AdminMenuItemClicked(me, event, el, eOpts) {
        if (me.eventToFire) {
            var adminBtn = this.getAdminBtn(),
                adminMenu = me.up('adminMenu');
            if (adminMenu) adminMenu.setVisible(false);
            if (adminBtn && adminMenu) {
                if (adminMenu.hidden) adminBtn.removeCls('ButtonEnabled');
                else adminBtn.addCls('ButtonEnabled');
            }

            Ext.GlobalEvents.fireEvent('doAppDeepLink', me.eventToFire.eventName, me.eventToFire.params)
        }
    }
});