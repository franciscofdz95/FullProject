BIACore.define('BIACore.Header.PerformanceTracker', {}, function (me) {
    BIACore.apply(me, {
        StartTracker: function () {
            if (typeof Ext != "undefined") {
                var performanceTrackerDisplay = Ext.create('BIA.header.tool.PerformanceTracker.Summary');
                performanceTrackerDisplay.show();
            }
        },
        CheckSQLInjectionToggle: function CheckSQLInjectionToggle() {
            var toggle = Ext.getCmp('BH_Button_PerformanceTrackerSQLInjectionToggle');
            return toggle && toggle.getValue() == 1;
        }
    });

    var getPFButton = function getPFButton() {
        return BIACore.$('#BH_Button_PerformanceTracker');
    };

    var checkPFButton = function checkPFButton() {
        var pfButton = getPFButton();
        return pfButton.length > 0 && pfButton[0].style.display !== 'none';
    };

    var getSparklineButton = function getSparklineButton() {
        return BIACore.$('#BH_Button_PerformanceTrackerSparkline');
    }

    var checkSparklineButton = function checkSparklineButton() {
        var sparklineButton = getSparklineButton();
        return sparklineButton.length > 0 && sparklineButton[0].style.display !== 'none';
    };

    var getSQLInjectionButton = function getSQLInjectionButton() {
        return BIACore.$('#BH_Button_PerformanceTrackerSQLInjection');
    }

    var checkSQLInjectionButton = function checkSQLInjectionButton() {
        var sqlInjectionButton = getSQLInjectionButton();
        return sqlInjectionButton.length > 0 && sqlInjectionButton[0].style.display !== 'none';
    };

    var checkPerformanceTrackerInterface = function checkPerformanceTrackerInterface() {
        return typeof BIA !== 'undefined' && BIA && BIA.header && BIA.header.tool && BIA.header.tool.PerformanceTrackerInterface;
    };

    var checkExtCorrectVersion = function checkExtCorrectVersion() {
        return Ext && Ext.getVersion && Ext.isFunction(Ext.getVersion) && Ext.getVersion().major > 4;
    };

    var isDevOrQA = function isDevOrQA() {
        return BIACore.Config.environment == 'DEV' || BIACore.Config.environment == 'QA';
    };

    var initialUpdateHeaderButtonAttempts = 20;

    var updateHeaderButton = function updateHeaderButton() {
        if (checkPFButton()) {
            var pfButton = getPFButton();
            var childrenChanged = false;
            var totalRecordCount = 0;
            var recordCount = 0;
            if (checkPerformanceTrackerInterface()) {
                totalRecordCount = BIA.header.tool.PerformanceTrackerInterface.getPerformanceHistoryRecords(me.GetLastViewedId()).length;

                var formatRequestTime = function formatRequestTime(ms) {
                    ms = ms || 0;
                    if (ms >= 60000) {
                        return (ms / 60000).toFixed(1) + 'm'
                    }
                    else if (ms >= 1000) {
                        return (ms / 1000).toFixed(1) + 's'
                    }
                    else return ms.toFixed(0) + 'ms'
                };

                if (BIA.header.tool.PerformanceTrackerInterface.getPerformanceProblemHistoryRecords(me.GetLastViewedId()).length > 0) {
                    recordCount = BIA.header.tool.PerformanceTrackerInterface.getPerformanceProblemHistoryRecords(me.GetLastViewedId()).length;
                    pfButton.children().remove();
                    pfButton.append('<i class="fa fa-retweet fa-rotate-90" style="float: left;"></i>');
                    //pfButton.append('<span>Bad Req ' + recordCount + ' / ' + totalRecordCount + '</span>');
                    //pfButton.append('<span>&nbsp;</span>');
                    /*
                    <table class="PeformanceTrackerHeaderButtonRequestDisplayTable"><tr><td>Total</td><td class="value">100</td></tr><tr><td>Bad</td><td class="value">11</td></tr></table>
                    */
                    pfButton.append('<table class="PeformanceTrackerHeaderButtonRequestDisplayTable"><tr><td>Total</td><td class="value">' + (BIA.header.tool.PerformanceTrackerInterface.getLastPerformanceRecordId() + 1) + '</td></tr><tr><td>Bad</td><td class="value">' + recordCount + '</td></tr></table>');
                    pfButton.append('<span style="float: clear;">Avg ' + formatRequestTime(BIA.header.tool.PerformanceTrackerInterface.getAverageRequestTime(me.GetLastViewedId())) + '</span>');
                    pfButton.append('<span>&nbsp;</span>');
                    pfButton.append('<i class="fa fa-times-circle"></i>')

                    pfButton.data('status', 1);
                    pfButton.data('requests', totalRecordCount);

                    if (BIA.header.tool.PerformanceTrackerInterface.getPerformanceProblemHistoryRecords(me.GetLastViewedId()).filter(function (rec) { return rec.ProblemLevel > 2; }).length > 0)
                        Ext.fly(Ext.getDom('BH_Button_PerformanceTracker')).el.setStyle('background-color', '#f33');
                    else
                        Ext.fly(Ext.getDom('BH_Button_PerformanceTracker')).el.setStyle('background-color', '#f68b20');

                    childrenChanged = true;
                }
                else {
                    //recordCount = BIA.header.tool.PerformanceTrackerInterface.getPerformanceHistoryRecords(me.GetLastViewedId()).length;
                    pfButton.children().remove();
                    pfButton.append('<i class="fa fa-retweet fa-rotate-90"></i>')
                    pfButton.append('<span>Total ' + (BIA.header.tool.PerformanceTrackerInterface.getLastPerformanceRecordId() + 1) + '</span>')
                    pfButton.append('<span>Avg ' + formatRequestTime(BIA.header.tool.PerformanceTrackerInterface.getAverageRequestTime(me.GetLastViewedId())) + '</span>');
                    pfButton.append('<span>&nbsp;</span>');
                    pfButton.append('<i class="fa fa-check-circle"></i>')

                    pfButton.data('status', 0);
                    pfButton.data('requests', totalRecordCount);
                    Ext.fly(Ext.getDom('BH_Button_PerformanceTracker')).el.setStyle('background-color', '#00bc06');
                    childrenChanged = true;
                }

                performanceTrackerSparklineRefresh(true);
            }
            else {
                pfButton.children().remove();
                pfButton.append('<i class="fa fa-retweet fa-rotate-90"></i>')
                pfButton.append('<span>Total 0</span>')
                pfButton.append('<span>Avg 0</span>');
                pfButton.append('<span>&nbsp;</span>');
                pfButton.append('<i class="fa fa-check-circle"></i>')

                pfButton.data('status', 0);
                pfButton.data('requests', totalRecordCount);
                Ext.fly(Ext.getDom('BH_Button_PerformanceTracker')).el.setStyle('background-color', '#00bc06');
                childrenChanged = true;
            }

            if (childrenChanged) {
                var newWidth = 0;
                getPFButton().children().each(function (index) {
                    newWidth += BIACore.$(getPFButton().children()[index]).outerWidth();
                    newWidth += BIACore.$(getPFButton().children()[index]).css('padding-left').replace('px', '') * 1;
                    newWidth += BIACore.$(getPFButton().children()[index]).css('padding-right').replace('px', '') * 1;
                    newWidth += BIACore.$(getPFButton().children()[index]).css('margin-left').replace('px', '') * 1;
                    newWidth += BIACore.$(getPFButton().children()[index]).css('margin-right').replace('px', '') * 1;
                });

                //Ext.log({ msg: 'BH_Button_PerformanceTracker new calculated width = ' + newWidth + ' vs old width = ' + getPFButton().outerWidth() });

                Ext.fly(Ext.getDom('BH_Button_PerformanceTracker')).el.setWidth(newWidth + 35 + (pfButton.data('init') === undefined ? 20 : 0));
                Ext.fly(Ext.getDom('BH_Button_PerformanceTracker')).el.setStyle('padding', '3px');
                pfButton.data('init', true);
            }
        }
        else if (initialUpdateHeaderButtonAttempts > 0) {
            Ext.defer(updateHeaderButton, 100);
            initialUpdateHeaderButtonAttempts--;
        }
    };

    var updateSQLInjectionButton = function updateSQLInjectionButton() {
        var container = Ext.get('BH_Button_PerformanceTrackerSQLInjection');

        if (container && checkPerformanceTrackerInterface()) {
            var label = container.down('label'),
                historyRecords = BIA.header.tool.PerformanceTrackerInterface.getPerformanceHistoryRecords(me.GetLastViewedId()),
                badTests = historyRecords.filter(function (rec) { return rec.type == 'test' && rec.ProblemLevel == 4; }).length;

            if (badTests > 0) {
                container.removeCls('BH_Button_PerformanceTrackerSQLInjectionEnabled');
                container.addCls('BH_Button_PerformanceTrackerSQLInjectionBad');

                label.setText('SQL-i Tests (' + badTests + ')');
            } else {
                container.removeCls('BH_Button_PerformanceTrackerSQLInjectionBad');

                if (me.CheckSQLInjectionToggle()) {
                    container.addCls('BH_Button_PerformanceTrackerSQLInjectionEnabled');
                }

                label.setText('SQL-i Tests');
            }

        }
    };

    var performanceUpdated = function performanceUpdated() {
        updateHeaderButton();
        updateSQLInjectionButton();
    };

    var addPerformanceTrackerInterfaceChangeListener = function addPerformanceTrackerInterfaceChangeListener() {
        if (checkPerformanceTrackerInterface()) {
            BIA.header.tool.PerformanceTrackerInterface.addListener({
                'performanceupdated': {
                    fn: performanceUpdated,
                    scope: me
                }
                //TODO: Add listener for PT set last viewed id
            });

            performanceUpdated();
        }
    };

    var performanceSparklineDomConfig = { id: 'BH_Button_PerformanceTrackerSparkline', title: 'AJAX requests/15s over Last 15 Mins', iconCls: 'BH_SAIcon' };

    var showSparklineHeaderContainer = function showSparklineHeaderContainer(show) {
        if (checkPFButton()) {
            if (!checkSparklineButton() && show) {
                getPFButton().after(BIACore.String.format(BIACore.Header.Buttons.template.join(''), performanceSparklineDomConfig));
                //sparklineHeaderContainer = BIACore.$('#BH_Button_PerformanceTrackerSparkline');
            }

            var sparklineHeaderContainer = getSparklineButton();
            if (sparklineHeaderContainer != null) {
                sparklineHeaderContainer.toggle(show);

                var sparklineHeaderContainerCmp = Ext.get('BH_Button_PerformanceTrackerSparkline');
                if (sparklineHeaderContainerCmp) {
                    if (show) {
                        sparklineHeaderContainerCmp.setStyle({
                            display: 'block',
                            height: null,
                            width: null,
                            opacity: null
                        });
                    }
                    else {
                        sparklineHeaderContainerCmp.setStyle({
                            display: 'none',
                            height: 0,
                            width: 0,
                            opacity: 0
                        });
                    }
                }

                for (i = sparklineHeaderContainer.children().length - 1; i >= 0; i--) {
                    if ((['i', 'span']).indexOf(sparklineHeaderContainer.children()[i].tagName.toLowerCase()) > -1) {
                        BIACore.$(sparklineHeaderContainer.children()[i]).remove();
                    }
                }
            }
        }
    };

    var performanceSQLInjectionDomConfig = {
        id: 'BH_Button_PerformanceTrackerSQLInjection', title: 'Toggle SQL Injection Tests', iconCls: 'BH_SAIcon'
    };

    var buildSQLInjectionHeaderContainerAttempts = 20;
    var sqlInjectionPopupConfirmed = false;

    var buildSQLInjectionHeaderContainer = function buildSQLInjectionHeaderContainer() {
        if (checkPFButton() && !checkSQLInjectionButton()) {
            getPFButton().before(BIACore.String.format(BIACore.Header.Buttons.template.join(''), performanceSQLInjectionDomConfig));
            Ext.create({
                xtype: 'container',
                renderTo: 'BH_Button_PerformanceTrackerSQLInjection',
                layout: { type: 'hbox' },
                items: [
                    { xtype: 'label', text: 'SQL-i Tests', id: 'BH_Button_PerformanceTrackerSQLInjectionLabel' },
                    { xtype: 'tbfill' },
                    {
                        xtype: 'slider',
                        id: 'BH_Button_PerformanceTrackerSQLInjectionToggle',
                        width: 35,
                        value: 0,
                        minValue: 0,
                        maxValue: 1
                    }
                ]
            });


            var sqlInjectionHeaderContainer = Ext.get('BH_Button_PerformanceTrackerSQLInjection');
            var sqlInjectionToggle = Ext.getCmp('BH_Button_PerformanceTrackerSQLInjectionToggle');
            sqlInjectionHeaderContainer.on('click', function (slider, value) {
                sqlInjectionToggle.fireEvent('change', sqlInjectionToggle);
            });

            sqlInjectionToggle.on('change', function (slider, value) {                
                if (!sqlInjectionHeaderContainer.hasCls('BH_Button_PerformanceTrackerSQLInjectionBad')) {

                    sqlInjectionToggle.value = (!sqlInjectionHeaderContainer.hasCls('BH_Button_PerformanceTrackerSQLInjectionEnabled')) ? 1 : 0; 
                    
                    if (sqlInjectionToggle.value == 1) {
                        sqlInjectionToggle.setValue(1); 
                        sqlInjectionHeaderContainer.addCls('BH_Button_PerformanceTrackerSQLInjectionEnabled');

                        if (!sqlInjectionPopupConfirmed) {
                            Ext.Msg.show({
                                title: 'Enable SQL Injection Testing?',
                                message: 'The SQL Injection Tool will run a basic attack against each Web API call the Ajax Performance Tracker observes. It runs 5 different tests against each parameter. '
                                    + 'So 2 Web API with 5 parameters running 5 tests will execute 50 additional calls. '
                                    + 'The tests will show in the Performance Tracker with a type of "T" and a pass/warning/error with more detail in the test popup.'
                                    + '<br><br>Please note the tool will impact performance of the app and if you have transactional Web API methods there may be extra data inserted/deleted.',
                                buttons: Ext.Msg.OKCANCEL,
                                icon: Ext.Msg.QUESTION,
                                fn: function (btn) {
                                    if (btn === 'ok') {                                                                                
                                        sqlInjectionPopupConfirmed = true;
                                    } else {
                                        sqlInjectionToggle.setValue(0);                                       
                                        sqlInjectionHeaderContainer.removeCls('BH_Button_PerformanceTrackerSQLInjectionEnabled');
                                    }
                                }
                            });
                        }
                    } else {       
                        sqlInjectionToggle.setValue(0);
                        sqlInjectionHeaderContainer.removeCls('BH_Button_PerformanceTrackerSQLInjectionEnabled');
                    }
                }
            });

            var sqlInjectionHeaderButton = getSQLInjectionButton();
            for (i = sqlInjectionHeaderButton.children().length - 1; i >= 0; i--) {
                if ((['i', 'span']).indexOf(sqlInjectionHeaderButton.children()[i].tagName.toLowerCase()) > -1) {
                    BIACore.$(sqlInjectionHeaderButton.children()[i]).remove();
                }
            }
        }
        else if (buildSQLInjectionHeaderContainerAttempts > 0) {
            Ext.defer(buildSQLInjectionHeaderContainer, 100);
            buildSQLInjectionHeaderContainerAttempts--;
        }
    };

    var TOTAL_TIME = 900;
    var HITS_INTERVAL = 15;

    //Change to look for requests within last TOTAL_TIME and break up by HITS_INTERVAL

    var getPerformanceTrackerSparklineData = function getPerformanceTrackerSparklineData() {
        var sparklineData = new Array();
        if (checkPerformanceTrackerInterface()) {
            var phr = BIA.header.tool.PerformanceTrackerInterface.getPerformanceHistoryRecords()
            var d = new Date();
            d = new Date((d.getMonth() + 1) + '/' + d.getDate() + '/' + d.getFullYear() + ' ' + d.getHours() + ':' + d.getMinutes() + ':' + d.getSeconds());
            for (i = 0; i < phr.length; i++) {
                var srd = new Date((phr[i].StartRequest.getMonth() + 1) + '/' + phr[i].StartRequest.getDate() + '/' + phr[i].StartRequest.getFullYear() + ' ' + phr[i].StartRequest.getHours() + ':' + phr[i].StartRequest.getMinutes() + ':' + phr[i].StartRequest.getSeconds());
                var md = Ext.Date.diff(srd, d, Ext.Date.SECOND);
                if (md <= TOTAL_TIME) {
                    //var interval = 60 - md;
                    var interval = Math.floor((TOTAL_TIME - md) / HITS_INTERVAL, 0) * HITS_INTERVAL;
                    var record = Ext.Array.findBy(sparklineData, function (item) { return item.Interval == interval; });
                    if (record) { record.Hits++; }
                    else { sparklineData.push({ Interval: interval, Hits: 1 }); }
                }
            }

            var sparklinDataMinutes = Ext.Array.pluck(sparklineData, 'Interval');

            for (i = 0; i <= TOTAL_TIME; i += HITS_INTERVAL) {
                if (sparklinDataMinutes.indexOf(i) === -1) sparklineData.push({ Interval: Math.floor(i / HITS_INTERVAL, 0), Hits: 0 });
                else {
                    var sdr = Ext.Array.findBy(sparklineData, function (item) { return item.Interval == i; });
                    if (sdr) sdr.Interval = sdr.Interval / HITS_INTERVAL;
                }
            }

            sparklineData = sparklineData.sort(function (a, b) {
                if (a.Interval < b.Interval) return -1;
                else if (a.Interval > b.Interval) return 1;
                else return 0;
            });
        }

        return sparklineData;
    }

    var sparklineRefreshTimer = null;

    var performanceTrackerSparklineRefresh = function performanceTrackerSparklineRefresh(requestUpdate) {
        if (Ext.chart && Ext.chart.CartesianChart) {
            showSparklineHeaderContainer(true);
            var sparklineData = getPerformanceTrackerSparklineData();

            var sparklineGraph = Ext.ComponentQuery.query('BIAPerformanceTrackerSparkline#BIAHeaderPerformanceTrackerSparkline');
            if (sparklineGraph.length > 0) {
                sparklineGraph = sparklineGraph[0];
            }
            else if (BIACore.$('#BH_Button_PerformanceTrackerSparkline').length > 0) {
                sparklineGraph = Ext.create({
                    xtype: 'BIAPerformanceTrackerSparkline',
                    renderTo: 'BH_Button_PerformanceTrackerSparkline',
                    itemId: 'BIAHeaderPerformanceTrackerSparkline'
                });
            }

            if (sparklineGraph && (!Ext.isArray(sparklineGraph) || (Ext.isArray(sparklineGraph) && sparklineGraph.length > 0))) {
                var maxHits = Ext.Array.max(Ext.Array.pluck(sparklineData, 'Hits'));
                var leftAxes = sparklineGraph.getAxes().filter(function (item) { return item.getPosition() == 'left' })[0];
                leftAxes.setMaximum(maxHits < 1 ? 1 : maxHits);

                var bottomAxes = sparklineGraph.getAxes().filter(function (item) { return item.getPosition() == 'bottom' })[0];
                if (bottomAxes.setIncrement) bottomAxes.setIncrement(1);
                bottomAxes.setMaximum((TOTAL_TIME / HITS_INTERVAL) + 1);

                sparklineGraph.store.clearData();
                sparklineGraph.store.loadData(Ext.clone(sparklineData));

                if (sparklineRefreshTimer != null) {
                    clearTimeout(sparklineRefreshTimer);
                    sparklineRefreshTimer = null;
                }

                sparklineRefreshTimer = Ext.defer(performanceTrackerSparklineRefresh, 30000);

                return;
            }
        }
    }

    BIACore.onReady(function () {
        BIACore.apply(me, {
            SetLastViewedId: function (id) {
                var pfButton = getPFButton();
                if (pfButton) {
                    pfButton.data('lastViewedId', id);
                    performanceUpdated();
                }
            },
            GetLastViewedId: function () {
                var pfButton = getPFButton();
                if (pfButton) {
                    return pfButton.data('lastViewedId');
                }
            }
        });
    }, me);

    var extStartup = function extStartup() {
        if ((isDevOrQA() || (BIACore.Security.User.isSA() && !isDevOrQA())) && checkExtCorrectVersion() && checkPerformanceTrackerInterface()) {
            addPerformanceTrackerInterfaceChangeListener();
            performanceTrackerSparklineRefresh();
            buildSQLInjectionHeaderContainer();
        }
    };

    var initAttempts = 0;
    var init = function init() {
        if (typeof Ext != 'undefined') {
            Ext.onReady(extStartup, this);
        }
        else {
            if (++initAttempts < 50) {
                setTimeout(init, 10, null, true);
            }
        }
    }

    BIACore.onReady(init, me);
});