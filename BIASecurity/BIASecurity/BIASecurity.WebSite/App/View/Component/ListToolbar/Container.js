Ext.define('App.View.Component.ListToolbar.Container', {
    extend: 'Ext.toolbar.Toolbar',
    alias: 'widget.App-View-Component-ListToolbar-Container',
    docked: top,
    componentCls: 'componentListToolbarContainer',
    padding: 10,
    hideGridView: false,
    hideListView: false,
    hideDetailView: false,
    initComponent: function ComponentListToolbarContainerInitComponent() {
        if (!Ext.isArray(this.items)) this.items = new Array();

        if (this.filter) {
            if (Ext.isEmpty(Ext.Array.findBy(this.items, function (i) { return i.itemId == 'filterContainer'; }))) {
                this.items.splice(this.items.length, 0,
                    { xtype: 'tbfill' },
                    { xtype: 'label', text: 'Filters:' }
                );
                this.items.push({
                    xtype: 'container',
                    itemId: 'filterContainer',
                    items: this.filter
                });
            }
        }

        if (this.autoAddTypeToggleButtons === true) {
            if (Ext.isEmpty(Ext.Array.findBy(this.items, function (i) { return i.xtype == 'App-View-Component-List-TypeToggleButtons'; }))) {
                this.items.splice(this.items.length, 0,
                    { xtype: 'tbfill', flex: 1 },
                    {
                        xtype: 'App-View-Component-List-TypeToggleButtons',
                        hideGridView: this.hideGridView,
                        hideListView: this.hideListView,
                        hideDetailView: this.hideDetailView
                    }
                );
            }
        }

        this.callParent(arguments);
    }
});