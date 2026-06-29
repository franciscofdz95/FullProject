Ext.define('App.View.Connections.Connection.Component.ServerSelect', {
    extend: 'App.View.Connections.Component.FieldContainer',
    alias: 'widget.App-View-Connections-Connection-Component-ServerSelect',

    cls: 'connectionsConnectionComponentServerselect',
    layout: {
        type: 'hbox',
        align: 'middle',
        pack: 'start'
    },

    items: [
        {
            xtype: 'connectionsComboBox', itemId: 'ServerId', fieldLabel: 'Server', 
            store: { type: 'webapi', api: { read: 'api/BIASecurity/ConnectionServers' } }, flex: 1, margin: '0 5 0 0',
            plugins: { ptype: 'componentstorebind', dataField: 'ServerId' }
        },
        { xtype: 'App-View-Connections-Header-AddServer', displayType: 'NoText' }
    ]
});