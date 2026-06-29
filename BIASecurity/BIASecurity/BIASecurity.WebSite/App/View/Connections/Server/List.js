Ext.define('App.View.Connections.Server.List', {
    extend: 'App.View.Component.Grid.PagedSort',
    alias: 'widget.App-View-Connections-Server-List',

    title: 'Server',
    cls: 'connectionsServerList',
    border: false,
    store: {
        type: 'webapi',
        api: {
            read: 'api/BIASecurity/ServerList'
        },
        remoteSort: true
    },
    columns: {
        defaults: { menuDisabled: true, align: 'left', flex: 1, autoSize: true, draggable: false },
        items: [
            { clickEvent: 'serverview', align: 'center', renderer: Utility.Formatting.ConnectionsViewColumnIcon, width: 35, flex: 0, hidden: !App.Utility.ConnectionSecurity.isConnectionAdmin() },
            { clickEvent: 'serveredit', align: 'center', renderer: Utility.Formatting.ConnectionsEditColumnIcon, width: 35, flex: 0, hidden: !App.Utility.ConnectionSecurity.isConnectionAdmin() },
            { text: 'Alias', dataIndex: 'ServerAlias' },
            { text: 'Name', dataIndex: 'ServerName' },
            { text: 'Instance Name', dataIndex: 'InstanceName' },
            { text: 'Port', dataIndex: 'Port' },
            { text: 'Type', dataIndex: 'ServerType' },
            { text: 'Env', dataIndex: 'Environment', flex: 0, width: 70 },
            { text: 'Cluster', dataIndex: 'Cluster' },
            { text: 'Node', dataIndex: 'Node' },
            { text: 'Active', dataIndex: 'Active', align: 'center', renderer: Utility.Formatting.ConnectionsActiveColumnIcon, width: 70, flex: 0 },
            { text: 'Conn #', dataIndex: 'ConnectionCount', align: 'center', width: 80, flex: 0 }
        ]
    }
});