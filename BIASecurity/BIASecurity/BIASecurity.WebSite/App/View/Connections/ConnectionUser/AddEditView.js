Ext.define('App.View.Connections.ConnectionUser.AddEditView', {
    extend: 'App.View.Connections.Component.AddEditViewWindow',
    alias: 'widget.App-View-Connections-ConnectionUser-AddEditView',

    UserId: null,
    store: { type: 'webapi', api: { read: 'api/BIASecurity/ConnectionUserInfo' } },

    title: 'Login',
    purpose: 'View',
    cls: 'connectionsConnectionuserAddeditview',
    padding: 5,
    layout: {
        type: 'vbox',
        align: 'middle',
        pack: 'start'
    },
    purposeItemConfig: {
        Add: [
            { xtype: 'App-View-Connections-ConnectionUser-Component-UsernameEntry' },
            { xtype: 'App-View-Connections-ConnectionUser-Component-AuthStringEntry' },
            { xtype: 'App-View-Connections-ConnectionUser-Component-ActiveFlag' },
            { xtype: 'connectionsAddEditButtonContainer' }
        ],
        Edit: [
            { xtype: 'App-View-Connections-ConnectionUser-Component-UsernameSelect', readOnly: true, editable: false },
            { xtype: 'App-View-Connections-ConnectionUser-Component-AuthStringEntry' },
            { xtype: 'App-View-Connections-ConnectionUser-Component-ActiveFlag' },
            { xtype: 'connectionsAddEditButtonContainer' }
        ],
        AuthKeyEdit: [
            { xtype: 'App-View-Connections-ConnectionUser-Component-UsernameSelect', readOnly: true, editable: false },
            { xtype: 'App-View-Connections-ConnectionUser-Component-AuthStringEntry' },
            { xtype: 'connectionsAddEditButtonContainer' }
        ],
        View: [
            { xtype: 'App-View-Connections-ConnectionUser-Component-UsernameSelect', readOnly: true, editable: false },
            { xtype: 'App-View-Connections-ConnectionUser-Component-AuthStringEntry', readOnly: true, editable: false },
            { xtype: 'App-View-Connections-ConnectionUser-Component-ActiveFlag', readOnly: true, editable: false }
        ]
    }
});