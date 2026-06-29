Ext.define('MyReports.view.Report.Grid', {
    extend: (Ext.platformTags && Ext.platformTags.modern) ? 'Ext.grid.Grid' : 'Ext.grid.Panel',
    alias: 'widget.MyReports-Report-Grid',
    title: 'My Reports',
    store: { type: 'MyReports-Report-Grid' },
    cls: 'MyReports',
    multiSelect: true,
    columns: {
        defaults: { menuDisabled: true },
        items: [
            { text: 'Report ID', dataIndex: 'MyReportsId', width: 120, renderer: BIA.util.Format.customRenderer('Renderer_ReportId') },
            { xtype: 'actioncolumn', dataIndex: 'Status', width: 18, sortable: false, getClass: BIA.util.Format.customActionRenderer('Renderer_Icon') },
            { text: 'File Description', dataIndex: 'Description', flex: 1, renderer: BIA.util.Format.customRenderer('Renderer_Description') },
            { text: 'Status', dataIndex: 'Status', width: 90, align: 'center', renderer: BIA.util.Format.customRenderer('Renderer_Status') },
            { text: 'Date', dataIndex: 'DateEntry', width: 200, align: 'center', renderer: BIA.util.Format.dateRenderer('n/j/Y g:i:s A') },
            {
                xtype: 'actioncolumn', width: 45, align: 'center', sortable: false,
                items: [
                    {
                        iconCls: 'icon icon-arrow_rotate_clockwise',
                        tooltip: 'Retry',
                        isDisabled: function (grid, rowIndex, colIndex, item, record) {
                            // enabled when the Status is errored.
                            return record.get('Status') !== 'E';
                        },
                        handler: function (grid, rowIndex, colIndex, item, e, record) {
                            // since the grid is actually the gridView, we want what we've defined here in this file.
                            grid.ownerCt.fireEvent('itemretry', grid, rowIndex, colIndex, item, e, record);
                        }
                    },
                    {
                        iconCls: 'icon icon-trash_can',
                        tooltip: 'Delete',
                        handler: function (grid, rowIndex, colIndex, item, e, record) {
                            // since the grid is actually the gridView, we want what we've defined here in this file.
                            grid.ownerCt.fireEvent('itemdelete', grid, rowIndex, colIndex, item, e, record);
                        }
                    }
                ]
            }
        ]
    },
    dockedItems: [
        {
            xtype: 'toolbar', dock: 'top', //hidden: true,
            items: [
                { xtype: 'clearText', itemId: 'ReportUser', emptyText: 'User', hidden: true },
                { xtype: 'clearCombo', itemId: 'ReportType', store: { type: 'MyReports-Filter-Type' }, emptyText: 'Type' },
                { xtype: 'clearCombo', itemId: 'ReportDate', store: { type: 'MyReports-Filter-Date' }, emptyText: 'Date' },
                { xtype: 'clearCombo', itemId: 'ReportStatus', store: { type: 'MyReports-Filter-Status' }, emptyText: 'Status' }
            ]
        },
        {
            xtype: 'pagingtoolbar', dock: 'bottom', displayInfo: true,
            items: [
                '->',
                { xtype: 'button', itemId: 'ShowAll', text: 'Show All', hidden: true, iconCls: 'icon icon-group' },
                { xtype: 'button', itemId: 'ShowMine', text: 'Show Mine', hidden: true, iconCls: 'icon icon-user' },
                { xtype: 'button', itemId: 'ToggleAgent', text: 'Report Generator', hidden: true, iconCls: 'icon icon-application_error' },
                '->'
            ]
        }
    ],
    constructor: function (config) {
        var me = this;
        //me.addEvents('itemdelete', 'itemretry');
        me.callParent([config]);
    },
    initComponent: function () {
        var me = this;
        me.callParent(arguments);

        me.getStore().getProxy().extraParams.UserId = BIACore.Security.User.userId;
        if (BIACore.Security.User.isSA()) {
            var items = ['#ReportUser', '#ShowAll', '#ShowMine', '#ToggleAgent'];
            Ext.each(items, function (name) { me.down(name).setVisible(true); });
        }

        var pager = me.down('[xtype="pagingtoolbar"]');
        if (pager) {
            pager.bindStore(me.getStore());
        }
    },
    Renderer_ReportId: function (value, metaData, record) {
        return BIACore.Security.User.isSA() ? Ext.String.format('{0} | {1}', value, record.get('UserId')) : value;
    },
    Renderer_Icon: function (value, metaData, record) {
        // default renderer sets value = '', so we need to fetch our record.
        var val = record.get(this.dataIndex);
        switch (val) {
            case 'C':
                var file = record.get('FileType');
                switch (file) {
                    case 'xls': return 'icon icon-page_excel';
                    case 'pdf': return 'icon icon-page_white_acrobat';
                    default: return 'icon icon-page_gear';
                }
                break;
            case 'E': return 'icon icon-page_error';
            case 'P': return 'icon icon-page_lightning';
            default: return 'icon icon-page_gear';
        }
    },
    Renderer_Description: function (value, metaData, record) {
        var desc = record.get('Description'),
            status = record.get('Status');

        switch (status) {
            case 'C': metaData.tdCls = 'Complete';
                return desc;
            case 'E': metaData.tdCls = 'Error';
                var comment = record.get('StatusComments');
                return Ext.String.format('{0} report caused an error: {1}', desc, comment);
            case 'P': metaData.tdCls = 'Processing';
                return Ext.String.format('{0} report is processing.', desc);
            default: metaData.tdCls = 'NotApplicable';
                return Ext.String.format('{0} report is pending: May take up to 5 minutes to generate report.', desc);
        }
    },
    Renderer_Status: function (value, metaData, record) {
        switch (value) {
            case 'C': metaData.tdCls = 'Complete';
                return 'Complete';
            case 'E': metaData.tdCls = 'Error';
                return 'Error';
            case 'N': metaData.tdCls = 'NotApplicable';
                return 'Queued';
            case 'P': metaData.tdCls = 'Processing';
                return 'Processing';
            case 'R': metaData.tdCls = 'NotApplicable';
                return 'Pending';
            case 'S': metaData.tdCls = 'NotApplicable';
                return 'Stopped';
            default: metaData.tdCls = 'NotApplicable';
                return 'Unknown';
        }
    },
    Reload: function () {
        var me = this,
            pager = me.down('[xtype="pagingtoolbar"]'),
            store = me.getStore();

        if (pager) {
            pager.moveFirst();
        } else {
            store.reload();
        }
    }
});