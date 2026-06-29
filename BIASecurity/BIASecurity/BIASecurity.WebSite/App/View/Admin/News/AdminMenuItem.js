Ext.define('App.View.Admin.News.AdminMenuItem', {
    extend: 'App.View.Admin.Menu.Item.Container',
    alias: 'widget.App-View-Admin-News-AdminMenuItem',
    itemText: '<i class="fa fa-newspaper-o fa-2x" style="vertical-align:middle; padding: 6px"></i>BIA News And Alerts',
    hidden: true,
    cls: 'biaNewsMenuItem',
    eventToFire: {
        eventName: 'GotoAdminTool',
        params: {
            xtype: 'App-View-Admin-News-Container'
        }
    }
});