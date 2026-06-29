using System;
using System.Collections.Generic;
using System.Data;

using System.Net;
using System.Net.Http;
using System.Web.Http;
using BIACore.Model;
using BIACore.Web.Model;
using extjs = BIACore.Web.Model.ExtJS;

using biasec = BIACore.Security;

using BIACore.Server;

namespace BIACore.MyReports.Controller
{
    public partial class MyReportsController
    {
        [HttpPost]
        [ActionName("Retry")]
        public HttpResponseMessage Retry(string TokenLocal, string AppCode, [FromBody] dynamic[] request)
        {
            User user = Cached.User(CurrentContext.GetSessionId(new { TokenLocal = TokenLocal }), null, AppCode);
            if (null == user) ErrorUnauthorized();

            List<MyReport> reports = new List<MyReport>();

            foreach (dynamic item in request)
            {
                if (item.ReportId == null) continue;

                MyReport report = Statics.GetReport((int)item.ReportId.Value);
                if (null == report) continue;

                if (string.Equals(report.UserId, user.userId, StringComparison.InvariantCultureIgnoreCase)
                    || Rules.User.isAdmin(user))
                {
                    reports.Add(report);
                }
            }

            int success = 0;
            foreach (MyReport report in reports)
            {
                try
                {
                    //"myreports.
                    Execute("appObject.Report_Update",
                        new DBParameter("@ReportId", DbType.Int32, report.ReportId.Value),
                        new DBParameter("@Status", DbType.AnsiString, "Q"),
                        new DBParameter("@Comments", DbType.AnsiString, "Requeued for processing"));
                    ++success;
                }
                catch { }
            }

            return Request.CreateResponse(HttpStatusCode.OK, new { Success = (reports.Count == success), Message = string.Format("{0} reports requeued.", success) });
        }
    }
}
