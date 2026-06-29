Ext.define('App.View.User.AddEditView.DelegateWindow', {
    extend: 'Ext.window.Window',
    alias: 'widget.App-View-User-AddEditView-DelegateWindow',

    layout: {
        type: 'vbox',
        align: 'stretch',
        pack: 'start'
    },
    modal: true,
    bodyPadding: 10,
    width: 700,
    title: 'Add Delegate',

    items: [
        {
            xtype: 'container',
            layout: { type: 'hbox', align: 'stretch' },
            items: [
                { xtype: 'label', style: { fontSize: '20px', fontWeight: 'bold', lineHeight: '35px' }, width: 135, text: 'Delegate:' },
                {
                    xtype: 'container',
                    layout: { type: 'vbox', align: 'stretch' },
                    flex: 1,
                    items: [
                        {
                            xtype: 'combobox',
                            itemId: 'userField',
                            flex: 1,
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
                        },
                        { xtype: 'App-View-Access-Request-User' },
                        { xtype: 'App-View-Access-Request-UserGeo' }
                    ]
                }
            ]
        },
        {
            xtype: 'container',
            layout: { type: 'hbox', align: 'stretch' },
            margin: '10 0 0 0',
            items: [
                { xtype: 'label', style: { fontSize: '20px', fontWeight: 'bold', lineHeight: '35px' }, width: 135, text: 'Application:' },
                {
                    xtype: 'combobox',
                    itemId: 'applicationField',
                    flex: 1,
                    store: {
                        type: 'webapi',
                        proxy: {
                            type: 'webapi',
                            api: {
                                read: 'api/BIASecurity/ApplicationFilter'
                            }
                        }
                    },
                    valueField: 'Id',
                    displayField: 'Name',
                    forceSelection: true,
                    minChars: 2,
                    allowBlank: false
                }
            ]
        },
        //{
        //    xtype: 'container',
        //    layout: { type: 'hbox', align: 'stretch' },
        //    margin: '10 0 0 0',
        //    items: [
        //        { xtype: 'label', style: { fontSize: '20px', fontWeight: 'bold', lineHeight: '35px' }, width: 135, text: 'Access Level:' },
        //        {
        //            xtype: 'combobox',
        //            itemId: 'accessLevelField',
        //            flex: 1,
        //            store: {
        //                type: 'memory',
        //                data: [
        //                    { Id: 'User', Name: 'User' },
        //                    { Id: 'Admin', Name: 'Admin' },
        //                    { Id: 'SA', Name: 'SA' }
        //                ]
        //            },
        //            valueField: 'Id',
        //            displayField: 'Name',
        //            forceSelection: true,
        //            minChars: 2,
        //            allowBlank: false
        //        }
        //    ]
        //},
        {
            xtype: 'container',
            layout: { type: 'hbox', align: 'stretch' },
            margin: '10 0 0 0',
            items: [
                { xtype: 'label', style: { fontSize: '20px', fontWeight: 'bold', lineHeight: '35px' }, width: 135, text: 'Expiration:' },
                {
                    xtype: 'datefield',
                    itemId: 'expirationField',
                    flex: 1,
                    allowBlank: false
                }
            ]
        }
    ],
    buttons: [
        { itemId: 'confirmButton', text: 'Save' },
        { itemId: 'cancelButton', text: 'Cancel' }
    ]
});