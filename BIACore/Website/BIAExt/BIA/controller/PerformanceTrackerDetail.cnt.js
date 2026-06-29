Ext.define('BIA.controller.PerformanceTrackerDetail', {
    extend: 'Ext.app.Controller',
    init: function () {
        this.control({
            'BIAPerformanceTrackerDetail': {
                beforerender: this.DetailBeforeRender,
                afterrender: this.DetailAfterRender
            },
            'BIAPerformanceTrackerDetailTitle #DetailClose': {
                afterrender: this.DetailCloseAfterRender
            },
            'BIAPerformanceTrackerDetailInfoDisplay': {
                beforerender: this.DetailInfoDisplayBeforeRender
            },
            'BIAPerformanceTrackerDetailContainer #ViewErrorStacktrace': {
                beforerender: this.DetailContainerViewErrorStacktraceBeforeRender
            },
            'BIAPerformanceTrackerDetailContainer #StatusDisplay': {
                beforerender: this.DetailContainerStatusDisplayBeforeRender
            },
            'BIAPerformanceTrackerDetailContainer #TypeDisplay': {
                beforerender: this.DetailContainerTypeDisplayBeforeRender
            },
            'BIAPerformanceTrackerDetailContainer #SQLInjectionDisplay': {
                beforerender: this.DetailContainerSQLInjectionDisplayBeforeRender
            },
            'BIAPerformanceTrackerDetailContainer #RequestTime': {
                beforerender: this.DetailContainerRequestTimeBeforeRender
            },
            'BIAPerformanceTrackerDetailContainer #AnalysisDescription': {
                beforerender: this.DetailContainerAnalysisDescriptionBeforeRender
            },
            'BIAPerformanceTrackerDetailContainer #DataSizeFormulaDisplay': {
                beforerender: this.DetailContainerDataSizeFormulaDisplayBeforeRender
            },
            'BIAPerformanceTrackerDetailTimeline': {
                added: this.DetailTimelineAdded
            },
            'PerformanceTrackerDetailTimelinePart': {
                beforerender: this.DetailTimelinePartBeforeRender,
                afterlayout: this.DetailTimelinePartAfterLayout
            }
        });
    },
    DetailResize: function DetailResize(me, reposition) {
        me.setConfig({
            maxHeight: (window.innerHeight * .95),
            maxWidth: (window.innerWidth * .95)
        });

        if (reposition === true && !Ext.isEmpty(me.el)) {
            me.setConfig({
                x: (window.innerWidth - me.getWidth()) < 0 ? 0 : (window.innerWidth - me.getWidth()) / 2,
                y: (window.innerHeight - me.getHeight()) < 0 ? 0 : (window.innerHeight - me.getHeight()) / 2
            });
        }
    },
    DetailBeforeRender: function DetailBeforeRender(me) {
        Ext.GlobalEvents.addListener({
            resize: {
                fn: this.DetailResize,
                scope: this,
                args: [me, true]
            }
        });
    },
    DetailAfterRender: function DetailAfterRender(me) {
        this.DetailResize(me, true);
    },
    DetailCloseAfterRender: function DetailCloseAfterRender(me, eOpts) {
        if (Ext.getVersion().major > 4) {
            me.getEl().addListener({
                click: {
                    fn: this.DetailCloseClick,
                    args: [me],
                    scope: this
                }
            });
        }
        else {
            me.getEl().addListener({
                click: {
                    fn: this.DetailCloseClick,
                    scope: { scope: this, args: [me] }
                }
            });
        }
    },
    DetailCloseClick: function DetailCloseClick(me, event, el, eOpts) {
        if (Ext.getVersion().major > 4) me.up('window').close();
        else this.args[0].up('window').close();
    },
    DetailInfoDisplayBeforeRender: function DetailInfoDisplayBeforeRender(me, eOpts) {
        if (me.label != null && me.dataValue != null) {
            var label = me.label.toString();
            var dataValue = '';
            var value = me.up('window').record[me.dataValue];
            if (Ext.isObject(value)) {
                dataValue = Ext.isEmpty(value) ? 'N/A' : Ext.JSON.encode(value);
            }
            else if (Ext.isNumeric(value)) { dataValue = BIA.util.Format.number("0,000", value).toString(); }
            else if (Ext.isArray(value)) { dataValue = value.join('<br>'); }
            else if (value === undefined) dataValue = me.dataValue;
            else dataValue = value.toString();

            //if (me.urlDecode === true) dataValue = Ext.urlDecode(dataValue);

            if (me.displayCode) dataValue = '<pre>' + dataValue + '</pre>';

            me.down('#label').setConfig('html', label);
            me.down('#dataValue').setConfig('html', dataValue);
        }
        else me.hidden = true;
    },
    DetailContainerViewErrorStacktraceBeforeRender: function DetailContainerViewErrorStacktraceBeforeRender(me, eOpts) {
        var performanceRecord = me.up('window').record;
        if (performanceRecord) {
            var errorProblemArea = performanceRecord.ProblemArea.filter(function (pa) { return pa.Type == 'Error'; });
            if (errorProblemArea.length > 0 && errorProblemArea[0].StackTrace) {
                me.html = errorProblemArea[0].StackTrace.replace(/(?:\r\n|\r|\n)/g, '<br />');
            }
            else me.setConfig('height', 0);
        }
        else me.setConfig('height', 0);
    },
    DetailContainerStatusDisplayBeforeRender: function DetailContainerStatusDisplayBeforeRender(me, eOpts) {
        var problemLevel = me.up('window').record[me.dataValue],
            type = me.up('window').record.type,
            icon = '';

        if (problemLevel == 0)
            icon = type == 'test' ? '<i class="fa fa-check-square noIssuesSqlIcon" data-qtip="No SQL Injection Issues"></i><span class="BIAPerformanceTrackerDetailIconLabel">No SQL Injection Issues</span>' :
                '<i class="fa fa-check-square noIssuesIcon" data-qtip="No Issues"></i><span class="BIAPerformanceTrackerDetailIconLabel">No Issues</span>';
        if (problemLevel == 1) icon = '<i class="fa fa-exclamation-circle warningIcon" data-qtip="Warning"></i><span class="BIAPerformanceTrackerDetailIconLabel">Warning</span>';
        if (problemLevel == 2) icon = '<i class="fa fa-exclamation-triangle cautionIcon" data-qtip="Caution"></i><span class="BIAPerformanceTrackerDetailIconLabel">Caution</span>';
        if (problemLevel == 3) icon = '<i class="fa fa-times-circle criticalIcon" data-qtip="Critical"></i><span class="BIAPerformanceTrackerDetailIconLabel">Critical</span>';
        if (problemLevel == 4)
            icon = type == 'test' ? '<i class="fa fa-exclamation sqlerrorIcon" data-qtip="SQL Injection Error"></i><span class="BIAPerformanceTrackerDetailIconLabel">SQL Injection Error</span>' :
                '<i class="fa fa-ban errorIcon" data-qtip="Error"></i><span class="BIAPerformanceTrackerDetailIconLabel">Error</span>';


        me.down('#dataValue').update(icon);
    },
    DetailContainerTypeDisplayBeforeRender: function DetailContainerTypeDisplayBeforeRender(me, eOpts) {
        me.down('#dataValue').update(
            me.up('window').record[me.dataValue] == 'test'
                ? BIA.header.tool.PerformanceTrackerInterface.requestTestTypeIcon + '<span class="BIAPerformanceTrackerDetailIconLabel">Test</span>'
                : me.up('window').record[me.dataValue] == 'ajax'
                    ? BIA.header.tool.PerformanceTrackerInterface.requestAjaxTypeIcon + '<span class="BIAPerformanceTrackerDetailIconLabel">Ajax</span>'
                    : BIA.header.tool.PerformanceTrackerInterface.requestStoreTypeIcon + '<span class="BIAPerformanceTrackerDetailIconLabel">Store</span>'
        );
    },
    DetailContainerSQLInjectionDisplayBeforeRender: function DetailContainerSQLInjectionDisplayBeforeRender(me, eOpts) {
        var BIASQLInjectionTest = me.up('window').record[me.dataValue];

        if (BIASQLInjectionTest) {
            me.setHidden(false);
            me.down('#dataValue').setHtml('Parameter: <b>' + BIASQLInjectionTest.parameter + '</b><br>' +
                'Test Type: <b>' + BIASQLInjectionTest.payloadDesc + '</b>' +
                '<pre>' + BIASQLInjectionTest.payload + '</pre>');
        }
    },
    DetailContainerRequestTimeBeforeRender: function DetailContainerRequestTimeBeforeRender(me) {
        me.down('#dataValue').update(me.down('#dataValue').html + ' ms');
    },
    DetailContainerAnalysisDescriptionBeforeRender: function DetailContainerAnalysisDescriptionBeforeRender(me) {
        me.down('#dataValue').update(me.down('#dataValue').html.replace('Database:', '<b>Database:</b>')
            .replace('Dataload:', '<b>Dataload:</b>').replace('BIAWebAPI:', '<b>BIAWebAPI:</b>')
            .replace('AppWebAPI:', '<b>AppWebAPI:</b>').replace('Network:', '<b>Network:</b>')
            .replace('MultiCall:', '<b>MultiCall:</b>'));
    },
    DetailContainerDataSizeFormulaDisplayBeforeRender: function DetailContainerDataSizeFormulaDisplayBeforeRender(me) {
        var dataValues = me.query('#dataValue');
        for (i = 0; i < dataValues.length; i++) {
            dataValues[i].setStyle('font-size', '18px').setStyle('font-weight', 'bold');
        }
    },
    DetailTimelineAdded: function DetailTimelineAdded(me) {
        var win = me.up('window');
        if (win) {
            var rec = win.record;
            if (rec) {
                try {
                    var requestTime = rec.RequestTime;
                    var initTime = rec.InitTime;
                    var webAPIStart = parseInt(rec.AppWebAPIStartTime);
                    var database = rec.DBTime;
                    var dataload = rec.DataLoadTime; //DataLoadTime;
                    var webAPIEnd = rec.WebAPIEndTime;
                    var network = rec.NetworkEndTime;
                    var problemAreas = rec.ProblemArea
                    var networkProblemArea = problemAreas.filter(function (r) { return r.Type == 'Network'; })[0];
                    var webAPIProblemArea = problemAreas.filter(function (r) { return r.Type == 'WebAPI'; })[0];
                    var databaseProblemArea = problemAreas.filter(function (r) { return r.Type == 'Database'; })[0];
                    var dataloadProblemArea = problemAreas.filter(function (r) { return r.Type == 'Dataload'; })[0];

                    var icons = new Array();
                    icons.push('<i class="fa fa-exclamation-circle warningIcon" data-qtip="Warning"></i>');
                    icons.push('<i class="fa fa-exclamation-triangle cautionIcon" data-qtip="Caution"></i>');
                    icons.push('<i class="fa fa-times-circle criticalIcon" data-qtip="Critical"></i>');

                    var classes = new Array();
                    classes.push('Warning');
                    classes.push('Caution');
                    classes.push('Critical');

                    var problemTimeStyle = {
                        fontWeight: 'bold', color: 'red'
                    };

                    if (networkProblemArea) {
                        //me.down('#Init').displayLabel += icons[networkProblemArea.Level - 1];
                        //me.down('#Init').timeStyle = problemTimeStyle;
                        me.down('#Network').displayLabel += icons[networkProblemArea.Level - 1];
                        me.down('#Network').timeStyle = problemTimeStyle;
                        //me.down('#Init').addCls(classes[networkProblemArea.Level - 1]);
                        me.down('#Network').addCls(classes[networkProblemArea.Level - 1]);
                    }
                    if (webAPIProblemArea) {
                        me.down('#WebAPIStart').displayLabel += icons[webAPIProblemArea.Level - 1];
                        me.down('#WebAPIStart').timeStyle = problemTimeStyle;
                        me.down('#WebAPIEnd').displayLabel += icons[webAPIProblemArea.Level - 1];
                        me.down('#WebAPIEnd').timeStyle = problemTimeStyle;
                        me.down('#WebAPIStart').addCls(classes[webAPIProblemArea.Level - 1]);
                        me.down('#WebAPIEnd').addCls(classes[webAPIProblemArea.Level - 1]);
                    }
                    if (databaseProblemArea) {
                        me.down('#Database').displayLabel += icons[databaseProblemArea.Level - 1];
                        me.down('#Database').timeStyle = problemTimeStyle;
                        me.down('#Database').addCls(classes[databaseProblemArea.Level - 1]);
                    }
                    if (dataloadProblemArea) {
                        me.down('#Dataload').displayLabel += icons[dataloadProblemArea.Level - 1];
                        me.down('#Dataload').timeStyle = problemTimeStyle;
                        me.down('#Dataload').addCls(classes[dataloadProblemArea.Level - 1]);
                    }

                    me.down('#Init').displayTime = BIA.util.Format.number_0(initTime).replace('<span class="">', '').replace('</span>', '') + ' ms';
                    me.down('#WebAPIStart').displayTime = BIA.util.Format.number_0(webAPIStart).replace('<span class="">', '').replace('</span>', '') + ' ms';
                    me.down('#Database').displayTime = BIA.util.Format.number_0(database).replace('<span class="">', '').replace('</span>', '') + ' ms';
                    me.down('#Dataload').displayTime = BIA.util.Format.number_0(dataload).replace('<span class="">', '').replace('</span>', '') + ' ms';
                    me.down('#WebAPIEnd').displayTime = BIA.util.Format.number_0(webAPIEnd).replace('<span class="">', '').replace('</span>', '') + ' ms';
                    me.down('#Network').displayTime = BIA.util.Format.number_0(network).replace('<span class="">', '').replace('</span>', '') + ' ms';

                    var totalTime = initTime + webAPIStart + database + dataload + webAPIEnd + network;
                    var startWidth = me.width;
                    var minSize = me.down('#Init').getMinWidth();
                    var leftStartWidth = startWidth - (minSize * 6);

                    me.down('#Init').widthPercent = ((minSize + ((leftStartWidth * (initTime / totalTime).toFixed(2)).toFixed(2) * 1)) / startWidth).toFixed(2);
                    me.down('#WebAPIStart').widthPercent = ((minSize + ((leftStartWidth * (webAPIStart / totalTime).toFixed(2)).toFixed(2) * 1)) / startWidth).toFixed(2);
                    me.down('#Database').widthPercent = ((minSize + ((leftStartWidth * (database / totalTime).toFixed(2)).toFixed(2) * 1)) / startWidth).toFixed(2);
                    me.down('#Dataload').widthPercent = ((minSize + ((leftStartWidth * (dataload / totalTime).toFixed(2)).toFixed(2) * 1)) / startWidth).toFixed(2);
                    me.down('#WebAPIEnd').widthPercent = ((minSize + ((leftStartWidth * (webAPIEnd / totalTime).toFixed(2)).toFixed(2) * 1)) / startWidth).toFixed(2);
                    me.down('#Network').widthPercent = ((minSize + ((leftStartWidth * (network / totalTime).toFixed(2)).toFixed(2) * 1)) / startWidth).toFixed(2);

                    var totalWidthPercent = me.down('#Init').widthPercent + me.down('#WebAPIStart').widthPercent + me.down('#Database').widthPercent
                        + me.down('#Dataload').widthPercent + me.down('#WebAPIEnd').widthPercent + me.down('#Network').widthPercent;

                    if (totalWidthPercent < 1) me.down('#Network').widthPercent += 1 - totalWidthPercent;
                    else if (totalWidthPercent > 1) me.down('#Network').widthPercent -= totalWidthPercent - 1;
                }
                catch (ex) {
                    Ext.log({ msg: 'DetailTimelineAdded processing', dump: ex });
                }
            }
        }
    },
    DetailTimelinePartBeforeRender: function DetailTimelinePartBeforeRender(me) {
        try {
            me.down('#BlockSection').update(me.displayLabel);
            me.down('#BlockSection').setStyle(Ext.apply(me.blockStyle, { color: 'white', textAlign: 'center' }));

            me.down('#TimeDisplay').update(me.displayTime);
            me.down('#TimeDisplay').setStyle(Ext.apply(me.timeStyle || {}, { textAlign: 'center' }));
        }
        catch (ex) {
            Ext.log({ msg: 'DetailTimelinePartBeforeRender processing', dump: ex });
        }
    },
    DetailTimelinePartAfterLayout: function DetailTimelinePartAfterLayout(me) {
        try {
            if (!me.widthSet) {
                if (me.widthPercent > 0) {
                    var displayWidth = (me.widthPercent * 100).toFixed();
                    me.setWidth(displayWidth + '%');
                }
                me.widthSet = true;
            }
        }
        catch (ex) {
            Ext.log({ msg: 'DetailTimelinePartBeforeRender processing', dump: ex });
        }
    }
});