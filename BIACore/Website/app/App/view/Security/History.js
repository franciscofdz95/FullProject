Ext.define('App.view.Security.History', {
    extend: 'BIA.grid.PagedPanel',
    alias: 'widget.App-Security-History',
    store: {
        type: 'webapi',
        api: {
            read: 'api/AppSecurity/History'
        }
    },
    dockedItems: [
        { xtype: 'App-Security-Filter', dock: 'top', border: false },
        {
            xtype: 'multisorttoolbar', dock: 'top',
            items: [
                { text: 'LogId', sortData: { property: 'LogId', direction: 'DESC' } }
            ]
        }
    ],
    columns: {
        defaults: { menuDisabled: true },
        items: [
            { text: 'LogId', dataIndex: 'LogId', width: 60 },
            { text: 'TransactionId', dataIndex: 'TransactionId', autoSize: false },
            { text: 'Date', dataIndex: 'LogDate', renderer: BIA.util.Format.ShortLocalDateTime },
            { text: 'Client', dataIndex: 'Client' },
            { text: 'UserId', dataIndex: 'UserId', width: 60 },
            { text: 'TargetId', dataIndex: 'TargetId', width: 60 },
            { text: 'Event', dataIndex: 'Event', width: 60, renderer: BIA.util.Format.customRenderer('Event') },
            { text: 'Detail', dataIndex: 'Detail', flex: 1 }
        ]
    },
    Date: function (value) {
        return Ext.Date.format(value, 'Y-m-d H:i:s.u') + ' UTC';
    },
    Event: function (value, metaData) {
        if (value === 'Exception') {
            metaData.tdCls = 'red';
        }
        return value;
    }
});