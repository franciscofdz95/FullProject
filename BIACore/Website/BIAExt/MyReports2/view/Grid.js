Ext.define('BIA.MyReports.view.Grid', {
    extend: (Ext.platformTags && Ext.platformTags.modern) ? 'Ext.grid.Grid' : 'Ext.grid.Panel',
    alias: 'widget.BIA-MyReports-Grid',
    title: 'My Reports',
    store: { type: 'BIA-MyReports-Grid' },
    multiSelect: true,
    columns: {
        defaults: { menuDisabled: true },
        items: [
            { text: 'Report ID', dataIndex: 'ReportId' },
            { text: 'User', dataIndex: 'UserId', hidden: !(Ext.getVersion().major < 5 && BIACore.Security.User.isAdmin()) },
            { xtype: 'actioncolumn', dataIndex: 'Status', width: 18, autoSize: false, sortable: false, getClass: BIA.util.Format.customActionRenderer('Icon') },
            { text: 'Description', dataIndex: 'Description', flex: 1, renderer: BIA.util.Format.customRenderer('Description') },
            { text: 'Status', dataIndex: 'Status', align: 'center', renderer: BIA.util.Format.customRenderer('Status') },
            { text: 'Date', dataIndex: 'Date', renderer: BIA.util.Format.dateRenderer('n/j/Y g:i:s A') },
            {
                xtype: 'actioncolumn', width: 45, align: 'center', sortable: false,
                items: [
                    {
                        iconCls: ' mricon mricon-retry',
                        tooltip: 'Retry',
                        isDisabled: function (grid, rowIndex, colIndex, item, record) {
                            // enabled when the Status is errored.
                            return record.get('Status') !== 'E';
                        },
                        handler: function (grid, rowIndex, colIndex, item, e, record) {
                            // since the grid is actually the gridView, we want what we've defined here in this file.
                            grid.ownerCt.fireEvent('itemretry', grid.ownerCt, rowIndex, colIndex, item, e, record);
                        }
                    },
                    {
                        iconCls: ' mricon mricon-trash',
                        tooltip: 'Delete',
                        handler: function (grid, rowIndex, colIndex, item, e, record) {
                            // since the grid is actually the gridView, we want what we've defined here in this file.
                            grid.ownerCt.fireEvent('itemdelete', grid.ownerCt, rowIndex, colIndex, item, e, record);
                        }
                    }
                ]
            }
        ]
    },
    dockedItems: [
        {
            xtype: 'toolbar', dock: 'top',
            items: [
                { xtype: 'clearCombo', itemId: 'ReportUser', store: { type: 'BIA-MyReports-User' }, emptyText: 'User', hidden: true, autoLoadOnValue: true },
                { xtype: 'clearCombo', itemId: 'ReportType', store: { type: 'BIA-MyReports-Type' }, emptyText: 'Type' },
                { xtype: 'clearCombo', itemId: 'ReportDate', store: { type: 'BIA-MyReports-Date' }, emptyText: 'Date' },
                { xtype: 'clearCombo', itemId: 'ReportStatus', store: { type: 'BIA-MyReports-Status' }, emptyText: 'Status' }
            ]
        },
        {
            xtype: 'pagingtoolbar', dock: 'bottom', displayInfo: true,
            items: [
                { xtype: 'tbfill' },
                { xtype: 'button', itemId: 'ToggleAgent', text: 'Report Generator', enableToggle: true, hidden: true, iconCls: 'mricon mricon-app_error' },
                { xtype: 'tbfill' }
            ]
        }
    ],
    initComponent: function () {
        var me = this;
        me.callParent(arguments);

        // set automatically on backend, but we don't want SA's to start off seeing everything.
        me.getStore().getProxy().setExtraParam('User', BIACore.Security.User.userId);

        if (BIACore.Security.User.isAdmin()) {
            var items = ['#ReportUser', '#ToggleAgent', '[dataIndex=UserId]'];
            Ext.each(items, function (name) { me.down(name).setVisible(true); });

            me.down('#ReportUser').select(BIACore.Security.User.userId);

            var agent = me.down('#ToggleAgent');
            me.mon(agent, { toggle: BIA.MyReports.AgentToggle, scope: me });

            // start the thread that watches the agent status and changes ToggleAgent appropriately.
            var agentStatusTask = Ext.TaskManager.newTask({
                run: BIA.MyReports.AgentStatus,
                interval: 60 * 1000,
                fireOnStart: true,
                args: [agent],
                scope: me
            });

            me.mon(me, {
                afterrender: function () { if (me.isVisible(true)) { agentStatusTask.start(); } },
                show: function () { agentStatusTask.start(); },
                hide: function () { agentStatusTask.stop(); },
                beforedestroy: function () { agentStatusTask.destroy(); },
                scope: me
            });
        }

        var pager = me.down('[xtype="pagingtoolbar"]');
        pager.bindStore(me.getStore());

        // and the refresh task
        var refreshTask = Ext.TaskManager.newTask({
            run: function () { pager.doRefresh(); },
            interval: 60 * 1000,
            fireOnStart: true,
            scope: me
        });

        me.mon(me, {
            // refresh task
            afterrender: function () { if (me.isVisible(true)) { refreshTask.start(); } },
            hide: function () { refreshTask.stop(); },
            show: function () { refreshTask.start(); },
            beforedestroy: function () { refreshTask.destroy(); },
            // row operations
            cellclick: me.CellClick,
            itemdelete: me.Delete,
            itemRetry: me.Retry,
            // page size
            resize: me.PageSize,
            scope: me
        });

        var filters = ['#ReportUser', '#ReportType', '#ReportDate', '#ReportStatus'];
        Ext.each(filters, function (filter) {
            var item = me.down(filter);
            if (item) {
                me.mon(item, {
                    select: me.Filter,
                    clear: me.Filter,
                    scope: me
                });
            }
        });
    },

    onStoreLoad: function () {
        var me = this;
        me.callParent(arguments);

        if (me.getStore().count() > 0) {
            var columns = (Ext.getVersion().major >= 5) ? me.getColumnManager().getColumns() : me.columns;
            Ext.each(columns, function (column) {
                if (!column.flex && column.autoSize) {
                    column.autoSize();
                }
            });
        }
    },

    // Filters
    Filter: function (field) {
        var id = field.itemId.replace('Report', ''),
            store = this.getStore();
        
        store.getProxy().setExtraParam(id, field.getValue());
        store.loadPage(1);
    },

    PageSize: function (grid) {
        var view = grid.getView(),
            store = grid.getStore(),
            height = grid.body.getHeight(),
            row = view.getNode(0) ? Ext.get(view.getNode(0)).getHeight() : 21,
            pageSize = Math.floor(height / row),
            current = store.getPageSize();

        if (current !== pageSize) {
            // recalculate current page
            var first = (store.currentPage - 1) * current + 1;
            store.setPageSize(pageSize);
            // reload.
            store.loadPage(Math.floor(first / pageSize) + 1);
        }
    },

    // Renderers
    Description: function (value, metaData, record) {
        var status = record.get('Status');
        switch (status) {
            case 'C': metaData.tdCls = 'BIA-MyReports-Complete'; break;
            case 'P': metaData.tdCls = 'BIA-MyReports-Processing'; break;
            case 'E': metaData.tdCls = 'BIA-MyReports-Error'; break;
            default: metaData.tdCls = 'BIA-MyReports-NotApplicable'; break;
        }
        return value;
    },

    Icon: function (value, metaData, record) {
        switch (value) {
            case 'C':
                var file = record.get('FileType');
                switch (file) {
                    case 'xls': return 'mricon mricon-page_excel';
                    case 'pdf': return 'mricon mricon-page_acrobat';
                    default: return 'mricon mricon-page_gear';
                }
                break;
            case 'E': return 'mricon mricon-page_error';
            case 'P': return 'mricon mricon-page_lightning';
            default: return 'mricon mricon-page_gear';
        }
    },

    Status: function (value, metaData, record) {
        var comment = record.get('Comments');
        switch (value) {
            case 'C': metaData.tdCls = 'BIA-MyReports-Complete';
                return 'Complete';
            case 'E': metaData.tdCls = 'BIA-MyReports-Error';
                return 'Error';
            case 'N': metaData.tdCls = 'BIA-MyReports-NotApplicable';
                return 'Queued';
            case 'Q': metaData.tdCls = 'BIA-MyReports-NotApplicable';
                return comment;
            case 'P': metaData.tdCls = 'BIA-MyReports-Processing';
                return comment;
            case 'R': metaData.tdCls = 'BIA-MyReports-NotApplicable';
                return comment;
            case 'S': metaData.tdCls = 'BIA-MyReports-NotApplicable';
                return comment;
            default: metaData.tdCls = 'BIA-MyReports-NotApplicable';
                return 'Unknown';
        }
    },

    // Row operations
    CellClick: function (table, td, cellIndex, record) {
        var col = table.getGridColumns()[cellIndex].dataIndex;

        if ((col === 'Status' || col === 'Description') && record.get('Status') === 'C') {
            BIA.MyReports.Download(record.get('ReportId'));
        }
    },

    Delete: function (grid, rowIndex) {
        var store = grid.getStore(),
            selected = grid.getSelectionModel().getSelection();

        if (selected.length === 0) {
            selected = [store.getAt(rowIndex)];
        }

        var message = 'Are you sure you want to delete ' + ((selected.length > 1) ? 'these ' + selected.length + ' reports?' : 'this report?');

        // confirm delete
        Ext.MessageBox.confirm(
            'Delete',
            message,
            function (buttonId) {
                if (buttonId === 'yes') {
                    store.remove(selected);
                    BIA.MyReports.Sync(store);
                }
            },
            this);
    },

    Retry: function (grid, rowIndex) {
        var store = grid.getStore(),
            pager = grid.down('[xtype="pagingtoolbar"]'),
            selected = grid.getSelectionModel().getSelection(),
            items = [];

        if (selected.length === 0) {
            selected = [store.getAt(rowIndex)];
        }

        // get the array of selected items to retry.
        Ext.each(selected, function (item) {
            if (item.get('Status') === 'E') {
                items.push({ ReportId: item.get('ReportId') });
            }
        });

        BIA.MyReports.Retry(items, function (success) {
            if (success) {
                pager.doRefresh();
            }
        });
    }
});