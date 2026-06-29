//#region PagedList
Ext.define('BIA.Components.PagedList', {
    extend: (Ext.platformTags && Ext.platformTags.modern) ? 'Ext.Panel' : 'Ext.panel.Panel',
    alias: 'widget.BIA-Components-PagedList',
    componentCls: 'BIA_Components_PagedList',
    xtype: 'pagedlist',
    extendedFrom: 'BIA-Components-PagedList',

    scrollable: true,
    width: '100%',
    height: '100%',

    columns: 1,
    pageSize: 20,
    currentPage: 1,
    loadingMessage: 'Loading',
    itemXtype: 'container',
    itemRecordAttribute: 'record',
    showPagingToolbar: true,
    pagingToolbarTotalRecordsPostfixString: 'Item',
    pagingToolbarNumberPageLinksShown: 10,
    syncListItemHeights: false,
    noRecordsMessage: 'No records exist.',
    remotePaging: false,
    deeplinkPaging: false,
    loadOnInit: true,

    changeCurrentPage: function changeCurrentPage(page) {
        this.currentPage = page;
        this.down('BIA-Components-PagedList-PagingToolbar').currentPage = page;
        this.store.currentPage = page;
    },

    defaults: { border: false },
    items: [],

    dockedItems: [
        { xtype: 'BIA-Components-PagedList-PagingToolbar', dock: 'bottom' }
    ],

    constructor: function (config) {
        this.callParent([config]);
    },
    initComponent: function () {
        var me = this;
        if (me.store) {
            me.store = Ext.StoreMgr.lookup(me.store) || Ext.create(me.store);
            me.store.setPageSize(me.pageSize);
        }

        if (me.componentCls.indexOf('BIA_Components_PagedList') == -1) {
            me.componentCls = me.componentCls + ' BIA_Components_PagedList';
        }

        if (!Ext.Array.findBy(me.dockedItems, function (item) { return Ext.isObject(item) && item.xtype == 'BIA-Components-PagedList-PagingToolbar'; })) {
            me.dockedItems = Ext.Array.union((me.dockedItems || []), [
            { xtype: 'BIA-Components-PagedList-PagingToolbar', dock: 'bottom' }
            ]);
        }

        /*switch (me.columns) {
            case 1:
                me.layout = {
                    type: 'vbox',
                    pack: 'fill',
                    align: 'start'
                };
                break;
            default:
                me.layout = 'column';
                //me.columnCount = me.columns;
        }*/
        me.layout = 'column';
        this.callParent(arguments);
    }
});
//#endregion