Ext.define('BIA.Components.PagedList.PagingToolbar.GoToPage', {
    extend: (Ext.platformTags && Ext.platformTags.modern) ? 'Ext.Container' : 'Ext.container.Container',
    alias: 'widget.BIA-Components-PagedList-PagingToolbar-GoToPage',
    cls: 'PagedListGoToPage',
    layout: {
        type: 'hbox',
        align: 'stretch',
        pack: 'start'
    },
    items: [
        {
            xtype: 'textbox',
            itemId: 'GoToPageEntry',
            cls: 'PagedListGoToPageEntry',
            emptyText: 'Go To Page'
        },
        {
            xtype: 'button',
            itemId: 'GoToPageGoButton',
            cls: 'PagedListGoToPage'
        }
    ]
});