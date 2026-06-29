(function () {
    // fix a bug that gets introduced in 4.2
    // if the autoSize function is called on a grid, check if the column has a fixed size before attempting to 'autoSize' it.
    var version = Ext.getVersion() || {};
    if (version.major === 4 && version.minor >= 2) {
        Ext.override(Ext.grid.column.Column, {
            autoSize: function () {
                var me = this;
                if (!me.fixedSize && me.el) {
                    me.callOverridden(arguments);
                }
            }
        });
    }
}());