Ext.define('App.View.EA.EAFDB', {
    extend: 'Ext.container.Container',
    alias: 'widget.App-View-EA-EAFDB',
    itemId: 'EAFDBPanelId',
    closable: true,
    hidden: true,
    scrollable: true,
    minWidth: 300,
    minHeight: 300,
    bodyPadding: 10,
    collapsible: false,
    defaults: {
        margin: '5 2 5 2',
        padding: '8 5 8 5',
        border: false,
    },

    layout: {
        type: 'vbox',
        align: 'middle',
        pack: 'center'
    },
    viewModel: {
        data: {
            Callout_Daily: false,
            Callout_EOM: false,
            Callout_EOQ: false,
            Callout_EOW: false,
            Callout_MTD: false,
            Callout_Monthly: false,
            Callout_QTD: false,
            Callout_WTD: false,
            Callout_Weekly: false,
            Card_ExpenseVariance: false,
            Card_PL_Impacting: false,
            Card_PerformanceBreakdown: false,
            Card_ProductBreakdown: false,
            Card_ProfitLoss: false,
            Card_RevenueVariance: false,
            CostView: false,
            Daily_Cost: false,
            DataAvailability: '',
            Expense_Daily: false,
            Expense_Monthly: false,
            Expense_QTD: false,
            Expense_Weekly: false,
            ICON_CarsRange: false,
            ICON_Forecast: false,
            ICON_MonthlyProfitForecast: false,
            ICON_PeakSurcharge: false, 
            ICON_StatPage: false,
            ICON_VnrDailypdf: false,
            ICON_VnrWeeklypdf: false,
            Measure_FLYA: false,
            Measure_FPP: false,
            Measure_PPLYA: false,
            Measure_TYAF: false,
            Measure_TYALYA: false,
            Measure_TYAPP: false,
            Period_Daily: false,
            Period_MTD: false,
            Period_Monthly: false,
            Period_Quarterly: false,
            Period_WTD: false,
            Period_Weekly: false,
            StartAppCode: "FDB",
            Testing_Approver: false,
            Testing_Remote: false,
            Testing_Rollback: false,
            ToDate_Month: false,
            ToDate_Week: false,
            ViewPeak: false,
            WhatIfView: false,
            WhatIf_NRPP: false
            
        }
    },
    items: [
        {
            xtype: 'form',
            border: false,
            itemId: 'EAFDBContentTable',
            layout: 'vbox',
            layout: {
                type: 'table',
                columns: 1,
                align: 'stretch'
            },
            defaults: {
                margin: '5 5 5 5',
                padding: '3 5 3 5',
                labelWidth: 150,
                width: 250
            },
            buttonAlign: 'center',
            buttons: [
                { xtype: 'button', itemId: 'btnEASave', text: 'Save', margin: '5 5 5 5' },
                { xtype: 'button', itemId: 'btnEACancel', text: 'Cancel', margin: '5 5 5 5' }
            ],
            items: [
                {
                    xtype: 'fieldset',
                    border: true,
                    width: 700,
                    layout: {
                        type: 'table',
                        columns: 2,
                        align: 'stretch'
                    },
                    items: [
                        {
                            xtype: 'combobox',
                            fieldLabel: 'Start App Code:',
                            labelWidth: 150,
                            padding: '8 10 8 5',
                            
                            grow: true,
                            growToLongestValue: true,
                            displayField: 'Name',
                            valueField: 'Code',
                            itemId: 'FDBStartAppCodeId',
                            bind: '{StartAppCode}',
                            store: {
                                fields: ['Name', 'Code'],
                                data: [
                                    { "Name": "Galileo", "Code": "FDB" },
                                    { "Name": "Financial Dash", "Code": "Financial_Dash" }

                                ]
                            },
                            queryMode: 'local',
                            typeAhead: true
                        }
                        ,
                        {
                            xtype: 'combobox',
                            fieldLabel: 'Data Availablity Level:',
                            
                            padding: '8 10 8 50',
                            grow: true,
                            growToLongestValue: true,
                            displayField: 'Name',
                            valueField: 'Code',
                            itemId: 'FDBDataAvailabilityId',
                            bind: '{DataAvailability}',
                            store: {
                                fields: ['Name', 'Code'],
                                data: [
                                    { "Name": "Select One", "Code": "" },
                                    { "Name": "A", "Code": "A" },
                                    { "Name": "F", "Code": "F" }

                                ]
                            },
                            queryMode: 'local',
                            typeAhead: true
                        }
                    ]
                },

                {
                    xtype: 'fieldset',
                    border: true,
                    width: 700,
                    defaults: {
                        width: 162
                    },
                    layout: {
                        type: 'table',
                        columns: 4,
                        align: 'stretch'
                    },
                    items: [
                        {
                            xtype: 'checkbox',
                            boxLabelAlign:'after',
                           
                            boxLabel:'Cost View',
                            vertical: true,
                            padding: '8 10 8 5',
                            bind: {
                                value: '{CostView}'
                            },
                            itemId: 'FDBCostViewId'
                        },
                        {
                            xtype: 'checkbox',
                            boxLabel: 'What If View',
                            
                            padding: '8 10 8 5',
                            bind: {
                                value: '{WhatIfView}'
                            },
                            itemId: 'FDBWhatIfViewId'
                        },
                        {
                            xtype: 'checkbox',
                            boxLabel: 'What If NRPP',
                            
                            padding: '8 10 8 5',
                            bind: {
                                value: '{WhatIf_NRPP}'
                            },
                            itemId: 'FDBWhatIf_NRPPId'
                        },
                        {
                            xtype: 'checkbox',
                            boxLabel: 'Peak Surcharge View',
                            
                            padding: '8 10 8 5',
                            bind: {
                                value: '{ViewPeak}'
                            },
                            itemId: 'FDBViewPeakId'
                        }
                    ]
                },

                {
                    xtype: 'fieldset',
                    title: 'Card',
                    instructions: 'Tell us all about yourself',
                    border: true,
                    width: 700,
                    defaults: {
                        width: 163
                    },
                    layout: {
                        type: 'table',
                        columns: 4,
                        align: 'stretch'
                    },


                    items: [
                        {
                            xtype: 'checkbox',
                            boxLabel: 'Profit Loss',
                            
                            padding: '8 10 8 5',
                            bind: {
                                value: '{Card_ProfitLoss}'
                            },
                            itemId: 'FDBCard_ProfitLossId'
                        },
                        {
                            xtype: 'checkbox',
                            boxLabel: 'PL Impacting',
                            
                            padding: '8 10 8 5',
                            bind: {
                                value: '{Card_PL_Impacting}'
                            },
                            itemId: 'FDBCard_PL_ImpactingId'
                        },
                        {
                            xtype: 'checkbox',
                            boxLabel: 'Revenue Variance',
                            
                            padding: '8 10 8 5',
                            bind: {
                                value: '{Card_RevenueVariance}'
                            },
                            itemId: 'FDBCard_RevenueVarianceId'
                        },
                        {
                            xtype: 'checkbox',
                            boxLabel: 'Product Breakdown',
                            
                            padding: '8 10 8 5',
                            bind: {
                                value: '{Card_ProductBreakdown}'
                            },
                            itemId: 'FDBCard_ProductBreakdownId'
                        },
                        {
                            xtype: 'checkbox',
                            boxLabel: 'Expense Variance',
                            
                            padding: '8 10 8 5',
                            bind: {
                                value: '{Card_ExpenseVariance}'
                            },
                            itemId: 'FDBCard_ExpenseVarianceId'
                        }
                        , {
                            xtype: 'checkbox',
                            boxLabel: 'Performance Breakdown',
                            boxWidth: 170,
                            padding: '8 10 8 5',
                            bind: {
                                value: '{Card_PerformanceBreakdown}'
                            },
                            itemId: 'FDBCard_PerformanceBreakdownId'
                        }


                    ]
                },
                {
                    xtype: 'fieldset',
                    title: 'Measures',
                    border: true,
                    width: 700,
                    defaults: {
                        width: 163
                    },
                    layout: {
                        type: 'table',
                        columns: 4,
                        align: 'fit'
                    },
                    items: [
                        {
                            xtype: 'checkbox',
                            boxLabel: 'TY to Profit Plan',
                            
                            padding: '8 10 8 5',
                            bind: {
                                value: '{Measure_TYAPP}'
                            },
                            itemId: 'FDBMeasure_TYAPPId'
                        },
                        {
                            xtype: 'checkbox',
                            boxLabel: 'Forecast to Profit Plan',
                            
                            padding: '8 10 8 5',
                            bind: {
                                value: '{Measure_FPP}'
                            },
                            itemId: 'FDBMeasure_FPPId'
                        },
                        {
                            xtype: 'checkbox',
                            boxLabel: 'TY to Forecast',
                            
                            padding: '8 10 8 5',
                            bind: {
                                value: '{Measure_TYAF}'
                            },
                            itemId: 'FDBMeasure_TYAFId'
                        },
                        {
                            xtype: 'checkbox',
                            boxLabel: 'TY to LY',
                            
                            padding: '8 10 8 5',
                            bind: {
                                value: '{Measure_TYALYA}'
                            },
                            itemId: 'FDBMeasure_TYALYAId'
                        },
                        {
                            xtype: 'checkbox',
                            boxLabel: 'Profit Plan to LY',
                            
                            padding: '8 10 8 5',
                            bind: {
                                value: '{Measure_PPLYA}'
                            },
                            itemId: 'FDBMeasure_PPLYAId'
                        },
                        {
                            xtype: 'checkbox',
                            
                            boxLabel: 'Profit Forecast to LY',
                            
                            padding: '8 10 8 5',
                            bind: {
                                value: '{Measure_FLYA}'
                            },
                            itemId: 'FDBMeasure_FLYAId'
                        }
                    ]
                },
                {
                    xtype: 'fieldset',
                    title: 'Periods',
                    width: 700,
                    defaults: {
                        width: 100
                    },
                    border: true,
                    layout: {
                        type: 'table',
                        columns: 6,
                        align: 'fit'
                    },
                    items: [
                        {
                            xtype: 'checkbox',
                            
                            boxLabel: 'Daily',
                            
                            padding: '8 10 8 5',
                            bind: {
                                value: '{Period_Daily}'
                            },
                            itemId: 'FDBPeriod_DailyId'
                        },
                        {
                            xtype: 'checkbox',
                            boxLabel: 'WTD',
                            
                            padding: '8 10 8 5',
                            bind: {
                                value: '{Period_WTD}'
                            },
                            itemId: 'FDBPeriod_WTDId'
                        },
                        {
                            xtype: 'checkbox',
                            boxLabel: 'Weekly',
                            
                            padding: '8 10 8 5',
                            bind: {
                                value: '{Period_Weekly}'
                            },
                            itemId: 'FDBPeriod_WeeklyId'
                        },
                        {
                            xtype: 'checkbox',
                            boxLabel: 'MTD',
                            
                            padding: '8 10 8 5',
                            bind: {
                                value: '{Period_MTD}'
                            },
                            itemId: 'FDBPeriod_MTDId'
                        },
                        {
                            xtype: 'checkbox',
                            boxLabel: 'Monthly',
                            
                            padding: '8 10 8 5',
                            bind: {
                                value: '{Period_Monthly}'
                            },
                            itemId: 'FDBPeriod_MonthlyId'
                        },
                        {
                            xtype: 'checkbox',
                            boxLabel: 'Quarterly',
                            
                            padding: '8 10 8 5',
                            bind: {
                                value: '{Period_Quarterly}'
                            },
                            itemId: 'FDBPeriod_QuarterlyId'
                        }

                    ]
                },
                {
                    xtype: 'fieldset',
                    title: 'Period Expense Access',
                    defaults: {
                        width: 120
                    },
                    width: 700,
                    border: true,
                    layout: {
                        type: 'table',
                        columns: 6,
                        align: 'stretch'
                    },
                    items: [
                        {
                            xtype: 'checkbox',
                            boxLabel: 'Daily Cost',
                            
                            padding: '8 10 8 5',
                            bind: {
                                value: '{Daily_Cost}'
                            },
                            itemId: 'FDBDaily_CostId'
                        },
                        {
                            xtype: 'checkbox',
                            boxLabel: 'Daily Expense',
                            
                            padding: '8 10 8 5',
                            bind: {
                                value: '{Expense_Daily}'
                            },
                            itemId: 'FDBExpense_DailyId'
                        },
                        {
                            xtype: 'checkbox',
                            boxLabel: 'Weekly Expense',
                            
                            padding: '8 10 8 5',
                            bind: {
                                value: '{Expense_Weekly}'
                            },
                            itemId: 'FDBExpense_WeeklyId'
                        },
                        {
                            xtype: 'checkbox',
                            boxLabel: 'Monthly Expense',
                            
                            padding: '8 10 8 5',
                            bind: {
                                value: '{Expense_Monthly}'
                            },
                            itemId: 'FDBExpense_MonthlyId'
                        },
                        {
                            xtype: 'checkbox',
                            boxLabel: 'QTD Expense',
                            
                            padding: '8 10 8 5',
                            bind: {
                                value: '{Expense_QTD}'
                            },
                            itemId: 'FDBExpense_QTDId'
                        }
                    ]
                },
                {
                    xtype: 'fieldset',
                    title: 'Period To Date',
                    width: 700,
                    defaults: {
                        width: 120
                    },
                    border: true,
                    layout: {
                        type: 'table',
                        columns: 3,
                        align: 'stretch'
                    },
                    items: [
                        {
                            xtype: 'checkbox',
                            boxLabel: 'WTD',
                            
                            padding: '8 10 8 5',
                            bind: {
                                value: '{ToDate_Week}'
                            },
                            itemId: 'FDBToDate_WeekId'
                        },
                        {
                            xtype: 'checkbox',
                            boxLabel: 'MTD',
                            
                            padding: '8 10 8 5',
                            bind: {
                                value: '{ToDate_Month}'
                            },
                            itemId: 'FDBToDate_MonthId'
                        }
                    ]
                },
                {
                    xtype: 'fieldset',
                    title: 'Reports',
                    width: 700,
                    defaults: {
                        width: 170
                    },
                    border: true,
                    layout: {
                        type: 'table',
                        columns: 4,
                        align: 'stretch'
                    },
                    items: [
                        {
                            xtype: 'checkbox',
                            boxLabel: 'CARS',
                            
                            padding: '8 10 8 5',
                            bind: {
                                value: '{ICON_CarsRange}'
                            },
                            itemId: 'FDBICON_CarsRangeId'
                        },
                        {
                            xtype: 'checkbox',
                            boxLabel: 'Forecast',
                            
                            padding: '8 10 8 5',
                            bind: {
                                value: '{ICON_Forecast}'
                            },
                            itemId: 'FDBICON_ForecastId'
                        },
                        {
                            xtype: 'checkbox',
                            boxLabel: 'Monthly Profit Forecast',
                            
                            padding: '8 10 8 5',
                            bind: {
                                value: '{ICON_MonthlyProfitForecast}'
                            },
                            itemId: 'FDBICON_MonthlyProfitForecastId'
                        },
                        {
                            xtype: 'checkbox',
                            boxLabel: 'VnRWeekly',
                            
                            padding: '8 10 8 5',
                            bind: {
                                value: '{ICON_VnrWeeklypdf}'
                            },
                            itemId: 'FDBICON_VnrWeeklypdfId'
                        },
                        {
                            xtype: 'checkbox',
                            boxLabel: 'VnRDaily',
                            
                            padding: '8 10 8 5',
                            bind: {
                                value: '{ICON_VnrDailypdf}'
                            },
                            itemId: 'FDBICON_VnrDailypdfId'
                        },
                        {
                            xtype: 'checkbox',
                            boxLabel: 'Peak Surcharge',
                            
                            padding: '8 10 8 5',
                            bind: {
                                value: '{ICON_PeakSurcharge}'
                            },
                            itemId: 'FDBICON_PeakSurchargeId'
                        },
                        {
                            xtype: 'checkbox',
                            boxLabel: 'Stat Page',
                            
                            padding: '8 10 8 5',
                            bind: {
                                value: '{ICON_StatPage}'
                            },
                            itemId: 'FDBICON_StatPageId'
                        }
                    ]
                },
                {
                    xtype: 'fieldset',
                    title: 'Callouts',
                    width: 700,
                    defaults: {
                        width: 100
                    },
                    border: true,
                    layout: {
                        type: 'table',
                        columns: 6,
                        align: 'stretch'
                    },
                    items: [
                        {
                            xtype: 'checkbox',
                            boxLabel: 'Daily',
                            
                            padding: '8 10 8 5',
                            bind: {
                                value: '{Callout_Daily}'
                            },
                            itemId: 'FDBCallout_DailyId'
                        },
                        {
                            xtype: 'checkbox',
                            boxLabel: 'WTD',
                            
                            padding: '8 10 8 5',
                            bind: {
                                value: '{Callout_WTD}'
                            },
                            itemId: 'FDBCallout_WTDId'
                        },
                        {
                            xtype: 'checkbox',
                            boxLabel: 'EOW',
                            
                            padding: '8 10 8 5',
                            bind: {
                                value: '{Callout_EOW}'
                            },
                            itemId: 'FDBCallout_EOWId'
                        },
                        {
                            xtype: 'checkbox',
                            boxLabel: 'Weekly',
                            
                            padding: '8 10 8 5',
                            bind: {
                                value: '{Callout_Weekly}'
                            },
                            itemId: 'FDBCallout_WeeklyId'
                        },
                        {
                            xtype: 'checkbox',
                            boxLabel: 'MTD',
                            
                            padding: '8 10 8 5',
                            bind: {
                                value: '{Callout_MTD}'
                            },
                            itemId: 'FDBCallout_MTDId'
                        },
                        {
                            xtype: 'checkbox',
                            boxLabel: 'EOM',
                            
                            padding: '8 10 8 5',
                            bind: {
                                value: '{Callout_EOM}'
                            },
                            itemId: 'FDBCallout_EOMId'
                        },
                        {
                            xtype: 'checkbox',
                            boxLabel: 'Monthly',
                            
                            padding: '8 10 8 5',
                            bind: {
                                value: '{Callout_Monthly}'
                            },
                            itemId: 'FDBCallout_MonthlyId'
                        },
                        {
                            xtype: 'checkbox',
                            boxLabel: 'QTD',
                            
                            padding: '8 10 8 5',
                            bind: {
                                value: '{Callout_QTD}'
                            },
                            itemId: 'FDBCallout_QTDId'
                        },
                        {
                            xtype: 'checkbox',
                            boxLabel: 'EOQ',
                            
                            padding: '8 10 8 5',
                            bind: {
                                value: '{Callout_EOQ}'
                            },
                            itemId: 'FDBCallout_EOQId'
                        }
                    ]
                },
                {
                    xtype: 'fieldset',
                    title: 'Testing Remote',
                    width: 700,
                    defaults: {
                        width: 220
                    },
                    border: true,
                    layout: {
                        type: 'table',
                        columns: 3,
                        align: 'stretch'
                    },
                    items: [
                        {
                            xtype: 'checkbox',
                            boxLabel: 'Testing Remote Access',
                            
                            padding: '8 10 8 5',
                            bind: {
                                value: '{Testing_Remote}'
                            },
                            itemId: 'FDBTesting_RemoteId'
                        },

                        {
                            xtype: 'checkbox',
                            boxLabel: 'Testing Remote Approve/Reject',
                            
                            padding: '8 10 8 5',
                            bind: {
                                value: '{Testing_Approver}'
                            },
                            itemId: 'FDBTesting_ApproverId'
                        },
                        {
                            xtype: 'checkbox',
                            boxLabel: 'Testing Remote Rollback',
                            
                            padding: '8 10 8 5',
                            bind: {
                                value: '{Testing_Rollback}'
                            },
                            itemId: 'FDBTesting_RollbackId'
                        }
                    ]
                }
            ]
        }
    ]


});