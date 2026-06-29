Ext.define('App.View.Connections.Server.Component.ServerNameEntry', {
    extend: 'App.View.Connections.Component.FieldContainer',
    alias: 'widget.App-View-Connections-Server-Component-ServerNameEntry',

    cls: 'connectionsComponentServernameentry',
    layout: {
        type: 'hbox',
        align: 'stretch',
        pack: 'start'
    },

    items: [
        {
            xtype: 'connectionsTextfield', itemId: 'ServerName', fieldLabel: 'Server Name', flex: 1,
            plugins: { ptype: 'componentstorebind', dataField: 'ServerName' }
        }
    ]
});