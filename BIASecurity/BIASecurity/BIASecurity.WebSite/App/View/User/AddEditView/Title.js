Ext.define('App.View.User.AddEditView.Title', {
    extend: 'App.View.Component.AddEditView.Title',
    alias: 'widget.App-View-User-AddEditView-Title',

    cls: 'userAddeditviewTitle',

    store: { type: 'webapi', api: { read: 'api/BIASecurity/UserBaseInfo' } },
    loadStoreOnInit: true,
    getUserOnStoreLoad: true,

    defaults: { margin: '0 10 0 0', cls: 'userAddeditviewTitleFields' },
    items: [
        { xtype: 'label', itemId: 'FormTypeTitle', plugins: { ptype: 'componentstorebind', dataField: 'FormTitle' } },
        { xtype: 'label', text: '-'} ,
        { xtype: 'label', itemid: 'UserDisplay', plugins: { ptype: 'componentstorebind', dataField: 'UserDisplay' } }
    ]
});