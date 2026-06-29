using BIACore.Model;
using BIACore.Web.Model.MyReports;
using System;
using System.Data;
using System.IO;
using System.Net;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Web.Http;
using biasec = BIACore.Security;


namespace BIACore.Web.Controller
{
    public abstract partial class MyReportsController
    {
        /// <summary>
        /// BIACore.Web.Controller.Download(int?) method for downloading MyReports files.
        /// </summary>
        [HttpPost]
        [ActionName("Download")]
        public HttpResponseMessage Download(int? Id)
        {
            Report item = LoadSingle<Report>("appObject.MyReportsGetByMyReportsId",
                new DBParameter("@ReportId", DbType.Int32, (null != Id) ? Id.Value : 0));

            if (item == null) return new HttpResponseMessage(HttpStatusCode.InternalServerError);

            if (!biasec.User.isSA && biasec.User.userId != item.UserId) return new HttpResponseMessage(HttpStatusCode.InternalServerError);

            try
            {

                /*
                if (string.IsNullOrWhiteSpace(BIACore.Settings.Agent.FtpPath)) throw new ArgumentNullException("ftpPath", "Missing configuration element biacore->agent->ftpPath");
                if (string.IsNullOrWhiteSpace(BIACore.Settings.Agent.FtpUser)) throw new ArgumentNullException("ftpUser", "Missing configuration element biacore->agent->ftpUser");
                if (string.IsNullOrWhiteSpace(BIACore.Settings.Agent.FtpPass)) throw new ArgumentNullException("ftpPass", "Missing configuration element biacore->agent->ftpPass");

                if (string.IsNullOrWhiteSpace(item.FileName)) throw new ArgumentException("filename", "No file to download");

                FtpWebRequest ftp = (FtpWebRequest)FtpWebRequest.Create(BIACore.Settings.Agent.FtpPath + item.FileName);
                ftp.Method = WebRequestMethods.Ftp.DownloadFile;
                ftp.Proxy = null;
                ftp.Credentials = new NetworkCredential(BIACore.Settings.Agent.FtpUser, BIACore.Settings.Agent.FtpPass);
                ftp.UsePassive = true;
                ftp.UseBinary = true;
                ftp.KeepAlive = false;

                // as tempting as it is, don't use a 'using' here.
                // the HttpResponseMessage will clean up for us.
                FtpWebResponse file = (FtpWebResponse)ftp.GetResponse();
                */

                Stream file = BIACore.Utility.FTP.GetFile(item.FileName);

                HttpResponseMessage response = new HttpResponseMessage(HttpStatusCode.OK);
                response.Content = new StreamContent(file);
                response.Content.Headers.ContentType = new MediaTypeHeaderValue("application/octet-stream");
                response.Content.Headers.ContentDisposition = new ContentDispositionHeaderValue("attachment");
                response.Content.Headers.ContentDisposition.FileName = item.FileName;
                // Fix IE download issue over SSL with caching enabled.
                response.Headers.CacheControl = new CacheControlHeaderValue() { Private = true, MaxAge = new TimeSpan(0, 0, 0, 1) };
                response.Headers.Add("Pragma", "token");
                return response;
            }
            catch (Exception e)
            {
                HttpResponseMessage response = new HttpResponseMessage(HttpStatusCode.InternalServerError);
                response.Content = new StringContent(e.Message);
                return response;
            }
        }
    }
}
