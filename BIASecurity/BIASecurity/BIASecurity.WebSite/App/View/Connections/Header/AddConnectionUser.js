Ext.define('App.View.Connections.Header.AddConnectionUser', {
    extend: 'App.View.Connections.Header.Component.AddButton',
    alias: 'widget.App-View-Connections-Header-AddConnectionUser',

    cls: 'connectionsHeaderAddconnectionuser',
    text: 'Login',
    actionSecure: 'isBIAAppDevMgr',
    menu: [
        { text: 'Login List', eventToFire: { eventName: 'gotoNewContent', params: { xtype: 'App-View-Connections-Container', viewList: 'ConnectionUsers' } } }
    ]
});