
//Ext.define('App.view.store.InvoiceDetail', {
//    extend: 'Ext.data.Model',

//    fields: [
//        { name: 'AE_ID' },
//        { name: 'AE_Name' },
//        { name: 'ASM_ID' },
//        { name: 'ASM_Name' },
//        { name: 'AWFAC' },
//        { name: 'AWNR' },
//        { name: 'AWPG' },
//        { name: 'AWV' },
//        { name: 'ActionStatus' },
//        { name: 'ActionStatusID' },
//        { name: 'ActionType' },
//        { name: 'ActionTypeID' },
//        { name: 'Analyst_Employee_ID' },
//        { name: 'AnnualFAContirbution' },
//        { name: 'AnnualNetRev' },
//        { name: 'AnnualProfitGap' },
//        { name: 'AnnualVol' },
//        { name: 'CPMCustomer' },
//        { name: 'CPMEvalDate' },
//        { name: 'CPMRiskLevel' },
//        { name: 'CPMStageID' },
//        { name: 'CPMStartDate' },
//        { name: 'CPMTarget' },
//        { name: 'CurrentCustomerNumber' },
//        { name: 'CustomerName' },
//        { name: 'CustomerSummary' },
//        { name: 'Customer_Number' },
//        { name: 'DD' },
//        { name: 'District' },
//        { name: 'Country_Cd' },
//		{ name: 'Country_Name' },
//        { name: 'EndDate' },
//        { name: 'FA_OR' },
//        { name: 'FirstReviewDate' },
//        { name: 'Geo_LR_ORCeiling' },
//        { name: 'Geo_LR_ORFloor' },
//        { name: 'HasActionPlan' },
//        { name: 'HasStatus' },
//        { name: 'IndustrySegment' },
//        { name: 'IndustrySegmentID' },
//        { name: 'LR_OR' },
//        { name: 'Lead' },
//        { name: 'M3Segment' },
//        { name: 'M3SegmentID', type: 'int' },
//        { name: 'MostRecentStatus' },
//        { name: 'NextStageDate' },
//        { name: 'PeerGroup' },
//        { name: 'Proactive_Reactive' },
//        { name: 'RR' },
//        { name: 'Region' },
//        { name: 'ReviewDate' },
//        { name: 'RootCauseKeyDrivers' },
//        { name: 'StageName' },
//        { name: 'StartDate' },
//        { name: 'SuccessStory' },
//        { name: 'TotalPending' },
//        { name: 'TotalProducing' },
//        { name: 'MostRecentStatus' },
//        { name: 'InternalUpdate' },
//        { name: 'WCPMCount' },
//        { name: 'NonWCPMCount' },
//        { name: 'SiteCount' },
//        { name: 'IsFavorite' },
//        { name: 'ActionCount' },
//        { name: 'StatusCount' }

//    ],
//    proxy: new Ext.create("jslib.AspWebAjaxProxy", {
//        //url: '',
//        reader: {
//            type: 'json',
//            root: 'd.rows',
//            successProperty: 'd.success',
//            totalProperty: 'd.results'
//        }

//    })
//});



//Ext.define('App.view.store.InvoiceDetail', {
//    extend: 'Ext.data.Store',
//    id: 'Invoicedetail',
//    model: 'App.view.store.InvoiceDetail',
//    alias: 'store.InvoiceDetail',
//    autoLoad: false,
//    loadWithParameters: function (yearMonth, customer_Number, internalUpdate) {
//        internalUpdate = (typeof internalUpdate === "undefined") ? false : internalUpdate;
//        this.getProxy().url = 'api/WebAPIReport/InvoiceChargesDetails';
//         this.load({
//            params: {
//                YearMonth: yearMonth,
//                Customer_Number: customer_Number,
//                InternalUpdate: internalUpdate
//            }
//        });
//    }
//});

