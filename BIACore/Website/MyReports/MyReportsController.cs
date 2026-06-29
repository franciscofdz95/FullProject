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

using web = BIACore.Website.Properties;

namespace BIACore.MyReports.Controller
{
    public partial class MyReportsController : BIACore.Web.Controller.BaseController
    {
        public override string Connection
        {
            get { return BIACore.Server.Connections.MyReports; }
        }

        private void ErrorUnauthorized()
        {
            HttpResponse response = HttpContext.Current.Response;
            response.Clear();
            response.ClearContent();
            response.ClearHeaders();
            response.ContentType = "application/json";
            response.StatusCode = 403;
            response.StatusDescription = "User is not logged in.";
            response.End();
            // this will terminate execution on the server, so anything after this point will not be executed.

            // could also try
            //Request.CreateResponse((HttpStatusCode)511, "User is not logged in.");
            // but would need 2 versions, one Task<HttpResponseMessage>, one HttpResponseMessage
        }

        #region Async operations
        private Task<HttpResponseMessage> DeleteFiles(List<MyReport> reports)
        {
            return Task.Factory.StartNew(() =>
            {
                foreach (MyReport report in reports)
                {
                    try
                    {
                        //"myreports.
                        Execute("appObject.Report_Delete",
                            new DBParameter("@ReportId", DbType.Int32, report.ReportId.Value));

                        if (!string.IsNullOrWhiteSpace(report.FileName))
                        {
                            /*
                            FtpWebRequest ftp = Statics.FTPRequest(report.FileName);
                            ftp.Method = WebRequestMethods.Ftp.DeleteFile;
                            using (FtpWebResponse response = (FtpWebResponse)ftp.GetResponse()) { }
                            */
                            BIACore.Utility.FTP.DeleteFile(report.FileName);
                        }
                    }
                    catch { }
                }
                return new HttpResponseMessage(HttpStatusCode.OK);
            });
        }

        private Task<HttpResponseMessage> SendFile(string filename)
        {
            return Task.Factory.StartNew(() =>
            {
                try
                {
                    /*
                    FtpWebRequest ftp = Statics.FTPRequest(filename);
                    ftp.Method = WebRequestMethods.Ftp.DownloadFile;

                    // as tempting as it is, don't use a 'using' here.
                    // the HttpResponseMessage will clean up for us.
                    FtpWebResponse file = (FtpWebResponse)ftp.GetResponse();
                    */
                    MemoryStream file = BIACore.Utility.FTP.GetFile(filename);

                    HttpResponseMessage response = new HttpResponseMessage(HttpStatusCode.OK);
                    response.Content = new StreamContent(file);
                    response.Content.Headers.ContentType = new MediaTypeHeaderValue("application/octet-stream");
                    response.Content.Headers.ContentDisposition = new ContentDispositionHeaderValue("attachment");
                    response.Content.Headers.ContentDisposition.FileName = filename;
                    // Fix IE download issue over SSL with caching enabled.
                    response.Headers.CacheControl = new CacheControlHeaderValue() { Private = true, MaxAge = new TimeSpan(0, 0, 0, 1) };
                    response.Headers.Add("Pragma", "token");

                    return response;
                }
                catch (Exception ex)
                {
                    return new HttpResponseMessage(HttpStatusCode.InternalServerError)
                    {
                        Content = new StringContent(ex.Message, Encoding.UTF8, "text/plain")
                    };
                }
            });
        }
        #endregion

        private bool ExportEnabled(string AppCode)
        {
            //"myreports.
            return LoadSingle<dynamic>("appObject.Agent_Status",
                new DBParameter("@AppCode", DbType.AnsiString, AppCode)).Enabled ?? false;
        }
    }
}