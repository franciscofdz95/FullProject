Ext.define('App.View.Admin.ActiveUser.MenuItem', {
    extend: 'App.View.Admin.Menu.Item.Container',
    alias: 'widget.App-View-Admin-ActiveUser-MenuItem',
    itemText: 'Session Active Users Per Server',
    hidden: true,
    eventToFire: {
        eventName: 'gotoAdminTool',
        params: {
            xtype: 'App-View-Admin-ActiveUser-Container'
        }
    }
});