Ext.define('App.controller.Browser.Grid', {
    extend: 'Ext.app.Controller',
    init: function () {
        var me = this;
        me.control({
            '[xtype="App-Browser-Grid"]': {
                resize: me.PageSize
            }
        });
    },
    PageSize: function (grid) {
        var view = grid.getView(),
            store = grid.getStore(),
            height = grid.body.getHeight(),
            row = view.getNode(0) ? Ext.get(view.getNode(0)).getHeight() : 21,
            pageSize = Math.floor(height / row),
            current = store.getPageSize();

        if (current !== pageSize) {
            // recalculate current page
            var first = (store.currentPage - 1) * current + 1;
            store.setPageSize(pageSize);
            // reload.
            store.loadPage(Math.floor(first / pageSize) + 1);
        }
    }
});