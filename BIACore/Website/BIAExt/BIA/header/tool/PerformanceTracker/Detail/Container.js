Ext.define('BIA.header.tool.PerformanceTracker.Detail.Container', {
    extend: (Ext.platformTags && Ext.platformTags.modern) ? 'Ext.Container' : 'Ext.container.Container',
    alias: 'widget.BIA-Header-Tool-PerformanceTracker-Detail-Container',
    xtype: 'BIAPerformanceTrackerDetailContainer',

    layout: {
        type: 'vbox',
        align: 'stretch',
        pack: 'start'
    },

    padding: 10,
    autoScroll: true,
    viewModel: {
        formulas: {
            getErrorHidden: function(get) {
                return this.getView().up('window').record.ProblemLevel != 4;
            },
            getCallStringHidden: function (get) {
                return this.getView().up('window').record.ProblemLevel != 4 || (this.getView().up('window').record.ProblemLevel == 4 && !Ext.isEmpty(this.getView().up('window').record.CallString));
            }
        }
    },

    width: 800,

    items: [
        {
            xtype: 'BIAPerformanceTrackerDetailInfoDisplay',
            itemId: 'StatusDisplay',
            label: 'Status:',
            dataValue: 'ProblemLevel',
            cls: 'BIAPerformanceTrackerDetailStatusDisplay',
            defaults: {
                padding: '5 10 5 0'
            },
            layout: {
                type: 'hbox',
                align: 'middle',
                pack: 'start'
            },
            margin: '0 10 10 0'
        },
        {
            xtype: 'BIAPerformanceTrackerDetailInfoDisplay',
            label: 'Route:',
            dataValue: 'WebAPIRoute',
            defaults: {
                padding: '5 10 5 0'
            },
            layout: {
                type: 'hbox',
                align: 'middle',
                pack: 'start'
            }
        },
        {
            xtype: 'BIAPerformanceTrackerDetailInfoDisplay',
            itemId: 'TypeDisplay',
            label: 'Call Type:',
            dataValue: 'type',
            cls: 'BIAPerformanceTrackerDetailTypeDisplay',
            defaults: {
                padding: '5 10 5 0'
            },
            layout: {
                type: 'hbox',
                align: 'middle',
                pack: 'start'
            },
            margin: '0 10 10 0'
        },
        {
            xtype: 'BIAPerformanceTrackerDetailInfoDisplay',
            itemId: 'SQLInjectionDisplay',
            label: 'SQL Injection:',
            dataValue: 'BIASQLInjectionTest',
            hidden: true
        },
        {
            xtype: 'BIAPerformanceTrackerDetailInfoDisplay',
            label: 'Request Parameters:',
            dataValue: 'ExtraParams',
            urlDecode: true,
            displayCode: true
        },
        {
            xtype: 'BIAPerformanceTrackerDetailInfoDisplay',
            label: 'WebAPI SQL Call:',
            dataValue: 'CallString',
            displayCode: true,
            bind: {
                hidden: '{!getCallStringHidden}'
            }
        },
        {
            xtype: 'container',
            itemId: 'DataSizeFormulaDisplay',
            layout: {
                type: 'hbox',
                align: 'stretch',
                pack: 'start'
            },
            items: [
                {
                    xtype: 'BIAPerformanceTrackerDetailInfoDisplay',
                    label: 'Rows:',
                    dataValue: 'RecordsReturned',
                    defaults: {
                        padding: '5 5 5 0'
                    },
                    layout: {
                        type: 'hbox',
                        align: 'middle',
                        pack: 'start'
                    }
                },
                {
                    xtype: 'container',
                    html: 'X',
                    padding: '5 10 5 10',
                    style: {
                        fontSize: '18px',
                        fontWeight: 'bold',
                        color: '#3892d3'
                    }
                },
                {
                    xtype: 'BIAPerformanceTrackerDetailInfoDisplay',
                    label: 'Columns:',
                    dataValue: 'ColumnCount',
                    defaults: {
                        padding: '5 5 5 0'
                    },
                    layout: {
                        type: 'hbox',
                        align: 'middle',
                        pack: 'start'
                    }
                },
                {
                    xtype: 'container',
                    html: '=',
                    padding: '5 10 5 10',
                    style: {
                        fontSize: '18px',
                        fontWeight: 'bold',
                        color: '#3892d3'
                    }
                },
                {
                    xtype: 'BIAPerformanceTrackerDetailInfoDisplay',
                    label: '',
                    dataValue: 'DataSize',
                    defaults: {
                        padding: '5 5 5 0'
                    },
                    layout: {
                        type: 'hbox',
                        align: 'middle',
                        pack: 'start'
                    }
                },
            ]
        },
        {
            xtype: 'BIAPerformanceTrackerDetailInfoDisplay',
            label: 'Data Length:',
            dataValue: 'DataMemory',
            defaults: {
                padding: '5 5 5 0'
            },
            layout: {
                type: 'hbox',
                align: 'middle',
                pack: 'start'
            }
        },
        {
            xtype: 'BIAPerformanceTrackerDetailTimeline'
        },
        {
            xtype: 'BIAPerformanceTrackerDetailInfoDisplay',
            itemId: 'RequestTime',
            label: 'Total Request Time:',
            dataValue: 'RequestTime',
            defaults: {
                padding: '5 10 5 0'
            },
            layout: {
                type: 'hbox',
                align: 'center',
                pack: 'stretch'
            }
        },
        {
            xtype: 'BIAPerformanceTrackerDetailInfoDisplay',
            label: 'Analysis',
            dataValue: 'AnalysisDescription',
            itemId: 'AnalysisDescription',
            bind: {
                hidden: '{!getErrorHidden}'
            }
        },
        {
            xtype: 'BIAPerformanceTrackerDetailInfoDisplay',
            label: 'Error',
            dataValue: 'AnalysisDescription',
            itemId: 'ErrorDescription',
            bind: {
                hidden: '{getErrorHidden}'
            }
        },
        {
            xtype: 'container',
            itemId: 'ViewErrorStacktrace',
            scrollable: true,
            height: 200,
            bind: {
                hidden: '{getErrorHidden}'
            }
        }        
    ]
});