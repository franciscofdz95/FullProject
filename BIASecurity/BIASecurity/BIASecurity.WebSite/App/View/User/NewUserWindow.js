Ext.define('App.View.User.NewUserWindow', {
    extend: 'Ext.window.Window',
    alias: 'widget.App-View-User-NewUserWindow',

    cls: 'userNewUserSearchWindow',
    layout: {
        type: 'vbox',
        align: 'stretch',
        pack: 'start'
    },
    bodyPadding: 10,
    width: 500,
    modal: true,
    title: 'Create Profile',

    items: [
        {
            xtype: 'container',
            itemId: 'searchContainer',
            layout: {
                type: 'vbox',
                align: 'stretch'
            },
            items: [
                { xtype: 'label', text: 'Enter the ADID of the user you would like to add:' },
                { xtype: 'textfield', itemId: 'searchField', margin: '5 0 0 0', allowBlank: false },
                { xtype: 'label', itemId: 'errorMessage', style: { color: 'red' }, margin: '5 0 0 0', hidden: true }
            ]
        },
        {
            xtype: 'container',
            itemId: 'userContainer',
            layout: {
                type: 'vbox',
                align: 'stretch'
            },
            items: [
                { xtype: 'label', text: 'User found! Would you like to create a profile?' },
                {
                    xtype: 'container',
                    layout: {
                        type: 'column'
                    },
                    margin: '5 0 0 0',
                    defaults: {
                        labelAlign: 'top',
                        padding: '5 5',
                        columnWidth: 0.5
                    },
                    items: [
                        { xtype: 'displayfield', fieldLabel: 'First Name', dataField: 'FirstName' },
                        { xtype: 'displayfield', fieldLabel: 'Last Name', dataField: 'LastName' },
                        { xtype: 'displayfield', fieldLabel: 'AD ID', dataField: 'ADID' },
                        { xtype: 'displayfield', fieldLabel: 'Employee ID', dataField: 'EmployeeId' },
                        { xtype: 'displayfield', fieldLabel: 'Email', dataField: 'Email' }
                    ]
                }
            ],
            hidden: true
        }
    ],
    buttons: [
        { itemId: 'addButton', text: 'Create Profile', hidden: true },
        { itemId: 'searchButton', text: 'Search' },
        { itemId: 'cancelButton', text: 'Cancel' }
    ]
});