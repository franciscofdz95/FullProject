Ext.define('MyReports.controller.Filter.Date', {
    extend: 'Ext.app.Controller',
    refs: [
        { ref: 'Grid', selector: '[xtype="MyReports-Report-Grid"]' }
    ],
    init: function () {
        var me = this;
        me.control({
            '[xtype="MyReports-Report-Grid"] #ReportDate': {
                select: me.Report_FilterDate,
                clear: me.Report_FilterDate
            }
        });
    },
    Report_FilterDate: function (combo, records) {
        var grid = this.getGrid(),
            store = grid.getStore(),
            records = Ext.Array.from(records), // force Ext5 and Ext4 to "act" the same.
            value = (records.length > 0) ? records[0].get('Id') : null;

        store.getProxy().extraParams.Date = value;
        grid.Reload();
    }
});