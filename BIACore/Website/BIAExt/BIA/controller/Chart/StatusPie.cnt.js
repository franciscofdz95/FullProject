Ext.define('BIA.controller.Chart.StatusPie', {
    extend: 'Ext.app.Controller',
    refs: [],
    init: function init() {
        this.control({
            'BIA-Components-Chart-StatusPie': {
                beforerender: this.StatusPieBeforeRender,
                spritemousemove: this.StatusPieSpriteMouseMove,
                afterrender: this.StatusPieAfterRender/*,
                redraw: {
                    fn: this.StatusPieRedraw,
                    single: true,
                    scope: this
                }*/
            }
        });
    },
    StatusPieBeforeRender: function StatusPieBeforeRender(me) {
        me.addListener({
            redraw: {
                fn: this.StatusPieRedraw,
                scope: this
            }
        });
    },
    StatusPieSpriteMouseMove: function StatusPieSpriteMouseMove(sprite, event, eOpts) {

    },
    StatusPieAfterRender: function StatusPieAfterRender(me) {
        if (Ext.isObject(me.summaryConfig) && Ext.isFunction(me.summaryConfig.tooltipRenderer)) {
            var el = me.getEl();
            if (el) {
                el.addListener({
                    mousemove: {
                        fn: this.MouseOverSpriteForTooltip,
                        scope: this,
                        args: [me]
                    }
                });
            }
        }
    },
    MouseOverSpriteForTooltip: function MouseOverSpriteForTooltip(me, event, el, eOpts) {
        
    },
    GetPieSeries: function GetPieSeries(me){
        var series = me.getSeries();
        var pieSeries = null;
        for (var i = 0; i < series.length; i++) {
            if (series[i].type === 'pie') {
                pieSeries = series[i];
                break;
            }
        }
        return pieSeries;
    },
    GetCenterXY: function GetCenterXY(me) {
        return {
            x: me.getCenter()[0] + me.getInsetPadding().left,
            y: me.getCenter()[1] + me.getInsetPadding().top
        };
    },
    GetStatusRadius: function GetStatusRadius(me) {
        var chartRadius = me.getRadius();
        var radiusWithPadding = chartRadius - (me.statusConfig.padding * 2);
        var radiusWithFactor = chartRadius * (me.statusConfig.chartRadiusFactor == null ? .8 : me.statusConfig.chartRadiusFactor) - (chartRadius * .15);
        if (radiusWithPadding < radiusWithFactor) return radiusWithFactor;
        else return radiusWithPadding;
    },
    GetSummaryFontSize: function GetSummaryFontSize(me) {
        var fontSizeRatio = me.summaryConfig && me.summaryConfig.fontSizeRatio && Ext.isNumeric(me.summaryConfig.fontSizeRatio) ? me.summaryConfig.fontSizeRatio : 50 / 130;
        return Math.floor(this.GetStatusRadius(me) * fontSizeRatio);
    },
    GetSecondarySummaryFontSize: function GetSecondarySummaryFontSize(me, count) {
        return Math.floor(this.GetSummaryFontSize(me) * (me.secondarySummaryFontSizeRatio * (1 - (.11 * count<=1?0:count))));
    },
    GetSpriteText: function GetSpriteText(me, textSprite, config, store) {
        var records = Ext.Array.pluck(store.getData().items, 'data');
        var summaryValue = '';
        var text = summaryValue;

        if (config.sumData !== false) {
            var hiddenRecords = Ext.Array.findBy(me.series, function (item) { return item.type == 'pie'; }).getHidden();
            var summaryFieldValues = Ext.Array.pluck(records, config.field).filter(function (value, index) { return !hiddenRecords[index]; });
            if (summaryFieldValues.every(function (value) { return Ext.isNumeric(value); })) {
                summaryValue = Ext.Array.sum(summaryFieldValues);
            }
        }
        else if (records[0][config.field] == null) { return summaryValue; }
        else {
            summaryValue = records[0][config.field];
        }

        if (config.renderer && Ext.isFunction(config.renderer)) {
            text = config.renderer.call(textSprite, me, records, config.field, summaryValue, config);
        }
        else {
            text = summaryValue;
        }

        return text;
    },
    GetSecondarySummaryX: function GetSecondarySummaryX(me, center, count, index) {
        if (count == 1) return center.x;
        else {
            var radius = this.GetStatusRadius(me);
            var lengthPer = radius / count;
            var middleIndex = count % 2 != 0 ? Math.round(count / 2) * 1.0 : ((count + 1) * 1.0) / 2.0;
            var spriteIndex = index + 1;

            if (spriteIndex < middleIndex) {
                return center.x - ((middleIndex - spriteIndex) * lengthPer) - (lengthPer * .5);
            }
            else if (spriteIndex > middleIndex) {
                return center.x + ((spriteIndex - middleIndex) * lengthPer) + (lengthPer * .5);
            }
            else {
                return center.x;
            }
        }
    },
    BuildStatusSprite: function BuildStatusSprite(me) {
        var center = this.GetCenterXY(me);
        var statusColor = '#A6A6A3';
        if (me.store.getData().getAt(0).get(me.statusField) != null)
            statusColor = me.statusColors[me.store.getData().getAt(0).get(me.statusField).toString()];

        return {
            type: 'circle',
            cx: center.x,
            cy: center.y,
            r: this.GetStatusRadius(me),
            fillStyle: statusColor,
            //fillStyle: me.statusColors[me.store.getData().getAt(0) && me.store.getData().getAt(0).get(me.statusField) != null
            //    ? me.store.getData().getAt(0).get(me.statusField).toString()
            //    : Ext.Object.getKeys(me.statusColors)[0]],
            statusConfig: me.statusConfig
        };
    },
    BuildSummarySprite: function BuildSummarySprite(me) {
        var center = this.GetCenterXY(me);

        var summarySprite = Ext.apply({
            textAlign: 'center',
            fontWeight: 'bold',
            fillStyle: '#FFF'
        },
        me.summaryConfig);

        summarySprite = Ext.apply(summarySprite, {
            type: 'text',
            fontSize: this.GetSummaryFontSize(me),
            x: center.x,
            y: center.y,
            tooltipRenderer: me.summaryConfig.tooltipRenderer,
            summaryConfig: me.summaryConfig
        });

        summarySprite = Ext.apply(summarySprite, {
            text: this.GetSpriteText(me, summarySprite, me.summaryConfig, me.store)
        });

        return summarySprite;
    },
    BuildSecondarySummarySprites: function BuildSecondarySummarySprites(me, sprites) {
        var center = this.GetCenterXY(me);

        var ssc = me.secondarySummaryConfig;
        for (i = 0; i < ssc.length; i++) {
            var sprite = Ext.apply({
                fillStyle: '#FFF'
            }, ssc[i]);

            var fontSize = this.GetSecondarySummaryFontSize(me, ssc.length);

            sprite = Ext.apply(sprite, {
                type: 'text',
                textAlign: 'center',
                fontSize: fontSize,
                x: this.GetSecondarySummaryX(me, center, ssc.length, i),
                y: center.y + fontSize + 10,
                summaryConfig: ssc[i]
            });

            sprite = Ext.apply(sprite, {
                text: this.GetSpriteText(me, sprite, ssc[i], me.store)
            });

            sprites.push(Ext.clone(sprite));
            sprite = {};
        }
    },
    StatusPieRedraw: function StatusPieRedraw(me) {
        //if (Ext.isEmpty(me.events.redraw) || !Ext.Array.findBy(me.events.redraw.listeners, function (l) { return l.fn === this.StatusPieRedraw; }, this)) {
        //    me.addListener({
        //        redraw: { fn: this.StatusPieRedraw, scope: this }
        //    });
        //}

        if (!me.reapplySprites && me.isSummaryConfigValid() && me.isSecondarySummaryConfigValid()) {

            var sprites = [
                this.BuildStatusSprite(me),
                this.BuildSummarySprite(me)
            ];

            this.BuildSecondarySummarySprites(me, sprites);

            me.setSprites(sprites);

            var pieSeries = this.GetPieSeries(me);
            if (pieSeries && pieSeries.setDonut && Ext.isFunction(pieSeries.setDonut) && pieSeries.getHighlight && !(pieSeries.getHighlight() || {}).margin)
                pieSeries.setDonut(((sprites[0].r / me.getRadius()) * 100) * .95);

            me.reapplySprites = true;
            me.redraw();
        }
        else me.reapplySprites = false;
    },
    ShowSummaryTooltip: function ShowSummaryTooltip(sprite, event, eOpts) {

    },
    HideSummaryTooltip: function HideSummaryTooltip(sprite, event, eOpts) {

    }
});