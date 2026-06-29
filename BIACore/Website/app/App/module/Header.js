Ext.define('App.module.Header', {
    extend: 'App.desktop.Module',
    alias: 'widget.App-module-Header',

    title: 'Header',
    iconCls: 'icon-brick',

    items: [
        { xtype: 'App-Header-Panel' }
    ]
});