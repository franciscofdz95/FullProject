Ext.define('App.View.EA.EAMyReports', {
    extend: 'Ext.container.Container',
    alias: 'widget.App-View-EA-EAMyReports',
    itemId: 'EAMyReportsPanelId',
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
        data: { AccessAdmin:'N'}
    },
    items: [                
            {
            xtype: 'form',
            border: false,
            itemId: 'EAMyReportsContentTable',
            layout: {
                type: 'table',
                columns: 2,
                align: 'stretch'
            },
            defaults: {
                margin: '5 5 5 5',
                padding: '3 5 3 5',
                labelWidth: 150,
                width: 350
            },
            buttonAlign:'center',
            buttons: [
                { xtype: 'button', itemId: 'btnEASave', text: 'Save', margin: '5 5 5 5'},
                { xtype: 'button', itemId: 'btnEACancel', text: 'Cancel', margin: '5 5 5 5', handler: this.EACancelClick }
            ],
            items: [                                                              
                {
                    xtype: 'combobox',
                    fieldLabel: 'Access Admin:',
                    labelWidth: 150,
                    grow: true,
                    growToLongestValue: true,
                    displayField: 'Name',
                    valueField: 'Code',
                    itemId: 'MREAAccessAdmin',
                    bind: '{AccessAdmin}',
                    store: {
                        fields: ['Name', 'Code'],
                        data: [
                            { "Name": "Yes", "Code": "Y" },
                            { "Name": "No", "Code": "N" }
                        ]
                    },
                    queryMode: 'local',
                    typeAhead: true
                }
                ]
        } //END of form fields          
     ]
        
});