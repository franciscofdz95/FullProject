Ext.define('BIA.Components.FusionCharts.AngularGauge', {
    extend: (Ext.platformTags && Ext.platformTags.modern) ? 'Ext.Container' : 'Ext.container.Container',
    alias: 'widget.BIA-Components-FusionCharts-AngularGauge',
    xtype: 'fusionchartsangulargauge',

    store: {
        fields: ['value'],
        data: [{ value: 105 }]
    },

    height: '100%',
    width: '100%',

    dialValueField: 'value',
    includeDefaultColorRange: true,
    includeDefalutTrendpoint: false,
    includeDefalutTrendarc: false,
    chartVerticalAlign: 'bottom',
    chartHorizontalAlign: 'middle',

    chart: {},
    colorRange: [],
    dials: [],
    trendPoints: [],
    annotations: {},
    /*
    chartConfig: {
        **** FusionCharts Config properties *****
            type: 'angulargauge'
            renderAt: thisContainer.getId()
            dataformat: 'json'
            dataSource: {
            
                height: #,
                width: #
                
                chart: {},
                colorRange: {},
                dials: {},
                trendPoints: {},
                annotations: {},
                events
            }
    }
    
    */
    /*
    resizeTo: function(width,height)
    */
    initComponent: function () {
        var me = this;

        //Set default Chart config
        var chartConfig = {
            caption: '',
            supcaption: '',
            lowerLimit: '80',
            upperLimit: '120',
            bgColor: '#FFFFFF',
            gaugeFillMix: '{dark-30},{light-60},{dark-10}',
            gaugeFillRatio: '8',
            theme: 'fint',
            showGaugeBorder: '0',//0=hide, 1=show
            borderColor: '#FFF',
            borderAlpha: '100', //0=transparent, 100=opaque
            gaugeBorderColor: '#fff',//# color, {dark-x} for version of section color
            gaugeBorderThikness: '0',
            gaugeBorderAlpha: '100',//0=transparent, 100=opaque
            gaugeOuterRadius: '180',
            gaugeInnerRadius: '120',
            pivotRadius: '5',
            pivotBorderColor: '#fff',
            pivotBorderAlpha: '100',//0=transparent, 100=opaque
            pivotFillColor: '#fff',
            pivotFillAlpha: '100',//0=transparent, 100=opaque
            pivotFillMix: '',//{dark-50},{light-30},{dark-40}
            pivotFillRatio: '#fff',
            pivotFillType: 'linear', //linear,radial
            showValue: '1',
            showTickMarks: '1',
            showTickValue: '1',
            placeTicksInside: '0',
            placeValuesInside: '0',
            majorTMNumber: '4',
            majorTMColor: '#000',
            majorTMAlpha: '100',
            majorTMHeight: '10',
            majorTMThickness: '3',
            minorTMNumber: '9',
            minorTMColor: '#000',
            minorTMAlpha: '100',
            minorTMHeight: '5',
            minorTMThickness: '1',
            tickValueStep: '1',
            tickValueDecimals: '0',
            forceTickValueDecimals: '0',
            tickValueDistance: '5',
            manageValueOverLapping: '1',
            autoAlignTickValues: '1',
            gaugeStartAngle: '-180',
            gaugeEndAngle: '-360',
            origH: '200',
            origW: '500',
            autoscale: '1',
            valueBelowPivot: '1'
        };
        me.chart = Ext.apply(Ext.clone(chartConfig), me.chart || {});

        me.getDefaultChartConfig = function getDefaultChartConfig() {
            return Ext.clone(chartConfig);
        };

        //Set default Color config
        //colorRange: { color: [] }
        //me.colorRange = []
        var colorRangeConfig = {
            minValue: '80',
            maxValue: '120',
            code: '#E1E1DE'
        };

        if (Ext.isObject(me.colorRange)) me.colorRange = [Ext.clone(me.colorRange)];
        else if (me.colorRange == null && !Ext.isArray(me.colorRange)) me.colorRange = new Array();

        if (!Ext.isEmpty(me.colorRange)) {
            for (var i = 0; i < me.colorRange.length; i++) me.colorRange[i] = Ext.apply(Ext.clone(Ext.apply(colorRangeConfig, { id: 'colorRange' + i.toString() })), me.colorRange[i]);
        }
        else if (me.includeDefaultColorRange) {
            me.colorRange = [Ext.apply(Ext.clone(colorRangeConfig), { code: '#F31A12', maxValue: '100' }), Ext.apply(Ext.clone(colorRangeConfig), { code: '#64A70B', minValue: '100' })]
        }
        else { me.colorRange = new Array(); }

        me.getDefaultDialConfig = function getDefaultDialConfig() {
            return Ext.clone(colorRangeConfig);
        };

        //Set default Dial config
        //dials: { dial: []}
        var dialConfig = {
            bgColor: '#000',
            borderColor: '#000', //Comma-seperated list for left-to-right gradient
            borderThickness: '0',
            borderAlpha: '100',
            radius: '160',
            rearExtension: '5',
            baseWidth: '15',
            topWith: '0',
            showHoverEffect: '0',
            bgHoverColor: "",
            bgHoverAlpha: "0",
            borderHoverColor: "",
            borderHoverAlpha: "0",
            borderHoverThickness: "0",
            //tooltext: '$value',
            //showValueText: '$value',
            //showValue: '0',
            //valueX: '0',
            //valueY: '0',
            //valueFont: '',
            //valueFontColor: '',
            valueFontSize: '12',
            valueFontBold: '1',
            //valueFontItalic: '0',
            //valueBgColor: '',
            //valueBorderColor: '',
            //valueAlpha: '0',
            //valueFontAlpha: '0',
            //valueBgAlpha: '0',
            //valueBorderAlpha: '0',
            //valueBorderThickness: '0',
            //valueBorderRadius: '0',
            //valueBorderDashed: '0',
            //valueBorderDashGap: '0',
            //valueBorderDashLen: '0',
            id: 'dial1'
        };

        if (!Ext.isEmpty(me.dials)) {
            for (var i = 0; i < me.dials.length; i++) me.dials[i] = Ext.apply(Ext.clone(Ext.apply(dialConfig, { id: 'dial' + i.toString() })), me.dials[i]);
        }
        else {
            me.dials = [Ext.clone(dialConfig)]
        }

        me.getDefaultDialConfig = function getDefaultDialConfig() {
            return Ext.clone(dialConfig);
        };

        //Set default Trendpoint config
        //trendPoints: { points: [] }
        var trendpointConfig = {
            startValue: '0',
            endValue: '10',
            displayValue: '0',
            valueInside: '0',
            color: '#000',
            thickness: '2',
            radius: '180',
            innerRadius: me.chart.gaugeInnerRadius,
            alpha: '100',
            dashed: '0',
            dashLen: '0',
            dashGap: '0',
            trendValueDistance: '10',
            useMarker: '1',
            markerColor: '#000',
            markerBorderColor: '#000',
            markerRadius: '10',
            markerTooltext: '$value'
        };

        if (Ext.isObject(me.trendpoints)) me.trendpoints = [Ext.clone(me.trendpoints)];
        else if (me.trendpoints == null && !Ext.isArray(me.trendpoints)) me.trendpoints = new Array();

        if (!Ext.isEmpty(me.trendpoints)) {
            for (var i = 0; i < me.trendpoints.length; i++) {
                if (me.trendpoints[i].endValue === undefined) me.trendpoints[i] = Ext.apply(Ext.clone(Ext.apply(trendpointConfig, { id: 'trendpoint' + i.toString() })), me.trendpoints[i]);
            }
        }
        else if (me.includeDefalutTrendpoint) {
            me.trendpoints = [Ext.clone(trendpointConfig)]
        }

        me.getDefaultDialConfig = function getDefaultDialConfig() {
            return Ext.clone(trendpointConfig);
        };

        //Set default Trendarc config
        //trendPoints: { points: [] }
        var trendarcConfig = {
            startValue: '0',
            displayValue: '0',
            valueInside: '0',
            color: '#000',
            thickness: '2',
            radius: '180',
            innerRadius: '0',
            alpha: '60',
            dashed: '0',
            dashLen: '0',
            dashGap: '0',
            trendValueDistance: '10',
            useMarker: '1',
            markerColor: '#000',
            markerBorderColor: '#000',
            markerRadius: '10',
            markerTooltext: '$value',
            showBorder: '0',
            borderColor: '#000'
        };

        if (!Ext.isEmpty(me.trendpoints)) {
            for (var i = 0; i < me.trendpoints.length; i++) {
                if (me.trendpoints[i].endValue !== undefined) me.trendarcs[i] = Ext.apply(Ext.clone(Ext.apply(trendarcConfig, { id: 'trendarc' + i.toString() })), me.trendarcs[i]);
            }
        }
        else if (me.includeDefalutTrendarc) {
            if (me.trendpoints.length > 0) {
                me.trendpoints[me.trendPoints.length] = Ext.clone(trendarcConfig)
            }
            else me.trendpoints = [Ext.clone(trendarcConfig)]
        }

        me.getDefaultDialConfig = function getDefaultDialConfig() {
            return Ext.clone(trendarcConfig);
        };

        var chart = null;

        //Set defalut Events config
        //events: { }
        var eventsConfig = {
            beforeInitialize: function beforeInitialize(eventObj, dataObj) {
                return me.fireEvent('chartbeforeinitialize', me, eventObj, dataObj);
            },
            initialize: function initialize(eventObj, dataObj) {
                return me.fireEvent('chartinitialize', me, eventObj, dataObj);
            },
            dataUpdated: function dataUpdated(eventObj, dataObj) {
                return me.fireEvent('chartdataupdated', me, chart, eventObj, dataObj);
            },
            beforeDataUpdate: function beforeDataUpdate(eventObj, dataObj) {
                return me.fireEvent('chartbeforedataupdate', me, chart, eventObj, dataObj);
            },
            chartCleared: function chartCleared(eventObj, dataObj) {
                return me.fireEvent('chartcleared', me, chart, eventObj, dataObj);
            },
            entityRollOut: function entityRollOut(eventObj, dataObj) {
                return me.fireEvent('chartentityrollout', me, chart, eventObj, dataObj);
            },
            entityRollOver: function entityRollOver(eventObj, dataObj) {
                return me.fireEvent('chartentityrollover', me, chart, eventObj, dataObj);
            },
            entityClick: function entityClick(eventObj, dataObj) {
                return me.fireEvent('chartentityclick', me, chart, eventObj, dataObj);
            },
            markerRollOver: function markerRollOver(eventObj, dataObj) {
                return me.fireEvent('chartmarkerrollover', me, chart, eventObj, dataObj);
            },
            markerRollOut: function markerRollOut(eventObj, dataObj) {
                return me.fireEvent('chartmarkerrollout', me, chart, eventObj, dataObj);
            },
            markerClick: function markerClick(eventObj, dataObj) {
                return me.fireEvent('chartmarkerclick', me, chart, eventObj, dataObj);
            },
            chartClick: function chartClick(eventObj, dataObj) {
                return me.fireEvent('chartClick', me, chart, eventObj, dataObj);
            },
            chartMouseMove: function chartMouseMove(eventObj, dataObj) {
                return me.fireEvent('chartMouseMove', me, chart, eventObj, dataObj);
            },
            chartRollOver: function chartRollOver(eventObj, dataObj) {
                return me.fireEvent('chartRollOver', me, chart, eventObj, dataObj);
            },
            chartRollOut: function chartRollOut(eventObj, dataObj) {
                return me.fireEvent('chartrollout', me, chart, eventObj, dataObj);
            },
            backgroundLoaded: function backgroundLoaded(eventObj, dataObj) {
                return me.fireEvent('chartbackgroundloaded', me, chart, eventObj, dataObj);
            },
            backgroundLoadError: function backgroundLoadError(eventObj, dataObj) {
                return me.fireEvent('chartbackgroundloaderror', me, chart, eventObj, dataObj);
            },
            legendItemClicked: function legendItemClicked(eventObj, dataObj) {
                return me.fireEvent('chartlegenditemclicked', me, chart, eventObj, dataObj);
            },
            legendItemRollover: function legendItemRollover(eventObj, dataObj) {
                return me.fireEvent('chartlegenditemrollover', me, chart, eventObj, dataObj);
            },
            legendItemRollout: function legendItemRollout(eventObj, dataObj) {
                return me.fireEvent('chartlegenditemrollout', me, chart, eventObj, dataObj);
            },
            logoRollover: function logoRollover(eventObj, dataObj) {
                return me.fireEvent('chartlogorollover', me, chart, eventObj, dataObj);
            },
            logoRollout: function logoRollout(eventObj, dataObj) {
                return me.fireEvent('chartlogorollout', me, chart, eventObj, dataObj);
            },
            logoClick: function logoClick(eventObj, dataObj) {
                return me.fireEvent('chartlogoclick', me, chart, eventObj, dataObj);
            },
            logoLoaded: function logoLoaded(eventObj, dataObj) {
                return me.fireEvent('chartlogoloaded', me, chart, eventObj, dataObj);
            },
            logoLoadError: function logoLoadError(eventObj, dataObj) {
                return me.fireEvent('chartlogoloaderror', me, chart, eventObj, dataObj);
            },
            beforeExport: function beforeExport(eventObj, dataObj) {
                return me.fireEvent('chartbeforeexport', me, chart, eventObj, dataObj);
            },
            exported: function exported(eventObj, dataObj) {
                return me.fireEvent('chartexported', me, chart, eventObj, dataObj);
            },
            exportCancelled: function exportCancelled(eventObj, dataObj) {
                return me.fireEvent('chartexportcancelled', me, chart, eventObj, dataObj);
            },
            beforePrint: function beforePrint(eventObj, dataObj) {
                return me.fireEvent('chartbeforeprint', me, chart, eventObj, dataObj);
            },
            printComplete: function printComplete(eventObj, dataObj) {
                return me.fireEvent('chartprintcomplete', me, chart, eventObj, dataObj);
            },
            printCancelled: function printCancelled(eventObj, dataObj) {
                return me.fireEvent('chartprintcancelled', me, chart, eventObj, dataObj);
            },
            loaded: function loaded(eventObj, dataObj) {
                return me.fireEvent('chartloaded', me, chart, eventObj, dataObj);
            },
            rendered: function rendered(eventObj, dataObj) {
                return me.fireEvent('chartrendered', me, chart, eventObj, dataObj);
            },
            drawComplete: function drawComplete(eventObj, dataObj) {
                return me.fireEvent('chartdrawcomplete', me, chart, eventObj, dataObj);
            },
            renderComplete: function renderComplete(eventObj, dataObj) {
                return me.fireEvent('chartrendercomplete', me, chart, eventObj, dataObj);
            },
            dataInvalid: function dataInvalid(eventObj, dataObj) {
                return me.fireEvent('chartdatainvalid', me, chart, eventObj, dataObj);
            },
            dataLoaded: function dataLoaded(eventObj, dataObj) {
                return me.fireEvent('chartdataloaded', me, chart, eventObj, dataObj);
            },
            noDataToDisplay: function noDataToDisplay(eventObj, dataObj) {
                return me.fireEvent('chartnodatatodisplay', me, chart, eventObj, dataObj);
            },
            linkClicked: function linkClicked(eventObj, dataObj) {
                return me.fireEvent('chartlinkclicked', me, chart, eventObj, dataObj);
            },
            beforeRender: function beforeRender(eventObj, dataObj) {
                return me.fireEvent('chartbeforerender', me, chart, eventObj, dataObj);
            },
            renderCancelled: function renderCancelled(eventObj, dataObj) {
                return me.fireEvent('chartrendercancelled', me, chart, eventObj, dataObj);
            },
            beforeResize: function beforeResize(eventObj, dataObj) {
                return me.fireEvent('chartbeforeresize', me, chart, eventObj, dataObj);
            },
            resized: function resized(eventObj, dataObj) {
                return me.fireEvent('chartresized', me, chart, eventObj, dataObj);
            },
            resizeCancelled: function resizeCancelled(eventObj, dataObj) {
                return me.fireEvent('chartresizeCancelled', me, chart, eventObj, dataObj);
            },
            beforeDispose: function beforeDispose(eventObj, dataObj) {
                return me.fireEvent('chartbeforedispose', me, chart, eventObj, dataObj);
            },
            disposed: function disposed(eventObj, dataObj) {
                return me.fireEvent('chartdisposed', me, chart, eventObj, dataObj);
            },
            disposeCancelled: function disposeCancelled(eventObj, dataObj) {
                return me.fireEvent('chartdisposecancelled', me, chart, eventObj, dataObj);
            }
        };

        me.getDefaultEventsConfig = function getDefaultEventsConfig() {
            return Ext.clone(eventsConfig);
        }

        var getInitialHeight = function getInitialHeight() {
            if (me && me.rendered && Ext.isFunction(me.getHeight) && me.getHeight() > 1 && me.getHeight <= window.innerHeight) return me.getHeight();
            else return 101;
        };

        var getInitialWidth = function getInitialWidth() {
            if (me && me.rendered && Ext.isFunction(me.getWidth) && me.getWidth() > 1 && me.getWidth() <= window.innerWidth) return me.getWidth();
            else return 200;
        }

        me.getChartConfigObject = function getChartConfigObject() {
            return {
                type: 'angulargauge',
                renderAt: me.getDOMIdOfChartContainer(),
                dataformat: 'json',
                height: getInitialHeight().toString(),
                width: getInitialWidth().toString(),
                dataFormat: 'json',
                dataSource: {
                    chart: me.chart,
                    colorRange: { color: me.colorRange },
                    dials: { dial: me.dials },
                    trendPoints: { points: me.trendPoints },
                    annotations: me.annotations || new Object(),
                    events: me.getDefaultEventsConfig()
                }
            }
        };

        me.createChart = function createChart() {
            if (chart === null && typeof FusionCharts !== 'undefined') {
                chart = new FusionCharts(me.getChartConfigObject());
            }

            return chart;
        };

        me.getChart = function getChart() {
            return chart;
        };

        me.renderChart = function () {
            if (chart !== null && Ext.isFunction(chart.hasRendered) && !chart.hasRendered()) chart.render();

            return chart;
        };

        me.reloadChartData = function () {
            me.fireEvent('reloadchartdata', me);
        };

        me.cls = (me.cls != null ? me.cls + ' ' : '') + 'fusionChartsAngularGauge';

        me.getDOMIdOfChartContainer = function getDOMIdOfChartContainer() {
            return me.getId() + '-FusionChartContainer'
        }

        me.html = '<div id="' + me.getDOMIdOfChartContainer() + '" style="width:100%; height:100%"></div>';

        me.callParent(arguments);
    }
});