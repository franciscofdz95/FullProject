Ext.define('App.View.User.AddEditView.Profile.LocationList.View', {
    extend: 'App.View.User.AddEditView.Profile.Component.InfoList',
    alias: 'widget.App-View-User-AddEditView-Profile-LocationList-View',

    cls: 'userAddeditviewProfileLocationlistView',
    itemXtype: 'App-View-User-AddEditView-Profile-LocationList-Display',

    store: {
        type: 'webapi',
        api: {
            read: 'api/BIASecurity/UserProfileLocationList'
        }
    }
});