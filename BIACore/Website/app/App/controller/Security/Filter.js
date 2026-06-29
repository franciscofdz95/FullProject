Ext.define('App.controller.Security.Filter', {
    extend: 'Ext.app.Controller',
    init: function () {
        var me = this;
        me.control({
            '[xtype="App-Security-Filter"] comboarray': {
                select: me.Filter,
                clear: me.Filter,
                specialkey: me.ManualEntry
            },
            '[xtype="App-Security-Filter"] datefield': {
                select: me.Filter, // picker date selection
                specialkey: me.ManualEntry // keyboard input.
            },
            '[xtype="App-Security-Filter"] clearNumber': {
                clear: me.Filter,
                specialkey: me.ManualEntry
            },
            '[xtype="App-Security-Filter"] clearText': {
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
        var grid = combo.up('window').down('[xtype="App-Security-History"]'),
            store = grid.getStore();

        store.getProxy().setExtraParam(combo.itemId, combo.getValue());
        grid.Reload();
    }
});