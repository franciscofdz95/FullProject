Ext.define('BIA.MyReports.store.User', {
    extend: 'BIA.data.store.WebAPI',
    alias: 'store.BIA-MyReports-User',

    pageSize: 0,
    proxy: {
        type: 'webapi',
        api: {
            read: BIACore.Config.serviceURI + 'api/MyReports/User'
        },
        withCredentials: true
    },

    constructor: function () {
        var me = this;
        me.callParent(arguments);
        me.mon(me, { beforeload: BIA.MyReports.BeforeLoad, scope: me });
    }
});
