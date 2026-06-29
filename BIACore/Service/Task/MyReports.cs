using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

using System.Data;
using System.IO;
using System.Net;

using BIACore.Agent;
using BIACore.Agent.Task;

using BIACore.Model;
using BIACore.Provider;

using web = BIAService.Properties;

namespace BIAService.Task
{
    public class MyReports : BaseTask
    {
        public override TimeSpan Interval { get { return new TimeSpan(24, 0, 0); } set { } }

        public List<string> GetAppCodes()
        {
            return SQL.ExecuteToString(Connections.MyReports, "appObject.Agent_List", null);
        }

        public List<MyReport> GetReports(string appCode)
        {
            return SQL.Execute<MyReport>(Connections.MyReports, "dynAppObject.Report_List",
                new DBParameter("@AppCode", DbType.AnsiString, appCode),
                new DBParameter("@Age", DbType.DateTime, DateTime.Now.AddDays(-15).Date));
        }

        public override void Run()
        {
            List<string> appCodes = GetAppCodes();
            foreach (string appCode in appCodes)
            {
                foreach (MyReport report in GetReports(appCode))
                {
                    Delete(report);
                }
            }
            Delete_Files();
        }

        private void Delete(MyReport report)
        {
            try
            {
                SQL.ExecuteNonQuery(Connections.MyReports, "appObject.Report_Delete",
                    new DBParameter("@ReportId", DbType.Int32, report.ReportId));

                if (!string.IsNullOrEmpty(report.FileName))
                {
                    FtpWebRequest request = FTPRequest(report.FileName);
                    request.Method = WebRequestMethods.Ftp.DeleteFile;
                    using (FtpWebResponse response = (FtpWebResponse)request.GetResponse()) { }
                }
            }
            catch { }
        }

        private List<string> Files_Older_Than(DateTime MaxAge)
        {
            List<string> result = new List<string>();

            try
            {
                FtpWebRequest request = FTPRequest(string.Empty);
                request.Method = WebRequestMethods.Ftp.ListDirectoryDetails;

                string[] list = null;
                using (FtpWebResponse response = (FtpWebResponse)request.GetResponse())
                {
                    using (StreamReader reader = new StreamReader(response.GetResponseStream()))
                    {
                        list = reader.ReadToEnd().Split(new string[] { "\r\n" }, StringSplitOptions.RemoveEmptyEntries);
                    }
                }

                foreach (string line in list)
                {
                    if (line.StartsWith("d"))
                    {
                        // skip directories
                        continue;
                    }
                    else
                    {
                        string date = line.Substring(43, 12);
                        DateTime dateTime = DateTime.Parse((date.Contains(':')) ? date.Substring(0, 6) : date);

                        // if the file is older than we allow, add it to the list
                        if (dateTime < MaxAge)
                            result.Add(line.Substring(56));
                    }
                }
            }
            catch { }

            return result;
        }

        private void Delete_Files()
        {
            foreach (string file in Files_Older_Than(DateTime.Now.AddDays(-14).Date))
            {
                try
                {
                    FtpWebRequest ftp = FTPRequest(file);
                    ftp.Method = WebRequestMethods.Ftp.DeleteFile;
                    using (FtpWebResponse response = (FtpWebResponse)ftp.GetResponse()) { }
                }
                catch { }
            }
        }

        private static FtpWebRequest FTPRequest(string filename)
        {
            FtpWebRequest request = (FtpWebRequest)FtpWebRequest.Create(web.Settings.Default.MyReportsPath + filename);
            request.Proxy = null;
            request.Credentials = new NetworkCredential(web.Settings.Default.MyReportsUser, web.Settings.Default.MyReportsPass);
            request.UsePassive = true;
            request.UseBinary = true;
            request.KeepAlive = false;
            return request;
        }
    }
}
