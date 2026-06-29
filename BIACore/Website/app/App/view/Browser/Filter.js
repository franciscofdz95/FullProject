Ext.define('App.view.Browser.Filter', {
    extend: (Ext.platformTags && Ext.platformTags.modern) ? 'Ext.Panel' : 'Ext.panel.Panel',
    alias: 'widget.App-Browser-Filter',
    layout: 'hbox',
    items: [
        { xtype: 'datefield', itemId: 'BeginDate', value: Ext.Date.add(new Date(), Ext.Date.DAY, -7) },
        { xtype: 'datefield', itemId: 'EndDate', value: new Date() },
        {
            xtype: 'comboarray', itemId: 'UserId', emptyText: 'UserId',
            store: { type: 'webapi', api: { read: 'api/AppLog/UserId' }, remoteFilter: true }
        },
        {
            xtype: 'comboarray', itemId: 'AppCode', emptyText: 'AppCode',
            store: { type: 'webapi', api: { read: 'api/AppLog/AppCode' }, remoteFilter: false }
        }
    ],
    initComponent: function () {
        var me = this;
        me.callParent(arguments);

        me.on({
            afterrender: function () { me.setBorder('0 0 1 0'); },
            scope: me
        });
    }
});