Ext.define('App.View.Connections.AdminMenuItem', {
    extend: 'App.View.Admin.Menu.Item.Container',
    alias: 'widget.App-View-Connections-AdminMenuItem',
    itemText: '<i class= "fa fa-plug fa-2x" aria-hidden="true" style = "vertical-align:middle; padding: 6px"></i>Connection Manager',
    cls: 'adminConnectionMenuItem',
    hidden: !App.Utility.ConnectionSecurity.isBIADeveloper(),
    eventToFire: { eventName: 'gotoNewContent', params: { xtype: 'App-View-Connections-Container', viewList: 'Connections' } }
});