Ext.define('App.module.Version', {
    extend: 'App.desktop.Module',
    alias: 'widget.App-module-Version',

    title: 'Version',
    iconCls: 'icon-report',

    layout: 'border',

    items: [
        { xtype: 'App-Version-Filter', region: 'north' },
        { xtype: 'App-Version-Grid', region: 'center' }
    ]
});