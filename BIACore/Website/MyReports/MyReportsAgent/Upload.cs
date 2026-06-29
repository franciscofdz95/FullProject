using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

using System.IO;
using System.Net;
using System.Net.Http;
using System.Threading.Tasks;
using System.Web.Http;

using BIACore.Model;

namespace BIACore.MyReports.Controller
{
    public partial class MyReportsAgentController
    {
        [HttpPost]
        [ActionName("Upload")]
        public Task<HttpResponseMessage> Upload(int ReportId)
        {
            MyReport report = Statics.GetReport(ReportId);
            if (null == report)
                return Statics.Error(HttpStatusCode.InternalServerError, "Specified report does not exist");

            return ReceiveFile(report);
        }
    }
}