Ext.define('App.view.Browser.Graph', {
    extend: 'BIA.panel.Graph',
    alias: 'widget.App-Browser-Graph',

    store: {
        type: 'webapi',
        api: {
            read: 'api/AppLog/Browser'
        }
    },

    onDataChanged: function () {
        var me = this,
            chart = me.down('cartesian'),
            rec = me.getStore().first();

        if (rec) {
            var fields = [];
            Ext.each(rec.fields, function (field) {
                if (field.name !== 'Date' && field.name !== 'id' && field.name !== 'ROWNUMBER') {
                    fields.push(field.name);
                }
            });

            chart.setAxes([
                {
                    type: 'category', position: 'bottom', fields: ['Date'],
                    label: { rotate: { degrees: -90 } }
                },
                {
                    type: 'numeric', position: 'left', fields: fields,
                    renderer: BIA.util.Chart.number_0
                }
            ]);

            var series = [];
            Ext.each(fields, function (field) {
                series.push({
                    type: 'line',
                    xField: 'Date',
                    yField: field,
                    title: field,
                    style: { lineWidth: 3 },
                    marker: { radius: 3 },
                    highlight: true,
                    tooltip: {
                        trackMouse: true,
                        style: 'background: #fff',
                        renderer: function (storeItem) {
                            this.setHtml(field + ' ' + storeItem.get(field));
                        }
                    }
                });
            });

            chart.setSeries(series);
        }
    },

    chartConfig: {
        xtype: 'cartesian',
        border: false,
        legend: {
            docked: 'right',
            border: false,
            labelFont: '11px tahoma, arial, verdana, sans-serif'
        },
        axes: [],
        series: []
    }
});