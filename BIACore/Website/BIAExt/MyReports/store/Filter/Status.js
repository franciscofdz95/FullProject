Ext.define('MyReports.store.Filter.Status', {
    extend: 'BIA.data.store.Memory',
    alias: 'store.MyReports-Filter-Status',
    data: [
        { Id: 'C', Name: 'Complete' },
        { Id: 'E', Name: 'Error' },
        { Id: 'P', Name: 'Processing' },
        { Id: 'R', Name: 'Pending' }
    ]
});
