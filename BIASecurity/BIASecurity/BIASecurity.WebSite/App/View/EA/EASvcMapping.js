Ext.define('App.View.EA.EASvcMapping', {
    extend: 'Ext.container.Container',
    alias: 'widget.App-View-EA-EASvcMapping',
    itemId: 'EASvcMappingPanelId',
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
        data: { EA_ISSGSUSER:'0'}
    },
    items: [                
            {
            xtype: 'form',
            border: false,
            itemId: 'EASvcMappingContentTable',
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
                { xtype: 'button', itemId: 'btnEASave', text: 'Save', margin: '5 5 5 5'},
                { xtype: 'button', itemId: 'btnEACancel', text: 'Cancel', margin: '5 5 5 5' }
            ],
            items: [                                                              
                    {
                        xtype: 'combobox',
                        fieldLabel: 'Is SGS User:',
                        labelWidth: 150,
                        grow: true,
                        growToLongestValue: true,
                        displayField: 'Name',
                        valueField: 'Code',
                        itemId: 'svcSgsUserId',
                        bind: '{EA_ISSGSUSER}',
                        store: {
                            fields: ['Name', 'Code'],
                            data: [
                                { "Name": "Yes", "Code": "1" },
                                { "Name": "No", "Code": "0" }
                            ]
                        },
                        queryMode: 'local',
                        typeAhead: true
                }
                ]
        } //END of form fields          
     ]
        
});