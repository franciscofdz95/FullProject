Ext.define('App.module.Browser', {
    extend: 'App.desktop.Module',
    alias: 'widget.App-module-Browser',

    title: 'Browser',
    iconCls: 'icon-report',

    layout: 'border',

    items: [
        { xtype: 'App-Browser-Filter', region: 'north' },
        {
            xtype: 'tabpanel', region: 'center',
            defaults: { border: false },
            items: [
                { xtype: 'App-Browser-Grid', title: 'Browser' },
                { xtype: 'App-Browser-GroupGrid', title: 'Browser Group' },
                { xtype: 'App-Browser-Graph', title: 'Chart' }
            ]
        }
    ]
});