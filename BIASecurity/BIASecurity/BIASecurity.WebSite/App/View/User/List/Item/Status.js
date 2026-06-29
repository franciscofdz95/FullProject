Ext.define('App.View.User.List.Item.Status', {
    extend: 'App.View.Component.List.Item.ConditionalIcon',
    alias: 'widget.App-View-User-List-Item-Status',

    cls: 'userListItemStatus',
    iconProperty: 'Status',
    icons: [
        '<i class="fa fa-circle Offline" data-qtip="User Offline"></i>',
        '<i class="fa fa-circle Active" data-qtip="User Active Today"></i>',
        '<i class="fa fa-circle Online" data-qtip="User Online"></i>'
    ]
});