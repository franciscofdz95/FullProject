Ext.define('App.View.Connections.Database.Component.DatabaseNameEntry', {
    extend: 'App.View.Connections.Component.FieldContainer',
    alias: 'widget.App-View-Connections-Database-Component-DatabaseNameEntry',

    cls: 'connectionsDatabaseComponentDatabasenameentry',
    layout: {
        type: 'hbox',
        align: 'stretch',
        pack: 'start'
    },

    items: [
        {
            xtype: 'connectionsTextfield', itemId: 'DatabaseName', fieldLabel: 'Database Name', flex: 1,
            plugins: { ptype: 'componentstorebind', dataField: 'DatabaseName' }
        }
    ]
});