Ext.define('App.View.Connections.Component.AddEditViewWindow', {
    extend: 'Ext.window.Window',
    alias: 'widget.App-View-Connections-Component-AddEditViewWindow',
    componentCls: 'connectionsComponentAddeditviewwindow',
    modal: true,
    draggable: false,
    resizable: false,
    layout: {
        type: 'vbox',
        align: 'stretch',
        pack: 'start'
    },
    purpose: 'View',
    padding: '3 3 6'
});