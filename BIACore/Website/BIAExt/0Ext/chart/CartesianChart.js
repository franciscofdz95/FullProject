(function () {
    if (Ext.getVersion().major >= 5 && Ext.getTheme() === 'classic') {
        Ext.define('BIA.override.CartesianChart', {
            override: 'Ext.chart.CartesianChart',
            updateLegend: function (legend, oldLegend) {
                // Abstract Chart operations
                if (oldLegend) {
                    oldLegend.destroy();
                }
                if (legend) {
                    this.getItems();
                    this.legendStore = new Ext.data.Store({
                        autoDestroy: true,
                        fields: [
                            'id', 'name', 'mark', 'disabled', 'series', 'index'
                        ]
                    });
                    legend.setStore(this.legendStore);
                    this.refreshLegendStore();
                    this.legendStore.on('update', 'onUpdateLegendStore', this);
                }
                // Ext.chart.overrides.AbstractChart - Classic theme overrides
                if (legend) {
                    dock = legend.docked;
                    this.addDocked({
                        dock: dock,
                        border: legend.border || false,
                        xtype: 'panel',
                        shrinkWrap: true,
                        autoScroll: true,
                        layout: {
                            type: dock === 'top' || dock === 'bottom' ? 'hbox' : 'vbox',
                            pack: 'center'
                        },
                        items: legend,
                        cls: Ext.baseCSSPrefix + 'legend-panel'
                    });
                }
            }
        });
    }
}());
