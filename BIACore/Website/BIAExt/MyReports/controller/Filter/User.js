Ext.define('MyReports.controller.Filter.User', {
    extend: 'Ext.app.Controller',
    refs: [
        { ref: 'Grid', selector: '[xtype="MyReports-Report-Grid"]' }
    ],
    init: function () {
        var me = this;
        me.control({
            '[xtype="MyReports-Report-Grid"] #ShowAll': {
                click: me.Report_FilterUserAll
            },
            '[xtype="MyReports-Report-Grid"] #ShowMine': {
                click: me.Report_FilterUserMine
            },
            '[xtype="MyReports-Report-Grid"] #ReportUser': {
                specialkey: me.Report_FilterUser,
                clear: me.Report_FilterUserMine
            }
        });
    },
    Report_FilterUserAll: function () {
        var grid = this.getGrid(),
            store = grid.getStore();

        store.getProxy().extraParams.UserId = null;
        grid.Reload();
    },
    Report_FilterUserMine: function () {
        var grid = this.getGrid(),
            store = grid.getStore();

        store.getProxy().extraParams.UserId = BIACore.Security.User.userId;
        grid.Reload();
    },
    Report_FilterUser: function (field, event) {
        if (event.getKey() === event.ENTER) {
            var grid = this.getGrid(),
                store = grid.getStore(),
                query = field.getValue() || BIACore.Security.User.userId;

            store.getProxy().extraParams.UserId = query;
            grid.Reload();
        }
    }
});