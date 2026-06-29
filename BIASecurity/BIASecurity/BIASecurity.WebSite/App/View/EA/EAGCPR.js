Ext.define('App.View.EA.EAGCPR', {
    extend: 'Ext.container.Container',
    alias: 'widget.App-View-EA-EAGCPR',
    itemId: 'EAGCPRPanelId',
    closable: true,
    hidden: true,
    scrollable: false,
    minWidth: 300,
    minHeight: 300,
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
            EA_IndustrySegmentation: '',
            EA_FinancialSegmentation: ''}
    },
    items: [
        {
            xtype: 'form',
            border: false,
            itemId: 'EAGCPRContentTable',
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
                    fieldLabel: 'Industry Segmentation:',
                    labelWidth: 150,
                    grow: true,
                    growToLongestValue: true,
                    displayField: 'Name',
                    valueField: 'Code',
                    itemId: 'IndustrySegmentationID',
                    bind: '{EA_IndustrySegmentation}',
                    store: {
                        fields: ['Name', 'Code'],
                        data: [
                            { "Name": "None", "Code": "None" },
                            { "Name": "Only Healthcare", "Code": "Only Healthcare" },
                            { "Name": "All Industries", "Code": "All Industries" }
                        ]
                    },
                    queryMode: 'local',
                    typeAhead: true
                },
                {
                    xtype: 'combobox',
                    fieldLabel: 'Financial Segmentation:',
                    labelWidth: 150,
                    grow: true,
                    growToLongestValue: true,
                    displayField: 'Name',
                    valueField: 'Code',
                    itemId: 'FinancialSegmentationID',
                    bind: '{EA_FinancialSegmentation}',
                    store: {
                        fields: ['Name', 'Code'],
                        data: [
                            { "Name": "None", "Code": "None" },
                            { "Name": "Only DAP", "Code": "Only DAP" },
                            { "Name": "All except Amazon", "Code": "All except Amazon" },
                            { "Name": "All including Amazon", "Code": "All including Amazon" }
                        ]
                    },
                    queryMode: 'local',
                    typeAhead: true
                }
            ]
        } //END of form fields          
    ]

});