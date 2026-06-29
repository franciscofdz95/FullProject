Ext.define('App.View.Admin.ActiveUser.AdminMenuItem', {
    extend: 'App.View.Admin.Menu.Item.Container',
    alias: 'widget.App-View-Admin-ActiveUser-AdminMenuItem',
    itemText: '<i class="fa fa-users fa-2x" style="vertical-align:middle; padding: 6px"></i>Session Active Users Per Server',
    cls: 'activeUserMenuItem',
    hidden: true,
    eventToFire: {
        eventName: 'gotoAdminTool',
        params: {
            xtype: 'App-View-Admin-ActiveUser-Container'
        }
    }
});