Ext.define('App.View.Admin.ActiveUser.Grid', {
    extend: 'App.View.Component.Grid.PagedSort',
    alias: 'widget.App-View-Admin-ActiveUser-Grid',

    title: 'Active Users',
    border: false,
    store: {
        type: 'webapi',
        api: {
            read: 'api/BIASecurity/GetActiveUserList'
        }
    },
    columns: {
        defaults: { menuDisabled: true, align: 'left', flex: 1, autoSize: false },
        items: [
            { text: 'Session', dataIndex: 'SessionId', autoSize: true, flex: 0, width: 140, align: 'center' },
            { text: 'Server', dataIndex: 'server', autoSize: true, flex: 0, width: 75, align: 'center' },  
            { text: 'Env', dataIndex: 'Env', autoSize: true, flex: 0, width: 75, align: 'center' },            
            { text: 'AppCode', dataIndex: 'appCode', autoSize: true, flex: 0, width: 150 },      
            { text: 'Sysm', dataIndex: 'Sysm', flex: 0, width: 100 },
            { text: 'AD ID', dataIndex: 'AD_ID', flex: 0, width: 100 },
            { text: 'Auth ID', dataIndex: 'authenticatedId', flex: 0, width: 100 },
            { text: 'Email', dataIndex: 'Email', align: 'center', renderer: Utility.Formatting.UserEmailColumnIcon, width: 75, flex: 0 },
            //{ text: 'Email', dataIndex: 'Email', autoSize: true },
            { text: 'Name', dataIndex: 'fullName', autoSize: true },
            { text: 'Created Date', dataIndex: 'SessionCreatedDt', autoSize: true, renderer: Utility.Formatting.LongDateTime },
            { text: 'Modified Date', dataIndex: 'modifiedDt', autoSize: true, renderer: Utility.Formatting.LongDateTime },            
            { text: 'Browser', dataIndex: 'source', autoSize: true, flex: 0, width: 100 },
            { text: 'VPN', dataIndex: 'vpnUser', autoSize: true, flex: 0, width: 50, align: 'center',renderer: Utility.Formatting.VPNViewColumnIcon  }
        ]
    }
});