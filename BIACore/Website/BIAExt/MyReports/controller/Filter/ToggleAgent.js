Ext.define('MyReports.controller.Filter.ToggleAgent', {
    extend: 'Ext.app.Controller',
    refs: [],
    init: function () {
        var me = this;
        if (BIACore.Security.User.isSA()) {
            me.control({
                '[xtype="MyReports-Report-Grid"] #ToggleAgent': {
                    click: me.ExportConfiguration
                }
            });
        }
    },
    ExportConfiguration: function () {
        Ext.widget('Configuration-Window');
    }
});