Ext.define('App.View.Connections.Connection.Component.RawFlag', {
    extend: 'App.View.Connections.Component.FieldContainer',
    alias: 'widget.App-View-Connections-Connection-Component-RawFlag',

    cls: 'connectionsConnectionComponentRawFlag',
    layout: {
        type: 'hbox',
        align: 'stretch',
        pack: 'start'
    },

    items: [
        {
            xtype: 'checkbox', itemId: 'Raw', fieldLabel: 'Raw Connection', value: false,
            plugins: { ptype: 'componentstorebind', dataField: 'Raw' }
        }
    ]
});
