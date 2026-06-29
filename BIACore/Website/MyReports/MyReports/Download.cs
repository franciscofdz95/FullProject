using System;
using System.Collections.Generic;
using System.Linq;

using System.Net;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Text;
using System.Threading.Tasks;
using System.Web;
using System.Web.Http;

using BIACore.Model;
using BIACore.Server;

namespace BIACore.MyReports.Controller
{
    public partial class MyReportsController
    {
        [HttpPost]
        [ActionName("Download")]
        public Task<HttpResponseMessage> Download(string TokenLocal, string AppCode, int ReportId)
        {
            // normally I would use Error() and Error511(),
            // but since we're called from a special browser 'form'
            // we need to ensure our response is browser-correct,
            // and not json-encoded (which would cause a download
            // of json - and that's just bad).

            // verify the Session/App/User
            User user = Cached.User(CurrentContext.GetSessionId(new { TokenLocal = TokenLocal }), null, AppCode);
            if (null == user)
                return new Task<HttpResponseMessage>(() =>
                    new HttpResponseMessage(HttpStatusCode.Forbidden)
                    {
                        Content = new StringContent("Download not successful.", Encoding.UTF8, "text/plain")
                    });

            // get the requested report info.
            MyReport report = Statics.GetReport(ReportId);
            if (null == report // does not exist
                || string.IsNullOrWhiteSpace(report.FileName) // does not exist
                || !(Rules.User.isAdmin(user) // admin
                    || string.Equals(report.UserId, user.userId, StringComparison.InvariantCultureIgnoreCase) // owner
                    )
                )
                return new Task<HttpResponseMessage>(() =>
                    new HttpResponseMessage(HttpStatusCode.Forbidden)
                    {
                        Content = new StringContent("Download not successful.", Encoding.UTF8, "text/plain")
                    });

            return SendFile(report.FileName);
        }
    }
}