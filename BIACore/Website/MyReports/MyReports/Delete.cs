using System;
using System.Collections.Generic;
using System.Data;

using System.Net;
using System.Net.Http;
using System.Threading.Tasks;
using System.Web;
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
        [ActionName("Delete")]
        public Task<HttpResponseMessage> Delete(string TokenLocal, string AppCode, [FromBody] dynamic[] request)
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

            return DeleteFiles(reports);
        }
    }
}
