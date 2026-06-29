//#region PagingToolbar
Ext.define('BIA.components.PagedList.PagingToolbar', {
    extend: (Ext.platformTags && Ext.platformTags.modern) ? 'Ext.Container' : 'Ext.container.Container',
    alias: 'widget.BIA-Components-PagedList-PagingToolbar',
    layout: {
        type: 'hbox',
        pack: 'center',
        align: 'middle'
    },
    componentCls: 'BIAPagedListPagingToolbar',
    currentPage: 1,
    style: {
        fontSize: '20px',
        color: '#3366cc',
        fontWeight: 'bold'
    },

    defaults: {
        padding: 5
        //style: {
        //    cursor: 'pointer'
        //}
    },
    items: [
        { xtype: 'BIA-Components-PagedList-PagingToolbar-Refresh' },
        { xtype: 'tbfill', flex: 1 },
        { xtype: 'BIA-Components-PagedList-PagingToolbar-Button', itemId: 'FirstPage', cls: 'FirstPage', html: '<i class="fa fa-step-backward"></i>', hidden: true },
        { xtype: 'BIA-Components-PagedList-PagingToolbar-Button', itemId: 'PreviousPage', cls: 'PreviousPage', html: '<i class="fa fa-angle-left"></i>', hidden: true },
        { xtype: 'BIA-Components-PagedList-PagingToolbar-Button', itemId: 'PreviousPageGroup', cls: 'PreviousPageGroup', html: '...', hidden: true },
        {
            xtype: 'container',
            itemId: 'PageButtonContainer',
            cls: 'PageButtonContainer',
            layout: {
                type: 'hbox',
                pack: 'center',
                align: 'middle'
            },
            padding: '0 5',
            defaults: {
                padding: 5
            },
            currentPageCls: 'PageLinkCurrent',
            items: [
                //{ xtype: 'BIA-Components-PagedList-PagingToolbar-Button', itemId: 'PageLinkBack2', html: '', hidden: true },
                //{ xtype: 'BIA-Components-PagedList-PagingToolbar-Button', itemId: 'PageLinkBack1', html: '', hidden: true },
                //{ xtype: 'BIA-Components-PagedList-PagingToolbar-Button', cls: 'PagingToolbarButton PageLinkCurrent', itemId: 'PageLinkCurrent', html: 'Page 1' },
                //{ xtype: 'BIA-Components-PagedList-PagingToolbar-Button', itemId: 'PageLinkNext1', html: '', hidden: true },
                //{ xtype: 'BIA-Components-PagedList-PagingToolbar-Button', itemId: 'PageLinkNext2', html: '', hidden: true },
            ]
        },
        { xtype: 'BIA-Components-PagedList-PagingToolbar-Button', itemId: 'NextPageGroup', cls: 'NextPageGroup', html: '...', hidden: true },
        { xtype: 'BIA-Components-PagedList-PagingToolbar-Button', itemId: 'NextPage', cls: 'NextPage', html: '<i class="fa fa-angle-right"></i>', hidden: true },
        { xtype: 'BIA-Components-PagedList-PagingToolbar-Button', itemId: 'LastPage', cls: 'LastPage', html: '<i class="fa fa-step-forward"></i>', hidden: true },
        { xtype: 'tbfill', flex: 1 },
        { xtype: 'container', itemId: 'CurrentPageDisplay', cls: 'CurrentPageDisplay', html: '', style: { cursor: 'default' } },
    ]
});
//#endregion