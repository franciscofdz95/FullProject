Ext.define('App.View.User.AddEditView.Profile', {
    extend: 'Ext.container.Container',
    alias: 'widget.App-View-User-AddEditView-Profile',

    cls: 'userAddeditviewProfile',
    layout: {
        type: 'vbox',
        align: 'stretch',
        pack: 'start'
    },
    loadStoreOnInit: true,
    getUserOnStoreLoad: true,
    showFieldEditPencil: true,
    scrollable: true,

    store: {
        type: 'webapi',
        api: {
            read: 'api/BIASecurity/UserProfile'
        }
    },

    items: [
        {
            xtype: 'container',
            cls: 'info',
            minHeight: 25,
            layout: {
                type: 'hbox',
                align: 'stretch',
                pack: 'start'
            },
            defaults: {
                minHeight: 25,
                padding: '0 10'
            },
            items: [
                {
                    xtype: 'container',
                    layout: {
                        type: 'vbox',
                        align: 'stretch',
                        pack: 'start'
                    },
                    items: [
                        { plugins: { ptype: 'borderfloatingtitle', position: 't', titleConfig: 'Info' } },
                        {
                            xtype: 'container',
                            cls: 'info',
                            layout: {
                                type: 'hbox',
                                align: 'stretch',
                                pack: 'start'
                            },
                            padding: '10 0 5',
                            margin: '0 0',
                            items: [
                                {
                                    xtype: 'container',
                                    itemId: 'idInfo',
                                    cls: 'idInfo',
                                    hidden: false,
                                    minWidth: 350,
                                    layout: {
                                        type: 'vbox',
                                        align: 'stretch',
                                        pack: 'start'
                                    },
                                    padding: '0 10 0 0',
                                    //html: 'Basic Info',
                                    defaults: { labelWidth: 100, margin: '0 0 10', editable: false, hidden: true, labelAlign: 'top' },
                                    items: [
                                        { xtype: 'textfield', fieldLabel: 'AD ID', itemId: 'User_ADID', plugins: { ptype: 'componentstorebind', dataField: 'ADID', hideOnNull: true } },
                                        { xtype: 'textfield', fieldLabel: 'Login ID', itemId: 'User_LoginId', plugins: { ptype: 'componentstorebind', dataField: 'LoginId', defaultValue: 'N/A', hideOnNull: true } },
                                        { xtype: 'textfield', inputType: 'password', fieldLabel: 'Password', editable: false, itemId: 'User_AuthenticationString', plugins: { ptype: 'componentstorebind', dataField: 'AuthenticationString', hideOnNull: true } },
                                        { xtype: 'textfield', fieldLabel: 'Employee ID', itemId: 'User_EmployeeId', plugins: { ptype: 'componentstorebind', dataField: 'EmployeeId', defaultValue: 'N/A', neverHide: true } }
                             
                                    ]
                                },
                                {
                                    xtype: 'container',
                                    itemId: 'nameInfo',
                                    cls: 'nameInfo',
                                    hidden: false,
                                    minWidth: 350,
                                    layout: {
                                        type: 'vbox',
                                        align: 'stretch',
                                        pack: 'start'
                                    },
                                    padding: '0',
                                    //html: 'Basic Info',
                                    defaults: { labelWidth: 100, margin: '0 0 10', editable: false, hidden: true, labelAlign: 'top' },
                                    items: [
                                        { xtype: 'textfield', fieldLabel: 'User ID', itemId: 'User_UserId', hidden: true, editable: false, plugins: { ptype: 'componentstorebind', dataField: 'UserId' } },
                                        { xtype: 'textfield', fieldLabel: 'SR ID', itemId: 'User_SRID', plugins: { ptype: 'componentstorebind', dataField: 'SRID', defaultValue: 'N/A', neverHide: true } }
                                    ]
                                },
                            ]
                        },
                        {
                            xtype: 'container',
                            cls: 'info',
                            minHeight: 25,
                            layout: {
                                type: 'hbox',
                                align: 'stretch',
                                pack: 'start'
                            },
                            defaults: {
                                minHeight: 25,
                                padding: '0'
                            },
                            items: [
                                {
                                    xtype: 'container',
                                    cls: 'info',
                                    layout: {
                                        type: 'hbox',
                                        align: 'stretch',
                                        pack: 'start'
                                    },
                                    padding: '0 0 5',
                                    margin: '0 0',
                                    items: [
                                        {
                                            xtype: 'container',
                                            itemId: 'idInfo',
                                            cls: 'idInfo',
                                            hidden: false,
                                            minWidth: 350,
                                            layout: {
                                                type: 'vbox',
                                                align: 'stretch',
                                                pack: 'start'
                                            },
                                            padding: '0 10 0 0',
                                            //html: 'Basic Info',
                                            defaults: { labelWidth: 100, margin: '0 0 10', editable: false, hidden: true, labelAlign: 'top' },
                                            items: [
                                                { xtype: 'textfield', fieldLabel: 'First Name', itemId: 'User_FirstName', plugins: { ptype: 'componentstorebind', dataField: 'FirstName', hideOnNull: true } },
                                                { xtype: 'textfield', fieldLabel: 'Preferred Name', editable: true, itemId: 'User_PreferredName', plugins: { ptype: 'componentstorebind', dataField: 'PreferredName', hideOnNull: true } }
                                            ]
                                        },
                                        {
                                            xtype: 'container',
                                            itemId: 'nameInfo',
                                            cls: 'nameInfo',
                                            hidden: false,
                                            minWidth: 350,
                                            layout: {
                                                type: 'vbox',
                                                align: 'stretch',
                                                pack: 'start'
                                            },
                                            padding: '0',
                                            //html: 'Basic Info',
                                            defaults: { labelWidth: 100, margin: '0 0 10', editable: false, hidden: true, labelAlign: 'top' },
                                            items: [
                                                { xtype: 'textfield', fieldLabel: 'Last Name', itemId: 'User_LastName', plugins: { ptype: 'componentstorebind', dataField: 'LastName', hideOnNull: true } }
                                            ]
                                        }
                                    ]
                                }
                            ]
                        },
                        {
                            xtype: 'container',
                            cls: 'info',
                            minHeight: 25,
                            layout: {
                                type: 'hbox',
                                align: 'stretch',
                                pack: 'start'
                            },
                            defaults: {
                                minHeight: 25,
                                padding: '0 10 0 0'
                            },
                            items: [
                                {
                                    xtype: 'container',
                                    cls: 'info',
                                    layout: {
                                        type: 'hbox',
                                        align: 'stretch',
                                        pack: 'start'
                                    },
                                    padding: '0 0 5',
                                    margin: '0 0',
                                    //defaults: {
                                    //    minHeight: 25,
                                    //    padding: '5 10'
                                    //},
                                    items: [
                                        {
                                            xtype: 'container',
                                            itemId: 'idInfo',
                                            cls: 'idInfo',
                                            hidden: false,
                                            minWidth: 350,
                                            layout: {
                                                type: 'vbox',
                                                align: 'stretch',
                                                pack: 'start'
                                            },
                                            padding: '0 10 0 0',
                                            //html: 'Basic Info',
                                            defaults: { labelWidth: 100, margin: '0 0 10', editable: false, hidden: false, labelAlign: 'top' },
                                            items: [
                                                { xtype: 'textfield', fieldLabel: 'Department', itemId: 'User_Department', plugins: { ptype: 'componentstorebind', dataField: 'Department', hideOnNull: false, editable: true } },
                                                { xtype: 'textfield', fieldLabel: 'Business Unit ID', itemId: 'User_BusinessUnitId', plugins: { ptype: 'componentstorebind', dataField: 'BusinessUnitId', hideOnNull: false, editable: true } }
                                            ]
                                        },
                                        {
                                            xtype: 'container',
                                            itemId: 'nameInfo',
                                            cls: 'nameInfo',
                                            hidden: false,
                                            minWidth: 350,
                                            layout: {
                                                type: 'vbox',
                                                align: 'stretch',
                                                pack: 'start'
                                            },
                                            padding: '0',
                                            //html: 'Basic Info',
                                            defaults: { labelWidth: 100, margin: '0 0 10', editable: false, hidden: false, labelAlign: 'top' },
                                            items: [
                                                { xtype: 'textfield', fieldLabel: 'Job Level', itemId: 'User_JobLevel', plugins: { ptype: 'componentstorebind', dataField: 'JobLevel', hideOnNull: false, editable: true } }
                                                
                                            ]
                                        }

                                    ]
                                }
                            ]
                        }
                    ]
                },
                {
                    xtype: 'container',
                    itemId: 'otherInfo',
                    cls: 'otherInfo',
                    hidden: false,
                    minWidth: 250,
                    flex: 1,
                    layout: {
                        type: 'vbox',
                        align: 'stretch',
                        pack: 'start'
                    },
                    defaults: { margin: '0 0 15' },
                    items: [
                        { plugins: { ptype: 'borderfloatingtitle', position: 't', titleConfig: 'Emails' } },
                        { xtype: 'App-View-User-AddEditView-Profile-EmailList-View' },
                        { plugins: { ptype: 'borderfloatingtitle', position: 't', titleConfig: 'Phone Numbers' } },
                        { xtype: 'App-View-User-AddEditView-Profile-PhoneList-View' },
                        { plugins: { ptype: 'borderfloatingtitle', position: 't', titleConfig: 'Locations' } },                                                                                         
                        { xtype: 'App-View-User-AddEditView-Profile-LocationList-View' }
                    ]
                },
                {
                    xtype: 'container',
                    itemId: 'newUserInfo',
                    cls: 'newUserInfo',
                    hidden: true,
                    minWidth: 250,
                    padding: 10,
                    margin: '5 0',
                    layout: {
                        type: 'vbox',
                        align: 'stretch',
                        pack: 'start'
                    },
                    html: 'New User Info',
                    items: [
                        { plugins: { ptype: 'borderfloatingtitle', position: 't', titleConfig: 'Info' } }
                    ]
                }
            ]
        },
        {
            xtype: 'checkbox', boxLabel: 'Active', labelAlign: 'right', itemId: 'User_Active', margin: '0 0 0 20', editable: true,
            plugins: { ptype: 'componentstorebind', dataField: 'Active' }
        }
    ]
});