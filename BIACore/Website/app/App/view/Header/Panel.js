Ext.define('App.view.Header.Panel', {
    extend: (Ext.platformTags && Ext.platformTags.modern) ? 'Ext.Panel' : 'Ext.panel.Panel',
    alias: 'widget.App-Header-Panel',

    layout: 'border',
    defaults: { border: false },
    items: [
        { xtype: 'biaheader', region: 'north', showNotification: true, showOtherTools: true, showTimeout: true },
        { xtype: 'panel', region: 'center' }
    ]
});