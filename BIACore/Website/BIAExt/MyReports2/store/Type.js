Ext.define('BIA.MyReports.store.Type', {
    extend: 'BIA.data.store.WebAPI',
    alias: 'store.BIA-MyReports-Type',

    pageSize: 0,
    proxy: {
        type: 'webapi',
        api: {
            read: BIACore.Config.serviceURI + 'api/MyReports/Type'
        },
        withCredentials: true
    },

    constructor: function () {
        var me = this;
        me.callParent(arguments);
        me.mon(me, { beforeload: BIA.MyReports.BeforeLoad, scope: me });
    }
});
