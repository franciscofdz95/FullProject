(function () {
    if (Ext.getVersion().major >= 5 && typeof Ext != 'undefined' && typeof Ext.util != 'undefined' && typeof Ext.util.Floating != 'undefined' && Ext.platformTags && Ext.platformTags.classic) {
        Ext.override(Ext.util.Floating, {
            onAfterFloatLayout: function () {
                var el = this.el;
                if (el && (el.shadow || el.shim)) {




                    el.setUnderlaysVisible(true);
                    el.syncUnderlays();
                }
            }
        });
    }
})();
