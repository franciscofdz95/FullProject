Ext.define('App.View.Connection.Connection.Component.DatabaseSelect', {
    extend: 'App.View.Connections.Component.FieldContainer',
    alias: 'widget.App-View-Connections-Connection-Component-DatabaseSelect',

    cls: 'connectionsConnectionComponentDatabaseselect',
    layout: {
        type: 'hbox',
        align: 'middle',
        pack: 'start'
    },

    items: [
        {
            xtype: 'connectionsComboBox', itemId: 'DatabaseId', fieldLabel: 'Database', 
            store: { type: 'webapi', api: { read: 'api/BIASecurity/ConnectionDatabases' } }, flex: 1, margin: '0 5 0 0',
            plugins: { ptype: 'componentstorebind', dataField: 'DatabaseId' }
        },
        { xtype: 'App-View-Connections-Header-AddDatabase', displayType: 'NoText' }
    ]
});