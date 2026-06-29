Ext.define('App.View.Application.List.Item.Status.Requestable', {
    extend: 'App.View.Component.List.Item.ConditionalIcon',
    alias: 'widget.App-View-Application-List-Item-Status-Requestable',

    cls: 'ApplicationListItemStatusRequestable ApplicationListIcon',
    width: 23,
    
    iconProperty: 'Requestable',
    icons: [
        '<i class="fa fa-user-times NotRequestable" data-qtip="Users Can Not Request Access"></i>',
        '<i class="fa fa-user-plus Requestable" data-qtip="Users Can Request Access"></i>'
    ],
    msg: [
        'Are you sure you want to block users from requesting access?',
        'Are you sure you want to allow users to request access?'
    ]
});