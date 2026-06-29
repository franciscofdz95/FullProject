using BIACore.Model;
using BIACore.Web.Model;
using BIACore.Web.Model.MyReports;
using System;
using System.Collections.Generic;
using System.Data;
using System.Web.Http;
using biasec = BIACore.Security;
using extjs = BIACore.Web.Model.ExtJS;


namespace BIACore.Web.Controller
{
    public abstract partial class MyReportsController
    {
        [HttpPost]
        [ActionName("MyReports")]
        public ClientResult MyReports([FromBody] dynamic request)
        {
            // ignoring filterUserId in favor of sending search string as userId iff isSA().
            List<Report> result = LoadResult<Report>("appObject.MyReportsGetReportByAppNameAndStatus",
                new DBParameter("@AppName", DbType.AnsiString, BIACore.Settings.Config.AppCode),
                new DBParameter("@Processing", DbType.Boolean, false),
                // filters
                new DBParameter("@UserId", DbType.AnsiString, biasec.User.isSA ? request.UserId.Value : biasec.User.userId),
                //new DBParameter("@FilterUserID", DbType.AnsiString, filterUser),
                new DBParameter("@ROIName", DbType.AnsiString, (request.Type == null) ? null : request.Type.Value),
                new DBParameter("@Time", DbType.DateTime, parseDate(request.Date)),
                new DBParameter("@Status", DbType.AnsiString, (request.Status == null) ? null : request.Status.Value),
                // paging
                new DBParameter("@StartRowNumber", DbType.Int32, (request.start == null) ? null : request.start.Value),
                new DBParameter("@RowCountLimit", DbType.Int32, (request.limit == null) ? null : request.limit.Value));

            // until this SP works with the standard LoadPagedClientResult, we fake it.
            return new extjs.StoreResult<Report>()
            {
                Data = result,
                MetaData = new extjs.MetaData(typeof(Report)),
                Total = (result.Count == 0) ? 0 : result[0].ReturnedRowCount
            };
        }

        private DateTime? parseDate(dynamic date)
        {
            string param = (date == null) ? string.Empty : date.Value;
            switch (param.ToLower())
            {
                case "lastfiveminutes": return DateTime.Now.AddMinutes(-5);
                case "lastthirtyminutes": return DateTime.Now.AddMinutes(-30);
                case "lasthour": return DateTime.Now.AddHours(-1);
                case "today": return DateTime.Now.Date;
                case "yesterday": return DateTime.Now.Date.AddDays(-1);
                case "lastweek": return DateTime.Now.Date.AddDays(-7);
                default: return null;
            }
        }
    }
}
