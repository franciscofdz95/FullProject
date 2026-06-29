Ext.define('App.View.Access.List.View', {
    extend: 'BIA.Components.PagedList',
    alias: 'widget.App-View-Access-List-View',

    cls: 'accessListView',

    store: {
        type: 'webapi',
        api: {
            read: 'api/BIASecurity/GetAccessList'
        }
    },

    columns: 1,
    pageSize: 15,
    loadingMessage: 'Loading',
    itemXtype: 'App-View-Access-List-ItemList',
    itemRecordAttribute: 'access',
    showPagingToolbar: true,
    pagingToolbarTotalRecordsPostfixString: 'Access',
    syncListItemHeights: false,
    noRecordsMessage: 'No records exist.',
    deeplinkPaging: true,
    remotePaging: true,
    loadOnInit: false,
    autoPageSize: true,

    listItemXtype: 'App-View-Access-List-ItemList',
    listItemHeight: 22,
    //detailItemXtype: 'App-View-Access-List-ItemDetail',
    //detailItemHeight: 22,

    headerConfig: {
        header: true,
        padding: 4,
        docked: 'top',
        access: {
            UserId: 'User ID',                  // Matthew Erdmann (adm1mme) [email/skype]
            UserName: 'Request User',           // Matthew Erdmann (adm1mme) [email/skype]
            AppCode: 'App Code',                // BIASecurity/AskMilton/etc.
            AppName: 'App Name',                // BIASecurity/AskMilton/etc.
            BusinessUnit: 'Bus. Unit',          // 01 - Small Package / 05 - SCS / etc.
            GeoGroupCode: 'Geo Group',          // All/Both/Dom/Int/etc.
            GeoCode: 'Geo',                     // CO/RR/DD/CR/etc.
            GeoId: 'Geo ID',                    // 02/03/45/etc.
            GeoName: 'Geo Name',                // Asia Pacific
            AccessLevel: 'Access Level',        // User/Admin/SA
            Access: 'Access',                   // Yes (#) or Blank
            UpdatedBy: 'Updated By',            // Blank if no access
            StatusDate: 'Status Date',          // Blank if no access
            AccessId: 'Access Id',
            ExtendedAttribPath: 'ExtendedAttribPath'
        }
    },

    dockedItems: [
        { xtype: 'App-View-Access-List-Toolbar', docked: 'top', autoAddTypeToggleButtons: true },
        
    ]
});