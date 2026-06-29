Ext.define('App.View.EA.EAOCM', {
    extend: 'Ext.container.Container',
    alias: 'widget.App-View-EA-EAOCM',
    itemId: 'EAOCMPanelId',
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
        data: {}
    },
    items: [                
            {
            xtype: 'form',
            border: false,
            itemId: 'EAOCMContentTable',
            layout: {
                type: 'vbox',                
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
                { xtype: 'button', itemId: 'btnEACancel', text: 'Cancel', margin: '5 5 5 5' }
            ],
            items: [                                                              
                    {
                        xtype: 'combobox',
                        fieldLabel: 'Provide access type:',
                        labelWidth: 150,
                        grow: true,
                        growToLongestValue: true,
                        displayField: 'Name',
                        valueField: 'Code',
                        itemId: 'ocmEAAccessType',
                        bind: '{ea_AccessType}',
                        store: {
                            fields: ['Name', 'Code'],
                            data: [
                                { "Name": "User", "Code": "U" },
                                { "Name": "Coordinators", "Code": "C" },
                                { "Name": "Group Member", "Code": "G" }
                            ]
                        },
                        queryMode: 'local',
                        typeAhead: true
                },{
                        xtype: 'combobox',
                        fieldLabel: 'Admin Access:',
                        labelWidth: 150,
                        grow: true,
                        growToLongestValue: true,
                        displayField: 'Name',
                        valueField: 'Code',
                        itemId: 'ocmEAAdminAccess',
                        bind: '{ea_AdminAccess}',
                        store: {
                            fields: ['Name', 'Code'],
                            data: [
                                { "Name": "YES", "Code": "YES" },
                                { "Name": "NO", "Code": "NO" }
                            ]
                        },
                        queryMode: 'local',
                        typeAhead: true
                }
                ]
        } //END of form fields          
     ]
        
});