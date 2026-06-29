Ext.define('App.View.Connections.ConnectionUser.Component.ActiveFlag', {
    extend: 'App.View.Connections.Component.FieldContainer',
    alias: 'widget.App-View-Connections-ConnectionUser-Component-ActiveFlag',

    cls: 'connectionsConnectionuserComponentActiveflag',
    //store: { type: 'webapi', api: { read: 'api/BIASecurity/ConnectionUserInfo' } },
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