Ext.define('App.View.Connections.Connection.List', {
    extend: 'App.View.Component.Grid.PagedSort',
    alias: 'widget.App-View-Connections-Connection-List',

    title: 'Application Connections',
    cls: 'connectionsConnectionList',
    border: false,
    store: {
        type: 'webapi',
        api: {
            read: 'api/BIASecurity/ConnectionList'
        },
        remoteSort: true,
        autoLoad: false
    },
    viewConfig: {
        getRowClass: function getRowClass(record, index, rowParams, store) {
            return record.get('Active') !== 1 ? 'row-inactive' : '';
        }
    },
    header: {
        defaults: { margin: '0 0 0 10' },
        items: [
            { xtype: 'App-View-Connections-Connection-Component-EnvironmentFilter' },
            { xtype: 'App-View-Connections-Connection-Component-ShowEnvironmentMismatch' },
            { xtype: 'App-View-Connections-Connection-Component-ShowInactiveToggle' }
        ]
    },
    columns: {
        defaults: { menuDisabled: true, align: 'left', flex: 1, autoSize: true, draggable: false },
        items: [
            { clickEvent: 'connectionview', align: 'center', renderer: Utility.Formatting.ConnectionsViewColumnIcon, width: 35, flex: 0, hideable: false, hidden: false },
            { clickEvent: 'connectionedit', align: 'center', renderer: Utility.Formatting.ConnectionsEditColumnIcon, width: 35, flex: 0, hideable: false, hidden: false },
            { text: 'Env', dataIndex: 'Environment', flex: 0, width: 70 },
            { text: 'Server', dataIndex: 'ServerNameInstanceName', flex: 2 },
            { text: 'Database', dataIndex: 'DatabaseName' },
            { text: 'AppCode', dataIndex: 'AppCode' },
            { text: 'Manager', dataIndex: 'Manager' },
            { text: 'Connection', dataIndex: 'ConnectionName', flex: 2 },
            { text: 'Technology', dataIndex: 'TechnologyName', flex: 0, width: 100 },
            { clickEvent: 'updateapplicationstatus', text: 'Active', dataIndex: 'Active', align: 'center', renderer: Utility.Formatting.ConnectionsActiveColumnIcon, width: 70, flex: 0 },            
            { clickEvent: 'applicationconnectiontest', align: 'center', renderer: Utility.Formatting.ApplicationConnectionTestIcon, width: 40, flex: 0 },
            { text: 'Login', dataIndex: 'Username', flex: 1.25 },
            { clickEvent: 'connectionuserpasswordedit', align: 'center', renderer: Utility.Formatting.ConnectionsUserPasswordEditIcon, width: 40, flex: 0, hideable: false, hidden: true }
        ]
    }
});