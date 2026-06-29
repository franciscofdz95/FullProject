Ext.define('App.Controller.Permissions', {
    extend: 'Ext.app.Controller',
    refs: [],
    init: function init() {
        var me = this;

        me.control({
            'App-View-Component-Permissions-Container': {
                beforerender: this.PermissionsBeforeRender,
                addpermissions: this.AddPermissions,
                addpermissionitem: this.AddPermissionItem,
                addmorepermissionitem: this.AddMorePermissionItem,
                removepermissionitem: this.RemovePermissionItem,
                removemorepermissionitem: this.RemoveMorePermissionItem,
                updatepermissions: this.UpdatePermissions,
                updatepermissionitem: this.UpdatePermissionItem
            },
            'App-View-Component-Permissions-More': {
                click: {
                    fn: this.MorePermissionsClick,
                    priority: -999
                }
            },
            'App-View-Component-Permissions-Item-View': {
                added: this.ItemViewAdded
            },
            'App-View-Component-Permissions-Item-StatusIcon': {
                added: this.StatusIconAdded
            },
            'App-View-Component-Permissions-Item-TypeIcon': {
                added: this.TypeIconAdded
            },
            'App-View-Component-Permissions-Item-Name': {
                added: this.NameAdded
            }
        });
        me.listen({});
    },
    PermissionsBeforeRender: function PermissionsBeforeRender(me, eOpts) {
        if (Ext.isArray(me.permissions) && me.permissions.length > 0) {
            me.fireEvent('addPermissions', me, me.permissions);
        }
        me.down('App-View-Component-Permissions-More').suspendEvent('click');
    },
    AddPermissions: function AddPermissions(me, permissions) {
        if (permissions.length > 0) {
            var localSuspendLayouts = this.GetLocalSuspendLayouts(me);
            for (index in permissions) {
                me.fireEvent('addPermissionItem', me, permissions[index]);
            }
            if (localSuspendLayouts) { Ext.resumeLayouts(); }
        }
    },
    AddPermissionItem: function AddPermissionItem(me, permission) {
        var itemContainer = this.GetPermissionItemContainer(me);
        if (itemContainer.query('>').length < 2) {
            var localSuspendLayouts = this.GetLocalSuspendLayouts(me);
            var defaultMargins = itemContainer.defaults.margin || 0;
            itemContainer.add({
                xtype: 'App-View-Component-Permissions-Item-View',
                permission: permission,
                //style: (itemContainer.query('>').length == 0 ? { marginTop: '0' } : {})
                //margin: (itemContainer.query('>').length == 0 ? '0 ' + defaultMargins + ' ' + defaultMargins + ' ' + defaultMargins : defaultMargins)
            });

            if (!me.permissions) { me.permissions = [] }
            me.permissions.push(permission);
            if (!me.shownPermissions) { me.shownPermissions = [] }
            me.shownPermissions.push(permission);

            if (localSuspendLayouts) { Ext.resumeLayouts(); }
        }
        else {
            me.fireEvent('addMorePermissionItem', me, permission);
        }
    },
    AddMorePermissionItem: function AddMorePermissionItem(me, permission) {
        if (!me.morePermissions) { me.morePermissions = []; }
        me.morePermissions.push(permission);
        if (!me.permissions) { me.permissions = [] }
        me.permissions.push(permission);
        me.down('App-View-Component-Permissions-More').enable(true);
        me.down('App-View-Component-Permissions-More').resumeEvent('click');
    },
    GetLocalSuspendLayouts: function GetLocalSuspendLayouts(me) {
        var localSuspendLayouts = false;
        if (!me.isLayoutSuspended() && me.rendered) {
            localSuspendLayouts = true;
            Ext.suspendLayouts();
        }
        return localSuspendLayouts;
    },
    GetPermissionItemContainer: function GetPermissionItemContainer(me) {
        var PermissionItemsContainer = me.down('#PermissionItemsContainer');
        if (!PermissionItemsContainer) {
            PermissionItemsCountainer = me.insert(0, {
                xtype: 'container',
                itemId: 'PermissionItemsContainer',
                layout: {
                    type: 'vbox',
                    align: 'stretch',
                    pack: 'begin'
                },
                flex: 1
            });
        }
        return PermissionItemsContainer;
    },
    ItemViewAdded: function ItemViewAdded(me, parent, index, eOpts) {
        //if(me.permission.AccessLevel
    },
    StatusIconAdded: function StatusIconAdded(me, parent, index, eOpts) {
        var permissionCmp = me.up('[permission]');
        if (permissionCmp) {
            if (Ext.isObject(permissionCmp.permission)) {
                if (permissionCmp.permission.requestStatus == 'Pending') {
                    me.down('#Pending').hidden = false;
                }
                else {
                    me.hidden = true;
                }
            }
            /*else if(permissionCmp.permission == 'NoAccess') {
                me.down('#NoAccess').hidden = false;
                me.updateLayout({ root: true });
            }*/
            me.updateLayout({ root: true });
        }
    },
    TypeIconAdded: function TypeIconAdded(me, parent, index, eOpts) {
        var permissionCmp = me.up('[permission]');
        if (permissionCmp) {
            if (Ext.isObject(permissionCmp.permission)) {
                if (permissionCmp.permission.AccessLevel == 'SA') {
                    me.down('#SA').hidden = false;
                    me.up('App-View-Component-Permissions-Item-View').addCls('Permission' + permissionCmp.permission.AccessLevel);
                }
                else if (permissionCmp.permission.AccessLevel == 'Admin') {
                    me.down('#Admin').hidden = false;
                    me.up('App-View-Component-Permissions-Item-View').addCls('Permission' + permissionCmp.permission.AccessLevel);
                }
                else {
                    me.down('#User').hidden = false;
                    me.up('App-View-Component-Permissions-Item-View').addCls('PermissionUser');
                }
                me.updateLayout({ root: true });
            }
        }
    },
    NameAdded: function NameAdded(me, parent, index, eOpts) {
        var permissionCmp = me.up('[permission]');
        if (permissionCmp) {
            if (Ext.isObject(permissionCmp.permission)) {
                var re = /[A-Z]+/g;
                me.down('#NameValue').html = Ext.Array.filter(permissionCmp.permission.businessUnitName.split(/(.)/g), function (letter) { return letter.match(/([A-Z])/g); }).join('')
                    //+ (permissionCmp.permission.geoGroupName != '' ? ' / ' + permissionCmp.permission.geoGroupName : '')
                    + (permissionCmp.permission.geoCode != '' ? ' / ' + permissionCmp.permission.geoCode : '')
                    + (permissionCmp.permission.geoId != '' ? ' / ' + permissionCmp.permission.geoId : '')
                    //+ ' / TestingExtraLongPermission'
            }
        }
    }
});