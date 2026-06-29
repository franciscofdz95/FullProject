Ext.define('App.View.Connections.Server.Component.ServerAliasEntry', {
    extend: 'App.View.Connections.Component.FieldContainer',
    alias: 'widget.App-View-Connections-Server-Component-ServerAliasEntry',

    cls: 'connectionsComponentServeraliasentry',
    layout: {
        type: 'hbox',
        align: 'stretch',
        pack: 'start'
    },

    items: [
        {
            xtype: 'connectionsTextfield', itemId: 'ServerAlias', fieldLabel: 'Server Alias', flex: 1,
            plugins: { ptype: 'componentstorebind', dataField: 'ServerAlias' }
        }
    ]
});