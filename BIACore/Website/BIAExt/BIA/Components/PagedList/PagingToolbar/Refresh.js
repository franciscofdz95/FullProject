Ext.define('BIA.components.PagedList.PagingToolbar.Refresh', {
    extend: (Ext.platformTags && Ext.platformTags.modern) ? 'Ext.Container' : 'Ext.container.Container',
    alias: 'widget.BIA-Components-PagedList-PagingToolbar-Refresh',
    html: '<i class="fa fa-refresh" ></i>',
    cls: 'PagedListRefresh',
    itemId: 'PagedListRefresh'
});