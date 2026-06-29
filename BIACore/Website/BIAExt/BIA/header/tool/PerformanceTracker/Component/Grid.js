Ext.define('BIA.header.tool.PerformanceTracker.Component.Grid', {
    extend: 'BIA.grid.PagedPanel',
    alias: 'widget.BIA-Header-Tool-PerformanceTracker-Component-Grid',
    xtype: 'BIAPerformanceTrackerGrid',

    cls: 'BIAPerformanceTrackerGrid',

    autoPageSize: false,
    skipToolbar: true,
    width: 1000,

    viewConfig: {
        listeners: {
            refresh: function (dataview) {
                Ext.each(dataview.panel.columns, function (column) {
                    if (column.autoSizeColumn === true)
                        column.autoSize();
                })
            }
        },
        getRowClass: function (record, rowIndex, rowParams, store) {
            if (record.data.Status == 1) {
                var ProblemLevel = record.data.ProblemLevel,//Ext.Array.max(Ext.Array.pluck(record.data.ProblemArea, 'Level'));
                    type = record.data.type;
                if (ProblemLevel == 1) return 'warning';
                if (ProblemLevel == 2) return 'caution';
                if (ProblemLevel == 3) return 'critical';
                if (ProblemLevel == 4) return type == 'test' ? 'sqlerror' : 'error';
            }
            else return record.data.type == 'test' ? 'no-issues-sql' : 'no-issues';
            return '';
        }
    },

    columns: {
        defaults: { autoSizeColumn: true },
        items: [
            { text: '', align: 'center', renderer: function () { return '<i class="fa fa-search" style="cursor: pointer;"></i>' }, viewDetailOnClick: true, minWidth: 45 },
            {
                text: 'Status',
                align: 'center',
                tdCls: 'status',
                renderer: function renderProblemAreaIcons(value, metaData, record, rowIndex, colIndex, store, view) {
                    var iconHTML = '';
                    iconHTML += '<i class="fa fa-exclamation-circle warningIcon" data-qtip="Warning"></i>';
                    iconHTML += '<i class="fa fa-exclamation-triangle cautionIcon" data-qtip="Caution"></i>';
                    iconHTML += '<i class="fa fa-times-circle criticalIcon" data-qtip="Critical"></i>';
                    iconHTML += '<i class="fa fa-ban errorIcon" data-qtip="Error"></i>';
                    iconHTML += '<i class="fa fa-exclamation sqlerrorIcon" data-qtip="SQL Injection Error"></i>';
                    iconHTML += '<i class="fa fa-check-square noIssuesIcon" data-qtip="No Issues"></i>';
                    iconHTML += '<i class="fa fa-check-square noIssuesSqlIcon" data-qtip="No SQL Injection Issues"></i>';
                    return iconHTML;
                }
            },
            {
                text: 'Time',
                dataIndex: 'StartRequest',
                renderer: function rendererStartRequest(value, metaData, record, rowIndex, colIndex, store, view) {
                    var dateString = BIA.util.Format.ConvertDateTimeToLocal(Ext.isDate(value) ? value : new Date(value), true, false, true, true, true, true);
                    return dateString.slice(dateString.indexOf(' ') + 1).replace('(', ' (');
                }
            },
            {
                text: 'Type',
                align: 'center',
                dataIndex: 'type',
                renderer: function (value) {
                    return value == 'test' ? BIA.header.tool.PerformanceTrackerInterface.requestTestTypeIcon :
                        value == 'ajax' ? BIA.header.tool.PerformanceTrackerInterface.requestAjaxTypeIcon : '';
                }
            },
            {
                text: 'Route', dataIndex: 'WebAPIRoute', flex: 1, autoSizeColumn: false,
                renderer: function rendererWebAPIRoute(value, metaData, record, rowindex, colindex, store, view) {
                    if (record.data.type == 'test') {
                        return record.data.WebAPIRoute + ' (<span class="BH_SQLParam">' + record.data.BIASQLInjectionTest.parameter +
                            ': <pre class="BH_SQLInlinePre">' + record.data.BIASQLInjectionTest.payload + '</pre></span>' + (record.data.ErrorResponse ? ' - ' + record.data.ErrorResponse.ExceptionMessage : '') + ')';
                    } else if (record.data.DuplicateCallGroup != null) {
                        return '<span class="MulticallGroupIndicator C' + (((record.data.DuplicateCallGroup + 1) % 12)) + '"'
                            + ' data-qtip="Duplicate Call Group #' + (record.data.DuplicateCallGroup + 1) + '">'
                            + '' + (record.data.DuplicateCallGroup + 1) + '</span>' + value;
                    }
                    else
                        return value;
                }
            },
            { text: 'Records', align: 'right', dataIndex: 'RecordsReturned' },
            {
                text: 'Exec. Time',
                align: 'right',
                dataIndex: 'RequestTime',
                renderer: function (value) {
                    return BIA.util.Format.number_0(value) + ' ms';
                }
            },
            {
                text: 'Problem Areas',
                tdCls: 'problemArea',

                renderer: function renderProblemAreaIcons(value, metaData, record, rowIndex, colIndex, store, view) {
                    var problemAreas = record.data.ProblemArea;
                    var iconHTML = '';
                    if (problemAreas.length > 0) {
                        if (problemAreas.filter(function (pa) { return pa.Type == 'WebAPI'; }).length > 0) {
                            iconHTML += '<i class="fa fa-server webapi" style="white-space:pre-line" data-qtip="WebAPI Issues<br>' +
                                BIA.util.Format.number_0(record.data.WebAPIOnlyTime).replace('<span class="">', '').replace('</span>', '') + ' ms (' +
                                BIA.util.Format.number('0%', (record.data.WebAPIOnlyTime / record.data.RequestTime) * 100).replace('<span class="">', '').replace('</span>', '') + ')"></i>';
                        }
                        if (problemAreas.filter(function (pa) { return pa.Type == 'Database'; }).length > 0) {
                            iconHTML += '<i class="fa fa-database database"  style="white-space:pre-line" data-qtip="Database Issues<br>' +
                                BIA.util.Format.number_0(record.data.DBTime).replace('<span class="">', '').replace('</span>', '') + ' ms (' +
                                BIA.util.Format.number('0%', (record.data.DBTime / record.data.RequestTime) * 100).replace('<span class="">', '').replace('</span>', '') + ')"></i>';
                        }
                        if (problemAreas.filter(function (pa) { return pa.Type == 'Dataload'; }).length > 0) {
                            iconHTML += '<i class="fa fa-download dataload"  style="white-space:pre-line" data-qtip="Dataload Issues<br>' +
                                BIA.util.Format.number_0(record.data.DataLoadTime).replace('<span class="">', '').replace('</span>', '') + ' ms (' +
                                BIA.util.Format.number('0%', (record.data.DataLoadTime / record.data.RequestTime) * 100).replace('<span class="">', '').replace('</span>', '') + ')"></i>';
                        }
                        if (problemAreas.filter(function (pa) { return pa.Type == 'Network'; }).length > 0) {
                            iconHTML += '<i class="fa fa-exchange network"  style="white-space:pre-line" data-qtip="Network Issues<br>' +
                                BIA.util.Format.number_0(record.data.NetworkOnlyTime).replace('<span class="">', '').replace('</span>', '') + ' ms (' +
                                BIA.util.Format.number('0%', (record.data.NetworkOnlyTime / record.data.RequestTime) * 100).replace('<span class="">', '').replace('</span>', '') + ')"></i>';
                        }
                        if (problemAreas.filter(function (pa) { return pa.Type == 'RecordCount'; }).length > 0) {
                            iconHTML += '<i class="fa fa-tasks recordcount"  style="white-space:pre-line" data-qtip="Record Count Issues"></i>';
                        }
                        if (problemAreas.filter(function (pa) { return pa.Type == 'RepetitiveCalls'; }).length > 0) {
                            iconHTML += '<i class="fa fa-history repetitivecalls"  style="white-space:pre-line" data-qtip="Repetitive Call Issues"></i>';
                        }
                        if (problemAreas.filter(function (pa) { return pa.Type == 'MultiCall'; }).length > 0) {
                            iconHTML += '<i class="fa fa-clone multicalls"  style="white-space:pre-line" data-qtip="Multi Call Issues"></i>';
                        }
                    }

                    return iconHTML;
                }
            }
        ]
    },

    bbar: [
        { xtype: 'PerformanceTrackerGridSummary', flex: 1 }
    ]
});