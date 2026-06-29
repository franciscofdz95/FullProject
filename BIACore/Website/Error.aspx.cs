using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Script.Serialization;
using System.Web.UI;
using System.Web.UI.WebControls;
using BIACore.Log;
using BIACore.Model;
using BIACore.Server.Controller;

namespace BIACore.Website
{
    public partial class Error : System.Web.UI.Page
    {
        protected void Page_Load(object sender, EventArgs e)
        {
            string qstr = HttpUtility.UrlDecode(Request.QueryString.ToString());
            if (!string.IsNullOrEmpty(qstr) && HttpUtility.UrlDecode(qstr).StartsWith("404") && string.IsNullOrEmpty(Request.QueryString["aspxerrorpath"]))
            {
                string OriginalUrl = GetRequestedPath();
                //Server.ClearError();

                string Path = OriginalUrl;
                if (Path.IndexOf("://") > -1) Path = Path.Substring(Path.IndexOf("://") + 3);
                Path = Path.Substring(Path.IndexOf("/"));
                Log.LogFactory.CustomLog("Unknown", BIACore.Server.Model.LogEntry.GetAppCodeFromURL(Path), Log.LogLevel.Error, "IIS 404", "IIS Captured 404 error for url " + OriginalUrl);

                Response.Status = "404 not found";
                Response.StatusCode = 404;
            }
            else if (!string.IsNullOrEmpty(qstr) && HttpUtility.UrlDecode(qstr).StartsWith("iis404") && !string.IsNullOrEmpty(Request.UrlReferrer.ToString()))
            {
                string urlReferrer = Request.UrlReferrer.Scheme + "://" + Request.UrlReferrer.Host + "/" + Request.ApplicationPath;
                Log.LogFactory.CustomLog("Unknown", BIACore.Server.Model.LogEntry.GetAppCodeFromURL(urlReferrer), Log.LogLevel.Error, "IIS 404", "IIS Captured 404 error for url " + Request.UrlReferrer.ToString());
                
                Response.Status = "404 not found";
                Response.StatusCode = 404;
            }
            else
            {
                string ec = Request.QueryString["ec"];
                if (!string.IsNullOrWhiteSpace(ec))
                {
                    FingerprintValueController fingerprintValueController = new FingerprintValueController();
                    FingerprintValue obj = (FingerprintValue)fingerprintValueController.GetFingerprintById_Post(new { FingerprintId = ec });
                    string value = obj.Value;
                    JavaScriptSerializer jss = new JavaScriptSerializer() { MaxJsonLength = 2147483647 };
                    Dictionary<string, string> Error = jss.Deserialize<Dictionary<string, string>>(value);
                    LogFactory.CustomLog(Error["UserId"], Error["AppCode"], LogLevel.Error, Error["Code"], string.Format("Message = {1}{0}Stacktrace = {2}", new object[] { Environment.NewLine, Error["Message"], Error["StackTrace"] }));
                }
            }
        }

        private string GetRequestedPath()
        {
            string path = "unknown";
            string qstr = HttpUtility.UrlDecode(Request.QueryString.ToString());
            if (!string.IsNullOrEmpty(qstr))
            {
                path = Request.QueryString["aspxerrorpath"]; // try to get asp.net error info 
                if (string.IsNullOrEmpty(path))                         // if none, must be IIS error 
                {
                    if (qstr.StartsWith("404"))
                    {
                        int start = qstr.IndexOf(":80");
                        if (start != -1)
                        {
                            path = qstr.Substring(start + 3);
                        }
                    }
                }
            }
            return path;
        }
    }
}