Ext.define('App.View.User.List.View', {
    extend: 'BIA.Components.PagedList',
    alias: 'widget.App-View-User-List-View',

    cls: 'userListView',

    store: {
        type: 'webapi',
        api: {
            read: 'api/BIASecurity/GetUserList'
        }
    },

    columns: 1,
    pageSize: 13,
    loadingMessage: 'Loading',
    itemXtype: 'App-View-User-List-ItemGrid',
    itemRecordAttribute: 'user',
    showPagingToolbar: true,
    pagingToolbarTotalRecordsPostfixString: 'User',
    syncListItemHeights: false,
    noRecordsMessage: 'No records exist.',
    //deeplinkPaging: true,
    remotePaging: true,
    gridItemXtype: 'App-View-User-List-ItemGrid',
    gridItemHeight: 22,
    listItemXtype: 'App-View-User-List-ItemList',
    listItemHeight: 47,
    detailItemXtype: 'App-View-User-List-ItemDetail',
    detailItemHeight: 67,
    loadOnInit: false,
    autoPageSize: true,
    headerConfig: {
        //cls: '',
        header: true,
        padding: 4,
        docked: 'top',
        user: {
            LoginId: 'Login ID',
            Name: 'Name',
            Email: 'Email',
            Phone: 'Phone',
            Region: 'RR',
            District: 'DD',
            Country: 'CN',
            Center: 'CR',
            LastLoginDT: 'Last Login',
            Logins: 'Logins',
            LastActivityDT: 'Last Activity',
            AppAccess: 'Applications',
            Usage: 'Usage'
        }
    },

    dockedItems: [
        { xtype: 'App-View-User-List-Toolbar', docked: 'top', autoAddTypeToggleButtons: true }
    ]
});