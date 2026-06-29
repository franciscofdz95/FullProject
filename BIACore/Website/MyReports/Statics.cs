using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

using System.Data;
using System.IO;
using System.Net;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Text;
using System.Threading.Tasks;

using BIACore.Model;
using BIACore.Provider;

using web = BIACore.Website.Properties;

namespace BIACore.MyReports
{
    internal class Statics
    {
        [Obsolete]
        internal static FtpWebRequest FTPRequest(string filename)
        {
            FtpWebRequest request = (FtpWebRequest)FtpWebRequest.Create(web.Settings.Default.MyReportsPath + filename);
            request.Proxy = null;
            request.Credentials = new NetworkCredential(web.Settings.Default.MyReportsUser, web.Settings.Default.MyReportsPass);
            request.UsePassive = true;
            request.UseBinary = true;
            request.KeepAlive = false;
            return request;
        }

        internal static Task<HttpResponseMessage> Error(HttpStatusCode code, string message)
        {
            return new Task<HttpResponseMessage>(() =>
                    new HttpResponseMessage(code)
                    {
                        ReasonPhrase = message
                    });
        }

        internal static MyReport GetReport(int ReportId)
        {
            //"myreports.
            List<MyReport> result = SQL.Execute<MyReport>(
                BIACore.Server.Connections.MyReports,
                "appObject.Report_ById",
                new DBParameter("@ReportId", DbType.Int32, ReportId));

            return (result.Count > 0) ? result[0] : null;
        }
    }
}