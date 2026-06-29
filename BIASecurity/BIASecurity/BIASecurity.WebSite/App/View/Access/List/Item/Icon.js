Ext.define('App.View.Access.List.Item.Icon', {
    extend: 'App.View.Component.List.Item.ConditionalIcon',
    alias: 'widget.App-View-Access-List-Item-Icon',

    cls: 'accessListItemIcon',    

    icons: {
        Global: '<i class="fa fa-globe" data-qtip="Global Role"></i>',
        App: '<i class="fa fa-desktop" data-qtip="Application Role"></i>',
        Dept: '<i class="fa fa-briefcase" data-qtip="Department Role"></i>',
        Shared: '<i class="fa fa-users" data-qtip="Shared Role"></i>',
        Hierarchy: '<i class="fa fa-sitemap" data-qtip="Hierarchy Role"></i>'
    }
});
//TODO: Make app-level component? (Used in Role List & User AddEditView RoleList)