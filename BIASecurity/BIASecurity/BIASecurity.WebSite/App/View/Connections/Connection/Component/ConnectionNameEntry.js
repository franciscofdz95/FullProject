Ext.define('App.View.Connections.Connection.Component.ConnectionNameEntry', {
    extend: 'App.View.Connections.Component.FieldContainer',
    alias: 'widget.App-View-Connections-Connection-Component-ConnectionNameEntry',

    cls: 'connectionsConnectionComponentConnectionnameentry',
    layout: {
        type: 'vbox',
        align: 'stretch',
        pack: 'start'
    },

    items: [
        {
            xtype: 'connectionsTextfield', itemId: 'ConnectionName', fieldLabel: 'Connection Name', flex: 1, 
            plugins: { ptype: 'componentstorebind', dataField: 'ConnectionName' }           
        },
        {
            xtype: 'label', itemId: 'AddConnectionButton', cls: 'AddConnectionButton',
            text: 'The connection name must match the connection name used in your .Net or CF application (e.g. SMT or dsnSMT for CF)'
        }
    ]
});