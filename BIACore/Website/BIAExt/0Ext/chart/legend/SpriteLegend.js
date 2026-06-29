(function () {
    if (Ext.getVersion().major >= 6) {
        Ext.define('BIA.override.SpriteLegend', {
            override: 'Ext.chart.legend.SpriteLegend',

            //When doing a component query Ext tries to call isXType on all children but
            //SpriteLegend does not extend from Component so it doesn't have that function
            isXType: Ext.emptyFn,
            getItemId: Ext.emptyFn
        });
    }
}());
