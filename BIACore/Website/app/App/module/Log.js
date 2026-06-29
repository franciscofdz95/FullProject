Ext.define('App.module.Log', {
    extend: 'App.desktop.Module',
    alias: 'widget.App-module-Log',

    title: 'Log',
    iconCls: 'icon-report',

    layout: 'border',
    items: [
        { xtype: 'App-Log-Filter', region: 'north' },
        { xtype: 'App-Log-Grid', region: 'center' }
    ],

    init: function (data) {
        var me = this;

        // can't use Ext.isEmpty, because data has a prototype, meaning it isn't empty.
        if (!BIACore.isEmpty(data)) {
            //me.down('[xtype="App-Log-Filter"]').setVisible(false);

            for(f in data) {
                var d = data[f];
                if(Ext.isArray(d)) d = d[0];

                var filter = me.down('#' + f);
                if(filter) filter.setRawValue(d);
            }

            var store = me.down('[xtype="App-Log-Grid"]').getStore();
            store.getProxy().setExtraParams(data);
            store.load();
        }
    },

    getParams: function () {
        return this.down('[xtype="App-Log-Grid"]').getStore().getProxy().getExtraParams();
    }
});