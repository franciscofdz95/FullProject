Ext.define('App.Controller.User.AddEditView.Delegates', {
    extend: 'Ext.app.Controller',
    init: function init() {
        this.control({
            'App-View-User-AddEditView-Delegates': {
                beforerender: this.BeforeRender
            },
            'App-View-User-AddEditView-DelegateList-View': {
                beforerender: this.ViewBeforeRender
            },
            'App-View-User-AddEditView-DelegateList-Display': {
                beforerender: this.DelegateItemBeforeRender
            },
            'App-View-User-AddEditView-DelegateList-Display #extendButton': {
                click: this.ExtendClick
            },
            'App-View-User-AddEditView-DelegateList-Display #deleteButton': {
                click: this.DeleteClick
            },
            'App-View-User-AddEditView-DelegatorList-View': {
                beforerender: this.ViewBeforeRender
            },
            'App-View-User-AddEditView-Delegates #addDelegateButton': {
                click: this.AddDelegateClick
            }
        });
    },
    BeforeRender: function BeforeRender(me) {
        var container = me.up('[user]'),
            addDelegateButton = me.down('#addDelegateButton');

        if (container.user.ADID.toLowerCase() == BIACore.Security.User.adId.toLowerCase() || BIACore.Security.User.isSA()) {
            addDelegateButton.setHidden(false);
        }
    },
    ViewBeforeRender: function ViewBeforeRender(me) {
        var container = me.up('[user]');

        me.store.getProxy().extraParams = Ext.apply(me.store.getProxy().extraParams, {
            userId: container.user.ADID
        });
    },
    DelegateItemBeforeRender: function DelegateItemBeforeRender(me) {
        var container = me.up('[user]'),
            extendButton = me.down('#extendButton'),
            deleteButton = me.down('#deleteButton');

        if (container.user.ADID.toLowerCase() == BIACore.Security.User.adId.toLowerCase() || BIACore.Security.User.isSA()) {
            extendButton.setHidden(false);
            deleteButton.setHidden(false);
        }
    },
    AddDelegateClick: function AddDelegateClick(me) {
        var container = me.up('App-View-User-AddEditView-Delegates'),
            views = container.query('App-View-User-AddEditView-Profile-Component-InfoList'),
            profile = me.up('[user]');

        var win = Ext.create('App.View.User.AddEditView.DelegateWindow', {
            userId: profile.user.UserId,
            adId: profile.user.ADID,
            views: views
        });

        win.show();
    },
    ExtendClick: function ExtendClick(me) {
        var display = me.up('App-View-User-AddEditView-DelegateList-Display'),
            view = me.up('App-View-User-AddEditView-DelegateList-View'),
            expirationDT = display.user.expirationDT;

        expirationDT.setDate(expirationDT.getDate() + 90);

        Ext.Msg.confirm('Extend Delegate', 'Extend delegate 90 days?', function (btn){
            if (btn == 'yes') {
                BIA.Ajax.request({
                    url: 'api/BIASecurity/UpdateDelegateExpiration',
                    jsonData: {
                        delegateId: display.user.ID,
                        expirationDate: expirationDT
                    },
                    callback: function callback(request, success, response) {
                        if (!success)
                            Ext.Msg.alert('Failed', 'Save failed');

                        view.removeAll();
                        view.store.load();
                    }
                });
            }
        });
    },
    DeleteClick: function DeleteClick(me) {
        var display = me.up('App-View-User-AddEditView-DelegateList-Display'),
            view = me.up('App-View-User-AddEditView-DelegateList-View');

        Ext.Msg.confirm('Delete Delegate', 'Delete delegate?', function (btn) {
            if (btn == 'yes') {
                BIA.Ajax.request({
                    url: 'api/BIASecurity/DeleteDelegate',
                    jsonData: {
                        delegateId: display.user.ID
                    },
                    callback: function callback(request, success, response) {
                        if (!success)
                            Ext.Msg.alert('Failed', 'Save failed');

                        view.removeAll();
                        view.store.load();
                    }
                });
            }
        });
    }
});