Ext.define('App.module.MyReports', {
    extend: 'App.desktop.Module',
    alias: 'widget.App-module-MyReports',

    title: 'MyReports',
    iconCls: 'icon-brick',

    items: [
        { xtype: 'BIA-MyReports-Grid', title: null }
    ]
});