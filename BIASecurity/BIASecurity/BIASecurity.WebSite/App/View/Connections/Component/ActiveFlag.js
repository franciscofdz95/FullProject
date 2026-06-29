Ext.define('App.View.Connections.Component.ActiveFlag', {
    extend: 'App.View.Connections.Component.FieldContainer',
    alias: 'widget.App-View-Connections-Component-ActiveFlag',

    cls: 'connectionsComponentActiveflag',
    layout: {
        type: 'hbox',
        align: 'stretch',
        pack: 'start'
    },

    items: [
        {
            xtype: 'checkbox', itemId: 'Active', fieldLabel: 'Active', value: true, 
            plugins: { ptype: 'componentstorebind', dataField: 'Active' }
        }
    ]
});