Ext.define('App.View.EA.EARegulatedGoods', {
    extend: 'Ext.container.Container',
    alias: 'widget.App-View-EA-EARegulatedGoods',
    itemId: 'EARegulatedGoodsPanelId',
    closable: true,
    hidden: true,
    scrollable: false,
    minWidth: 600,
    minHeight: 500,
    bodyPadding: 10,
    collapsible: false,
    defaults: {
        margin: '5 2 5 2',
        padding: '8 5 8 5',
        border: false,
    },
    layout: {
        type: 'hbox',
        align: 'middle',
        pack: 'center'
    },
    viewModel: {
        data: {
            EA_USHazMat: 'N',
            EA_NonUSHazMat: 'N',
            EA_Wine: 'No',
            EA_Tobacco: 'No',
            EA_Hemp:'No',
            EA_ISC: 'No',
            EA_IHVW: 'No',
            EA_WineExport: 'No',
            EA_ReadOnly: 'No',
            EA_ReadOnly: 'No',
            EA_2DAHandgun: 'No',
            EA_UserAdmin:'No'
        }
    },
    items: [
        {
            xtype: 'form',
            border: false,
            itemId:'EARGContentTable',
            layout: {
                type: 'table',
                columns: 2,
                align: 'stretch'
            },       
            defaults: {
                margin: '5 5 5 5',
                padding: '3 5 3 5',
                labelWidth: 150,
                width: 250
            },
            buttonAlign: 'center',
            buttons: [
                { xtype: 'button', itemId: 'btnEASave', text: 'Save', margin: '5 5 5 5' },
                { xtype: 'button', itemId: 'btnEACancel', text: 'Cancel', margin: '5 5 5 5' }
            ],
            items: [
                {
                    xtype: 'combobox',
                    fieldLabel: 'US HazMat User:',
                    displayField: 'Name',
                    valueField: 'Code',
                    itemId: 'EAUSHazmat',
                    bind:  '{EA_USHazMat}',
                    store: Ext.create('Ext.data.Store', {
                        fields: ['Name', 'Code'],
                        data: [
                            { "Name": "Yes", "Code": "Y" },
                            { "Name": "No", "Code": "N" }
                        ]
                    })
                },
                 {
                    xtype: 'combobox',
                    fieldLabel: 'Intl HazMat User:',
                    displayField: 'Name',
                    valueField: 'Code',
                     itemId: 'EANonUSHazMat',
                     bind:'{EA_NonUSHazMat}' ,
                    store: Ext.create('Ext.data.Store', {
                        fields: ['Name', 'Code'],
                        data: [
                            { "Name": "Yes", "Code": "Y" },
                            { "Name": "No", "Code": "N" }
                        ]
                    })
                },
                {
                    xtype: 'combobox',
                    fieldLabel:'Wine User:',
                    displayField: 'Name',
                    valueField: 'Code',
                    itemId: 'EAWine',
                    bind: '{EA_Wine}',
                    store: Ext.create('Ext.data.Store', {
                        fields: ['Name', 'Code'],
                        data: [
                            { "Name": "Yes", "Code": "Yes" },
                            { "Name": "No", "Code": "No" }
                        ]
                    }),
                    queryMode: 'local',
                    typeAhead: true
                },
                 {
                    xtype: 'combobox',
                    fieldLabel:'Tobacco User:',
                    displayField: 'Name',
                    valueField: 'Code',
                     itemId: 'EATobacco',
                     bind:  '{EA_Tobacco}',
                    store: Ext.create('Ext.data.Store', {
                        fields: ['Name', 'Code'],
                        data: [
                            { "Name": "Yes", "Code": "Yes" },
                            { "Name": "No", "Code": "No" }
                        ]
                    }),
                    queryMode: 'local',
                    typeAhead: true
                },
                {
                    xtype: 'combobox',
                    fieldLabel:'Hemp User:',
                    displayField: 'Name',
                    valueField: 'Code',
                    itemId: 'EAHemp',
                    bind: '{EA_Hemp}',
                    store: Ext.create('Ext.data.Store', {
                        fields: ['Name', 'Code'],
                        data: [
                            { "Name": "Yes", "Code": "Yes" },
                            { "Name": "No", "Code": "No" }
                        ]
                    }),
                    queryMode: 'local',
                    typeAhead: true
                },
                {
                    xtype: 'combobox',
                    fieldLabel:'ISC User:',
                    displayField: 'Name',
                    valueField: 'Code',
                    itemId: 'EAISC',
                    bind: '{EA_ISC}',
                    store: Ext.create('Ext.data.Store', {
                        fields: ['Name', 'Code'],
                        data: [
                            { "Name": "Yes", "Code": "Yes" },
                            { "Name": "No", "Code": "No" }
                        ]
                    }),
                    queryMode: 'local',
                    typeAhead: true
                },
                {
                    xtype: 'combobox',
                    fieldLabel:'IHVW User:',
                    displayField: 'Name',
                    valueField: 'Code',
                    itemId: 'EAIHVW',
                    bind: '{EA_IHVW}',
                    store: Ext.create('Ext.data.Store', {
                        fields: ['Name', 'Code'],
                        data: [
                            { "Name": "Yes", "Code": "Yes" },
                            { "Name": "No", "Code": "No" }
                        ]
                    }),
                    queryMode: 'local',
                    typeAhead: true
                },{
                    xtype: 'combobox',
                    fieldLabel:'Export Wine Customers:',
                    displayField: 'Name',
                    valueField: 'Code',
                    itemId: 'EAWineExport',
                    bind: '{EA_WineExport}',
                    store: Ext.create('Ext.data.Store', {
                        fields: ['Name', 'Code'],
                        data: [
                            { "Name": "Yes", "Code": "Yes" },
                            { "Name": "No", "Code": "No" }
                        ]
                    }),
                    queryMode: 'local',
                    typeAhead: true
                },{
                    xtype: 'combobox',
                    fieldLabel:'Read-Only Access:',
                    displayField: 'Name',
                    valueField: 'Code',
                    itemId: 'EAReadOnly',
                    bind: '{EA_ReadOnly}',
                    store: Ext.create('Ext.data.Store', {
                        fields: ['Name', 'Code'],
                        data: [
                            { "Name": "Yes", "Code": "Yes" },
                            { "Name": "No", "Code": "No" }
                        ]
                    }),
                    queryMode: 'local',
                    typeAhead: true
                },{
                    xtype: 'combobox',
                    fieldLabel:'2DA Handgun User:',
                    displayField: 'Name',
                    valueField: 'Code',
                    itemId: 'EA2DAHandgun',
                    bind: '{EA_2DAHandgun}',
                    store: Ext.create('Ext.data.Store', {
                        fields: ['Name', 'Code'],
                        data: [
                            { "Name": "Yes", "Code": "Yes" },
                            { "Name": "No", "Code": "No" }
                        ]
                    }),
                    queryMode: 'local',
                    typeAhead: true
                },{
                    xtype: 'combobox',
                    fieldLabel:'User Admin:',
                    displayField: 'Name',
                    valueField: 'Code',
                    itemId: 'EAUserAdmin',
                    bind: '{EA_UserAdmin}',
                    store: Ext.create('Ext.data.Store', {
                        fields: ['Name', 'Code'],
                        data: [
                            { "Name": "Yes", "Code": "Yes" },
                            { "Name": "No", "Code": "No" }
                        ]
                    }),
                    queryMode: 'local',
                    typeAhead: true
                },

            ]
        }
    ]
});