Ext.define('App.View.Connections.Database.Component.DatabaseIdDisplay', {
    extend: 'App.View.Connections.Component.FieldContainer',
    alias: 'widget.App-View-Connections-Database-Component-DatabaseIdDisplay',

    cls: 'connectionsDatabaseComponentDatabaseiddisplay',
    layout: {
        type: 'hbox',
        align: 'stretch',
        pack: 'start'
    },

    items: [
        {
            xtype: 'hiddenfield', fieldLabel: 'Database Id', itemId: 'DatabaseId', labelWidth: 85,
            plugins: { ptype: 'componentstorebind', dataField: 'DatabaseId' }
        }
    ]
});