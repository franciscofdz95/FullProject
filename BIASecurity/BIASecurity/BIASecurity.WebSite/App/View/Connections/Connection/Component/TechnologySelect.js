Ext.define('App.View.Connections.Connection.Component.TechnologySelect', {
    extend: 'App.View.Connections.Component.FieldContainer',
    alias: 'widget.App-View-Connections-Connection-Component-TechnologySelect',

    cls: 'connectionsConnectionComponentTechnologyselect',
    layout: {
        type: 'hbox',
        align: 'middle',
        pack: 'start'
    },

    items: [
        {
            xtype: 'connectionsComboBox', itemId: 'TechnologyId', fieldLabel: 'Technology',
            store: { type: 'webapi', api: { read: 'api/BIASecurity/ConnectionTechnology' } }, flex: 1, margin: '0 5 0 0',
            plugins: { ptype: 'componentstorebind', dataField: 'TechnologyId' }
        }
    ]
});