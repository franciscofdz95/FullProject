Ext.define('App.Controller.Application.AddEditView.Subscription.Window', {
    extend: 'Ext.app.Controller',

    init: function init() {
        this.control({
            'App-View-Application-AddEditView-Subscription-Window #confirmButton': {
                click: this.ConfirmClick
            },
            'App-View-Application-AddEditView-Subscription-Window #cancelButton': {
                click: this.CancelClick
            }
        });
    },
    ConfirmClick: function ConfirmClick(me) {
        var win = me.up('window'),
            userField = win.down('#userField'),
            typeField = win.down('#typeField');

        if (userField.isValid() && typeField.isValid()) {
            win.setLoading(true);
            BIA.Ajax.request({
                url: 'api/BIASecurity/InsertApplicationSubscription',
                jsonData: {
                    appCode: win.appCode,
                    userId: userField.getValue(),
                    subscriptionTypeId: typeField.getValue()
                },
                callback: function callback(request, success, response) {
                    if (!success)
                        Ext.Msg.alert('Failed', 'Save failed');
                    else
                        Ext.Msg.alert('Success', 'Subscription saved');

                    win.view.store.load();
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