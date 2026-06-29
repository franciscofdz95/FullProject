(function () {
    if (Ext.getVersion().major >= 5 && typeof Ext != 'undefined' && typeof Ext.Component != 'undefined') {
        Ext.override(Ext.Component, {
            afterComponentLayout: function (width, height, oldWidth, oldHeight) {
                var me = this;                
                if (++me.componentLayoutCounter === 1) {
                    me.afterFirstLayout(width, height);
                }
                if (width !== oldWidth || height !== oldHeight) {
                    me.onResize(width, height, oldWidth, oldHeight);
                }
                if (me.floating && me.el != null) {
                    me.onAfterFloatLayout();
                }
            }
        });
    }
})();
