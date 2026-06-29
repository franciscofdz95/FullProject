Ext.define('App.Controller.Application.AddEditView.Subscription.View', {
    extend: 'Ext.app.Controller',

    init: function init() {
        this.control({
            'App-View-Application-AddEditView-Detail #addSubscriptionButton': {
                click: this.AddClick
            },
            'App-View-Application-AddEditView-Subscription-Display #removeSubscriptionButton': {
                click: this.RemoveClick
            }
        });
    },
    AddClick: function AddClick(me) {
        var container = me.up('[appCode]'),
            detail = me.up('App-View-Application-AddEditView-Detail'),
            view = detail.down('App-View-Application-AddEditView-Subscription-View');

        Ext.create('App.View.Application.AddEditView.Subscription.Window', {
            appCode: container.appCode,
            view: view
        }).show();
    },
    RemoveClick: function RemoveClick(me) {
        var item = me.up('[application]'),
            view = me.up('App-View-Application-AddEditView-Subscription-View');

        Ext.Msg.confirm('Delete', 'Are you sure you want to delete this subscription?', function (buttonId) {
            if (buttonId == 'yes') {
                view.setLoading(true);
                BIA.Ajax.request({
                    url: 'api/BIASecurity/DeleteApplicationSubscription',
                    jsonData: {
                        appCode: item.application.AppCode,
                        userId: item.application.UserId,
                        subscriptionTypeId: item.application.SubscriptionTypeId
                    },
                    callback: function callback(request, success, response) {
                        if (!success)
                            Ext.Msg.alert('Failed', 'Delete failed');
                        else
                            Ext.Msg.alert('Success', 'Subscription deleted');

                        view.setLoading(false);
                        view.store.load();
                    }
                });
            }
        }, this);
    }
});