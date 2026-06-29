Ext.define('App.View.Application.AddEditView.Subscription.Window', {
    extend: 'Ext.window.Window',
    alias: 'widget.App-View-Application-AddEditView-Subscription-Window',

    layout: {
        type: 'vbox',
        align: 'stretch',
        pack: 'start'
    },
    modal: true,
    bodyPadding: 10,
    width: 400,
    title: 'Add Subscription',

    items: [
        {
            xtype: 'combobox',
            itemId: 'typeField',
            labelAlign: 'top',
            fieldLabel: 'Subscription Type',
            flex: 1,
            store: {
                type: 'webapi',
                proxy: {
                    type: 'webapi',
                    api: {
                        read: 'api/BIASecurity/GetSubscriptionTypes'
                    }
                }
            },
            valueField: 'Id',
            displayField: 'Name',
            forceSelection: true,
            minChars: 2,
            allowBlank: false
        },
        {
            xtype: 'combobox',
            itemId: 'userField',
            labelAlign: 'top',
            fieldLabel: 'User',
            flex: 1,
            margin: '10 0 0 0',
            store: {
                type: 'webapi',
                proxy: {
                    type: 'webapi',
                    api: {
                        read: 'api/BIASecurity/UserFilter'
                    }
                }
            },
            valueField: 'Id',
            displayField: 'Name',
            forceSelection: true,
            minChars: 2,
            allowBlank: false
        }
    ],
    buttons: [
        { itemId: 'confirmButton', text: 'Add Subscription' },
        { itemId: 'cancelButton', text: 'Cancel' }
    ]
});