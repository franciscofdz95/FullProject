Ext.define('MyReports.controller.Report.Grid', {
    extend: 'Ext.app.Controller',
    refs: [
        { ref: 'MyReports', selector: '[xtype="MyReports-Report-Grid"]' }
    ],
    init: function () {
        var me = this;
        me.control({
            '[xtype="MyReports-Report-Grid"]': {
                cellclick: me.CellClick,
                itemdelete: me.Delete,
                itemretry: me.Retry,
                afterrender: me.Show,
                show: me.Show,
                hide: me.Hide
            },
            'biaviewport': {
                windowfocus: me.WindowFocus,
                windowblur: me.WindowBlur
            }
        });
    },
    CellClick: function (table, td, cellIndex, record) {
        var col = table.getGridColumns()[cellIndex].dataIndex;

        if ((col === 'Description' || col === 'Status') && record.get('Status') === 'C') {
            // determine if we need to produce a download 'click'
            Ext.create('BIA.form.FileDownload', {
                url: 'api/MyReports/Download?' + Ext.urlEncode({
                    Id: record.get('MyReportsId')
                })
            });
        }
    },
    Delete: function (grid, rowIndex) {
        var store = grid.getStore(),
            selected = grid.getSelectionModel().getSelection(),
            message = 'Are you sure you want to delete ' + ((selected.length > 1) ? 'these ' + selected.length + ' reports?' : 'this report?');

        // confirm delete
        Ext.MessageBox.confirm(
            'Delete',
            message,
            function (buttonId) {
                if (buttonId === 'yes') {
                    if (selected.length === 0) {
                        store.removeAt(rowIndex);
                    } else {
                        store.remove(selected);
                    }
                    store.sync(/*{ callback: function () { store.reload() } }*/);
                }
            },
            this);
    },
    Retry: function (grid, rowIndex, colIndex, item, e, record) {
        var me = this;

        Ext.Ajax.request({
            caller: me,
            url: 'api/MyReports/Retry',
            jsonData: { MyReportsId: record.get('MyReportsId') },
            method: 'POST',
            callback: function () { me.Refresh(me.getMyReports()); },
            scope: me,
            withCredentials: true
        });
    },
    Show: function (panel) {
        var me = this,
            task = me.refreshTask;

        if (!Ext.isDefined(task)) {
            task = me.refreshTask = Ext.TaskManager.newTask({
                run: me.Refresh,
                fireOnStart: true,
                interval: 1000 * 60,
                repeat: 4,
                args: [panel],
                scope: me
            });
        }

        // since both afterrender and show call us, only start the task when the panel is not hidden.
        // we use isHidden instead of isVisible thanks to IE rendering issues (item is rendered visible then hidden)
        if (!panel.isHidden()) {
            task.start();
        }
    },
    Hide: function () {
        var task = this.refreshTask;
        if (task) { task.stop(); }
    },
    WindowFocus: function () {
        var me = this,
            task = me.refreshTask,
            report = me.getMyReports();

        if (report && task && !report.isHidden()) {
            task.start();
        }
    },
    WindowBlur: function () {
        var task = this.refreshTask;
        if (task) { task.stop(); }
    },
    Refresh: function (panel) {
        if (panel && !panel.isHidden()) {
            panel.Reload();
        }
    }
});