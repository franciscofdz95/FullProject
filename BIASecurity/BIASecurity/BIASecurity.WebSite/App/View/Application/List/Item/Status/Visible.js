Ext.define('App.View.Application.List.Item.Status.Visible', {
    extend: 'App.View.Component.List.Item.ConditionalIcon',
    alias: 'widget.App-View-Application-List-Item-Status-Visible',

    cls: 'ApplicationListItemStatusVisible ApplicationListIcon',
    width: 23,
    
    iconProperty: 'Visibility',
    icons: [
        '<i class="fa fa-eye-slash NotVisible" data-qtip="Users can not see App in lists"></i>',
        '<i class="fa fa-eye Visible" data-qtip="Users can see App in lists"></i>'
    ],
    msg: [
        'Are you sure you want to hide the application from the app list?',
        'Are you sure you want to show the application on the app list?'
    ]
});