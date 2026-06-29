Ext.define('MyReports.controller.Filter.Type', {
    extend: 'Ext.app.Controller',
    refs: [
        { ref: 'Grid', selector: '[xtype="MyReports-Report-Grid"]' }
    ],
    init: function () {
        var me = this;
        me.control({
            '[xtype="MyReports-Report-Grid"] #ReportType': {
                select: me.Report_FilterType,
                clear: me.Report_FilterType
            }
        });
    },
    Report_FilterType: function (combo, records) {
        var grid = this.getGrid(),
            store = grid.getStore(),
            records = Ext.Array.from(records), // force Ext5 and Ext4 to "act" the same.
            value = (records.length > 0) ? records[0].get('Id') : null;

        store.getProxy().extraParams.Type = value;
        grid.Reload();
    }
});