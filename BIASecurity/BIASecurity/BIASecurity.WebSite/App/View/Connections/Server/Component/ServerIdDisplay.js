Ext.define('App.View.Connections.Server.Component.ServerIdDisplay', {
    extend: 'App.View.Connections.Component.FieldContainer',
    alias: 'widget.App-View-Connections-Server-Component-ServerIdDisplay',

    cls: 'connectionsServerComponentServeriddisplay',
    layout: {
        type: 'hbox',
        align: 'stretch',
        pack: 'start'
    },

    items: [
        {
            xtype: 'hiddenfield', fieldLabel: 'Server Id', itemId: 'ServerId', labelWidth: 85,
            plugins: { ptype: 'componentstorebind', dataField: 'ServerId' }
        }
    ]
});