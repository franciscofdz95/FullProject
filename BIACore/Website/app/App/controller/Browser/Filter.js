Ext.define('App.controller.Browser.Filter', {
    extend: 'Ext.app.Controller',
    init: function () {
        var me = this;
        me.control({
            '[xtype="App-Browser-Filter"] combo': {
                select: me.Filter,
                clear: me.Filter,
                specialkey: me.ManualEntry
            },
            '[xtype="App-Browser-Filter"] datefield': {
                select: me.Filter,
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
        var tab = combo.up('window').down('tabpanel');

        Ext.each(Ext.ComponentQuery.query('grid,graph', tab), function (item) {
            item.getStore().getProxy().setExtraParam(combo.itemId, combo.getValue());
        });

        // tab active item reload.
        tab.getActiveTab().Reload();
    }
});