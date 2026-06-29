Ext.define('App.View.User.AddEditView.Profile.AccessSummaryList.View', {
    extend: 'BIA.Components.PagedList',
    alias: 'widget.App-View-User-AddEditView-Profile-AccessSummaryList-View',

    cls: 'userAddeditviewProfileRolesummarylistView',

    columns: 0,
    pageSize: 20,
    itemXtype: 'App-View-User-AddEditView-Profile-AccessSummaryList-Display',
    itemRecordAttribute: 'user',
    showPagingToolbar: true,
    pagingToolbarTotalRecordsPostfixString: 'Access Role',
    syncListItemHeights: false,
    noRecordsMessage: 'No records exist.',
    //deeplinkPaging: true,
    remotePaging: true,
    loadOnInit: true,
    autoPageSize: false,
    getUserOnStoreLoad: true,

    store: {
        type: 'webapi',
        api: {
            read: 'api/BIASecurity/UserProfileRoleAccessSummary'
        }
    },

    dockedItems: [
        { xtype: 'container', height: 30, layout: 'hbox', defaults: { height: 10, dock: 'top', margin: '10 0 0', flex: 1, html: '&nbsp;' },
            items: [ { xtype: 'container', plugins: { ptype: 'borderfloatingtitle', position: 't', titleConfig: 'Roles (Access)' } } ]
        }
    ]
});