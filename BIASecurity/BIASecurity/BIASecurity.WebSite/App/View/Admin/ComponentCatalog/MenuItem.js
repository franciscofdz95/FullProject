Ext.define('App.View.Admin.ComponentCatalog.MenuItem', {
    extend: 'App.View.Admin.Menu.Item.Container',
    alias: 'widget.App-View-Admin-ComponentCatalog-MenuItem',
    itemText: 'BIACore ExtJS Component Catalog',
    eventToFire: {
        eventName: 'gotoNewContent',
        params: { xtype: 'App-View-Admin-ComponentCatalog-Container' }
    }
});