Ext.define('BIA.controller.FusionCharts.AngularGauge', {
    extend: 'Ext.app.Controller',
    refs: [],
    init: function () {
        this.control({
            'BIA-Components-FusionCharts-AngularGauge': {
                afterrender: this.AngularGaugeAfterRender,
                resize: this.AngularGaugeResize,
                boxready: this.AngularGaugeResize,
                storeload: this.AngularGaugeStoreLoad,
                storedatachanged: this.AngularGaugeStoreLoad,
                storereload: this.AngularGaugeStoreLoad,
                reloadchartdata: this.AngularGaugeReloadChartData
            }
        });
    },
    AngularGaugeAfterRender: function AngularGaugeAfterRender(me) {
        if (me.store.isLoaded() && !me.store.isLoading() && me.store.data.length > 0) {
            this.AngularGaugeRenderChart(me);
        }
    },
    AngularGaugeStoreLoad: function AngularGaugeStoreLoad(me) {
        if (me.getChart() == null) this.AngularGaugeRenderChart(me);
        else me.reloadChartData();
    },
    AngularGaugeRenderChart: function AngularGaugeRenderChart(me) {
        var chart = me.createChart();
        if (chart !== null) {
            var chartDataSource = (me.getChartConfigObject() || {}).dataSource;
            if (chartDataSource && chartDataSource.dials && Ext.isArray(chartDataSource.dials.dial)) {
                var dials = chartDataSource.dials.dial;
                var records = Ext.Array.pluck(me.store.data.items, 'data')
                var minRange = 80, maxRange = 120;
                for (var i = 0; i < records.length && i < dials.length; i++) {
                    dials[i].value = records[i][me.dialValueField];
                    //if (dials[i].tooltext != null) dials[i].tooltext = dials[i].tooltext.replace(/\$value/g, records[i][me.dialValueField].toString());
                    if (dials[i].showValueText != null) dials[i].showValueText = dials[i].showValueText.replace(/\$value/g, records[i][me.dialValueField].toString());
                    if (records[i][me.dialValueField] < minRange) minRange = records[i][me.dialValueField];
                    if (records[i][me.dialValueField] > maxRange) maxRange = records[i][me.dialValueField];
                }

                var spread = 20;
                if (100 - minRange > 20) spread = (100 - minRange);
                if (maxRange - 100 > spread) spread = (maxRange - 100);

                if (spread != 20) {
                    spread = spread + (10 - (spread % 10))
                    chartDataSource.chart.majorTMNumber = ((spread * 2) / 10) - 1;
                }
                else {
                    chartDataSource.chart.majorTMNumber = 4;
                }

                chartDataSource.chart.lowerLimit = 100 - spread;
                chartDataSource.chart.upperLimit = 100 + spread;

                chart.setJSONData(chartDataSource);
                me.renderChart();
            }
        }
    },
    AngularGaugeReloadChartData: function AngularGaugeReloadChartData(me) {
        this.AngularGaugeRenderChart(me);
    },
    AngularGaugeGetRatioSize: function AngularGaugeGetRatioSize(me, width, height) {
        var ratio = .503;
        var size = {
            width: width,
            height: height,
            ratioHeight: Math.floor(width * ratio),
            ratioWidth: Math.floor(height / ratio)
        };

        size.chartHeight = height < size.ratioHeight ? height : size.ratioHeight;
        size.chartWidth = width < size.ratioWidth ? width : size.ratioWidth;

        return size;
    },
    AngularGaugeAlignVertical: function AngularGaugeAlignVertical(me, chart, ratioSize) {
        var el = me.getEl()
        if (el) {
            var chartDiv = el.down('#' + chart.id);
            if (chartDiv && Ext.isFunction(chartDiv.setStyle)) {
                var margin = ratioSize.height - ratioSize.chartHeight
                if (me.chartVerticalAlign == 'top') {
                    chartDiv.setStyle('margin-bottom', margin + 'px');
                }
                else if (me.chartVerticalAlign == 'middle') {
                    var marginValue = Math.round(margin / 2, 0) + 'px';
                    chartDiv.setStyle('margin-bottom', marginValue);
                    chartDiv.setStyle('margin-top', marginValue);
                }
                else { //me.chartVerticalAlign == 'bottom' OR null
                    chartDiv.setStyle('margin-top', margin + 'px');
                }
            }
        }
    },
    AngularGaugeAlignHorizontal: function AngularGaugeAlignHorizontal(me, chart, ratioSize) {
        var el = me.getEl()
        if (el) {
            var chartDiv = el.down('#' + chart.id);
            if (chartDiv && Ext.isFunction(chartDiv.setStyle)) {
                var margin = ratioSize.width - ratioSize.chartWidth;
                if (me.chartHorizontalAlign == 'right') {
                    chartDiv.setStyle('margin-left', margin + 'px');

                }
                else if (me.chartVerticalAlign == 'middle') {
                    var marginValue = Math.round(margin / 2, 0) + 'px';
                    chartDiv.setStyle('margin-left', marginValue);
                    chartDiv.setStyle('margin-right', marginValue);
                }
                else { //me.chartVerticalAlign == 'left' OR null
                    chartDiv.setStyle('margin-right', margin + 'px');

                }
            }
        }
    },
    AngularGaugeResize: function AngularGaugeResize(me, width, height, oldWidth, oldHeight, attempts) {
        attempts = attempts || 0;
        var chart = me.getChart();
        if (chart != null) {
            if (chart.__state && !chart.__state.rendering) {
                var ratioSize = this.AngularGaugeGetRatioSize(me, width, height);
                this.AngularGaugeAlignVertical(me, chart, ratioSize);
                this.AngularGaugeAlignHorizontal(me, chart, ratioSize);
                chart.resizeTo(ratioSize.chartWidth, ratioSize.chartHeight);
                chart.delayedResize = false;
                chart.delayedResizeAttempts = null;
            }
            else if (attempts < 200 && (!chart.delayedResize || (chart.delayedResize && attempts == (chart.delayedResizeAttempts || 0)))) {
                Ext.defer(this.AngularGaugeResize, 10, this, [me, width, height, oldWidth, oldHeight, ++attempts]);
                chart.delayedResize = true;
                chart.delayedResizeAttempts = attempts;
            }
        }
    }
});