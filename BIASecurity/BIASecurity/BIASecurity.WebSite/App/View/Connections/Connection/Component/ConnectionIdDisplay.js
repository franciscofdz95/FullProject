Ext.define('App.View.Connections.Connection.Component.ConnectionIdDisplay', {
    extend: 'App.View.Connections.Component.FieldContainer',
    alias: 'widget.App-View-Connections-Connection-Component-ConnectionIdDisplay',

    cls: 'connectionsConnectionComponentConnectioniddisplay',
    layout: {
        type: 'hbox',
        align: 'stretch',
        pack: 'start'
    },

    items: [
        {
            xtype: 'hiddenfield', fieldLabel: 'Connection Id', itemId: 'ConnectionId', labelWidth: 85,
            plugins: { ptype: 'componentstorebind', dataField: 'ConnectionId' }
        }
    ]
});