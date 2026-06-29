Ext.define('App.View.Admin.ActiveUser.Summary', {
    extend: 'Ext.container.Container',
    alias: 'widget.App-View-Admin-ActiveUser-Summary',

    cls: 'adminActiveuserSummary',
    layout: {
        type: 'hbox',
        align: 'middle',
        pack: 'start'
    },
    store: { type: 'webapi', api: { read: 'api/BIASecurity/GetActiveUserSummary' } },
    height: 55,
    items: [
        { xtype: 'label', cls: 'ActiveUserSummaryLabel', text: 'Server Summary:' }
    ]
});