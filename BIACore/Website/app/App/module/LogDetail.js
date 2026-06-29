Ext.define('App.module.LogDetail', {
    extend: 'App.desktop.Module',
    alias: 'widget.App-module-LogDetail',

    title: 'Log Detail',
    iconCls: 'icon-report_magnify',

    hideFromStart: true,

    layout: 'fit',
    items: [],

    init: function (data) {
        var me = this,
            data = data || {};

        if (data.isModel) {
            me.params = { LogId: data.get('LogId') };
            me.add({ xtype: 'App-Log-Detail', record: data });
        } else if (data.LogId) {
            var store = Ext.data.StoreManager.lookup({
                type: 'webapi',
                api: {
                    read: 'api/AppLog/ById'
                }
            });

            store.getProxy().setExtraParams(data);
            store.load({
                callback: function (records, operation, success) {
                    if (success && records.length > 0) {
                        me.add({ xtype: 'App-Log-Detail', record: records[0] });
                        me.params = { LogId: records[0].get('LogId') };
                    }
                }
            });
        }
    },

    getParams: function () {
        return this.params || {};
    }
});