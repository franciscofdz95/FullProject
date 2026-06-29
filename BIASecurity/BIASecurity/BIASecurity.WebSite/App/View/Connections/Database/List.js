Ext.define('App.View.Connections.Database.List', {
    extend: 'App.View.Component.Grid.PagedSort',
    alias: 'widget.App-View-Connections-Database-List',

    title: 'Database',
    cls: 'connectionsDatabaseList',
    border: false,
    store: {
        type: 'webapi',
        api: {
            read: 'api/BIASecurity/DatabaseList'
        },
        remoteSort: true
    },
    columns: {
        defaults: { menuDisabled: true, align: 'left', autoSize: true, draggable: false },
        items: [
            { clickEvent: 'databaseview', align: 'center', renderer: Utility.Formatting.ConnectionsViewColumnIcon, width: 35, flex: 0, hidden: !App.Utility.ConnectionSecurity.isConnectionAdmin() },
            { clickEvent: 'databaseedit', align: 'center', renderer: Utility.Formatting.ConnectionsEditColumnIcon, width: 35, flex: 0, hidden: !App.Utility.ConnectionSecurity.isConnectionAdmin() },
            { text: 'Name', dataIndex: 'DatabaseName', minWidth: 300 },
            { text: 'Global Name', dataIndex: 'GlobalName', minWidth: 300 },
            { text: 'Env', dataIndex: 'Environment', flex: 0, width: 70 },
            { text: 'Active', dataIndex: 'Active', align: 'center', renderer: Utility.Formatting.ConnectionsActiveColumnIcon, width: 70, flex: 0 }
        ]
    }
});