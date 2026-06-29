Ext.define('App.Controller.EA.EAFDB', {
    extend: 'Ext.app.Controller',
    refs: [
        { ref: 'EAFDBPanel', selector: 'App-View-EA-EAFDB' }
    ],
    init: function init() {
        this.control({
            'App-View-EA-EAFDB': {
                show: this.LoadEAFDBData
            },
            'App-View-EA-EAFDB #btnEASave': {
                click: this.EAFDBSaveClick
            }
        })
    },

    LoadEAFDBData: function LoadEAFDBData(me, eOpts) {

        let loginId = me.up('window').access.LoginId;
        let tmpStore = me.config.CommonAjaxCall('api/BIASecurity/EATableRead', { TableName: 'FDB', 'BIA_ID': loginId });
        me.getViewModel().getData()['BIA_ID'] = loginId;
        if (tmpStore.success) {
            if (tmpStore.data.length > 0) {
                me.getViewModel().setData(tmpStore.data[0]);
            }
            else {
                me.getViewModel().getData()['BIA_ID'] = loginId;
            }
        }

    },
    
    EAFDBSaveClick: function SaveClick(me) {
        
        if (!me.up('form').isValid()) {
            Ext.MessageBox.alert('Error', 'Please enter valid characters.');
            return false;
        }


        let loginId = me.up('window').access.LoginId;
        let pnl = this.getActiveEAFDBPanel();

        if (pnl.down('#FDBDataAvailabilityId').getValue() == "") {
            Ext.MessageBox.alert('Error', 'Please select Data Availability Level.');
            return false;
        }

        if (!['FDB', 'Financial_Dash'].includes(pnl.down('#FDBStartAppCodeId').getValue())) {
            Ext.MessageBox.alert('Error', 'Please select correct Start App Code.');
            return false;
        }

        if (!['A','F'].includes(pnl.down('#FDBDataAvailabilityId').getValue())) {
            Ext.MessageBox.alert('Error', 'Please select correct Data Availability Level.');
            return false;
        }


        let req = {
            BIA_ID: loginId,
            StartAppCode: pnl.down('#FDBStartAppCodeId').getValue(),
            CostView: pnl.down('#FDBCostViewId').getValue(),
            WhatIfView: pnl.down('#FDBWhatIfViewId').getValue(),
            ViewPeak: pnl.down('#FDBViewPeakId').getValue(),

            Card_ProfitLoss: pnl.down('#FDBCard_ProfitLossId').getValue(),
            Card_PL_Impacting: pnl.down('#FDBCard_PL_ImpactingId').getValue(),
            Card_RevenueVariance: pnl.down('#FDBCard_RevenueVarianceId').getValue(),
            Card_ProductBreakdown: pnl.down('#FDBCard_ProductBreakdownId').getValue(),
            Card_ExpenseVariance: pnl.down('#FDBCard_ExpenseVarianceId').getValue(),
            Card_PerformanceBreakdown: pnl.down('#FDBCard_PerformanceBreakdownId').getValue(),

            Measure_TYAPP: pnl.down('#FDBMeasure_TYAPPId').getValue(),
            Measure_FPP: pnl.down('#FDBMeasure_FPPId').getValue(),
            Measure_TYAF: pnl.down('#FDBMeasure_TYAFId').getValue(),
            Measure_TYALYA: pnl.down('#FDBMeasure_TYALYAId').getValue(),
            Measure_PPLYA: pnl.down('#FDBMeasure_PPLYAId').getValue(),
            Measure_FLYA: pnl.down('#FDBMeasure_FLYAId').getValue(),

            Period_Daily: pnl.down('#FDBPeriod_DailyId').getValue(),
            Period_WTD: pnl.down('#FDBPeriod_WTDId').getValue(),
            Period_Weekly: pnl.down('#FDBPeriod_WeeklyId').getValue(),
            Period_MTD: pnl.down('#FDBPeriod_MTDId').getValue(),
            Period_Monthly: pnl.down('#FDBPeriod_MonthlyId').getValue(),
            Period_Quarterly: pnl.down('#FDBPeriod_QuarterlyId').getValue(),

            ToDate_Week: pnl.down('#FDBToDate_WeekId').getValue(),
            ToDate_Month: pnl.down('#FDBToDate_MonthId').getValue(),

            DataAvailability: pnl.down('#FDBDataAvailabilityId').getValue(),
            Testing_Remote: pnl.down('#FDBTesting_RemoteId').getValue(),
            Testing_Approver: pnl.down('#FDBTesting_ApproverId').getValue(),
            Testing_Rollback: pnl.down('#FDBTesting_RollbackId').getValue(),
            Expense_Daily: pnl.down('#FDBExpense_DailyId').getValue(),
            Expense_Weekly: pnl.down('#FDBExpense_WeeklyId').getValue(),
            Expense_Monthly: pnl.down('#FDBExpense_MonthlyId').getValue(),
            Expense_QTD: pnl.down('#FDBExpense_QTDId').getValue(),

            Callout_Daily: pnl.down('#FDBCallout_DailyId').getValue(),
            Callout_WTD: pnl.down('#FDBCallout_WTDId').getValue(),
            Callout_EOW: pnl.down('#FDBCallout_EOWId').getValue(),
            Callout_Weekly: pnl.down('#FDBCallout_WeeklyId').getValue(),
            Callout_Monthly: pnl.down('#FDBCallout_MonthlyId').getValue(),
            Callout_MTD: pnl.down('#FDBCallout_MTDId').getValue(),
            Callout_EOM: pnl.down('#FDBCallout_EOMId').getValue(),
            Callout_QTD: pnl.down('#FDBCallout_QTDId').getValue(),
            Callout_EOQ: pnl.down('#FDBCallout_EOQId').getValue(),

            ICON_CarsRange: pnl.down('#FDBICON_CarsRangeId').getValue(),
            ICON_Forecast: pnl.down('#FDBICON_ForecastId').getValue(),
            ICON_MonthlyProfitForecast: pnl.down('#FDBICON_MonthlyProfitForecastId').getValue(),
            ICON_VnrWeeklypdf: pnl.down('#FDBICON_VnrWeeklypdfId').getValue(),
            ICON_VnrDailypdf: pnl.down('#FDBICON_VnrDailypdfId').getValue(),
            ICON_PeakSurcharge: pnl.down('#FDBICON_PeakSurchargeId').getValue(),
            ICON_StatPage: pnl.down('#FDBICON_StatPageId').getValue(),
            WhatIf_NRPP: pnl.down('#FDBWhatIf_NRPPId').getValue(),
            Daily_Cost: pnl.down('#FDBDaily_CostId').getValue()
           
            
        };


        let resp = pnl.config.CommonAjaxCall('api/BIASecurity/SaveFDB', req);
        if (resp) {
            if (resp.success === true) {
                me.up('window').close();
                Ext.MessageBox.alert('Success', 'Extended attributes updated successfully');
            } else {
                Ext.MessageBox.alert('Error', 'Extended attributes not updated.');
            }
        }
    }
});