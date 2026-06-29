Ext.define('App.View.Access.Request.Window', {
    extend: 'Ext.window.Window',
    alias: 'widget.App-View-Access-Request-Window',

    cls: 'accessRequestwindowWindow',
    layout: {
        type: 'vbox',
        align: 'stretch',
        pack: 'start'
    },
    modal: true,
    //bodyPadding: 10,
    width: 700,
    title: 'Request Access',
    //defaults: { padding: 10 },
    items: [
        {
            xtype: 'container',
            layout: { type: 'hbox', align: 'stretch' },
            padding: '10 10 0 10',
            items: [
                { xtype: 'label', style: { fontSize: '20px', fontWeight: 'bold', lineHeight: '35px' }, width: 135, text: 'User:' },
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
            padding: '0 10 0 10',
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
        {
            xtype: 'container',
            layout: { type: 'hbox', align: 'stretch' },
            margin: '10 0 0 0',
            padding: '0 10 0 10',
            items: [
                { xtype: 'label', style: { fontSize: '20px', fontWeight: 'bold', lineHeight: '35px' }, width: 135, text: 'Request Geo:' },
                {
                    xtype: 'container',
                    layout: { type: 'vbox', align: 'stretch' },
                    flex: 1,
                    items: [
                        {
                            xtype: 'combobox',
                            itemId: 'geoField',
                            flex: 1,
                            store: {
                                type: 'webapi',
                                proxy: {
                                    type: 'webapi',
                                    api: {
                                        read: 'api/BIASecurity/GeoSearch'
                                    }
                                }
                            },
                            valueField: 'Id',
                            displayField: 'Name',
                            listConfig: {
                                tpl: [
                                    '<ul><tpl for=".">',
                                    '{[xindex === 1 || parent[xindex - 2].Group !== values.Group ? "<li class=\'group-combo-title\'>" + values.Group + "</li>" : ""]}',
                                    '<li role="option" class="x-boundlist-item">{Name}</li>',
                                    '</tpl></ul>'
                                ],
                                cls: 'group-combo',
                                maxHeight: 400
                            },
                            forceSelection: true,
                            minChars: 2,
                            allowBlank: false,
                            disabled: true
                        },
                        { xtype: 'App-View-Access-Request-RequestGeo' }
                    ]
                }
            ]
        },
        {
            xtype: 'container',
            layout: { type: 'hbox', align: 'stretch' },
            margin: '10 0 0 0',
            padding: '0 10 0 10',
            items: [
                { xtype: 'label', style: { fontSize: '20px', fontWeight: 'bold', lineHeight: '35px' }, width: 135, text: 'Access Level:' },
                {
                    xtype: 'combobox',
                    itemId: 'accessLevelField',
                    flex: 1,
                    store: {
                        type: 'memory',
                        data: [
                            { Id: 'User', Name: 'User' },
                            { Id: 'Admin', Name: 'Admin' },
                            { Id: 'SA', Name: 'SA' }
                        ]
                    },
                    valueField: 'Id',
                    displayField: 'Name',
                    forceSelection: true,
                    minChars: 2,
                    allowBlank: false
                }
            ]
        },
        {
            xtype: 'container',
            layout: { type: 'hbox', align: 'stretch' },
            margin: '10 0 10 0',
            padding: '0 10 0 10',
            items: [
                { xtype: 'label', style: { fontSize: '20px', fontWeight: 'bold', lineHeight: '35px' }, width: 135, text: 'Reason:' },
                {
                    xtype: 'textfield',
                    itemId: 'reasonField',
                    flex: 1,
                    allowBlank: false
                }
            ]
        },
        {
            xtype: 'container',
            itemId: 'FieldHelpHint',
            cls: 'fieldHelpHint',
            minHeight: 80,
            layout: { type: 'hbox', align: 'stretch' },
            margin: '0',
            padding: '5',
            html: '<b>Field Help:</b> As you navigate through this page, this section will update to provide help for each input field. '
        }
    ],
    buttons: [
        { itemId: 'confirmButton', text: 'Request Access', margin: '5 0 5 10' },
        { itemId: 'cancelButton', text: 'Cancel', margin: '5 10 5 10' }
    ]
});