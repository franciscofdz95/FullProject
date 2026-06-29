Ext.define('App.View.Application.AddEditView.AccessGeos.View', {
    extend: 'App.View.Application.AddEditView.Component.InfoList',
    alias: 'widget.App-View-Application-AddEditView-AccessGeos-View',

    cls: 'applicationAddeditviewAccessgeosView',
    itemXtype: 'App-View-Application-AddEditView-AccessGeos-Display',

    store: {
        type: 'webapi',
        api: {
            read: 'api/BIASecurity/GetAppGeos'
        }
    },
    scrollable: true,
    flex: 1,
    //height: '100%',
    layout: {
        type: 'vbox',
        align: 'stretch',
        pack: 'start'
    }
});