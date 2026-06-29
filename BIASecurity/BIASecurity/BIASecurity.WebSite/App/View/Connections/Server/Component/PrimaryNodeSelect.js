Ext.define('App.View.Connections.Server.Component.PrimaryNodeSelect', {
    extend: 'App.View.Connections.Component.FieldContainer',
    alias: 'widget.App-View-Connections-Server-Component-PrimaryNodeSelect',

    cls: 'connectionsServerComponentPrimarynodeselect',
    layout: {
        type: 'hbox',
        align: 'stretch',
        pack: 'start'
    },

    items: [
        {
            xtype: 'connectionsComboBox', itemId: 'PrimaryNodeId', fieldLabel: 'Primary Node', 
            store: { type: 'webapi', api: { read: 'api/BIASecurity/GetServerPrimaryNode' } }, flex: 1,
            plugins: { ptype: 'componentstorebind', dataField: 'PrimaryNodeId' }
        }
    ]
});