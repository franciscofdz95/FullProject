if (typeof Ext != 'undefined' && Ext.getVersion().major >= 5 && typeof Ext.chart != 'undefined' && typeof Ext.chart.PolarChart != 'undefined') {
    Ext.define('BIA.Components.Chart.StatusPie', {
        extend: 'Ext.chart.PolarChart',
        alias: 'widget.BIA-Components-Chart-StatusPie',
        xtype: 'statuspie',
        cls: 'StatusPie',
        height: '100%',
        width: '100%',
        flex: 1,

        /***** Config for Dynamic field display *****/

        statusField: 'status',
        statusColors: {
            1: '#317400',
            '-1': '#F31A12'
        },
        statusConfig: {
            padding: 25,
            chartRadiusFactor: .9
        },

        //summaryConfig: 'value',
        summaryConfig: {
            fontSizeRatio: 50/130,
            field: 'value',
            sumData: true,
            //Any other config for Ext.draw.sprite.Text
            renderer: function (chart, records, field, value, config) {
                return '$' + Ext.Number.toFixed(value, 1).toString() + 'M';
            },
            tooltipRenderer: function (chart, records, field, value, config) {
                return 'Testing';
            }
        },


        //secondarySummaryConfig: ['rev', 'cost'],
        secondarySummaryFontSizeRatio: .75,
        secondarySummaryConfig: [
            {
                field: 'rev',
                sumData: true,
                renderer: function (chart, records, field, value, config) {
                    return '$' + Ext.Number.toFixed(value, 1).toString() + 'M';
                }
            },
            {
                field: 'cost',
                sumData: true,
                renderer: function (chart, records, field, value, config) {
                    return '$' + Ext.Number.toFixed(value, 1).toString() + 'M';
                }
            },
            {
                field: 'profit',
                sumData: true,
                renderer: function (chart, records, field, value, config) {
                    return '$' + Ext.Number.toFixed(value, 1).toString() + 'M';
                }
            }
        ],


        tooltipHoverFormat: {
            text: '~group~: ~value~%',
            replace: {
                group: '~group~',
                value: '~value~'
            }
        },

        /********************************************/
        legend: { docked: 'bottom', border: false },
        store: {
            type: 'json',
            fields: ['group', 'value', 'status', ],
            data: [
                { group: 'Amazon', value: 68.3, status: -1, rev: 5.2, cost: 2.2, profit: 3.0 },
                { group: 'Enterprise', value: 42.1, status: 1, rev: 2.1, cost: .8, profit: 1.3 },
                { group: 'SMB', value: 17.9, status: 1, rev: 1.8, cost: .2, profit: 1.6 }
            ]
        },
        animation: false,
        innerPadding: 10,
        seriesConfig: null,
        series: [{
            defalutPieSeries: true,
            colors: ['#60513A', '#908474', '#B0A696', '#825300', '#C98400', '#FFD124', '#AE957D', '#E1C8B0', '#EDDED0'],
            subStyle: {
                strokeStyle: ['white'],
                lineWidth: [0]
            },
            border: false,
            type: 'pie',
            angleField: 'value',
            donut: 20,
            label: {
                field: 'group',
                showText: false,
                renderer: function (text, sprite, config, rendererData, index) {
                    if (!rendererData.series.config.label.showText) config.text = '';
                },
                calloutLine: {
                    color: 'rgba(0,0,0,0)' // Transparent to hide callout line
                }
            },
            highlight: true,
            tooltip: {
                trackMouse: true,
                style: 'background: #fff',
                renderer: function (storeItem, item, ctx) {
                    if (Ext.getVersion().major <= 5) {
                        var formatConfig = item.series.getChart().tooltipHoverFormat || {};
                    } else {
                        var formatConfig = ctx.series.getChart().tooltipHoverFormat || {};
                    }
                    var formatString = formatConfig.text || '';
                    if (Ext.isObject(formatConfig.replace)) {
                        var fields = Ext.Object.getKeys(formatConfig.replace)
                        for (var i = 0; i < fields.length; i++) {
                            formatString = formatString.replace(new RegExp(formatConfig.replace[fields[i]]),
                                function () {
                                    if (Ext.getVersion().major <= 5) { return storeItem.get(fields[i]) } else { return item.get(fields[i]) }
                                });
                        }
                    }

                    if (Ext.getVersion().major <= 5) {
                        this.setHtml(formatString);
                    } else {
                        storeItem.setHtml(formatString);
                    }
                }
            }
        }],
        /*
        sprites: 
            [
                {
                    type: 'circle',
                    cx: x,
                    cy: y,
                    r: Math.floor(me.getRadius() - 60),
                    fillStyle: me.statusColors[me.store.getData().getAt(0).get(me.statusField).toString()]
                },
                {
                    type: 'text',
                    text: '128.3M',
                    textAlign: 'center',
                    fontSize: fontSize,
                    fontWeight: 'bold',
                    fillStyle: '#FFF',
                    fillStyle: '#FFF',
                    x: x,
                    y: y
                },
                {
                    type: 'text',
                    text: '$42.1M | $9.1M',
                    textAlign: 'center',
                    fontSize: Math.floor(fontSize * .5),
                    fillStyle: '#FFF',
                    x: x,
                    y: y + Math.floor(fontSize * .5) + 10
                }
            ]
        
        */
        isSummaryConfigValid: function isSummaryConfigValid() {
            return Ext.isObject(this.summaryConfig) && this.summaryConfig.field != null;
        },
        isSecondarySummaryConfigValid: function isSecondarySummaryConfigValid() {
            return Ext.isArray(this.secondarySummaryConfig) && this.secondarySummaryConfig.every(function (item) { return Ext.isObject(item) && item.field != null; });
        },

        initComponent: function initComponent() {
            var me = this;

            var defalutPieSeries = {
                defalutPieSeries: true,
                colors: ['#60513A', '#908474', '#B0A696', '#A6A6A3', '#D9D9D6', '#E1E1DE', '#AE957D', '#E1C8B0', '#E7D3C0'],
                subStyle: {
                    strokeStyle: ['white'],
                    lineWidth: [0]
                },
                border: false,
                type: 'pie',
                angleField: 'value',
                donut: 20,
                label: {
                    field: 'group',
                    showText: false,
                    renderer: function (text, sprite, config, rendererData, index) {
                        if (!rendererData.series.config.label.showText) config.text = '';
                    },
                    calloutLine: {
                        color: 'rgba(0,0,0,0)' // Transparent to hide callout line
                    }
                },
                highlight: true,
                tooltip: {
                    trackMouse: true,
                    style: 'background: #fff',
                    renderer: function (storeItem, item, ctx) {
                        if (Ext.getVersion().major <= 5) {
                            var formatConfig = item.series.getChart().tooltipHoverFormat || {};
                        } else {
                            var formatConfig = ctx.series.getChart().tooltipHoverFormat || {};
                        }
                        var formatString = formatConfig.text || '';
                        if (Ext.isObject(formatConfig.replace)) {
                            var fields = Ext.Object.getKeys(formatConfig.replace)
                            for (var i = 0; i < fields.length; i++) {
                                formatString = formatString.replace(new RegExp(formatConfig.replace[fields[i]]),
                                    function () {
                                        if (Ext.getVersion().major <= 5) { return storeItem.get(fields[i]) } else
                                        { return item.get(fields[i]) }
                                        });
                            }
                        }
                        if (Ext.getVersion().major <= 5) {
                            this.setHtml(formatString);
                        } else {
                            storeItem.setHtml(formatString);
                        }
                    }
                }
            };

            var seriesConfig = [];

            if (me.seriesConfig == null && (me.initialConfig.series == null || !Ext.isArray(me.initialConfig.series) || (Ext.isArray(me.initialConfig.series) && me.initialConfig.series.length == 0))) {
                seriesConfig = [Ext.apply(Ext.clone(defalutPieSeries), me.seriesConfig)];
            }
            else {
                if (me.seriesConfig != null || !me.initialConfig.series[0].defalutPieSeries) {
                    seriesConfig = Ext.clone(me.initialConfig.series) || [Ext.apply(Ext.clone(defalutPieSeries), me.seriesConfig)];
                    for (var i = 0; i < seriesConfig.length; i++) {
                        if (seriesConfig[i].type.toLowerCase() === 'pie') {
                            var pieSeries = Ext.apply(Ext.clone(defalutPieSeries), Ext.apply(seriesConfig[i], me.seriesConfig || {}));
                            pieSeries.subStyle = Ext.apply(Ext.clone(defalutPieSeries.subStyle), Ext.apply(seriesConfig[i].subStyle || {}, me.seriesConfig.subStyle || {}));
                            pieSeries.label = Ext.apply(Ext.clone(defalutPieSeries.label), Ext.apply(seriesConfig[i].label || {}, me.seriesConfig.label || {}));
                            if (!pieSeries.label.showText) pieSeries.label.renderer = function (text, sprite, config, rendererData, index) {
                                if (!rendererData.series.config.label.showText) config.text = '';
                            };
                            pieSeries.tooltip = Ext.apply(Ext.clone(defalutPieSeries.tooltip), Ext.apply(seriesConfig[i].tooltip || {}, me.seriesConfig.tooltip || {}));
                            pieSeries.defalutPieSeries = false;
                            seriesConfig[i] = Ext.clone(pieSeries);
                        }
                    }
                }
            }

            me.setConfig({
                //legend: Ext.apply({ docked: 'bottom', border: false }, (me.initialConfig.legend || {})),
                interactions: Ext.Array.union(me.initialConfig.interactions || [], ['rotate', 'itemhighlight']),
                cls: (me.initialConfig.cls != null ? me.initialConfig.cls + ' ' : '') + (me.hasCls('StatusPie') ? '' : 'StatusPie'),
                series: seriesConfig
            });

            var angleField = (Ext.Array.findBy(this.series, function (item) { return item.type.toLowerCase() == 'pie'; }) || { angleField: 'value' }).angleField;
            if (!Ext.isEmpty(me.summaryConfig) && (Ext.isString(me.summaryConfig) || Ext.isObject(me.summaryConfig))) {
                if (Ext.isString(me.summaryConfig)) me.summaryConfig = { field: me.summaryConfig };
                else {// if (Ext.isObject(me.summaryConfig)) {
                    if (me.summaryConfig.field == null) me.summaryConfig.field = angleField;
                }
            }
            else {
                me.summaryConfig = { field: angleField };
            }

            if (!me.summaryConfig.tooltipRenderer || !Ext.isFunction(me.summaryConfig.tooltipRenderer)) {
                me.summaryConfig.tooltipRenderer = function (chart, records, field, value, config) {
                    return 'Testing';
                };
            }

            if (me.summaryConfig.fontSizeRatio == null || !Ext.isNumeric(me.summaryConfig.fontSizeRatio)) {
                me.summaryConfig.fontSizeRatio = 50 / 130;
            }

            if (!Ext.isEmpty(me.secondarySummaryConfig) && Ext.isArray(me.secondarySummaryConfig)) {
                for (var i = 0; i < me.secondarySummaryConfig.length; i++) {
                    if (Ext.isString(me.secondarySummaryConfig[i])) me.secondarySummaryConfig[i] = { field: me.secondarySummaryConfig[i] };
                    else {
                        if (me.secondarySummaryConfig[i].field == null) me.secondarySummaryConfig[i].field = angleField;
                    }
                }
            }
            else {
                me.secondarySummaryConfig = [
                    {
                        field: 'rev',
                        renderer: function (chart, records, field, value, config) {
                            return '$' + value.toString() + 'M';
                        }
                    },
                    {
                        field: 'cost',
                        renderer: function (chart, records, field, value, config) {
                            return '$' + value.toString() + 'M';
                        }
                    }
                ];
            }

            if (me.secondarySummaryFontSizeRatio == null || !Ext.isNumeric(me.secondarySummaryFontSizeRatio)) {
                me.secondarySummaryFontSizeRatio = .75;
            }

            Ext.apply(me, {
                isSummaryConfigValid: function isSummaryConfigValid() {
                    return Ext.isObject(me.summaryConfig) && me.summaryConfig.field != null;
                },
                isSecondarySummaryConfigValid: function isSecondarySummaryConfigValid() {
                    return Ext.isArray(me.secondarySummaryConfig) && me.secondarySummaryConfig.every(function (item) { return Ext.isObject(item) && item.field != null; });
                }
            });

            this.callParent(arguments);
        }
    });
}