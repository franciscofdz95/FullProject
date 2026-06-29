Ext.define('App.View.Connections.Component.NoAccess', {
    extend: 'Ext.container.Container',
    alias: 'widget.App-View-Connections-Component-NoAccess',

    cls: 'connectionsComponentNoaccess',
    flex: 1,
    layout: {
        type: 'vbox',
        align: 'middle',
        pack: 'center'
    },
    items: [{ xtype: 'container', html: 'You do not have access to this admin tool.', cls: 'Card' }]
});