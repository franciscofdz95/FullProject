Ext.define('App.view.Security.Filter', {
    extend: (Ext.platformTags && Ext.platformTags.modern) ? 'Ext.Panel' : 'Ext.panel.Panel',
    alias: 'widget.App-Security-Filter',
    layout: 'column',
    items: [
        { xtype: 'clearNumber', itemId: 'LogId', emptyText: 'Log Id' },
        { xtype: 'datefield', itemId: 'BeginDate', value: new Date() },
        { xtype: 'datefield', itemId: 'EndDate', value: new Date() },
        {
            xtype: 'comboarray', itemId: 'UserId', emptyText: 'User Id', minChars: 2,
            store: { type: 'webapi', api: { read: 'api/AppSecurity/UserId' }, remoteFilter: true }
        },
        {
            xtype: 'comboarray', itemId: 'TargetId', emptyText: 'Target Id', minChars: 2,
            store: { type: 'webapi', api: { read: 'api/AppSecurity/TargetId' }, remoteFilter: true }
        },
        {
            xtype: 'comboarray', itemId: 'Client', emptyText: 'Client', minChars: 2,
            store: { type: 'webapi', api: { read: 'api/AppSecurity/Client' }, remoteFilter: true }
        },
        {
            xtype: 'comboarray', itemId: 'Event', emptyText: 'Event', minChars: 2,
            store: { type: 'webapi', api: { read: 'api/AppSecurity/Event' }, remoteFilter: true }
        }
    ]
});