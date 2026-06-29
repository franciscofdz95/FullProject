Ext.define('App.View.Navigation.NavBar', {
    extend: 'BIA.components.NavBar',
    alias: 'widget.App-View-Navigation-NavBar',
    cls: 'NavigationNavBar',

    defaults: { margin: 10 },
    groupedItems: [
        [
            {
                xtype: 'clearCombo',
                itemId: 'mainSearch',
                width: 325,
                emptyText: 'Search for User or Application',
                margin: '0 5 0 0',
                label: 'Search',
                valueField: 'Id',
                displayField: 'Name',
                listConfig: {
                    tpl: [
                        '<ul><tpl for=".">',
                        '{[xindex === 1 || parent[xindex - 2].Group !== values.Group ? "<li class=\'group-combo-title\'>" + values.Group + "</li>" : ""]}',
                        '<li role="option" class="x-boundlist-item">{Name}</li>',
                        '</tpl></ul>'
                    ],
                    cls: 'group-combo',
                    maxHeight: 400
                },
                store: {
                    type: 'webapi',
                    proxy: {
                        type: 'webapi',
                        api: {
                            read: 'api/BIASecurity/SearchPinResults'
                        },
                        extraParams: {
                            searchType: 'Search'
                        }
                    }
                },
                autoLoadOnValue: true,
                forceSelection: true,
                minChars: 2,
                caseSensitive: false
            }
            //, {
            //    xtype: 'iconbutton',
            //    itemId: 'mainSearchButton',
            //    icon: 'arrow-circle-right',
            //    margin: '0 5',
            //    width: 31
            //}
            //,{ xtype: 'tbfill', width: 170 }
        ],
        [
            {
                xtype: 'clearCombo',
                width: 350,
                itemId: 'mainPin',
                emptyText: 'Pin User or Application',
                margin: '0 5 0 0',
                label: 'Search',
                listConfig: {
                    tpl: [
                        '<ul><tpl for=".">',
                        '{[xindex === 1 || parent[xindex - 2].Group !== values.Group ? "<li class=\'group-combo-title\'>" + values.Group + "</li>" : ""]}',
                        '<li role="option" class="x-boundlist-item">{Name}</li>',
                        '</tpl></ul>'
                    ],
                    cls: 'group-combo',
                    maxHeight: 400
                },
                store: {
                    type: 'webapi',
                    proxy: {
                        type: 'webapi',
                        api: {
                            read: 'api/BIASecurity/SearchPinResults'
                        },
                        extraParams: {
                            searchType: 'Pin'
                        }
                    }
                },
                autoLoadOnValue: true,
                forceSelection: true,
                minChars: 2,
                caseSensitive: false
            }
            //, {
            //    xtype: 'iconbutton',
            //    icon: 'thumb-tack fa-rotate-45',
            //    cls: 'SmallScale',
            //    margin: '0 0 0 5',
            //    width: 22
            //}
        ],
        [
            {
                xtype: 'iconbutton',
                itemId: 'NavBarHomeButton',
                icon: 'home',
                cls: 'LargeScale',
                margin: '0 5 0 0',
                //width: 32,
                //height: 30
            },
            {
                xtype: 'iconbutton',
                icon: 'plus-circle',
                itemId: 'NavBarAddButton',
                tooltip: 'Request Access to an application',
                cls: 'LargeScale Orange',
                margin: '0 5 0 5',
                hidden: true


                //xtype: 'button',
                //iconCls: 'fa fa-plus',
                //itemId: 'NavBarRequestAccessButton',
                //tooltip: 'Request Access to an application',
                //cls: 'NavBarRequestAccessButton FlatOrangeButton',
                //width: 32,
                //height: 30,
                ////padding: '0 2 3 0',
                //margin: '0 5 0 5'
            },
            {
                xtype: 'splitbutton',
                scale: 'medium',
                cls: 'NavBarAppsButton',
                text: 'Apps',
                itemId: 'NavBarAppsButton',
                eventToFire: {
                    eventName: 'gotoNewContent',
                    params: { xtype: 'App-View-Application-List' }
                },
                menu: {
                    items: [
                        {
                            text: 'Apps List',
                            eventToFire: {
                                eventName: 'gotoNewContent',
                                params: { xtype: 'App-View-Application-List' }
                            }
                        },
                        {
                            text: 'New App',
                            cls: 'SectionSeperator',
                            itemId: 'MenuNewApplication',
                            requiredAccess: 'SA',
                            eventToFire: {
                                eventName: 'gotoAddContent',
                                params: { class: 'App.View.Application.NewApplicationWindow' }
                            }
                        }

                    ]
                },
                menuAlign: 'tr-br?',
                margin: '0 5 0 5'
            },
            {
                xtype: 'splitbutton',
                scale: 'medium',
                cls: 'NavBarUsersButton',
                text: 'Users',
                itemId: 'NavBarUsersButton',
                eventToFire: {
                    eventName: 'gotoNewContent',
                    params: { xtype: 'App-View-User-List' }
                },
                menu: {
                    items: [
                        {
                            text: 'My Profile',
                            eventToFire: {
                                eventName: 'gotoNewContent',
                                params: {
                                    xtype: 'App-View-User-AddEditView', userId: App.Utility.UserMapping.getCurrentUserId(), user: { ADID: BIACore.Security.User.adId } }
                            }
                        },
                        {
                            text: 'User List',
                            eventToFire: {
                                eventName: 'gotoNewContent',
                                params: { xtype: 'App-View-User-List' }
                            }
                        },
                        {
                            text: 'New User',
                            requiredAccess: 'Admin',
                            eventToFire: {
                                eventName: 'gotoAddContent',
                                params: { class: 'App.View.User.NewUserWindow' }
                            }
                        }
                    ]
                },
                menuAlign: 'tr-br?',
                margin: '0 5 0 5'
            },
            {
                xtype: 'splitbutton',
                scale: 'medium',
                cls: 'NavBarAccessButton',
                text: 'Access',
                itemId: 'NavBarAccessButton',
                eventToFire: {
                    eventName: 'gotoNewContent',
                    params: { xtype: 'App-View-Access-List' }
                },
                menu: {
                    items: [
                        {
                            text: 'Access List',
                            eventToFire: {
                                eventName: 'gotoNewContent',
                                params: { xtype: 'App-View-Access-List' }
                            }
                        },
                        {
                            text: 'New Access',
                            eventToFire: {
                                eventName: 'gotoAddContent',
                                params: { class: 'App.View.Access.Request.Window' }
                            }
                        }
                    ]
                },
                menuAlign: 'tr-br?',
                margin: '0 5 0 5'
            },
            //{
            //    xtype: 'splitbutton',
            //    scale: 'medium',
            //    cls: 'NavBarReportsButton',
            //    text: 'Reports',
            //    itemId: 'NavBarReportsButton',
            //    menu: {
            //        items: [
            //            { text: 'App Usage' },
            //            { text: 'App Logins' },
            //            { text: 'User Logins' },
            //            { text: 'Security User Audit', cls: 'SectionSeperator' },
            //            { text: 'Security App Audit' },
            //            { text: 'Security Role Audit' }
            //        ]
            //    },
            //    menuAlign: 'tr-br?',
            //    margin: '0 5 0 5'
            //},
            {
                xtype: 'iconbutton',
                itemId: 'NavBarAdminButton',
                icon: 'gears',
                margin: '0 0 0 5',
                width: 33
            }
        ]
    ]
});