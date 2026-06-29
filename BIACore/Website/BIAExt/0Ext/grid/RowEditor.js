(function () {
    // fix a bug that gets fixed in 4.1.3
    var version = Ext.getVersion() || {};
    if (version.major === 4 && version.minor < 2) {
        Ext.override(Ext.grid.RowEditor, {
            onColumnShow: function (column) {
                if (!column.isGroupHeader) {
                    var field = column.getEditor();
                    field.setWidth(column.getWidth() - 2).show();
                    this.repositionIfVisible();
                }
            }
        });
    }
}());