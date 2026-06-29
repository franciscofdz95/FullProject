Ext.define('BIA.MyReports.store.Grid', {
    extend: 'BIA.data.store.WebAPI',
    alias: 'store.BIA-MyReports-Grid',

    proxy: {
        batchActions: true,
        type: 'webapi',
        api: {
            read: BIACore.Config.serviceURI + 'api/MyReports/List',
            destroy: BIACore.Config.serviceURI + 'api/MyReports/Delete'
        },
        actionMethods: {
            read: 'POST',
            destroy: 'POST'
        },
        withCredentials: true
    },

    constructor: function () {
        var me = this;
        me.callParent(arguments);
        me.mon(me, { beforeload: BIA.MyReports.BeforeLoad, scope: me });

        if (Ext.getVersion().major < 5) {
            Ext.apply(me, {
                getPageSize: function () {
                    return me.pageSize;
                },
                setPageSize: function (size) {
                    me.pageSize = size;
                }
            });
        }
    }
});
