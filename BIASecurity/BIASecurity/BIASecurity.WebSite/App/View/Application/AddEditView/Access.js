Ext.define('App.View.Application.AddEditView.Access', {
    extend: 'App.View.Component.List.Container',
    alias: 'widget.App-View-Application-AddEditView-Access',

    cls: 'applicationAddeditviewAccess',
    layout: {
        type: 'hbox',
        align: 'stretch',
        pack: 'start'
    },
    scrollable: true,
    // This page will show the Users who have access to this app, it will simply contain the existing Access List pre-filtered on the app
    sorts: [
        { property: 'AppCode', direction: 'ASC' },
        { property: 'AccessLevel', direction: 'ASC' }
    ],
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