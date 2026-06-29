Ext.define('App.View.Admin.ActiveUser.Component.Summary.Item', {
    extend: 'Ext.container.Container',
    alias: 'widget.App-View-Admin-ActiveUser-Component-Summary-Item',

    cls: 'adminActiveuserComponentSummaryItem Card',
    layout: {
        type: 'hbox',
        align: 'stretch',
        pack: 'start'
    },
    record: {},
    items: [
        { xtype: 'label', itemId: 'ServerLabel', cls: 'ServerLabel', prop: 'server', margin: '0 2 0 5', postText: ' =' },
        { xtype: 'label', itemId: 'UserCountLabel', cls: 'UserCountLabel', prop: 'UserCount', postText: ' Users' },
        { xtype: 'label', text: '/', margin: '0 2' },
        { xtype: 'label', itemId: 'VPNUserCountLabel', cls: 'VPNUserCountLabel', prop: 'VPNUserCount', postText: ' on VPN', margin: '0 5 0 0' }
    ]
});