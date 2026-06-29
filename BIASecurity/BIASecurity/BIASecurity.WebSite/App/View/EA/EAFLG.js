Ext.define('App.View.EA.EAFLG', {
    extend: 'Ext.container.Container',
    alias: 'widget.App-View-EA-EAFLG',
    itemId: 'EAFLGPanelId',
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
            "VisitationForm": "N",
            "UPSAir": "N",
            "Sonic": "N",
            "VisitationList": "Y",
            "Gateway": "None",
            "SPLLocation": "None",
            "AutoSend_UrgentVisits": "0",
            "NFOAdmin": "",
            "NFOBusinessUnit": "",
            "SEEP_UserLevel": ""
        }

    },   
    items: [                
            {
            xtype: 'form',
            border: false,
            itemId: 'EAFLGContentTable',
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
                        fieldLabel: 'Visitation Form :',
                        labelWidth: 150,
                        grow: true,
                        growToLongestValue: true,
                        displayField: 'Name',
                        valueField: 'Code',
                        tooltip: 'Visitation Form :',
                    itemId: 'flgVisitationFormId',
                        bind: '{VisitationForm}',
                        store: {
                            fields: ['Name', 'Code'],
                            data: [
                                { "Name": "Yes", "Code": "Y" },
                                { "Name": "No", "Code": "N" }
                            ]
                        },
                        queryMode: 'local',
                        typeAhead: true
                    },
                    {
                        xtype: 'combobox',
                        fieldLabel: 'UPSAir :',
                        tooltip: 'UPSAir :',
                        labelWidth: 150,
                        grow: true,
                        growToLongestValue: true,
                        displayField: 'Name',
                        valueField: 'Code',
                        itemId: 'flgUPSAirId',
                        bind: '{UPSAir}',
                        store: {
                            fields: ['Name', 'Code'],
                            data: [
                                { "Name": "Yes", "Code": "Y" },
                                { "Name": "No", "Code": "N" }
                            ]
                        },
                        queryMode: 'local',                            
                        typeAhead: true
                    },
                    {
                        xtype: 'combobox',
                        fieldLabel: 'Sonic:',
                        labelWidth: 150,
                        grow: true,
                        growToLongestValue: true,
                        displayField: 'Name',
                        valueField: 'Code',
                        tooltip: 'Sonic',
                        itemId: 'flgSonicId',
                        bind: '{Sonic}',
                        store: {
                            fields: ['Name', 'Code'],
                            data: [
                                { "Name": "Yes", "Code": "Y" },
                                { "Name": "No", "Code": "N" }
                            ]
                        },
                        queryMode: 'local',
                        typeAhead: true
                    },
                        {
                        xtype: 'combobox',
                        fieldLabel: 'VisitationList:',
                        labelWidth: 150,
                        grow: true,
                        growToLongestValue: true,
                        displayField: 'Name',
                        valueField: 'Code',
                            tooltip: 'VisitationList',
                            itemId: 'flgVisitationListId',
                            bind: '{VisitationList}',
                        store: {
                            fields: ['Name', 'Code'],
                            data: [
                                { "Name": "Yes", "Code": "Y" },
                                { "Name": "No", "Code": "N" }
                            ]
                        },
                        queryMode: 'local',
                        typeAhead: true
                    },
                       
                        {
                        xtype: 'combobox',
                        fieldLabel: 'Gateway:',
                        labelWidth: 150,
                        grow: true,
                        growToLongestValue: true,
                        displayField: 'Name',
                        valueField: 'Code',
                        tooltip: 'Gateway.',
                            itemId: 'flgGatewayId',
                        bind: '{Gateway}',
                        store: {
                            fields: ['Name', 'Code'],
                            data: [
                                { "Name": "None", "Code": "None" },
                                { "Name": "AMER", "Code": "AMER" },
                                { "Name": "ANC", "Code": "ANC" },
                                { "Name": "ASIA", "Code": "ASIA" },
                                { "Name": "EWR", "Code": "EWR" },
                                { "Name": "EURO", "Code": "EURO" },
                                { "Name": "HNL", "Code": "HNL" },
                                { "Name": "ICS", "Code": "ICS" },
                                { "Name": "JFK", "Code": "JFK" },
                                { "Name": "LAX", "Code": "LAX" },
                                { "Name": "MIA", "Code": "MIA" },
                                { "Name": "ORD", "Code": "ORD" },
                                { "Name": "ONT", "Code": "ONT" },
                                { "Name": "PHL", "Code": "PHL" },
                                { "Name": "SDF", "Code": "SDF" }
                            ]
                        },
                        queryMode: 'local',
                        typeAhead: true
                    },
                        {
                        xtype: 'combobox',
                        fieldLabel: 'SPL Location:',
                        labelWidth: 150,
                        grow: true,
                        growToLongestValue: true,
                        displayField: 'Name',
                        valueField: 'Code',
                        tooltip: 'SPL Location',
                            itemId: 'flgSPLLocationId',
                        bind: '{SPLLocation}',
                        store: {
                            fields: ['Name', 'Code'],
                            data: [
                                { "Name": "None", "Code": "None" },
                                { "Name": "SP1", "Code": "SP1" }
                            ]
                        },
                        queryMode: 'local',
                        typeAhead: true
                    },
                        {
                        xtype: 'combobox',
                        fieldLabel: 'AutoSend_UrgentVisits:',
                        labelWidth: 150,
                        grow: true,
                        growToLongestValue: true,
                        displayField: 'Name',
                        valueField: 'Code',
                        tooltip: 'AutoSend_UrgentVisits',
                            itemId: 'flgAutoSend_UrgentVisitsId',
                        bind: '{AutoSend_UrgentVisits}',
                        store: {
                            fields: ['Name', 'Code'],
                            data: [
                                { "Name": "Yes", "Code": 1 },
                                { "Name": "No", "Code": 0 }
                            ]
                        },
                        queryMode: 'local',
                        typeAhead: true
                    },
                        {
                        xtype: 'combobox',
                        fieldLabel: 'NFOAdmin:',
                        labelWidth: 150,
                        grow: true,
                        growToLongestValue: true,
                        displayField: 'Name',
                        valueField: 'Code',
                        tooltip: 'NFOAdmin',
                            itemId: 'flgNFOAdminId',
                        bind: '{NFOAdmin}',
                        store: {
                            fields: ['Name', 'Code'],
                            data: [
                                { "Name": "Yes", "Code": 1 },
                                { "Name": "No", "Code": 0 }
                            ]
                        },
                        queryMode: 'local',
                        typeAhead: true
                    },
                        {
                        xtype: 'combobox',
                            fieldLabel: '[NFOBusinessUnit]:',
                        labelWidth: 150,
                        grow: true,
                        growToLongestValue: true,
                        displayField: 'Name',
                        valueField: 'Code',
                            tooltip: '[NFOBusinessUnit]',
                            itemId: 'flgNFOBusinessUnitId',
                            bind: '{NFOBusinessUnit}',
                        store: {
                            fields: ['Name', 'Code'],
                            data: [
                                { "Name": "None", "Code": "" },
                                { "Name": "BIA", "Code": "BIA" },
                                { "Name": "CS", "Code": "CS" },
                                { "Name": "EC", "Code": "EC" },
                                { "Name": "FF", "Code": "FF" },
                                { "Name": "MI", "Code": "MI" },
                                { "Name": "OPR", "Code": "OPR" },
                                { "Name": "PS", "Code": "PS" }
                            ]
                        },
                        queryMode: 'local',
                        typeAhead: true
                    },
                        {
                        xtype: 'combobox',
                            fieldLabel: 'SEEP_UserLevel:',
                        labelWidth: 150,
                        grow: true,
                        growToLongestValue: true,
                        displayField: 'Name',
                        valueField: 'Code',
                            tooltip: 'SEEP_UserLevel',
                            itemId: 'flgSEEP_UserLevelId',
                            bind: '{SEEP_UserLevel}',
                        store: {
                            fields: ['Name', 'Code'],
                            data: [
                                { "Name": "None", "Code": "" },
                                { "Name": "ADM", "Code": "ADM" },
                                { "Name": "CSC", "Code": "CSC" },
                                { "Name": "OPS", "Code": "OPS" }
                            ]
                        },
                        queryMode: 'local',
                        typeAhead: true
                    }
                ]
            } //END of form fields            
     ]
        
});