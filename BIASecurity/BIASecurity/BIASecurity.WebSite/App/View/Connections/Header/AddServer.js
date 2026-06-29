Ext.define('App.View.Connections.Header.AddServer', {
    extend: 'App.View.Connections.Header.Component.AddButton',
    alias: 'widget.App-View-Connections-Header-AddServer',

    cls: 'connectionsHeaderAddserver',
    text: 'Server',
    actionSecure: 'isConnectionAdmin',
    menu: [
        { text: 'Server List', eventToFire: { eventName: 'gotoNewContent', params: { xtype: 'App-View-Connections-Container', viewList: 'Servers' } } }
    ]
});