using BIACore.Model;
using BIACore.Web.Model;
using BIASecurity.WebAPI.Model;
using System.Data;
using System.Web.Http;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;

namespace BIASecurity.WebAPI.Controller
{
    public partial class BIASecurityController
    {
        [HttpPost]
        [ActionName("PostBriefByUserId")]
        public ClientResult PostBriefByUserId([FromBody] EABrief request)
        {
            return LoadClientResult("[appObject].[BIASecurity_EA_Brief]", request.ToDBParameter());
        }
        [HttpPost]
        [ActionName("PostBriefByUserId1")]
        public ClientResult PostBriefByUserId1([FromBody] dynamic request)
        {
            string[] DBParamNames = request["DBParamNames"].ToObject<string[]>();
            //string[] DBParamObj = request["DBParamObj"].ToObject<string[]>();
            //request["DBParamNames"][0].Value
            //request["DBParamObj"][request["DBParamNames"][1].Value].Value
            List<DBParameter> args = new List<DBParameter>();
            foreach (string i in DBParamNames)
            {
                string prm = "@" + i;
                string val = request["DBParamObj"][i].Value;
                if (i != "BIA_ID")
                    val = !String.IsNullOrEmpty(val) ? val : "NO";

                args.Add(new DBParameter(prm, DbType.AnsiString, val));

            };

            return LoadClientResult("[appObject].[BIASecurity_EA_Brief]", args.ToArray());
        }

        [HttpPost]
        [ActionName("PostCVBATByUserId")]
        public ClientResult PostCVBATByUserId([FromBody] EACVBAT request)
        {
            return LoadClientResult("[appObject].[BIA_BiaSecurity_EA_CVBAT_UPDATE_INSERT]", request.ToDBParameter());
        }

        [HttpPost]
        [ActionName("SaveACIP")]
        public ClientResult SaveACIP([FromBody] EAACIP request)
        {
            //request.TableName = "appData.BIASecurity_EA_ACIP";
            if (request.BIA_ID != null)
                return LoadClientResult("[appObject].[BIA_BiaSecurity_EA_ACIP_UPDATE_INSERT]", request.ToDBParameter());
            else throw new HttpResponseException(System.Net.HttpStatusCode.PreconditionFailed);
        }

        [HttpPost]
        [ActionName("SaveFLG")]
        public ClientResult SaveFLG([FromBody] EAFLG request)
        {
            //request.TableName = "appData.BIASecurity_EA_FLG";
            if (request.BIA_ID != null)
                return LoadClientResult("[appObject].[BIA_BiaSecurity_EA_FLG_UPDATE_INSERT]", request.ToDBParameter());
            else throw new HttpResponseException(System.Net.HttpStatusCode.PreconditionFailed);
        }

        [HttpPost]
        [ActionName("SaveGCPR")]
        public ClientResult SaveGCPR([FromBody] dynamic request)
        {
            request.TableName = "appData.BIASecurity_EA_GCPR_Mart";
            if (request.BIA_ID != null)
            {
                return LoadClientResult("[appObject].[BIA_BiaSecurity_EA_GCPR_Mart_UPDATE_INSERT]",
                    new DBParameter("@EA_IndustrySegmentation", DbType.AnsiString, request.EA_IndustrySegmentation != null ? request.EA_IndustrySegmentation.Value : null),
                   new DBParameter("@EA_FinancialSegmentation", DbType.AnsiString, request.EA_FinancialSegmentation != null ? request.EA_FinancialSegmentation.Value : null),
                    new DBParameter("@BIA_ID", DbType.AnsiString, request.BIA_ID.Value));
            }
            else throw new HttpResponseException(System.Net.HttpStatusCode.PreconditionFailed);
        }

        [HttpPost]
        [ActionName("SaveRegGoods")]
        public ClientResult SaveRegGoods([FromBody] EARegGoods request)
        {
            request.TableName = "appData.BIASecurity_EA_RegulatedGoods";
            if (request.BIA_ID != null)
                return LoadClientResult("[appObject].[BIA_BiaSecurity_EA_REGGOODS_UPDATE_INSERT]", request.ToDBParameter());
            else throw new HttpResponseException(System.Net.HttpStatusCode.PreconditionFailed);
        }

        [HttpPost]
        [ActionName("SaveWVAR")]
        public ClientResult SaveWVAR([FromBody] EAWVAR request)
        {
            request.TableName = "appData.BIASecurity_EA_WVAR";
            if (request.BIA_ID != null)
                return LoadClientResult("[appObject].[BIA_BiaSecurity_EA_WVAR_UPDATE_INSERT]", request.ToDBParameter());
            else throw new HttpResponseException(System.Net.HttpStatusCode.PreconditionFailed);
        }

        [HttpPost]
        [ActionName("SaveSvcMapping")]
        public ClientResult SaveSvcMapping([FromBody] dynamic request)
        {
            request.TableName = "appData.BIASecurity_EA_Svc_Mapping";
            if (request.BIA_ID != null)
            {
                return LoadClientResult("[appObject].[BIA_BiaSecurity_EA_SVCMapping_UPDATE_INSERT]",
                    new DBParameter("@EA_ISSGSUSER", DbType.Byte, request.EA_ISSGSUSER != null ? request.EA_ISSGSUSER.Value : null),
                    new DBParameter("@BIA_ID", DbType.AnsiString, request.BIA_ID.Value));
            }
            else throw new HttpResponseException(System.Net.HttpStatusCode.PreconditionFailed);
        }

        [HttpPost]
        [ActionName("SaveOCM")]
        public ClientResult SaveOCM([FromBody] dynamic request)
        {
            request.TableName = "appData.BIASecurity_EA_OCM";
            if (request.BIA_ID != null)
            {
                return LoadClientResult("[appObject].[BIA_BiaSecurity_EA_OCM_UPDATE_INSERT]",
                    new DBParameter("@ea_AccessType", DbType.AnsiString, request.ea_AccessType != null ? request.ea_AccessType.Value : null),
                    new DBParameter("@ea_AdminAccess", DbType.AnsiString, request.ea_AdminAccess != null ? request.ea_AdminAccess.Value : null),
                    new DBParameter("@BIA_ID", DbType.AnsiString, request.BIA_ID.Value));
            }
            else throw new HttpResponseException(System.Net.HttpStatusCode.PreconditionFailed);
        }

        [HttpPost]
        [ActionName("SaveMyReports")]
        public ClientResult SaveMyReports([FromBody] dynamic request)
        {
            request.TableName = "appData.BIASecurity_EA_MyReports";
            if (request.BIA_ID != null)
            {
                return LoadClientResult("[appObject].[BIA_BiaSecurity_EA_MyReports_UPDATE_INSERT]",
                    new DBParameter("@AccessAdmin", DbType.Byte, request.AccessAdmin != null ? request.AccessAdmin.Value : null),
                    new DBParameter("@BIA_ID", DbType.AnsiString, request.BIA_ID.Value));
            }
            else throw new HttpResponseException(System.Net.HttpStatusCode.PreconditionFailed);
        }

        [HttpPost]
        [ActionName("SaveCTP")]
        public ClientResult SaveCTP([FromBody] dynamic request)
        {
            request.TableName = "appData.BIASecurity_EA_CTP";
            if (request.BIA_ID != null)
            {
                return LoadClientResult("[appObject].[BIA_BiaSecurity_EA_CTP_UPDATE_INSERT]",
                     new DBParameter("@BIA_ID", DbType.AnsiString, request.BIA_ID.Value),
                    new DBParameter("@AccessGroupID", DbType.Byte, request.AccessGroupID != null ? request.AccessGroupID.Value : null),
                    new DBParameter("@FreightDistrict", DbType.AnsiString, request.FreightDistrict != null ? request.FreightDistrict.Value : "")
                   );
            }
            else throw new HttpResponseException(System.Net.HttpStatusCode.PreconditionFailed);
        }

        [HttpPost]
        [ActionName("SaveRevRec")]
        public ClientResult SaveRevRec([FromBody] dynamic request)
        {
            if (request.BIA_ID != null)
            {
                return LoadClientResult("[appObject].[BIA_BiaSecurity_EA_RevRec_UPDATE_INSERT]",
                    new DBParameter("@BIA_ID", DbType.AnsiString, request.BIA_ID.Value),
                    new DBParameter("@Admin", DbType.AnsiString, request.Admin.Value),
                    new DBParameter("@DD", DbType.AnsiString, request.DD.Value),
                    new DBParameter("@RR", DbType.AnsiString, request.RR.Value));
            }
            else throw new HttpResponseException(System.Net.HttpStatusCode.PreconditionFailed);
        }
        [HttpPost]
        [ActionName("SaveFDB")]
        public ClientResult SaveFDB([FromBody] dynamic request)
        {
            if (request.BIA_ID != null)
            {
                return LoadClientResult("[appObject].[usp_EA_FDB_PL]",
                    new DBParameter("@BIA_ID", DbType.AnsiString, request.BIA_ID.Value),
                    new DBParameter("@StartAppCode ", DbType.AnsiString, request.StartAppCode.Value),
                    new DBParameter("@CostView ", DbType.AnsiString, request.CostView.Value),
                    new DBParameter("@WhatIfView ", DbType.AnsiString, request.WhatIfView.Value),
                    new DBParameter("@ViewPeak", DbType.AnsiString, request.ViewPeak.Value),

                    new DBParameter("@Card_ProfitLoss", DbType.AnsiString, request.Card_ProfitLoss.Value),
                    new DBParameter("@Card_PL_Impacting ", DbType.AnsiString, request.Card_PL_Impacting.Value),
                    new DBParameter("@Card_RevenueVariance ", DbType.AnsiString, request.Card_RevenueVariance.Value),
                    new DBParameter("@Card_ProductBreakdown", DbType.AnsiString, request.Card_ProductBreakdown.Value),
                    new DBParameter("@Card_ExpenseVariance", DbType.AnsiString, request.Card_ExpenseVariance.Value),
                    new DBParameter("@Card_PerformanceBreakdown", DbType.AnsiString, request.Card_PerformanceBreakdown.Value),


                    new DBParameter("@Measure_TYAPP", DbType.AnsiString, request.Measure_TYAPP.Value),
                    new DBParameter("@Measure_FPP", DbType.AnsiString, request.Measure_FPP.Value),
                    new DBParameter("@Measure_TYAF", DbType.AnsiString, request.Measure_TYAF.Value),
                    new DBParameter("@Measure_TYALYA", DbType.AnsiString, request.Measure_TYALYA.Value),
                    new DBParameter("@Measure_PPLYA", DbType.AnsiString, request.Measure_PPLYA.Value),
                    new DBParameter("@Measure_FLYA", DbType.AnsiString, request.Measure_FLYA.Value),

                    new DBParameter("@Period_Daily", DbType.AnsiString, request.Period_Daily.Value),
                    new DBParameter("@Period_WTD", DbType.AnsiString, request.Period_WTD.Value),
                    new DBParameter("@Period_Weekly", DbType.AnsiString, request.Period_Weekly.Value),
                    new DBParameter("@Period_MTD", DbType.AnsiString, request.Period_MTD.Value),
                    new DBParameter("@Period_Monthly", DbType.AnsiString, request.Period_Monthly.Value),
                    new DBParameter("@Period_Quarterly", DbType.AnsiString, request.Period_Quarterly.Value),

                    new DBParameter("@ToDate_Week", DbType.AnsiString, request.ToDate_Week.Value),
                    new DBParameter("@ToDate_Month", DbType.AnsiString, request.ToDate_Month.Value),

                    new DBParameter("@DataAvailability", DbType.AnsiString, request.DataAvailability.Value),
                    new DBParameter("@Testing_Remote", DbType.AnsiString, request.Testing_Remote.Value),
                    new DBParameter("@Testing_Approver", DbType.AnsiString, request.Testing_Approver.Value),
                    new DBParameter("@Testing_Rollback", DbType.AnsiString, request.Testing_Rollback.Value),
                    new DBParameter("@Expense_Daily", DbType.AnsiString, request.Expense_Daily.Value),
                    new DBParameter("@Expense_Weekly", DbType.AnsiString, request.Expense_Weekly.Value),
                    new DBParameter("@Expense_Monthly", DbType.AnsiString, request.Expense_Monthly.Value),
                    new DBParameter("@Expense_QTD", DbType.AnsiString, request.Expense_QTD.Value),

                    new DBParameter("@Callout_Daily", DbType.AnsiString, request.Callout_Daily.Value),
                    new DBParameter("@Callout_WTD", DbType.AnsiString, request.Callout_WTD.Value),
                    new DBParameter("@Callout_EOW", DbType.AnsiString, request.Callout_EOW.Value),
                    new DBParameter("@Callout_Weekly", DbType.AnsiString, request.Callout_Weekly.Value),
                    new DBParameter("@Callout_Monthly", DbType.AnsiString, request.Callout_Monthly.Value),
                    new DBParameter("@Callout_MTD", DbType.AnsiString, request.Callout_MTD.Value),
                    new DBParameter("@Callout_EOM", DbType.AnsiString, request.Callout_EOM.Value),
                    new DBParameter("@Callout_QTD", DbType.AnsiString, request.Callout_QTD.Value),
                    new DBParameter("@Callout_EOQ", DbType.AnsiString, request.Callout_EOQ.Value),

                    new DBParameter("@ICON_CarsRange", DbType.AnsiString, request.ICON_CarsRange.Value),
                    new DBParameter("@ICON_Forecast", DbType.AnsiString, request.ICON_Forecast.Value),
                    new DBParameter("@ICON_MonthlyProfitForecast", DbType.AnsiString, request.ICON_MonthlyProfitForecast.Value),
                    new DBParameter("@ICON_VnrWeeklypdf", DbType.AnsiString, request.ICON_VnrWeeklypdf.Value),
                    new DBParameter("@ICON_VnrDailypdf", DbType.AnsiString, request.ICON_VnrDailypdf.Value),
                    new DBParameter("@ICON_PeakSurcharge", DbType.AnsiString, request.ICON_PeakSurcharge.Value),
                    new DBParameter("@ICON_StatPage", DbType.AnsiString, request.ICON_StatPage.Value),
                    new DBParameter("@WhatIf_NRPP", DbType.AnsiString, request.WhatIf_NRPP.Value),
                    new DBParameter("@Daily_Cost", DbType.AnsiString, request.Daily_Cost.Value));

            }
            else throw new HttpResponseException(System.Net.HttpStatusCode.PreconditionFailed);
        }
    }

}
