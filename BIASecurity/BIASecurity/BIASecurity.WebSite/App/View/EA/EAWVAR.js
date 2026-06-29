Ext.define('App.View.EA.EAWVAR', {
    extend: 'Ext.container.Container',
    alias: 'widget.App-View-EA-EAWVAR',
    itemId: 'EAWVARPanelId',
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
        data: {}
    },
    items: [                
            {
            xtype: 'form',
            border: false,
            itemId: 'EAWvarContentTable',
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
            buttonAlign:'center',
            buttons: [
                { xtype: 'button', itemId: 'btnEAWVARSave', text: 'Save', margin: '5 5 5 5'},
                { xtype: 'button', itemId: 'btnEACancel', text: 'Cancel', margin: '5 5 5 5' }
            ],
            items: [                                                              
                    {
                        xtype: 'combobox',
                        fieldLabel: 'Can Add Message:',
                        labelWidth: 150,
                        grow: true,
                        growToLongestValue: true,
                        displayField: 'Name',
                        valueField: 'Code',
                        itemId: 'wvarMessageAdminId',
                        bind: '{ea_Message_Admin}',
                        store: {
                            fields: ['Name', 'Code'],
                            data: [
                                { "Name": "Yes", "Code": "1" },
                                { "Name": "No", "Code": "0" }
                            ]
                        },
                        queryMode: 'local',
                        typeAhead: true
                },
                //if group
                {
                        xtype: 'combobox',
                        fieldLabel: 'Can View Files:',
                        labelWidth: 150,
                        hidden:true,
                        grow: true,
                        growToLongestValue: true,
                        displayField: 'Name',
                        valueField: 'Code',
                        itemId: 'wvarViewFileId',
                        bind: '{ea_View_File}',
                        store: {
                            fields: ['Name', 'Code'],
                            data: [
                                { "Name": "Yes", "Code": "1" },
                                { "Name": "No", "Code": "0" }
                            ]
                        },
                        queryMode: 'local',
                        typeAhead: true
                    },
                        {
                        xtype: 'combobox',
                        fieldLabel: 'Can Add Files:',
                        labelWidth: 150,
                        hidden:true,
                        grow: true,
                        growToLongestValue: true,
                        displayField: 'Name',
                        valueField: 'Code',
                        itemId: 'wvarUploadFileId',
                        bind: '{ea_Upload_File}',
                        store: {
                            fields: ['Name', 'Code'],
                            data: [
                                { "Name": "Yes", "Code": "1" },
                                { "Name": "No", "Code": "0" }
                            ]
                        },
                        queryMode: 'local',
                        typeAhead: true
                    },
                        {
                        xtype: 'combobox',
                        fieldLabel: 'Can Update Files:',
                        labelWidth: 150,
                        hidden: true,
                        grow: true,
                        growToLongestValue: true,
                        displayField: 'Name',
                        valueField: 'Code',
                        itemId: 'wvarEditFileId',
                        bind: '{ea_Edit_File}',
                        store: {
                            fields: ['Name', 'Code'],
                            data: [
                                { "Name": "Yes", "Code": "1" },
                                { "Name": "No", "Code": "0" }
                            ]
                        },
                        queryMode: 'local',
                        typeAhead: true
                    },
                        {
                        xtype: 'combobox',
                        fieldLabel: 'Upload Tool Access Only:',
                        labelWidth: 150,
                        hidden:true,
                        grow: true,
                        growToLongestValue: true,
                        displayField: 'Name',
                        valueField: 'Code',
                        itemId: 'wvarFileOnlyId',
                        bind: '{ea_File_Only}',
                        store: {
                            fields: ['Name', 'Code'],
                            data: [
                                { "Name": "Yes", "Code": "1" },
                                { "Name": "No", "Code": "0" }
                            ]
                        },
                        queryMode: 'local',
                        typeAhead: true
                    },//END of if block div
                    {
                        xtype: 'combobox',
                        fieldLabel: 'Strategic Parents Export:',
                        labelWidth: 150,
                        grow: true,
                        growToLongestValue: true,
                        displayField: 'Name',
                        valueField: 'Code',
                        itemId: 'wvarStrategicParentId',
                        bind: '{EA_Strategic_Parent}',
                        store: {
                            fields: ['Name', 'Code'],
                            data: [
                                { "Name": "Yes", "Code": "1" },
                                { "Name": "No", "Code": "0" }
                            ]
                        },
                        queryMode: 'local',
                        typeAhead: true
                    },
                        {
                        xtype: 'combobox',
                        fieldLabel: 'District Manager Report Access:',
                        labelWidth: 150,
                        grow: true,
                        growToLongestValue: true,
                        displayField: 'Name',
                        valueField: 'Code',
                        itemId: 'wvarDMReportAccessId',
                        bind: '{EA_DM_Report_Access}',
                        store: {
                            fields: ['Name', 'Code'],
                            data: [
                                { "Name": "Yes", "Code": "1" },
                                { "Name": "No", "Code": "0" }
                            ]
                        },
                        queryMode: 'local',
                        typeAhead: true
                    },
                        {
                        xtype: 'combobox',
                        fieldLabel: 'Parent Type:',
                        labelWidth: 150,
                        grow: true,
                        growToLongestValue: true,
                        displayField: 'Name',
                        valueField: 'Code',
                        itemId: 'wvarParentTypeId',
                        bind: '{EA_ParentType}',
                        store: {
                            fields: ['Name', 'Code'],
                            data: [
                                { "Name": "Yes", "Code": "1" },
                                { "Name": "No", "Code": "0" }
                            ]
                        },
                        queryMode: 'local',
                        typeAhead: true
                    },
                        {
                        xtype: 'combobox',
                        fieldLabel: 'Data Manager Extract',
                        labelWidth: 150,
                        grow: true,
                        growToLongestValue: true,
                        displayField: 'Name',
                        valueField: 'Code',
                        itemId: 'wvarDataManagerExtractId',
                        bind: '{EA_DataManager_Extract}',
                        store: {
                            fields: ['Name', 'Code'],
                            data: [
                                { "Name": "Yes", "Code": "1" },
                                { "Name": "No", "Code": "0" }
                            ]
                        },
                        queryMode: 'local',
                        typeAhead: true
                    },
                        {
                        xtype: 'combobox',
                        fieldLabel: 'Can See Parents',// #ListGetAt(var, 5 , '_')#
                        labelWidth: 150,
                        hidden:true,
                        grow: true,
                        growToLongestValue: true,
                        displayField: 'Name',
                        valueField: 'Code',
                        tooltip: 'Allow some users to manipulate the excluded parents attribute ',
                        itemId: 'wvarExcludeParent',
                        bind: '{ea_exclude_parent}',
                        store: {
                            fields: ['Name', 'Code'],
                            data: [
                                { "Name": "Yes", "Code": "1" },
                                { "Name": "No", "Code": "0" }
                            ]
                        },
                        queryMode: 'local',
                        typeAhead: true
                    },
                    
                    { xtype: 'hiddenfield', name: 'hFileOnly', itemId: 'hFileOnly', "value": "0" },
                    { xtype: 'hiddenfield', name: 'hEditFile', itemId: 'hEditFile', "value": "0" },
                    { xtype: 'hiddenfield', name: 'hViewFile', itemId: 'hViewFile', "value": "0" },
                    { xtype: 'hiddenfield', name: 'hUploadFile', itemId: 'hUploadFile', "value": "0" },
                    { xtype: 'hiddenfield', name: 'hStrategicParent', itemId: 'hStrategicParent', "value": "0" },
                    { xtype: 'hiddenfield', name: 'hDMReportAccess', itemId: 'hDMReportAccess', "value": "0" },
                    ///////////////////////////////

                ]
        }, //END of form fields    
      //  { xtype: 'App-View-EA-EAActionButtons' }
     ]
        
});