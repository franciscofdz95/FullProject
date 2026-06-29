Ext.define('App.View.User.AddEditView.Access', {
    extend: 'Ext.container.Container',
    alias: 'widget.App-View-User-AddEditView-Access',

    cls: 'userAddeditviewRoles',
    layout: {
        type: 'hbox',
        align: 'stretch',
        pack: 'start'
    },
    items: [
        {
            xtype: 'App-View-Access-List',
            flex: 1,
            itemId: 'AccessListMini',
            displayChild: true,
            filterValues: {
                access: ['Yes', 'Pending']
            }
        }
    ]
});