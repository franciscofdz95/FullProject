Ext.define('App.View.Admin.News.AddEditView', {
    extend: 'Ext.window.Window',
    alias: 'widget.App-View-Admin-News-AddEditView',
    title: 'BIA News',
    NewsId: null,
    width: 830,
    store: { type: 'webapi', api: { read: 'api/BIASecurity/GetBIAMessageInfo' } },    
    layout: {
        type: 'vbox',
        align: 'stretch',
        pack: 'start'
    },
    items: [
        { xtype: 'App-View-Admin-News-Component-NewsIdDisplay' },
        { xtype: 'App-View-Admin-News-FieldContainer', margin: '10 0 0' },
        { xtype: 'App-View-Admin-News-Component-MessageText', margin: '10 0 0 5' },
        { xtype: 'App-View-Admin-News-Component-ActiveFlag', value: true, margin: '10 0 0 10' },
        { xtype: 'connectionsAddEditButtonContainer', margin: '0 0 10' },
        { xtype: 'App-View-Admin-News-Component-NewsPreview' }
    ]
});