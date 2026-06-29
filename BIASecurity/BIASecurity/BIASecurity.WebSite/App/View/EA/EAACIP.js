Ext.define('App.View.EA.EAACIP', {
    extend: 'Ext.container.Container',
    alias: 'widget.App-View-EA-EAACIP',
    itemId: 'EAACIPPanelId',
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
            "Region_Coordinator": "No",
            "District_Coordinator": "No",
            "Add_Address": "No",
            "Read_Only_Access": "No",
            "View_AddrKey": "No",
            "Change_ActiveFlag": "No",
            "Unclassified_Des": "No",
            "Edit_Reasons": "No",
            "CSC_Access": "No",
            "CSC_Supervisor_Access": "No",
            "Customer_Contact_Export": "No",
            "View_Repeater_Rpt": "No",
            "EA_ACIP_View_Usage_Rpt": "No",
            "Escalation_Export": "No",
            "EA_UseMultiTrackingNumLookup": "No",
            "EA_Weekly_Designation_Summary_Report": "No",
            "EA_ACIP_Online_Research_Agent": "No",
            "EA_ACIP_Online_Research_Agent_Reports": "No",
            "EA_ACIP_ORA_Level": "No",
            "EA_ACIP_Can_Process_Multi_Tenant": "No",
            "EA_ACIP_Can_Designate": "No",
            "EA_ACIP_Can_View_AMS_30Day_Audit": "No"
        }

    },   
    items: [                
            {
            xtype: 'form',
            border: false,
            itemId: 'EAACIPContentTable',
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
                        fieldLabel: 'Region Coordinator :',
                        labelWidth: 150,
                        grow: true,
                        growToLongestValue: true,
                        displayField: 'Name',
                        valueField: 'Code',
                        tooltip: 'Region Coordinator :',
                         itemId: 'acipRegionCoordinatorId',
                         bind: '{Region_Coordinator}',
                        store: {
                            fields: ['Name', 'Code'],
                            data: [
                                { "Name": "Yes", "Code": "Yes" },
                                { "Name": "No", "Code": "No" }
                            ]
                        },
                        queryMode: 'local',
                        typeAhead: true
                    },
                    {
                        xtype: 'combobox',
                        fieldLabel: 'District Coordinator :',
                        tooltip: 'District Coordinator :',
                        labelWidth: 150,
                        grow: true,
                        growToLongestValue: true,
                        displayField: 'Name',
                        valueField: 'Code',
                        itemId: 'acipDistrictCoordinatorId',
                        bind: '{District_Coordinator}',
                        store: {
                            fields: ['Name', 'Code'],
                            data: [
                                { "Name": "Yes", "Code": "Yes" },
                                { "Name": "No", "Code": "No" }
                            ]
                        },
                        queryMode: 'local',                            
                        typeAhead: true
                    },
                    {
                        xtype: 'combobox',
                        fieldLabel: 'Can Update Addresses:',
                        labelWidth: 150,
                        grow: true,
                        growToLongestValue: true,
                        displayField: 'Name',
                        valueField: 'Code',
                        tooltip: 'Test address',//These users will see the Quicksearch link in ACIP.  The link allows them to update addresses.
                        itemId: 'acipAddAddressId',
                        bind: '{Add_Address}',
                        store: {
                            fields: ['Name', 'Code'],
                            data: [
                                { "Name": "Yes", "Code": "Yes" },
                                { "Name": "No", "Code": "No" }
                            ]
                        },
                        queryMode: 'local',
                        typeAhead: true
                    },
                        {
                        xtype: 'combobox',
                        fieldLabel: 'ReadOnly Access:',
                        labelWidth: 150,
                        grow: true,
                        growToLongestValue: true,
                        displayField: 'Name',
                        valueField: 'Code',
                        tooltip: 'Test address',//<td title="These users can only view the designated report." class="Label">ReadOnly Access:</td>
                        itemId: 'acipReadOnlyAccessId',
                        bind: '{Read_Only_Access}',
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
                        fieldLabel: 'Country:',
                        labelWidth: 150,
                        grow: true,
                        growToLongestValue: true,
                        displayField: 'CSC_Type_Country_Code',
                        valueField: 'CSC_Type_Country_Code',
                        tooltip: 'Select CSC Country.',
                        itemId: 'acipCountryId',
                        store: {
                            fields: ['CSC_Type_Country_Code'],
                            type: 'webapi',
                            storeId: 'acipCountryStore',
                            autoLoad: true,
                            api: {
                                read: 'api/ACIP/GetCSCCountryCodes'
                            }
                            },  
                        queryMode: 'local',
                        typeAhead: true
                    },
                        {
                        xtype: 'combobox',
                        fieldLabel: 'CSC User Location:',
                        labelWidth: 150,
                        grow: true,
                        growToLongestValue: true,
                        displayField: 'CSC_Type_Desc',
                        valueField: 'CSC_Type',
                        tooltip: 'These users can search for and dispute addresses',
                        itemId: 'acipCSCAccessId',
                        bind: '{CSC_Access}',
                        store: {
                            fields: ['CSC_Type', 'CSC_Type_Desc'],
                            type: 'webapi',
                            storeId:'acipCSCAccessStore',
                            autoLoad: false,
                            api: {
                                read: 'api/ACIP/GetCSCAccessLevels'
                            }
                        },                         
                        queryMode: 'local',
                        typeAhead: true
                    },
                    {
                        xtype: 'combobox',
                        fieldLabel: 'CSC Supervisor Access:',
                        labelWidth: 150,
                        grow: true,
                        growToLongestValue: true,
                        displayField: 'Name',
                        valueField: 'Code',
                        tooltip: 'The CSC Supervisor can override confirmed address designations.',//<td title="These users can only view the designated report." class="Label">ReadOnly Access:</td>
                        itemId: 'acipCSCSupervisorAccessId',
                        bind: '{CSC_Supervisor_Access}',
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
                        fieldLabel: 'Edit Designation Reasons:',
                        labelWidth: 150,
                        grow: true,
                        growToLongestValue: true,
                        displayField: 'Name',
                        valueField: 'Code',
                        tooltip: 'These users have the ability to edit designation reason options.',//<td title="These users can only view the designated report." class="Label">ReadOnly Access:</td>
                        itemId: 'acipEditReasonsId',
                        bind: '{Edit_Reasons}',
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
                        fieldLabel: 'Unclassified Designations:',
                        labelWidth: 150,
                        grow: true,
                        growToLongestValue: true,
                        displayField: 'Name',
                        valueField: 'Code',
                        tooltip: 'These users can classify addresses as Unclassified (Region Coordinators Only).',
                        itemId: 'acipUnclassifiedDesId',
                        bind: '{Unclassified_Des}',
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
                        fieldLabel: 'View Repeater Report:',
                        labelWidth: 150,
                        grow: true,
                        growToLongestValue: true,
                        displayField: 'Name',
                        valueField: 'Code',
                        tooltip: 'These users can view the Repeater report',
                        itemId: 'acipViewRepeaterRptId',
                        bind: '{View_Repeater_Rpt}',
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
                        fieldLabel: 'Customer Contact Export:',
                        labelWidth: 150,
                        grow: true,
                        growToLongestValue: true,
                        displayField: 'Name',
                        valueField: 'Code',
                        tooltip: 'These users can export the latest address disputes',
                        itemId: 'acipCustomerContactExportId',
                        bind: '{Customer_Contact_Export}',
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
                        fieldLabel: 'View AddrKey:',
                        labelWidth: 150,
                        grow: true,
                        growToLongestValue: true,
                        displayField: 'Name',
                        valueField: 'Code',
                        tooltip: 'Developers only.',
                        itemId: 'acipViewAddrKeyId',
                        bind: '{View_AddrKey}',
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
                        fieldLabel: 'View Usage Report:',
                        labelWidth: 150,
                        grow: true,
                        growToLongestValue: true,
                        displayField: 'Name',
                        valueField: 'Code',
                        tooltip: 'Developers only.',
                        itemId: 'acipEAACIPViewUsageRptId',
                        bind: '{EA_ACIP_View_Usage_Rpt}',
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
                        fieldLabel: 'View Escalation Report:',
                        labelWidth: 150,
                        grow: true,
                        growToLongestValue: true,
                        displayField: 'Name',
                        valueField: 'Code',
                        tooltip: 'View Escalation Report.',
                        itemId: 'acipEscalationExportId',
                        bind: '{Escalation_Export}',
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
                        fieldLabel: 'Use Multi Tracking Number Lookup',
                        labelWidth: 150,
                        grow: true,
                        growToLongestValue: true,
                        displayField: 'Name',
                        valueField: 'Code',
                        tooltip: 'Use Multi Tracking Number Lookup.',
                        itemId: 'acipEAUseMultiTrackingNumLookupId',
                        bind: '{EA_UseMultiTrackingNumLookup}',
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
                        fieldLabel: 'View Weekly Designation Summary Report',
                        labelWidth: 150,
                        grow: true,
                        growToLongestValue: true,
                        displayField: 'Name',
                        valueField: 'Code',
                        tooltip: 'View Weekly Designation Summary Report.',
                        itemId: 'acipEAWeeklyDesignationSummaryReportId',
                        bind: '{EA_Weekly_Designation_Summary_Report}',
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
                    //  {
                    //    xtype: 'combobox',
                    //    fieldLabel: 'ORA Level',
                    //    labelWidth: 150,
                    //    grow: true,
                    //    growToLongestValue: true,
                    //    displayField: 'EA_ACIP_ORA_Level',
                    //    valueField: 'EA_ACIP_ORA_Level',
                    //    tooltip: 'EA_ACIP_ORA_Level.',
                    //    itemId: 'acipEAACIPORALevelId',
                    //    store: {
                    //        fields: ['EA_ACIP_ORA_Level'],
                    //        data: [
                    //            { "EA_ACIP_ORA_Level": "Corporate CSC"  },
                    //            { "EA_ACIP_ORA_Level": "Manager"  },
                    //            { "EA_ACIP_ORA_Level": "Supervisor"  },
                    //            { "EA_ACIP_ORA_Level": "Coach"  },
                    //            { "EA_ACIP_ORA_Level": "Agent"  }
                    //        ]
                    //    },
                    //    queryMode: 'local',
                    //    typeAhead: true
                    //},
                    {
                        xtype: 'combobox',
                        fieldLabel: 'Can Process Multi-Tenant Investigations',
                        labelWidth: 150,
                        grow: true,
                        growToLongestValue: true,
                        displayField: 'Name',
                        valueField: 'Code',
                        tooltip: 'EA_ACIP_Can_Process_Multi_Tenant.',
                        itemId: 'acipEAACIPCanProcessMultiTenantId',
                        bind: '{EA_ACIP_Can_Process_Multi_Tenant}',
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
                        fieldLabel: 'Can Designate',
                        labelWidth: 150,
                        grow: true,
                        growToLongestValue: true,
                        displayField: 'Name',
                        valueField: 'Code',
                        tooltip: 'EA_ACIP_Can_Designate.',
                        itemId: 'acipEAACIPCanDesignateId',
                        bind: '{EA_ACIP_Can_Designate}',
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
                        fieldLabel: 'ORA Level',
                        labelWidth: 150,
                        grow: true,
                        growToLongestValue: true,
                        displayField: 'EA_ACIP_ORA_Level',
                        valueField: 'EA_ACIP_ORA_Level',
                        tooltip: 'EA_ACIP_ORA_Level.',
                        itemId: 'acipEAACIPORALevelId',
                        bind: '{EA_ACIP_ORA_Level}',
                        store: {
                            fields: ['EA_ACIP_ORA_Level'],
                            data: [
                                { "EA_ACIP_ORA_Level": "Corporate CSC" },
                                { "EA_ACIP_ORA_Level": "Manager" },
                                { "EA_ACIP_ORA_Level": "Supervisor" },
                                { "EA_ACIP_ORA_Level": "Coach" },
                                { "EA_ACIP_ORA_Level": "Agent" }
                            ]
                        },
                        queryMode: 'local',
                        typeAhead: true
                    },//for testing of alignment. not actual order 
                        {
                        xtype: 'combobox',
                        fieldLabel: 'Can View AMS 30 Day Audit Report',
                        labelWidth: 150,
                        grow: true,
                        growToLongestValue: true,
                        displayField: 'Name',
                        valueField: 'Code',
                        tooltip: 'EA_ACIP_Can_View_AMS_30Day_Audit.',
                        itemId: 'acipEAACIPCanViewAMS30DayAuditId',
                        bind: '{EA_ACIP_Can_View_AMS_30Day_Audit}',
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
                        hidden:true,                       
                        displayField: 'CSC_Type_Country_Code',
                        valueField: 'CSC_Type_Country_Code',
                        itemId: 'acipCSCTypeCountryCodeId',
                        store: {
                            fields: ['CSC_Type_Country_Code'],
                            type: 'webapi',
                            autoLoad: false,
                            api: {
                                read: 'api/ACIP/GetCSCTypeCountryCode'
                            }
                        }
                    },
                    { xtype: 'hiddenfield', name: 'HAdd_Address', itemId: 'HAdd_Address' },
                    { xtype: 'hiddenfield', name: 'HUnclassified_Des', itemId: 'HUnclassified_Des' },
                    ///////////////////////////////

                ]
            }, //END of form fields            
     ]
        
});