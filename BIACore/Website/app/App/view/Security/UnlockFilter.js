Ext.define('App.view.Security.Filter', {
    extend: (Ext.platformTags && Ext.platformTags.modern) ? 'Ext.Panel' : 'Ext.panel.Panel',
    alias: 'widget.App-Security-Filter',
    layout: 'column',
    items: [
        {
            xtype: 'comboarray', itemId: 'UserId', emptyText: 'User Id', minChars: 2,
            store: { type: 'webapi', api: { read: 'api/AppSecurity/UserId' }, remoteFilter: true }
        }
    ]
});