Ext.define('App.View.Application.List.Item.Status.OfflineWindow', {
    extend: 'Ext.window.Window',
    alias: 'widget.App-View-Application-List-Item-Status-OfflineWindow',

    layout: {
        type: 'vbox',
        align: 'stretch'
    },

    title: 'Application Offline',
    width: 500,
    bodyPadding: 10,
    modal: true,

    items: [
        { xtype: 'container', html: 'Are you sure you want to take the application offline?' },
        { xtype: 'container', html: 'Please enter a message to display while the application is offline.', margin: '10 0 0 0' },
        {
            xtype: 'textfield',
            itemId: 'activeMsg',
            margin: '5 0 0 0',
            allowBlank: false
        }
    ],
    buttons: [
        { itemId: 'saveButton', text: 'Take Offline' },
        { itemId: 'cancelButton', text: 'Cancel' }
    ]
});