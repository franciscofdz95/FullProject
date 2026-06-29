Ext.define('App.View.Admin.ComponentCatalog.AdminMenuItem', {
    extend: 'App.View.Admin.Menu.Item.Container',
    alias: 'widget.App-View-Admin-ComponentCatalog-AdminMenuItem',
    itemText: '<i class="fa fa-book fa-2x" aria-hidden="true" style="vertical-align:middle; padding: 6px"></i>BIACore Component Catalog',
    cls: 'adminCatalogMenuItem',
    eventToFire: {
        eventName: 'gotoNewContent',
        params: { xtype: 'App-View-Admin-ComponentCatalog-Container' }
    }
});