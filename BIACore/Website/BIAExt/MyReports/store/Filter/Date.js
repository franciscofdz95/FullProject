Ext.define('MyReports.store.Filter.Date', {
    extend: 'BIA.data.store.Memory',
    alias: 'store.MyReports-Filter-Date',
    data: [
        { Id: 'lastFiveMinutes', Name: 'Last 5 minutes' },
        { Id: 'lastThirtyMinutes', Name: 'Last 30 minutes' },
        { Id: 'lastHour', Name: 'Last Hour' },
        { Id: 'today', Name: 'Today' },
        { Id: 'yesterday', Name: 'Since Yesterday' },
        { Id: 'lastWeek', Name: 'This Week' }
    ]
});
