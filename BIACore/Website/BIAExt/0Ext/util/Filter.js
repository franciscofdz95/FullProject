(function () {
    if (Ext.getVersion().major < 5) {
        Ext.override(Ext.util.Filter, {
            getState: function () { return this; }
        });
    }
}());