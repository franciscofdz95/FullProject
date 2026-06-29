(function () {
    if (Ext.getVersion().major >= 5 && typeof Ext != 'undefined' && typeof Ext.layout != 'undefined' && typeof Ext.layout.Context != 'undefined') {
        Ext.override(Ext.layout.Context, {
            getItem: function (target, el) {
                var id = (el || (target || {})).id,
                    items = this.items,
                    item = items[id] || (items[id] = new Ext.layout.ContextItem({
                        context: this,
                        target: target,
                        el: el
                    }));
                return item;
            }
        });
    }
})();
    