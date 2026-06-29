Ext.define('App.View.Application.List.Item.Request', {
    extend: 'App.View.Component.List.Item.ConditionalIcon',
    alias: 'widget.App-View-Application-List-Item-Request',

    cls: 'appListItemIcon',
    iconProperty: 'hasAccess',
    icons: {
        No: '<i class="fa fa-plus-square" style="cursor: pointer;" data-qtip="Request Application Access"></i>',
        Yes: ''
    }
});