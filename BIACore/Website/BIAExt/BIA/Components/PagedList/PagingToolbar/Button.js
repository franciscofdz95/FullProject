//#region PagingToolbarButton
Ext.define('BIA.components.PagedList.PagingToolbar.Button', {
    extend: (Ext.platformTags && Ext.platformTags.modern) ? 'Ext.Container' : 'Ext.container.Container',
    alias: 'widget.BIA-Components-PagedList-PagingToolbar-Button',
    componentCls: 'PagingToolbarButton',
    changePage: 0,
    overCls: 'Hover'
});
//#endregion