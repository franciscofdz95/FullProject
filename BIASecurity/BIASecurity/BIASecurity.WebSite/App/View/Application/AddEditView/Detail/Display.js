Ext.define('App.View.Application.AddEditView.Detail.Display', {
    extend: 'Ext.container.Container',
    alias: 'widget.App-View-Application-AddEditView-Detail-Display',

    cls: 'applicationAddeditviewDetailDisplay',
    layout: {
        type: 'hbox',
        align: 'stretch',
        pack: 'start'
    },

    defaults: { margin: '0 10 10' },
    items: [
        {
            xtype: 'container',
            layout: { type: 'vbox', align: 'stretch', pack: 'start' },
            padding: '10 0 0 0',
            flex: 4,
            defaults: { margin: '0 10 0 0' },
            items: [
                {
                    plugins: { ptype: 'borderfloatingtitle', position: 't', titleConfig: 'App Settings' }
                },
                {
                    xtype: 'container', layout: { type: 'hbox', align: 'stretch', pack: 'start' }, padding: '10 0 0 0',
                    items: [
                        {
                            xtype: 'checkbox', boxLabel: 'Active', labelAlign: 'right', itemId: 'App_Active', margin: '10 10 0 0', editable: true,
                            plugins: { ptype: 'componentstorebind', dataField: 'Active' }
                        },
                        {
                            xtype: 'textfield', fieldLabel: 'Offline Message', labelAlign: 'top',
                            itemId: 'App_Active_Msg', margin: '10 0 0 0', padding: '0 0 0 0', editable: true, flex: 1,
                            plugins: { ptype: 'componentstorebind', dataField: 'Active_Msg' }
                        }
                    ]
                },
                {
                    xtype: 'textfield', fieldLabel: 'DNS Prefix (for automatic App Path)', labelAlign: 'top', itemId: 'App_DNS_Prefix', margin: '10 10 0 0', padding: '10 0 0 0', editable: true,
                    plugins: { ptype: 'componentstorebind', dataField: 'DNS_Prefix' }
                },
                {
                    xtype: 'textfield', fieldLabel: 'Application URL', labelAlign: 'top', itemId: 'App_ReturnPath', margin: '10 10 0 0', padding: '10 0 0', editable: true,
                    plugins: { ptype: 'componentstorebind', dataField: 'ReturnPath' }
                },
                {
                    xtype: 'textfield', fieldLabel: 'App Icon', labelAlign: 'top', itemId: 'App_Icon', margin: '10 10 0 0', padding: '10 0 0', editable: true,
                    plugins: { ptype: 'componentstorebind', dataField: 'Application_Logo' }
                },
                {
                    xtype: 'textfield', fieldLabel: 'FAQ URL', labelAlign: 'top', itemId: 'App_FAQ', margin: '10 10 20 0', padding: '10 0 20', editable: true,
                    plugins: { ptype: 'componentstorebind', dataField: 'FAQ' }
                },

                // Extended Attribute Settings
                {
                    plugins: { ptype: 'borderfloatingtitle', position: 't', titleConfig: 'Extended Attribute Settings', margin: '20 0 0 0', padding: '20 0 0 0' }
                },
                {
                    xtype: 'checkbox', boxLabel: 'Enable Extended Attribute', labelAlign: 'top', itemId: 'App_ExtendedAttrib', margin: '10 10 0 0', padding: '10 0 0', editable: true,
                    plugins: { ptype: 'componentstorebind', dataField: 'ExtendedAttrib' }
                },
                {
                    xtype: 'textfield', fieldLabel: 'Extended Attribute URL', labelAlign: 'top', itemId: 'App_ExtendedAttribPath', margin: '10 10 0 0', padding: '10 0 0', editable: true,
                    plugins: { ptype: 'componentstorebind', dataField: 'ExtendedAttribPath' }
                },
                {
                    xtype: 'textfield', fieldLabel: 'Extended Attribute Table', labelAlign: 'top', itemId: 'App_ExtendedAttribTable', margin: '10 10 0 0', padding: '10 0 0', editable: true,
                    plugins: { ptype: 'componentstorebind', dataField: 'ExtendedAttribTable' }
                },
                {
                    xtype: 'checkboxgroup', fieldLabel: 'Extended Attribute Access', labelAlign: 'top', itemId: 'App_ExtendedAttribAccess', margin: '10 10 0 0', padding: '10 0 0', editable: true,
                    name: 'ExtendedAttribAccess',
                    plugins: { ptype: 'componentstorebind', dataField: 'ExtendedAttribAccess' },
                    items: [
                        {
                            boxLabel: 'User',
                            name: 'ExtendedAttribAccess',
                            inputValue: 'User'
                        },
                        {
                            boxLabel: 'Admin',
                            name: 'ExtendedAttribAccess',
                            inputValue: 'Admin'
                        },
                        {
                            boxLabel: 'SA',
                            name: 'ExtendedAttribAccess',
                            inputValue: 'SA'
                        }
                    ]
                }

            ]
        },
        {
            xtype: 'container', layout: { type: 'vbox', align: 'stretch', pack: 'start' }, padding: '10 0 0', flex: 3,
            defaults: { margin: '0 10 10' },
            items: [
                {
                    plugins: { ptype: 'borderfloatingtitle', position: 't', titleConfig: 'Misc Settings' }
                },
                {
                    xtype: 'textfield', fieldLabel: 'Project Mgr', labelAlign: 'top', itemId: 'App_ProjectMgr', margin: '10 10 0 0', padding: '10 0 0', editable: true,
                    plugins: { ptype: 'componentstorebind', dataField: 'ProjectMgr' }
                },
                {
                    xtype: 'textfield', fieldLabel: 'Project Mgr Email', labelAlign: 'top', itemId: 'App_ProjectMgr_Email', margin: '10 10 0 0', padding: '10 0 0 0', editable: true,
                    plugins: { ptype: 'componentstorebind', dataField: 'ProjectMgr_Email' }
                },
                {
                    xtype: 'textfield', fieldLabel: 'App Contact Email', labelAlign: 'top', itemId: 'App_contactEmail', margin: '10 10 0 0', padding: '10 0 0 0', editable: true,
                    plugins: { ptype: 'componentstorebind', dataField: 'contactEmail' }
                },
                {
                    xtype: 'textfield', fieldLabel: 'BIA App List Icon/Initial Color (hex)', labelAlign: 'top', itemId: 'App_HexColor', margin: '10 10 20 0', padding: '10 0 20 0', editable: true,
                    plugins: { ptype: 'componentstorebind', dataField: 'HexColor' }
                },
                {
                    plugins: {
                        ptype: 'borderfloatingtitle', position: 't', margin: '20 0 0 0', padding: '20 0 0 0',
                        titleConfig: {
                            xtype: 'container',
                            layout: {
                                type: 'hbox'
                            },
                            items: [
                                { xtype: 'container', width: 10, text: '', cls: 'BorderFloatingTitleBottom', style: 'margin: 12px 0 0 0;' },
                                { xtype: 'container', html: 'Subscriptions', cls: 'BorderFloatingTitle', style: 'margin-top: 3px' },
                                {
                                    xtype: 'iconbutton',
                                    icon: 'plus-circle',
                                    itemId: 'addSubscriptionButton',
                                    cls: 'BIAIconButton',
                                    margin: '0 0 0 5'
                                },
                                { xtype: 'container', flex: 1, text: '', cls: 'BorderFloatingTitleBottom', style: 'margin: 12px 0 0 5px;' }
                            ]
                        }
                    }
                },
                {
                    xtype: 'container',
                    itemId: 'otherInfo',
                    cls: 'otherInfo',
                    hidden: false,
                    flex: 1,
                    margin: '-10 0 0 -15',
                    layout: {
                        type: 'vbox',
                        align: 'stretch',
                        pack: 'start'
                    },
                    defaults: { margin: '0 0 0' },
                    items: [
                        { xtype: 'App-View-Application-AddEditView-Subscription-View' }
                    ]
                }
            ]
        },
        {
            xtype: 'container', layout: { type: 'vbox', align: 'stretch', pack: 'start' }, padding: '10 0 0', flex: 2,
            defaults: { margin: '0 10 10' },
            items: [
                {
                    plugins: { ptype: 'borderfloatingtitle', position: 't', titleConfig: 'App Switches' }
                },
                {
                    xtype: 'checkbox', boxLabel: 'App Supports Multi Level Access (Multi-Geo)', labelAlign: 'right', itemId: 'App_multiLevelAccess', margin: '10 10 0 0', padding: '5 0 0', editable: true,
                    plugins: { ptype: 'componentstorebind', dataField: 'multiLevelAccess' }
                },
                {
                    xtype: 'checkbox', boxLabel: 'Visibility (Show on BIA App List/Homepage)', labelAlign: 'right', itemId: 'App_Visibility', margin: '10 10 0 0', padding: '5 0 0', editable: true,
                    plugins: { ptype: 'componentstorebind', dataField: 'Visibility' }
                },
                {
                    xtype: 'checkbox', boxLabel: 'Visibility', labelAlign: 'right', itemId: 'App_Visibility', margin: '10 10 0 0', padding: '5 0 0', editable: true,
                    plugins: { ptype: 'componentstorebind', dataField: 'Visibility' }
                },
                {
                    xtype: 'checkbox', boxLabel: 'Show On Request Page', labelAlign: 'right', itemId: 'App_showOnRequestPage', margin: '10 10 0 0', padding: '5 0 0', editable: true,
                    plugins: { ptype: 'componentstorebind', dataField: 'showOnRequestPage' }
                },
                {
                    xtype: 'checkbox', boxLabel: 'Allow Access Request', labelAlign: 'right', itemId: 'App_Req_App_Visible', margin: '10 10 0 0', padding: '5 0 0', editable: true,
                    plugins: { ptype: 'componentstorebind', dataField: 'Req_App_Visible' }
                },
                {
                    xtype: 'checkbox', boxLabel: 'Trap Errors (CF Only, .Net requires web.config changes)', labelAlign: 'right', itemId: 'App_TrapErrors', margin: '10 10 0 0', padding: '5 0 0', editable: true,
                    plugins: { ptype: 'componentstorebind', dataField: 'TrapErrors' }
                },
                {
                    xtype: 'checkbox', boxLabel: 'Secured App (BIASecurity Enabled)', labelAlign: 'right', itemId: 'App_Secured', margin: '10 10 0 0', padding: '5 0 0', editable: true,
                    plugins: { ptype: 'componentstorebind', dataField: 'SecuredApp' }
                },
                {
                    xtype: 'checkbox', boxLabel: 'BIACore Enabled', labelAlign: 'right', itemId: 'App_isSecured', margin: '10 10 0 0', padding: '5 0 0 0', editable: true,
                    plugins: { ptype: 'componentstorebind', dataField: 'isSecured' }
                },
                {
                    xtype: 'checkbox', boxLabel: 'APRS Enabled (will enable APRS Role check)', labelAlign: 'right', itemId: 'App_APRSEnabled', margin: '10 10 20 0', padding: '5 0 20 0', editable: true,
                    plugins: { ptype: 'componentstorebind', dataField: 'APRSEnabled' }
                },
                {
                    plugins: { ptype: 'borderfloatingtitle', position: 't', titleConfig: 'Browser New Window Settings', margin: '20 0 0 0', padding: '20 0 0 0' }
                },
                {
                    xtype: 'checkbox', boxLabel: 'Show Tool Bar on New Window', labelAlign: 'right', itemId: 'App_ShowToolBar', margin: '10 10 0 0', padding: '5 0 0', editable: true,
                    plugins: { ptype: 'componentstorebind', dataField: 'ShowToolBar' }
                },
                {
                    xtype: 'checkbox', boxLabel: 'Show Location on New Window', labelAlign: 'left', itemId: 'App_ShowLocation', margin: '10 10 0 0', padding: '5 0 0 0', editable: true,
                    plugins: { ptype: 'componentstorebind', dataField: 'ShowLocation' }
                },
                {
                    xtype: 'textfield', fieldLabel: 'Override Geo Level Access', labelAlign: 'top', itemId: 'App_DefaultGeoAccess', margin: '10 10 20 0', padding: '10 0 20 0', editable: true,
                    plugins: { ptype: 'componentstorebind', dataField: 'everyoneHasDefaultAccessAsGeoListingID' }
                },
                {
                    plugins: { ptype: 'borderfloatingtitle', position: 't', titleConfig: 'Info', margin: '20 0 0 0', padding: '20 0 0 0' }
                },
                {
                    xtype: 'textfield', fieldLabel: 'Last Updated', labelAlign: 'top', itemId: 'App_LastUpdated', margin: '10 10 0 0', padding: '5 0 20 0', editable: false, renderer: BIA.util.Format.ShortLocalDateTime,
                    plugins: { ptype: 'componentstorebind', dataField: 'LastUpdated' }
                },
                {
                    xtype: 'textfield', fieldLabel: 'Last Updated By', labelAlign: 'top', itemId: 'App_LastUpdatedBy', margin: '10 10 0 0', padding: '5 0 20 0', editable: false, 
                    plugins: { ptype: 'componentstorebind', dataField: 'LastUpdatedBy' }
                }
            ]
        }
    ]
});