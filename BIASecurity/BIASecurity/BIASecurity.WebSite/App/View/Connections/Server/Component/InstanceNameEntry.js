Ext.define('App.View.Connections.Server.Component.InstanceNameEntry', {
    extend: 'App.View.Connections.Component.FieldContainer',
    alias: 'widget.App-View-Connections-Server-Component-InstanceNameEntry',

    cls: 'connectionsComponentInstancename',
    layout: {
        type: 'hbox',
        align: 'stretch',
        pack: 'start'
    },

    items: [
        {
            xtype: 'connectionsTextfield', itemId: 'InstanceName', fieldLabel: 'Instance Name', flex: 1,
            plugins: { ptype: 'componentstorebind', dataField: 'InstanceName' }
        }
    ]
});