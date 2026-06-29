Ext.define('App.Controller.User.AddEditView.DelegateWindow', {
    extend: 'Ext.app.Controller',

    init: function init() {
        this.control({
            //'App-View-User-AddEditView-DelegateWindow': {
            //    beforerender: this.BeforeRender
            //},
            'App-View-User-AddEditView-DelegateWindow #confirmButton': {
                click: this.ConfirmClick
            },
            'App-View-User-AddEditView-DelegateWindow #cancelButton': {
                click: this.CancelClick
            }
        });
    },
    //BeforeRender: function BeforeRender(me) {
    //    var accessLevelField = me.down('#accessLevelField');

    //    if (!BIACore.Security.User.isSA()) {
    //        accessLevelField.setValue('User');
    //        accessLevelField.setDisabled(true);
    //    }
    //},
    ConfirmClick: function ConfirmClick(me) {
        var win = me.up('window'),
            userField = win.down('#userField'),
            applicationField = win.down('#applicationField'),
            //accessLevelField = win.down('#accessLevelField'),
            expirationField = win.down('#expirationField'),
            fields = win.query('field'),
            isValid = true;

        Ext.each(fields, function (a) { if (!a.isValid()) isValid = false; });

        if (isValid) {
            win.setLoading(true);
            BIA.Ajax.request({
                url: 'api/BIASecurity/InsertDelegate',
                jsonData: {
                    userId: win.adId,
                    delegateUserId: userField.getSelection().get('ADID'),
                    applicationCode: applicationField.getValue(),
                    //accessLevel: accessLevelField.getValue(),
                    expirationDate: expirationField.getValue()
                },
                callback: function callback(request, success, response) {
                    if (!success)
                        Ext.Msg.alert('Failed', 'Save failed');

                    Ext.each(win.views, function (a) {
                        a.removeAll();
                        a.store.load();
                    });

                    win.setLoading(false);
                    win.close();
                }
            });
        }
    },
    CancelClick: function CancelClick(me) {
        me.up('window').close();
    }
});