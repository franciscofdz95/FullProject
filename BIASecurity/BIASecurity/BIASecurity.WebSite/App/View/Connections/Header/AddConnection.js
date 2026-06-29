Ext.define('App.View.Connections.Header.AddConnection', {
    extend: 'App.View.Connections.Header.Component.AddButton',
    alias: 'widget.App-View-Connections-Header-AddConnection',

    cls: 'connectionsHeaderAddconnection',
    text: 'Connection',
    actionSecure: 'isBIADeveloper',
    menu: [
        { text: 'Connection List', eventToFire: { eventName: 'gotoNewContent', params: { xtype: 'App-View-Connections-Container', viewList: 'Connections' } } }
    ]
});