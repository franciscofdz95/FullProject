Ext.define('App.view.Security.Active', {
    extend: 'BIA.grid.PagedPanel',
    alias: 'widget.App-Security-Active',
    store: {
        type: 'webapi',
        api: {
            read: 'api/AppSecurity/Active',
            destroy: 'api/AppSecurity/Logout'
        }
    },
    columns: {
        defaults: { menuDisabled: true },
        items: [
            {
                xtype: 'actioncolumn', width: 45, align: 'center', sortable: false,
                items: [
                    {
                        iconCls: 'icon icon-door_in',
                        tooltip: 'Force Logout',
                        handler: function (grid, rowIndex, colIndex, item, e, record) { grid.ownerCt.fireEvent('deletesession', grid, rowIndex, colIndex, item, e, record); }
                    }
                ]
            },
            { text: 'SessionId', dataIndex: 'sessionId' },
            { text: 'UserId', dataIndex: 'UserId' },
            { text: 'Last Name', dataIndex: 'LastName' },
            { text: 'First Name', dataIndex: 'FirstName' },
            { text: 'Apps', dataIndex: 'AppCodes' },
            { text: 'Env', dataIndex: 'env' },
            { text: 'Source', dataIndex: 'source' },
            { text: 'Created', dataIndex: 'created', renderer: BIA.util.Format.ShortLocalDateTime },
            { text: 'Modified', dataIndex: 'modified', renderer: BIA.util.Format.ShortLocalDateTime },
            { text: 'IP', dataIndex: 'ipAddress' },
            { text: 'Auth UserId', dataIndex: 'Auth_UserId' },
            { text: 'Auth Last Name', dataIndex: 'Auth_LastName' },
            { text: 'Auth First Name', dataIndex: 'Auth_FirstName' }
        ]
    },

    //dockedItems: [
    //    { xtype: 'pagingtoolbar', dock: 'bottom', displayInfo: true }
    //],

    initComponent: function () {
        var me = this;

        me.callParent(arguments);

        //me.down('[xtype="pagingtoolbar"]').bindStore(me.getStore());

        var refresh = Ext.TaskManager.newTask({
            run: function () { me.getStore().load(); },
            interval: 5 * 60 * 1000,
            scope: me
        });

        me.mon(me, {
            activate: function () {
                refresh.start();
            },
            deactivate: function () {
                refresh.stop();
            },
            beforedestroy: function () {
                refresh.stop();
                refresh.destroy();
            },
            scope: me
        });
    },

    onStoreLoad: function (store) {
        var me = this;

        me.callParent(arguments);

        if (store.count() > 0) {
            if (me.rendered) {
                me.autoSize();
            } else {
                me.on({ afterrender: me.autoSize, scope: me, single: true });
            }
        }
    },

    autoSize: function () {
        Ext.each(this.getColumnManager().getColumns(), function (column) {
            if (Ext.isFunction(column.autoSize) && !column.flex) {
                column.autoSize();
            }
        });
    }
});