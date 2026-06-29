Ext.define('App.View.User.History.Grid', {
    extend: 'App.View.Component.Grid.Base',
    alias: 'widget.App-View-User-History-Grid',
    userId: null,
    appCode: null,

    //title: 'App Access History',
    skipToolbar: true,
    border: false,
    height: '100%',
    autoScroll: true,
    layout: 'fit',
    store: {
        type: 'webapi',
        api: {
            read: 'api/BIASecurity/GetUserHistory'
        }
    },
    columns: {
        defaults: { menuDisabled: true, align: 'left', flex: 1, autoSize: false },
        items: [
            { text: 'Name', dataIndex: 'Name' },
            { text: 'ADID', dataIndex: 'sysm' },
            { text: 'App Code', dataIndex: 'AppCode' },
            { text: 'Geo Code', dataIndex: 'geoCode' },
            { text: 'Access Level', dataIndex: 'AccessLevel' },
            { text: 'Request Date', dataIndex: 'RequestDT', renderer: Utility.Formatting.ShortDateTime },
            { text: 'Request By', dataIndex: 'RequestBy' },
            { text: 'Action Date', dataIndex: 'ActionDT', renderer: Utility.Formatting.ShortDateTime },
            { text: 'Action', dataIndex: 'Action' }
        ]
    }
});
