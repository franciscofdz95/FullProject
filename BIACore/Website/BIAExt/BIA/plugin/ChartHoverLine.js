if (Ext.getVersion().major >= 5) {
    /*
    Example:
    {
        ptype: 'hoverline',
        tooltipRenderers: {
            HIST_ADGR: function (record) {
                return 'HIST: ' + Ext.util.Format.number(record.get('HIST_ADGR'), '$0,000.00');
            },
            HIST_ADNR: function (record) {
                return 'HIST: ' + Ext.util.Format.number(record.get('HIST_ADNR'), '$0,000.00');
            }
        }
    }
    */
    /*
        Contributed by Preston Ough
    */
    Ext.define('BIA.plugin.ChartHoverLine', {
        extend: 'Ext.plugin.Abstract',
        alias: 'plugin.hoverline',

        init: function (chart) {
            var me = this;

            if (chart.getXTypes().indexOf('cartesian') == -1) {
                return;
            }

            var axes = chart.getAxes();
            for (i in axes) {
                if (axes[i].getAlignment() == 'horizontal') {
                    me.xAxis = axes[i];
                    break;
                }
            }

            if (me.xAxis == null) {
                return;
            }

            me.sprite = Ext.create('Ext.draw.sprite.Line', {
                strokeStyle: '#1F6D91',
                lineWidth: 2
            });

            me.tooltip = Ext.create({
                xtype: 'tooltip',
                trackMouse: true,
                style: 'background: #fff',
                showDelay: 0,
                dismissDelay: 0,
                hideDelay: 0
            });

            chart.addElementListener({
                mousemove: me.onMouseMove,
                mouseover: me.onMouseOver,
                mouseout: me.onMouseOut,
                priority: 1001,
                scope: me
            });
        },

        onMouseOver: function () {
            var me = this,
                chart = me.getCmp(),
                mainSurface = chart.getSurface('main'),
                insetPadding = chart.insetPadding;

            me.sprite.setAttributes({
                fromX: 50,
                fromY: 0,
                toX: 50,
                toY: chart.getHeight() - insetPadding.bottom
            });

            if (mainSurface.getItems().indexOf(me.sprite) == -1)
                mainSurface.add(me.sprite);

            chart.renderFrame();
        },

        onMouseOut: function () {
            var me = this,
                chart = me.getCmp(),
                mainSurface = chart.getSurface('main');

            mainSurface.remove(me.sprite);
            chart.renderFrame();
            me.hideTooltip();
        },

        onMouseMove: function (e) {
            var me = this,
                chart = me.getCmp(),
                store = chart.getStore(),
                series = chart.getSeries(),
                eventXY = e.getXY(),
                chartXY = chart.getEventXY(e),
                padding = chart.getInnerPadding(),
                axisSegmenter = me.xAxis.getSegmenter(),
                axisSprite = me.xAxis.getSprites()[0],
                axisMatrix = axisSprite.attr.matrix;

            var xx = axisMatrix.getXX();
            var dx = axisMatrix.getDX();
            var xValue = (chartXY[0] - dx - padding.left) / xx;
            if (me.xAxis.getLayout().isDiscrete === true) {
                xValue = axisSegmenter.from(Math.round(xValue));
                xValue = axisSprite.attr.data[xValue];
            } else {
                xValue = axisSegmenter.from(xValue);
            }

            if (me.tooltipRenderers) {
                var tooltipHtml = '';

                var records = store.query(me.xAxis.getFields()[0], xValue);
                records.each(function (record) {
                    series.forEach(function (series) {
                        var renderer = me.tooltipRenderers[series.getYField()];

                        if (renderer)
                            tooltipHtml += renderer(record) + '<br />';
                    });
                });

                if (tooltipHtml.length > 0) {
                    me.tooltip.setHtml(xValue + '<br />' + tooltipHtml);
                    me.showTooltip(eventXY);
                } else {
                    me.hideTooltip();
                }
            }

            me.sprite.setAttributes({
                fromX: chartXY[0],
                toX: chartXY[0]
            });
            chart.renderFrame();
        },

        showTooltip: function (xy) {
            var me = this,
                offset = 15,
                chart = me.getCmp(),
                chartBox = chart.getBox(),
                width = (me.tooltip.getEl() && me.tooltip.getWidth() > 0) ? me.tooltip.getWidth() : 100;

            if (xy[0] + offset + width < chartBox.x + chartBox.width)
                xy[0] += offset;
            else
                xy[0] -= offset + width;

            xy[1] += 2;

            me.tooltip.show(xy);
        },

        hideTooltip: function () {
            var me = this;
            me.tooltip.hide();
        }
    });
}