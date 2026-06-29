Ext.define('App.view.Version.Grid', {
    extend: 'BIA.grid.PagedPanel',
    alias: 'widget.App-Version-Grid',
    store: {
        type: 'webapi',
        api: {
            read: 'api/AppLog/Version'
        }
    },
    dockedItems: [
        {
            xtype: 'multisorttoolbar', dock: 'top',
            items: [
                { text: 'Version', sortData: { property: 'Version', direction: 'DESC' } }
            ]
        }
    ],
    columns: {
        defaults: { menuDisabled: true },
        items: [
            { text: 'Version', dataIndex: 'Version' },
            { text: 'Server', dataIndex: 'Server' },
            { text: 'AppCode', dataIndex: 'AppCode' },
            { text: 'Date', dataIndex: 'Date', renderer: BIA.util.Format.ShortLocalDateTime },
            { text: 'VersionDate', dataIndex: 'VersionDate', renderer: BIA.util.Format.ShortLocalDateTime }
        ]
    }
});