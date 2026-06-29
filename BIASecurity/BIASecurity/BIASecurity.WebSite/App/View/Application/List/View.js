Ext.define('App.View.Application.List.View', {
    extend: 'BIA.Components.PagedList',
    alias: 'widget.App-View-Application-List-View',
    cls: 'ApplicationList',

    store: {
        type: 'webapi',
        api: {
            read: 'api/BIASecurity/GetApplicationList'
        }
    },

    columns: 1,
    pageSize: 15,
    loadingMessage: 'Loading',
    itemXtype: 'App-View-Application-List-ItemGrid',
    itemRecordAttribute: 'application',
    showPagingToolbar: true,
    pagingToolbarTotalRecordsPostfixString: 'Apps',
    syncListItemHeights: false,
    noRecordsMessage: 'No records exist.',
    deeplinkPaging: true,
    remotePaging: true,
    gridItemXtype: 'App-View-Application-List-ItemGrid',
    gridItemHeight: 32,
    listItemXtype: 'App-View-Application-List-ItemList',
    listItemHeight: 51,
    detailItemXtype: 'App-View-Application-List-ItemDetail',
    detailItemHeight: 61,
    loadOnInit: false,
    autoPageSize: true,

    //Used to control what xtype the Add button on the NavBar launches
    addButtonXtype: 'App-View-Application-AddViewEdit',

    headerConfig: {
        header: true,
        padding: 6,
        docked: 'top',
        application: {
            hasAccess: 'Access',
            AppCode: 'App Code',
            AppName: 'App Name',
            Status: 'Status',
            Stats: 'Stats',
            Usage: 'Usage'
        }
    },

    dockedItems: [
        { xtype: 'App-View-Application-List-Toolbar', docked: 'top', autoAddTypeToggleButtons: true }
    ]
});