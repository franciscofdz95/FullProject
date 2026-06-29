Ext.define('App.View.Application.NewApplicationWindow', {
    extend: 'Ext.window.Window',
    alias: 'widget.App-View-Application-NewApplicationWindow',

    cls: 'applicationNewapplicationwindow',

    layout: {
        type: 'vbox',
        align: 'stretch',
        pack: 'start'
    },
    bodyPadding: 10,
    width: 500,
    modal: true,
    title: 'Create New Application',

    items: [
        {
            xtype: 'container',
            itemId: 'searchContainer',
            layout: {
                type: 'vbox',
                align: 'stretch'
            },
            items: [
                { xtype: 'label', text: 'Enter the new Application Code:' },
                { xtype: 'textfield', itemId: 'appCode', margin: '5 0 0 0', allowBlank: false },
                { xtype: 'label', text: 'Enter the new Application Name:', margin: '5 0 0 0' },
                { xtype: 'textfield', itemId: 'appName', margin: '5 0 0 0', allowBlank: false },
                { xtype: 'label', itemId: 'errorMessage', style: { color: 'red' }, margin: '5 0 0 0', hidden: true }
            ]
        }
    ],
    buttons: [
        { itemId: 'addButton', text: 'Create Application' },
        { itemId: 'cancelButton', text: 'Cancel' }
    ]
});