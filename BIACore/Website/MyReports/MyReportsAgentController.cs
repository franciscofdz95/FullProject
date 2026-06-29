using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

using System.Data;
using System.IO;
using System.Net;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Web.Http;
using System.Text;
using System.Threading.Tasks;

using BIACore.Model;

using web = BIACore.Website.Properties;

namespace BIACore.MyReports.Controller
{
    public partial class MyReportsAgentController : BIACore.Web.Controller.BaseController
    {
        public override string Connection
        {
            get { return BIACore.Server.Connections.MyReports; }
        }

        private Task<HttpResponseMessage> ReceiveFile(MyReport report)
        {
            if (!Request.Content.IsMimeMultipartContent())
                throw new HttpResponseException(HttpStatusCode.UnsupportedMediaType);

            return Request.Content.ReadAsMultipartAsync(new MultipartMemoryStreamProvider())
                .ContinueWith(t =>
                {
                    if (t.IsFaulted || t.IsCanceled)
                        Request.CreateErrorResponse(HttpStatusCode.InternalServerError, t.Exception);

                    foreach (HttpContent file in t.Result.Contents)
                    {
                        string name = file.Headers.ContentDisposition.FileName;
                        name = Path.GetFileName(name.Replace("\"", ""));

                        // no name passed, use stored filename.
                        if (string.IsNullOrWhiteSpace(name))
                            name = report.FileName;

                        // no stored filename, make one up.
                        if (string.IsNullOrWhiteSpace(name))
                            name = string.Format("{0}_{3}_{1}.{2}", report.ReportType, report.ReportId.Value, report.FileType ?? "stream", DateTime.Now.ToString("yyyyMMddhhmm"));

                        //var reqStream = new MemoryStream();

                        //file.ReadAsStreamAsync().Result.CopyTo(reqStream);
                        BIACore.Utility.FTP.UploadFile(file.ReadAsStreamAsync().Result, name);

                        //"myreports.
                        Execute("appObject.Report_Update",
                                    new DBParameter("@ReportId", DbType.Int32, report.ReportId.Value),
                                    new DBParameter("@FileName", DbType.AnsiString, name),
                                    new DBParameter("@FileType", DbType.AnsiString, Path.GetExtension(name).Replace(".", "")));

                        /*
                        // open ftp server connection.
                        FtpWebRequest ftp = Statics.FTPRequest(name);
                        ftp.Method = WebRequestMethods.Ftp.UploadFile;

                        // upload file.
                        //byte[] data = file.ReadAsByteArrayAsync().Result;
                        using (Stream reqStream = ftp.GetRequestStream())
                        {
                            file.ReadAsStreamAsync().Result.CopyTo(reqStream);
                            //reqStream.Write(data, 0, data.Length);
                        }

                        using (FtpWebResponse response = (FtpWebResponse)ftp.GetResponse())
                        {
                            if (response.StatusCode != FtpStatusCode.ClosingData)
                            {
                                BIACore.Server.LogFactory.Error("MyReports Upload: Ftp Error {0} ({1}) for ReportId {2}",
                                    response.StatusCode, response.StatusDescription, report.ReportId.Value);
                                // and throw an error if one occurred.
                                return Request.CreateErrorResponse(HttpStatusCode.InternalServerError,
                                    string.Format("Ftp Server Error ({0} - {1})", response.StatusCode, response.StatusDescription));
                            }
                            else
                            {
                                //"myreports.
                                Execute("appObject.Report_Update",
                                    new DBParameter("@ReportId", DbType.Int32, report.ReportId.Value),
                                    new DBParameter("@FileName", DbType.AnsiString, name),
                                    new DBParameter("@FileType", DbType.AnsiString, Path.GetExtension(name).Replace(".", "")));
                            }
                        }
                        */


                    }

                    return Request.CreateResponse(HttpStatusCode.OK);
                });
        }
    }
}