Ext.define('App.controller.Version.Grid', {
    extend: 'Ext.app.Controller',
    init: function () {
        var me = this;
        me.control({
            '[xtype="App-Version-Filter"] combo': {
                select: me.Filter,
                clear: me.Filter,
                specialkey: me.ManualEntry
            },
            '[xtype="App-Version-Filter"] datefield': {
                select: me.Filter, // picker date selection
                specialkey: me.ManualEntry // keyboard input.
            },
            '[xtype="App-Version-Filter"] clearNumber': {
                clear: me.Filter,
                specialkey: me.ManualEntry
            }
        });
    },
    ManualEntry: function (item, e) {
        var key = e.getKey();
        if (key === e.ENTER || key === e.TAB) {
            this.Filter(item);
        }
    },
    Filter: function (combo) {
        var grid = combo.up('window').down('[xtype="App-Version-Grid"]'),
            store = grid.getStore(),
            pager = grid.down('[xtype="pagingtoolbar"]');

        store.getProxy().setExtraParam(combo.itemId, combo.getValue());
        if (pager) {
            pager.moveFirst();
        } else {
            store.reload();
        }
    }
});