Ext.define('App.View.EA.EACVBAT', {
    extend: 'Ext.container.Container',
    alias: 'widget.App-View-EA-EACVBAT',
    itemId: 'EACVBATPanelId',
    closable: true,
    hidden: true,
    scrollable: false,
    minWidth: 500,
    minHeight: 500,
    bodyPadding: 10,
    collapsible: true,
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
        data:
        {
            AccessAdmin: 'N',
            Debug: 'N',
            EditOverride: 'N',
            MyReportsHistory: 'N',
            NBS: 'N',
            NewsEditor: 'N',
            Export_4000_CSV: 'NA',
            Attributes: 'N',
            FlagSitesFlagEdit: 'N',
            Parent_Exception: 'N'
        }

    },
    items: [
        {
            xtype: 'form',
            border: false,
            itemId: 'EACVBATContentTable',
            layout: {
                type: 'table',
                columns: 3,
                align: 'stretch'
            },
            defaults: {
                margin: '2 2 2 2',
                padding: '2 2 2 2',
                labelWidth: 150,
                width: 350
            },
            buttonAlign: 'center',
            buttons: [
                { xtype: 'button', itemId: 'btnEASave', text: 'Save', margin: '5 5 5 5' },
                { xtype: 'button', itemId: 'btnEACancel', text: 'Cancel', margin: '5 5 5 5' }
            ],

            items: [
                {
                    xtype: 'combobox',
                    fieldLabel: 'Access Admin :',
                    displayField: 'Name',
                    valueField: 'Code',
                    itemId: 'cvbatAccessAdminId',
                    labelWidth: 150,
                    grow: true,
                    growToLongestValue: true,
                    bind: '{AccessAdmin}',
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
                    fieldLabel: 'Debug:',
                    displayField: 'Name',
                    valueField: 'Code',
                    itemId: 'cvbatDebugId',
                    labelWidth: 150,
                    grow: true,
                    growToLongestValue: true,
                    bind: '{Debug}',
                    store: Ext.create('Ext.data.Store', {
                        fields: ['Name', 'Code'],
                        data: [
                            { "Name": "Yes", "Code": "Y" },
                            { "Name": "No", "Code": "N" }
                        ]
                    }),
                    queryMode: 'local',
                    typeAhead: true
                },
                {
                    xtype: 'combobox',
                    fieldLabel: 'Edit Override:',
                    displayField: 'Name',
                    valueField: 'Code',
                    itemId: 'cvbatEditOverrideId',
                    labelWidth: 150,
                    bind: '{EditOverride}',
                    store: Ext.create('Ext.data.Store', {
                        fields: ['Name', 'Code'],
                        data: [
                            { "Name": "Yes", "Code": "Y" },
                            { "Name": "No", "Code": "N" }
                        ]
                    }),
                    queryMode: 'local',
                    typeAhead: true
                },
                {
                    xtype: 'combobox',
                    fieldLabel: 'My Reports History :',
                    displayField: 'Name',
                    valueField: 'Code',
                    itemId: 'cvbatMyReportsHistoryId',
                    labelWidth: 150,
                    bind: '{MyReportsHistory}',
                    store: Ext.create('Ext.data.Store', {
                        fields: ['Name', 'Code'],
                        data: [
                            { "Name": "Yes", "Code": "Y" },
                            { "Name": "No", "Code": "N" }
                        ]
                    }),
                    queryMode: 'local',
                    typeAhead: true
                },
                {
                    xtype: 'combobox',
                    fieldLabel: 'NBS :',
                    displayField: 'Name',
                    valueField: 'Code',
                    itemId: 'cvbatNBSId',
                    labelWidth: 150,
                    bind: '{NBS}',
                    store: Ext.create('Ext.data.Store', {
                        fields: ['Name', 'Code'],
                        data: [
                            { "Name": "Yes", "Code": "Y" },
                            { "Name": "No", "Code": "N" }
                        ]
                    }),
                    queryMode: 'local',
                    typeAhead: true
                }, {
                    xtype: 'combobox',
                    fieldLabel: 'News Editor :',
                    displayField: 'Name',
                    valueField: 'Code',
                    itemId: 'cvbatNewsEditorId',
                    labelWidth: 150,
                    bind: '{NewsEditor}',
                    store: Ext.create('Ext.data.Store', {
                        fields: ['Name', 'Code'],
                        data: [
                            { "Name": "Yes", "Code": "Y" },
                            { "Name": "No", "Code": "N" }
                        ]
                    }),
                    queryMode: 'local',
                    typeAhead: true
                }, {
                    xtype: 'combobox',
                    fieldLabel: 'Export 4000 CSV :',
                    displayField: 'Name',
                    valueField: 'Code',
                    itemId: 'cvbatExportCSVId',
                    labelWidth: 150,
                    bind: '{Export_4000_CSV}',
                    store: Ext.create('Ext.data.Store', {
                        fields: ['Name', 'Code'],
                        data: [
                            { "Name": "NA", "Code": "NA" },
                            { "Name": "Yes", "Code": "Y" },
                            { "Name": "No", "Code": "N" }
                        ]
                    }),
                    queryMode: 'local',
                    typeAhead: true
                }, {
                    xtype: 'combobox',
                    fieldLabel: 'Attributes :',
                    displayField: 'Name',
                    valueField: 'Code',
                    itemId: 'cvbatAttributesId',
                    labelWidth: 150,
                    bind: '{Attributes}',
                    store: Ext.create('Ext.data.Store', {
                        fields: ['Name', 'Code'],
                        data: [
                            { "Name": "Yes", "Code": "Y" },
                            { "Name": "No", "Code": "N" }
                        ]
                    }),
                    queryMode: 'local',
                    typeAhead: true
                }, {
                    xtype: 'combobox',
                    fieldLabel: 'Flag Sites Flag Edit :',
                    displayField: 'Name',
                    valueField: 'Code',
                    itemId: 'cvbatFlagSitesFlagEditId',
                    labelWidth: 150,
                    bind: '{FlagSitesFlagEdit}',
                    store: Ext.create('Ext.data.Store', {
                        fields: ['Name', 'Code'],
                        data: [
                            { "Name": "Yes", "Code": "Y" },
                            { "Name": "No", "Code": "N" }
                        ]
                    }),
                    queryMode: 'local',
                    typeAhead: true
                }, {
                    xtype: 'combobox',
                    fieldLabel: 'Parent Exception :',
                    displayField: 'Name',
                    valueField: 'Code',
                    itemId: 'cvbatParentExceptionId',
                    labelWidth: 150,
                    bind: '{Parent_Exception}',
                    store: Ext.create('Ext.data.Store', {
                        fields: ['Name', 'Code'],
                        data: [
                            { "Name": "Yes", "Code": "Y" },
                            { "Name": "No", "Code": "N" }
                        ]
                    }),
                    queryMode: 'local',
                    typeAhead: true
                }
               


            ]
        }, //END of form fields            
    ]

});