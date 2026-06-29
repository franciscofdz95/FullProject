Ext.define('App.controller.Security.Unlock', {
    extend: 'Ext.app.Controller',
    init: function () {
        var me = this;
        me.control({
            '[xtype="App-Security-Unlock"]': {
                activate: me.Activate,
                unlock: me.Unlock
            },
            '[xtype="App-Security-Unlock"] #UserId': {
                select: me.Filter,
                clear: me.Filter
            }
        });
    },
    Activate: function (cmp) {
        cmp.Reload();
    },
    Unlock: function (grid, rowIndex, colIndex, item, e, record) {
        var store = grid.getStore();
        store.remove(record);
        store.sync();
    },
    Filter: function (combo) {
        var grid = combo.up('window').down('[xtype="App-Security-Unlock"]'),
            store = grid.getStore();

        store.getProxy().setExtraParam(combo.itemId, combo.getValue());
        grid.Reload();
    }
});