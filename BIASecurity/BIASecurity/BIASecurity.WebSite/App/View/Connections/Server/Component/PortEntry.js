Ext.define('App.View.Connections.Server.Component.PortEntry', {
    extend: 'App.View.Connections.Component.FieldContainer',
    alias: 'widget.App-View-Connections-Server-Component-PortEntry',

    cls: 'connectionsServerComponentPortentry',
    layout: {
        type: 'hbox',
        align: 'stretch',
        pack: 'start'
    },

    items: [
        {
            xtype: 'connectionsTextfield', itemId: 'Port', fieldLabel: 'Port', flex: 1,
            plugins: { ptype: 'componentstorebind', dataField: 'Port' }
        }
    ]
});