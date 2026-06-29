Ext.define('App.View.Admin.News.List', {
    extend: 'App.View.Component.Grid.PagedSort',
    alias: 'widget.App-View-Admin-News-List',
   
    title: 'BIA News And Alerts',
    border: false,
    height: 400,
    cls: 'biaMessageList',
    store: {
        type: 'webapi',
        api: {
            read: 'api/BIASecurity/GetBIAMessages'
        },
        remoteSort: true,
        autoLoad: false
    },  
    columns: {
        defaults: { menuDisabled: true, align: 'left', autoSize: false, draggable: false },
        items: [
            { clickEvent: 'bianewsedit', align: 'center', renderer: Utility.Formatting.BIANewsEditColumnIcon, width: 35, flex: 0, hidden: !App.Utility.ConnectionSecurity.isBIADeveloper() },
            { text: 'Type', dataIndex: 'MessageTypeClass', renderer: Utility.Formatting.BIANewsMessageTypeIcon, minWidth: 100, align: 'center' },
            { text: 'Active', dataIndex: 'Active', renderer: Utility.Formatting.BIANewsStatusIcon, minWidth: 100, align: 'center' },
            { text: 'Date', dataIndex: 'MessageDateDisplay', minWidth: 150, align: 'center' },
            { text: 'Message', dataIndex: 'MessageText', flex: 1.25}
        ]
    }
});