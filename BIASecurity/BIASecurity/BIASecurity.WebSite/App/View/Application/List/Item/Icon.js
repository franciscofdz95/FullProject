Ext.define('App.View.Application.List.Item.Icon', {
    extend: 'App.View.Component.List.Item.ConditionalIcon',
    alias: 'widget.App-View-Application-List-Item-Icon',

    cls: 'ApplicationListItemIcon',

    icons: {
        Yes: '<i class="fas fa-user-check" data-qtip="Access"></i>',
        No: '<i class="fas fa-user-times" data-qtip="No Access"></i>',
    }
});