Ext.define('App.View.EA.EARevRec', {
    extend: 'Ext.container.Container',
    alias: 'widget.App-View-EA-EARevRec',
    itemId: 'EARevRecPanelId',
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
            Admin: 'N',
            RR: '',
            DD: ''
        }
    },
    items: [                
            {
            xtype: 'form',
            border: false,
            itemId: 'EARevRecContentTable',
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
                    fieldLabel: 'Is Admin:',
                        labelWidth: 150,
                        grow: true,
                        growToLongestValue: true,
                        displayField: 'Name',
                        valueField: 'Code',
                        itemId: 'RevRecIsAdminId',
                    bind: '{Admin}',
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
                    xtype: 'textfield',
                    fieldLabel: 'Region:',
                    emptyText: 'Region',
                    regex: /^[a-zA-Z0-9]*$/,
                    labelWidth: 150,
                    enforceMaxLength: true,
                    maxLength: 2,
                    growToLongestValue: true,
                    bind: '{RR}',
                    itemId: 'RevRecRegionId',
                    typeAhead: true
                },
                {
                    xtype: 'textfield',
                    fieldLabel: 'District:',
                    emptyText:'District',
                    regex: /^[a-zA-Z0-9]*$/,
                    labelWidth: 150,
                    enforceMaxLength: true,
                    maxLength: 2,
                    growToLongestValue: true,
                    bind: '{DD}',
                    itemId: 'RevRecDistrictId',
                    typeAhead: true
                }

                ]
        } //END of form fields          
     ]
        
});