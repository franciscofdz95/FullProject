Ext.define('App.View.Connections.Server.Component.ServerTypeSelect', {
    extend: 'App.View.Connections.Component.FieldContainer',
    alias: 'widget.App-View-Connections-Server-Component-ServerTypeSelect',

    cls: 'connectionsServerComponentServertypeselect',
    layout: {
        type: 'hbox',
        align: 'stretch',
        pack: 'start'
    },

    items: [
        {
            xtype: 'connectionsComboBox', itemId: 'ServerTypeId', fieldLabel: 'Server Type', 
            store: { type: 'webapi', api: { read: 'api/BIASecurity/GetServerType' } }, flex: 1,
            plugins: { ptype: 'componentstorebind', dataField: 'ServerTypeId' }
        }
    ]
});