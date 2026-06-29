Ext.define('App.View.User.AddEditView.DelegatorList.View', {
    extend: 'App.View.User.AddEditView.Profile.Component.InfoList',
    alias: 'widget.App-View-User-AddEditView-DelegatorList-View',

    layout: {
        type: 'vbox'
    },
    scrollable: true,
    itemXtype: 'App-View-User-AddEditView-DelegatorList-Display',

    getUserOnStoreLoad: false,
    store: {
        type: 'webapi',
        api: {
            read: 'api/BIASecurity/UserDelegators'
        }
    }
});