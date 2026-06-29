Ext.define('App.View.Connections.Server.AddEditView', {
    extend: 'App.View.Connections.Component.AddEditViewWindow',
    alias: 'widget.App-View-Connections-Server-AddEditView',

    title: 'Server',
    cls: 'connectionsServerAddeditview',
    ServerId: null,
    store: { type: 'webapi', api: { read: 'api/BIASecurity/ServerInfo' } },
    items: [
        { xtype: 'App-View-Connections-Server-Component-ServerIdDisplay' },
        { xtype: 'App-View-Connections-Server-Component-ServerAliasEntry' },
        { xtype: 'App-View-Connections-Server-Component-ServerNameEntry' },
        { xtype: 'App-View-Connections-Server-Component-InstanceNameEntry' },
        { xtype: 'App-View-Connections-Server-Component-PortEntry' },
        { xtype: 'App-View-Connections-Server-Component-ServerTypeSelect' },
        { xtype: 'App-View-Connections-Component-EnvironmentSelect' },
        { xtype: 'App-View-Connections-Server-Component-ClusterSelect' },
        { xtype: 'App-View-Connections-Server-Component-PrimaryNodeSelect' },
        { xtype: 'App-View-Connections-Component-ActiveFlag' },
        { xtype: 'connectionsAddEditButtonContainer' }
    ]
});