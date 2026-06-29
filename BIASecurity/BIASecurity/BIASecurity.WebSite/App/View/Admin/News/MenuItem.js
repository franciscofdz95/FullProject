Ext.define('App.View.Admin.News.MenuItem', {
    extend: 'App.View.Admin.Menu.Item.Container',
    alias: 'widget.App-View-Admin-News-MenuItem',
    itemText: 'BIA News And Alerts',
    hidden: true,
    eventToFire: {
        eventName: 'GotoAdminTool',
        params: {
            xtype: 'App-View-Admin-News-Container'
        }
    }
});