Ext.define('App.View.User.AddEditView.Profile.PhoneList.View', {
    extend: 'App.View.User.AddEditView.Profile.Component.InfoList',
    alias: 'widget.App-View-User-AddEditView-Profile-PhoneList-View',

    cls: 'userAddeditviewProfilePhonelistView',
    itemXtype: 'App-View-User-AddEditView-Profile-PhoneList-Display',

    store: {
        type: 'webapi',
        api: {
            read: 'api/BIASecurity/UserProfilePhoneList'
        }
    }
});