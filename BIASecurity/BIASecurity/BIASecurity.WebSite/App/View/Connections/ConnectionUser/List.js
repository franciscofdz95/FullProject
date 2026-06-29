Ext.define('App.View.Connections.ConnectionUser.List', {
    extend: 'App.View.Component.Grid.PagedSort',
    alias: 'widget.App-View-Connections-ConnectionUser-List',

    title: 'Login',
    border: false,
    store: {
        type: 'webapi',
        api: {
            read: 'api/BIASecurity/ConnectionUserList'
        }
    },
    columns: {
        defaults: { menuDisabled: true, align: 'left', flex: 1, autoSize: false },
        items: [
            { clickEvent: 'connectionuserview', align: 'center', renderer: Utility.Formatting.ConnectionsViewColumnIcon, width: 35, flex: 0, hidden: !App.Utility.ConnectionSecurity.isBIAAppDevMgr() },
            { clickEvent: 'connectionuseredit', align: 'center', renderer: Utility.Formatting.ConnectionsEditColumnIcon, width: 35, flex: 0, hidden: !App.Utility.ConnectionSecurity.isBIAAppDevMgr() },
            { clickEvent: 'connectionuserpasswordedit', align: 'center', renderer: Utility.Formatting.ConnectionsUserPasswordEditIcon, width: 40, flex: 0, hidden: !App.Utility.ConnectionSecurity.isBIAAppDevMgr() },
            { text: 'Active', dataIndex: 'Active', align: 'center', renderer: Utility.Formatting.ConnectionsActiveColumnIcon, width: 70, flex: 0 },
            { text: 'Username', dataIndex: 'Username' }
        ]
    }
});