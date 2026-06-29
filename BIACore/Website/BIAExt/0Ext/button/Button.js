(function () {
    if (Ext.getVersion().major < 5) {
        Ext.override(Ext.button.Button, {
            getMenu: function () { return this.menu; }
        });
    }
}());