Ext.define('App.View.Connections.Component.EnvironmentSelect', {
    extend: 'App.View.Connections.Component.FieldContainer',
    alias: 'widget.App-View-Connections-Component-EnvironmentSelect',

    cls: 'connectionsComponentEnvironmentselect',
    layout: {
        type: 'hbox',
        align: 'stretch',
        pack: 'start'
    },

    items: [
        {
            xtype: 'connectionsComboBox', itemId: 'EnvironmentId', fieldLabel: 'Environment', 
            store: { type: 'webapi', api: { read: 'api/BIASecurity/ConnectionEnvironments' } }, flex: 1,
            plugins: { ptype: 'componentstorebind', dataField: 'EnvironmentId' }
        }
    ]
});