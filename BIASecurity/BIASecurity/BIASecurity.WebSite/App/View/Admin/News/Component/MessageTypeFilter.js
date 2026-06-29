Ext.define('App.View.Admin.News.Component.MessageTypeFilter', {
    extend: 'App.View.Connections.Component.FieldContainer',
    alias: 'widget.App-View-Admin-News-Component-MessageTypeFilter',

    layout: {
        type: 'hbox',
        align: 'stretch',
        pack: 'start'
    },

    items: [
        {
            xtype: 'connectionsComboBox', itemId: 'MessageTypeId', fieldLabel: 'Type',
            store: { type: 'webapi', api: { read: 'api/BIASecurity/GetBIAMessageType' } }, flex: 1,
            plugins: { ptype: 'componentstorebind', dataField: 'MessageTypeId' }
        }
    ]
});