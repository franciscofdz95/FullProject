Ext.define('App.View.Connections.Connection.Component.AppCodeSelect', {
    extend: 'App.View.Connections.Component.FieldContainer',
    alias: 'widget.App-View-Connections-Connection-Component-AppCodeSelect',

    cls: 'connectionsConnectionComponentAppcodeselect',
    layout: {
        type: 'hbox',
        align: 'middle',
        pack: 'start'
    },

    items: [
        {
            xtype: 'connectionsComboBox', itemId: 'AppCode', fieldLabel: 'AppCode', matchFieldWidth: false,
            store: { type: 'webapi', api: { read: 'api/BIASecurity/ConnectionAppCodes' } }, flex: 1, 
            plugins: { ptype: 'componentstorebind', dataField: 'AppCode' },
            tpl: Ext.create('Ext.XTemplate',
                '<ul class="x-list-plain connectionsConnectionComponentAppcodeselectList"><tpl for=".">',
                    '<li role="option" class="x-boundlist-item ',
                    '<tpl if="Active &lt; 1">inactive</tpl>',
                    '">{Display}</li>',
                '</tpl></ul>'
            )
        },
        { xtype: 'container', html: 'From BIA Security', cls: 'connectionsFieldInfoMsg' }
    ]
});