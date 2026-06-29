(function () {
    if (Ext.getVersion().major >= 6) {
        Ext.define('BIA.override.RowEditing', {
            override: 'Ext.grid.plugin.RowEditing',

            init: function (grid) {
                this.callParent([grid]);

                if (!grid.getMinHeight())
                    grid.setMinHeight(125);
            }
        });
    }
}());
