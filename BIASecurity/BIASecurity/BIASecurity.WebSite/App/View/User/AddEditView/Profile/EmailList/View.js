Ext.define('App.View.User.AddEditView.Profile.EmailList.View', {
    extend: 'App.View.User.AddEditView.Profile.Component.InfoList',
    alias: 'widget.App-View-User-AddEditView-Profile-EmailList-View',

    cls: 'userAddeditviewProfileEmaillistView',
    itemXtype: 'App-View-User-AddEditView-Profile-EmailList-Display',

    store: {
        type: 'webapi',
        api: {
            read: 'api/BIASecurity/UserProfileEmailList'
        }
    }
});