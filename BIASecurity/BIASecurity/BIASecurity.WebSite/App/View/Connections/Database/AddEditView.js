Ext.define('App.View.Connections.Database.AddEditView', {
    extend: 'App.View.Connections.Component.AddEditViewWindow',
    alias: 'widget.App-View-Connections-Database-AddEditView',

    title: 'Database',
    cls: 'connectionsDatabaseAddeditview',
    DatabaseId: null,
    store: { type: 'webapi', api: { read: 'api/BIASecurity/DatabaseInfo' } },
    items: [
        { xtype: 'App-View-Connections-Database-Component-DatabaseIdDisplay' },
        { xtype: 'App-View-Connections-Database-Component-DatabaseNameEntry' },
        { xtype: 'App-View-Connections-Database-Component-GlobalNameEntry' },
        { xtype: 'App-View-Connections-Component-EnvironmentSelect' },
        { xtype: 'App-View-Connections-Component-ActiveFlag' },
        { xtype: 'connectionsAddEditButtonContainer' }
    ]
});