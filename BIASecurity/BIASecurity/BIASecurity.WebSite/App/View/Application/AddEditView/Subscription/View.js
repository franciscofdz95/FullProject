Ext.define('App.View.Application.AddEditView.Subscription.View', {
    extend: 'App.View.Application.AddEditView.Component.InfoList',
    alias: 'widget.App-View-Application-AddEditView-Subscription-View',

    cls: 'applicationAddeditviewDetailSubscription',
    itemXtype: 'App-View-Application-AddEditView-Subscription-Display',

    store: {
        type: 'webapi',
        api: {
            read: 'api/BIASecurity/ApplicationSubscriptions'
        }
    },
    layout: {
        type: 'column',
        align: 'stretch',
        pack: 'start'
    }
});