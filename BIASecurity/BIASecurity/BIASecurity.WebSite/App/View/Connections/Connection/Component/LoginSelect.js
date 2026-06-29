Ext.define('App.View.Connections.Connection.Component.LoginSelect', {
    extend: 'App.View.Connections.Component.FieldContainer',
    alias: 'widget.App-View-Connections-Connection-Component-LoginSelect',

    cls: 'connectionsConnectionComponentLoginselect',
    layout: {
        type: 'hbox',
        align: 'middle',
        pack: 'start'
    },

    items: [
        {
            xtype: 'connectionsComboBox', itemId: 'UserId', fieldLabel: 'Login', 
            store: { type: 'webapi', api: { read: 'api/BIASecurity/ConnectionUsers' } }, flex: 1, margin: '0 5 0 0',
            plugins: { ptype: 'componentstorebind', dataField: 'UserId' }
        },
        { xtype: 'App-View-Connections-Header-AddConnectionUser', displayType: 'NoText' }
    ]
});