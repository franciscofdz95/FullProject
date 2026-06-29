Ext.define('App.view.Browser.Grid', {
    extend: 'BIA.grid.PagedPanel',
    alias: 'widget.App-Browser-Grid',

    autoSize: false,

    store: {
        type: 'webapi',
        api: {
            read: 'api/AppLog/Browser'
        }
    },
    columns: {
        defaults: { menuDisabled: true },
        items: [
            // generated dynamically in onMetaChange
        ]
    },
    features: [
        { ftype: 'remotesummary', dock: 'top' }
    ],

    initComponent: function () {
        var me = this;

        me.callParent(arguments);

        // theoretically, the store is who is supposed to fire this event
        // a bug in Ext's design has the proxy actually firing it.
        me.getStore().on({
            metachange: me.onMetaChange,
            scope: me
        });

        me.on({
            afterlayout: me.onAfterLayout,
            scope: me
        });
    },

    onMetaChange: function (proxy, meta) {
        var me = this,
            format = BIA.util.Format.auto,
            fields = (meta || {}).fields || [],
            columns = [];

        Ext.each(fields, function (field) {
            if (field.name === 'ROWNUMBER') { return; }
            columns.push({ text: field.name, dataIndex: field.name, renderer: format });
        });

        me.reconfigure(null, columns);
    },

    onAfterLayout: function () {
        var me = this,
            store = me.getStore();

        if (store.count() > 0) {
            Ext.each(me.getColumnManager().getColumns(), function (column) {
                column.autoSize();
            });
        }
    }

});