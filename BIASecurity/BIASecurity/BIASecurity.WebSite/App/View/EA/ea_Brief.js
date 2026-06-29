Ext.define('App.View.EA.ea_Brief', {
    extend: 'Ext.container.Container',
    alias: 'widget.App-View-EA-ea_Brief',
    itemId: 'EABriefPanelId',
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
        data: {
            Limited_AM: 'NO',
            EA_BRIEF_Profiles: 'NO'
        }
    },
    items: [
        {
            xtype: 'form',
            border: false,
            itemId: 'EABriefFormPanel',
            layout: {
                type: 'table',
                columns: 1,
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
                    fieldLabel: 'Limited Access User:',
                    displayField: 'Name',
                    valueField: 'Code',
                    itemId: 'accessId',
                    bind: '{Limited_AM}',
                    store: Ext.create('Ext.data.Store', {
                        fields: ['Name', 'Code'],
                        data: [
                            { "Name": "YES", "Code": "YES" },
                            { "Name": "NO", "Code": "NO" }
                        ]
                    })
                },
                {
                    xtype: 'combobox',
                    fieldLabel: 'Profiles:',
                    displayField: 'Name',
                    valueField: 'Code',
                    itemId: 'profileId',
                    bind: '{EA_BRIEF_Profiles}',
                    store: Ext.create('Ext.data.Store', {
                        fields: ['Name', 'Code'],
                        data: [
                            { "Name": "YES", "Code": "YES" },
                            { "Name": "NO", "Code": "NO" }
                        ]
                    }),
                    queryMode: 'local',
                    typeAhead: true
                }
            ]
        }
    ]
});