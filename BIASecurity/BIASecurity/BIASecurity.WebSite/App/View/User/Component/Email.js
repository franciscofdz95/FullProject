Ext.define('App.View.User.Component.Email', {
    extend: 'Ext.container.Container',
    alias: 'widget.App-View-User-Component-Email',

    cls: 'userListItemEmail',
    layout: {
        type: 'hbox',
        align: 'stretch',
        pack: 'start'
    },

    items: [
        //{
        //    xtype: 'label',
        //    flex: 1,
        //    dataField: 'Email'
        //},
        {
            xtype: 'container',
            cls: 'UserListIcon ClickableIcon TeamsIcon',
            //clickIcon: true,
            itemId: 'UserIMLink',
            padding: '0 3',
            icon: '<i class="fa fa-windows" data-qtip="Send user an IM"></i>'
        },
        {
            xtype: 'container',
            cls: 'UserListIcon ClickableIcon EmailIcon',
            //clickIcon: true,
            itemId: 'UserEmailLink',
            padding: '0 3',
            icon: '<i class="fa fa-envelope" data-qtip="Send user an email"></i>'
        }
    ]
});