Ext.define('App.view.Security.Stats', {
    extend: (Ext.platformTags && Ext.platformTags.modern) ? 'Ext.grid.Grid' : 'Ext.grid.Panel',
    alias: 'widget.App-Security-Stats',
    store: {
        type: 'webapi',
        api: {
            read: 'api/AppSecurity/Stats'
        }
    },
    columns: {
        defaults: { menuDisabled: true },
        items: [
            { text: 'Interval', dataIndex: 'Interval' },
            { text: 'Cached', dataIndex: 'Cached', renderer: BIA.util.Format.number_0 },
            { text: 'Uncached', dataIndex: 'Uncached', renderer: BIA.util.Format.number_0 },
            { text: 'Fail', dataIndex: 'Fail', renderer: BIA.util.Format.number_0 },
            { text: 'Lockout', dataIndex: 'Lockout', renderer: BIA.util.Format.number_0 },
            { text: 'Total', dataIndex: 'Total', renderer: BIA.util.Format.number_0 },
            { text: 'Min', dataIndex: 'Min', renderer: BIA.util.Format.number_2 },
            { text: 'Max', dataIndex: 'Max', renderer: BIA.util.Format.number_2 },
            { text: 'Avg', dataIndex: 'Avg', renderer: BIA.util.Format.number_2 },
            { text: 'Stdev', dataIndex: 'Stdev', renderer: BIA.util.Format.number_2 }
        ]
    },

    initComponent: function () {
        var me = this;

        me.callParent(arguments);

        var refresh = Ext.TaskManager.newTask({
            run: function () { me.getStore().load(); },
            interval: 60 * 1000,
            fireOnStart: true,
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