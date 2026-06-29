(function () {
    if (Ext.getVersion().major >= 5 && Ext && Ext.chart && Ext.chart.CartesianChart) {
        Ext.define('BIA.header.tool.PerformanceTracker.SparklineStore', {
            extend: 'Ext.data.Store',
            alias: 'store.PerformanceTrackerSparklineStore',
            fields: ['Interval', 'Hits']
        });

        Ext.define('BIA.header.tool.PerformanceTracker.Sparkline', {
            extend: 'Ext.chart.CartesianChart',
            downloadServerUrl: '',
            alias: 'widget.BIA-Header-Tool-PerformanceTracker-Sparkline',
            xtype: 'BIAPerformanceTrackerSparkline',
            cls: 'BIAPerformanceTrackerSparkline',
            store: {
                type: 'PerformanceTrackerSparklineStore'
            },
            width: '100%',
            height: '100%',
            insetPadding: { top: 3, left: 3, right: 3, bottom: 3 },
            axes: [
                {
                    type: 'numeric',
                    position: 'left',
                    title: null,
                    grid: false,
                    hidden: true, 
                    fields: 'Hits',
                    minimum: 0,
                    increment: 1
                },
                {
                    type: 'numeric',
                    position: 'bottom',
                    title: null,
                    grid: false,
                    hidden: true,
                    fields: 'Interval',
                    minimum: 0,
                    maximum: 60,
                    increment: 1
                }
            ],
            series: [
                {
                    type: 'line',
                    axis: 'left',
                    xField: 'Interval',
                    yField: 'Hits',
                    smooth: false,
                    showMarkers: false,
                    style: {
                        lineWidth: 2,
                        strokeStyle: '#0D8E79',
                        fillStyle: '#0D8E79',
                        fillOpacity: 0.4
                    },
                    tooltip: {
                        trackMouse: true,
                        style: 'background: #fff',
                        showDelay: 0,
                        dismissDelay: 0,
                        hideDelay: 0,
                        defaultAlign: 'b-t?',
                        renderer: function (storeItem, item) {
                            if (Ext.getVersion().major <= 5) this.setHtml(storeItem.get ? storeItem.get('Hits') : '0' + ' Hits');
                            else storeItem.setHtml(item.get('Hits') !== '' ? item.get('Hits') : '0' + ' Hits');
                        }
                    }
                }
            ]
        });
    }
}());