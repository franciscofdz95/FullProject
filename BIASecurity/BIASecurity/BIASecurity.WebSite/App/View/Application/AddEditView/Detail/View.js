Ext.define('App.View.Application.AddEditView.Detail.View', {
    extend: 'Ext.container.Container',
    alias: 'widget.App-View-Application-AddEditView-Detail-View',

    cls: 'applicationAddeditviewDetailView',

    store: { type: 'webapi', api: { read: 'api/BIASecurity/AppSummary' } },
    loadStoreOnInit: true,
    getAppOnStoreLoad: true,
    showFieldEditPencil: true,

    scrollable: true,
    flex: 1,

    //height: '100%',
    layout: {
        type: 'vbox',
        align: 'stretch',
        pack: 'start'
    },
    items: [
        { xtype: 'App-View-Application-AddEditView-Detail-Display' }
    ]
});