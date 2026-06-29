Ext.define('App.View.Connections.Header.AddDatabase', {
    extend: 'App.View.Connections.Header.Component.AddButton',
    alias: 'widget.App-View-Connections-Header-AddDatabase',

    cls: 'connectionsHeaderAdddatabase',
    text: 'Database',
    actionSecure: 'isConnectionAdmin',
    menu: [
        { text: 'Database List', eventToFire: { eventName: 'gotoNewContent', params: { xtype: 'App-View-Connections-Container', viewList: 'Databases' } } }
    ]
});