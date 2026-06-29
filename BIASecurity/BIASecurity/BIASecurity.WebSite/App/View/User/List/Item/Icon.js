Ext.define('App.View.User.List.Item.Icon', {
    extend: 'App.View.Component.List.Item.ConditionalIcon',
    alias: 'widget.App-View-User-List-Item-Icon',

    cls: 'userListItemIcon',
    iconProperty: 'UserType',
    icons: {
        ADUser: '<i class="fa fa-plus-square" style="cursor: pointer;" data-qtip="Request Application Access"></i>',
        GenericUser: '<i class="fa fa-user-o" data-qtip="Generic User"></i>'
    }
});