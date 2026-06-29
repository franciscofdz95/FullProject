Ext.define('App.Controller.User.AddEditView', {
    extend: 'Ext.app.Controller',
    refs: [
        { ref: 'UserAddEditView', selector: 'App-View-User-AddEditView-Profile' }
    ],

    init: function init() {
        this.control({
            'App-View-User-AddEditView [store][getUserOnStoreLoad=true]': {
                storebeforeload: this.AddEditViewGetUserOnStoreLoadStoreBeforeLoad
            },
            'App-View-User-AddEditView App-View-Component-ButtonContainer #Save': {
                click: this.UserSaveClick
            },
            'App-View-User-AddEditView App-View-Component-ButtonContainer #Cancel': {
                click: this.UserCancelClick
            },
            'App-View-User-AddEditView tabpanel': {
                tabchange: this.UserTabChange
            }
        });
    },
    UserTabChange: function UserTabChange(me, newCard, oldCard, eOpts) {
        var container = me.up('App-View-User-AddEditView');
        var buttons = container.down('App-View-Component-ButtonContainer');
        var saveButton = buttons.down('#Save');
        if (newCard.title != 'Profile') saveButton.hide();
        else saveButton.show();
    },
    AddEditViewGetUserOnStoreLoadStoreBeforeLoad: function AddEditViewGetUserOnStoreLoadStoreBeforeLoad(me) {
        var userCnt = me.up('[userId]');
        if (userCnt && !Ext.isEmpty(userCnt.userId) && !Ext.isEmpty(userCnt.formType)) {
            me.store.getProxy().extraParams = { userId: userCnt.userId, formType: userCnt.formType };
        }
    },
    UserCancelClick: function UserCancelClick(me) {
        Ext.GlobalEvents.fireEvent('doAppDeepLink', 'gotoNewContent', { xtype: 'App-View-User-List', flex: 1 });
    },
    UserSaveClick: function UserSaveClick(me) {
        //ADD SAVE
        var userAddEditView = this.getUserAddEditView();
        if (userAddEditView) {
            var userRecord = {},
                fields = userAddEditView.query('field[hidden=false],hiddenfield');
            for (var i = 0; i < fields.length; i++) userRecord[fields[i].itemId] = fields[i].getValue();

            userAddEditView.mask('Saving User');

            BIA.Ajax.request({
                url: 'api/BIASecurity/UserAddEdit',
                method: 'POST',
                jsonData: userRecord,
                callback: function AddEditUserCallback(request, success, response) {
                    var userAddEditView = this.getUserAddEditView();
                    if (success) {
                        Ext.MessageBox.alert('User Save Success', 'The user was saved successfully.', function () {
                            if (this.getUserAddEditView()) {
                                var records = response.data;

                            }
                        }, this);
                    }
                    else {
                        Ext.MessageBox.alert('User Save UnSuccess', 'The user was not saved, please try again later.');
                    }
                    if (userAddEditView && userAddEditView.isMasked()) userAddEditView.unmask();
                },
                scope: this
            });
        }
    }
});