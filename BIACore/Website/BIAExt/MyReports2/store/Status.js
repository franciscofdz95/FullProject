Ext.define('BIA.MyReports.store.Status', {
    extend: 'BIA.data.store.Memory',
    alias: 'store.BIA-MyReports-Status',
    data: [
        { Id: 'C', Name: 'Complete' },
        { Id: 'E', Name: 'Error' },
        { Id: 'P', Name: 'Processing' },
        { Id: 'R', Name: 'Pending' }
    ]
});
