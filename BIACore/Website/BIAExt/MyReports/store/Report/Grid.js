Ext.define('MyReports.store.Report.Grid', {
    extend: 'BIA.data.store.WebAPI',
    alias: 'store.MyReports-Report-Grid',
    proxy: {
        batchActions: true,
        type: 'webapi',
        api: {
            read: 'api/MyReports/MyReports',
            destroy: 'api/MyReports/Delete'
        },
        actionMethods: {
            read: 'POST',
            destroy: 'POST'
        },
        withCredentials: true
    },
    autoLoad: true
});
