Ext.define('App.View.Component.Grid.PagedSort', {
    extend: 'BIA.grid.PagedPanel',
    alias: 'widget.App-View-Component-Grid-PagedSort',
    xtype: 'gridpagedsort',
    dockedItems: [
        //{ xtype: 'multisorttoolbar', dock: 'top' },
        {
            xtype: 'pagingtoolbar', dock: 'bottom', displayInfo: true
            //items: [
            //    { xtype: 'tbseparator' },
            //    { xtype: 'button', itemId: 'ExportButton', iconCls: 'icon icon-page_save', text: 'Queue Export' }
            //]
        }
    ]
});