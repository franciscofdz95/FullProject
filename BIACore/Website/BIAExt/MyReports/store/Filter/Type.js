Ext.define('MyReports.store.Filter.Type', {
    extend: 'BIA.data.store.Memory',
    alias: 'store.MyReports-Filter-Type',

    constructor: function (config) {
        var me = this,
            data = me.data || config.data;

        if (!data) {
            if (Ext.getVersion().major >= 5 && me.defaultConfig && me.defaultConfig.data) {
            } else {
                config.data = [];
            }
        }

        me.callParent([config]);
    }
});
