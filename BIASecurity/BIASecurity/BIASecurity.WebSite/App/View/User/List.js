Ext.define('App.View.User.List', {
    extend: 'App.View.Component.List.Container',
    alias: 'widget.App-View-User-List',

    //biaPageView: true,
    //biaPageViewTitle: 'User List',

    searchList: true,

    addItemWindowClass: 'App.View.User.NewUserWindow',
    addItemButtonHover: 'Add a New User',
    addItemRequiredAccess: 'Admin',

    listItem: 'App-View-User-List-ItemGrid',
    sorts: [
        { property: 'Status', direction: 'DESC' }
    ],

    cls: 'userList',
    layout: {
        type: 'vbox',
        align: 'stretch',
        pack: 'start'
    },

    items: [
        { xtype: 'App-View-User-List-View', flex: 1, itemId: 'UserList' }
    ]
});