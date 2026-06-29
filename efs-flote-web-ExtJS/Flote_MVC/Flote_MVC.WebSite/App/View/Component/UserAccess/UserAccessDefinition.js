Ext.define('App.View.Component.UserAccess.UserAccessDefinition', {
    extend: 'Ext.window.Window',
    alias: 'widget.App-View-Component-UserAccess-UserAccessDefinition',
    title: 'Please select a user to set the extended access.',
    //contrain: true,
    constrainHeader: true,
    modal: true,
    itemId: 'UserAccessDefinitionWin',
    width: 600,
    height: 250,
    defaults: { margins: '5 5 5 5', region: 'center' },
    initComponent: function () {
        var me = this;
        me.items = [{
            xtype: 'form',
            itemId: 'userAccessDefSubmit',
            defaults: {
                anchor: '100%',
                margin: 5,
                enableKeyEvents: true
            },
            layout: 'anchor',
            items: [{
                xtype: 'combo',
                fieldLabel: "Select user to modify access",
                labelWidth: '40%',
                labelAlign: 'right',
                margin: '15 5 15 5',
                hideTrigger: true,
                anchor: '90%',
                name: "User",
                itemId: "usrSelection",
                tpl: '<tpl for="."><div class="x-boundlist-item" >{FirstName} {LastName}</div></tpl>',
                displayTpl: new Ext.XTemplate('<tpl for=".">{FirstName} {LastName}</tpl>'),
                valueField: "AdId",
                listConfig: {
                    minWidth: 300
                },
                triggerAction: "all",
                enableKeyEvents: true,
                editable: true,
                forceSelection: true,
                anyMatch: true,
                queryMode: 'remote',
                minChars: 3,
                queryParam: 'query',
                store: {
                    type: 'webapi',
                    api: {
                        read: 'api/BIASecurityFlote/GetUserList'
                    },
                    autoLoad: false
                }

            }, {
                xtype: 'App-View-Component-UserAccess-UserProfile',
                itemId: "UserprofileID",
                margin: '15 5 15 5'
                },
                {
                    xtype: 'App-View-Component-UserAccess-E2kUserId',                    
                    margin: '15 5 15 5'
                }
                
            ]

        }];
        me.fbar = {
            layout: {
                type: 'hbox',
                align: 'middle',
                pack: 'middle'
            },
            border: true,
            items: [
                { xtype: 'button', text: 'Save', iconCls: 'fa fa-save', itemId: 'userAccessDefSubmit', width: 100 },
                { xtype: 'button', text: 'Close', itemId: 'userAccessDefClose', width: 80 }
            ]
        };
        me.callParent(arguments);
    }
});