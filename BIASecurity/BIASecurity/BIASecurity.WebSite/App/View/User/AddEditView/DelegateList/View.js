Ext.define('App.View.User.AddEditView.DelegateList.View', {
    extend: 'App.View.User.AddEditView.Profile.Component.InfoList',
    alias: 'widget.App-View-User-AddEditView-DelegateList-View',

    layout: {
        type: 'vbox'
    },
    scrollable: true,
    itemXtype: 'App-View-User-AddEditView-DelegateList-Display',

    getUserOnStoreLoad: false,
    store: {
        type: 'webapi',
        api: {
            read: 'api/BIASecurity/UserDelegates'
        }
    }
});