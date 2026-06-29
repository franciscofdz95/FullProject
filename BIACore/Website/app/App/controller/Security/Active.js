Ext.define('App.controller.Security.Active', {
    extend: 'Ext.app.Controller',
    init: function () {
        var me = this;
        me.control({
            '[xtype="App-Security-Active"]': {
                activate: me.Activate,
                deletesession: me.Logout
            }
        });
    },
    Activate: function (cmp) {
        cmp.Reload();
    },
    Logout: function (grid, rowIndex, colIndex, item, e, record) {
        var store = grid.getStore();
        store.remove(record);
        store.sync();
    }
});