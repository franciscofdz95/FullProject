(function () {
    if (Ext.getVersion().major < 5) {
        Ext.override(Ext.util.Sorter, {
            getState: function () { return this; }
        });
    }
}());