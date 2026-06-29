Ext.define('App.View.Connections.ConnectionUser.Component.ButtonContainer', {
    extend: 'Ext.container.Container',
    alias: 'widget.App-View-Connections-ConnectionUser-Component-ButtonContainer',

    cls: 'connectionsConnectionuserComponentButtoncontainer',
    layout: { type: 'hbox', align: 'stretch', pack: 'center' },
    padding: '0 0 0 5',
    defaults: { margin: '0 5 0 0' },
    items: [
        { xtype: 'button', itemId: 'Save', text: 'Save' },
        { xtype: 'button', itemId: 'Cancel', text: 'Cancel' }
    ]
});