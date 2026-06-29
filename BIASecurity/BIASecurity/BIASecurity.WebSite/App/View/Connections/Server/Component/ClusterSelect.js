Ext.define('App.View.Connections.Server.Component.ClusterSelect', {
    extend: 'App.View.Connections.Component.FieldContainer',
    alias: 'widget.App-View-Connections-Server-Component-ClusterSelect',

    cls: 'connectionsServerComponentClusterselect',
    layout: {
        type: 'hbox',
        align: 'stretch',
        pack: 'start'
    },

    items: [
        {
            xtype: 'connectionsComboBox', itemId: 'ClusterId', fieldLabel: 'Cluster', 
            store: { type: 'webapi', api: { read: 'api/BIASecurity/GetServerCluster' } }, flex: 1,
            plugins: { ptype: 'componentstorebind', dataField: 'ClusterId' }
        }
    ]
});