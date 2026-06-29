Ext.define('App.View.User.AddEditView', {
    extend: 'Ext.container.Container',
    alias: 'widget.App-View-User-AddEditView',

    cls: 'userAddeditview',
    layout: {
        type: 'vbox',
        align: 'stretch',
        pack: 'start'
    },
    userId: null,
    formType: 'View',

    items: [
        { xtype: 'App-View-User-AddEditView-Title', padding: '5 5 10' },
        {
            xtype: 'tabpanel',
            flex: 1,
            plain: true,
            tabBar: { cls: 'userAddeditviewTabbar' },
            defaults: { padding: '15 10 10' },
            items: [
                { xtype: 'App-View-User-AddEditView-Profile', title: 'Profile' },
                { xtype: 'App-View-User-AddEditView-Access', title: 'Access' },
                { xtype: 'App-View-User-AddEditView-Delegates', title: 'Delegates' }
            ]
        },
        { xtype: 'App-View-Component-ButtonContainer', title: 'Buttons', show_delete: false }
    ]
});