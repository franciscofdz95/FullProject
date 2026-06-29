Ext.define('App.View.Application.AddEditView.Title', {
    extend: 'App.View.Component.AddEditView.Title',
    alias: 'widget.App-View-Application-AddEditView-Title',

    cls: 'applicationAddeditviewTitle',
    store: { type: 'webapi', api: { read: 'api/BIASecurity/AppBaseInfo' } },
    loadStoreOnInit: true,
    height: 24,
    getAppOnStoreLoad: true,

    items: [
        {
            xtype: 'label', itemId: 'App_Application',
            plugins: { ptype: 'componentstorebind', dataField: 'AppCode' }
        },
        {
            xtype: 'label', html: '&nbsp;-&nbsp;'
        },
        {
            xtype: 'label', itemId: 'AppName',
            plugins: { ptype: 'componentstorebind', dataField: 'AppName' }
        }
    ]
});