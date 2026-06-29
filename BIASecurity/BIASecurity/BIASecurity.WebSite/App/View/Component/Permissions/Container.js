Ext.define('App.View.Component.Permissions.Container', {
    extend: 'Ext.container.Container',
    alias: 'widget.App-View-Component-Permissions-Container',
    cls: 'PermissionsContainer',

    layout: {
        type: 'vbox',
        align: 'stretch',
        pack: 'begin'
    },

    defaults: {
        defaults: {
            margin: 5
        }
    },
    width: 175,
    //permissions: [],
    //morePermissions: [],
    //shownPermissions: [],

    items: [
        {
            xtype: 'container',
            itemId: 'PermissionItemsContainer',
            layout: {
                type: 'vbox',
                align: 'stretch',
                pack: 'begin'
            },
            defaults: {
                margin: '0 5 5 0'
            },
            flex: 1,
            items: []
        },
        {
            xtype: 'container',
            itemId: 'PermissionActionsContainer',
            layout: {
                type: 'hbox',
                align: 'end',
                pack: 'begin'
            },
            defaults: {
                margin: '0 5 5 5'
            },
            items: [
                { xtype: 'App-View-Component-Permissions-Add' },
                { xtype: 'tbfill' },
                { xtype: 'App-View-Component-Permissions-More'}
            ]
        }
    ],

    addPermissions: function addPermissions(permissions) {
        if (this.rendered) {
            this.fireEvent('addPermissions', this, permissions);
        }
        else {
            if (this.permissions) {
                this.permissions = Ext.Array.union(this.permissions, permissions);
            }
            else {
                this.permissions = permissions;
            }
        }
    }
});