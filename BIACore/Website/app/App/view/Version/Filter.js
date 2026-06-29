Ext.define('App.view.Version.Filter', {
    extend: (Ext.platformTags && Ext.platformTags.modern) ? 'Ext.Panel' : 'Ext.panel.Panel',
    alias: 'widget.App-Version-Filter',
    layout: 'hbox',
    items: [
        { xtype: 'datefield', itemId: 'BeginDate', value: Ext.Date.add(new Date(), Ext.Date.DAY, -7) },
        { xtype: 'datefield', itemId: 'EndDate', value: new Date() },
        {
            xtype: 'comboarray', itemId: 'Server', emptyText: 'Server',
            store: { type: 'webapi', api: { read: 'api/AppLog/Server' }, remoteFilter: false }
        },
        {
            xtype: 'comboarray', itemId: 'AppCode', emptyText: 'AppCode',
            store: { type: 'webapi', api: { read: 'api/AppLog/AppCode' }, remoteFilter: false }
        }
    ]
});