Ext.define('App.View.Connections.MenuItem', {
    extend: 'App.View.Admin.Menu.Item.Container',
    alias: 'widget.App-View-Connections-MenuItem',
    itemText: 'Connection Manager',
    hidden: !App.Utility.ConnectionSecurity.isBIADeveloper(),
    eventToFire: {eventName: 'gotoNewContent', params: { xtype: 'App-View-Connections-Container', viewList: 'Connections' } }
});