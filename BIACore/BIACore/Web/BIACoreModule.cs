using Newtonsoft.Json;
using System;
using System.Globalization;
using System.IO;
using System.Net;
using System.Web;
using System.Web.Util;
using System.Text.RegularExpressions;

namespace BIACore
{
    /// <summary>
    /// Another part of the BIACoreModule
    /// See also BIACoreModule.cs
    /// See also Log\BIACoreModule.cs
    /// In this section, we are concerned with
    /// 1) Handling security
    /// 2) Setting up c# user/session objects prior to application execution
    /// </summary>
    public partial class BIACoreModule
    {
        private readonly string XSS_URL_DEBUG_MESSAGE = "Invalid URL Input";
        private readonly string XSS_REQUEST_DEBUG_MESSAGE = "Invalid Post Body Input";
        private readonly string CSRF_MISSING_DEBUG_MESSAGE = "Missing Referrer";
        private readonly string CSRF_INVALID_DEBUG_MESSAGE = "Invalid Referrer";

        public void XssRequestValidation(object sender, EventArgs e)
        {
            Exception validationException = null;
            HttpApplication application = (HttpApplication)sender;
            HttpRequest request = application.Request;

            //If application developer changes the route name config this will not be active for them
            // The exclusion of BIACore is problematic.. Research
            if (Web.CurrentContext.RequestIsAjax() && Settings.Config.AppCode != "BIACore" )
            {
                try
                {
                    validationException = ValidateRequest(request);
                }
                catch (Exception ex)
                {
                    // exception in our validation code, just log it
                    BIACore.Log.LogFactory.Exception(ex);
                }

                if (validationException != null)
                {
                    throw validationException;
                }
            }
        }

        private Exception ValidateRequest(HttpRequest request)
        {
            string requestString = GetRequestContent(request);
            string queryString = request.QueryString != null ? request.QueryString.ToString() : null;

            if (!string.IsNullOrWhiteSpace(queryString))
            {
                Utility.XSSValidation.XssValidationResult result = Utility.XSSValidation.CheckXssSafe(queryString);

                if (!result.Success)
                    return new HttpRequestValidationException(XSS_URL_DEBUG_MESSAGE + " (" + result.FailedValidationType.Name + "):" + request.Url.AbsolutePath);
            }

            if (!string.IsNullOrWhiteSpace(requestString))
            {
                Utility.XSSValidation.XssValidationResult result = Utility.XSSValidation.CheckXssSafe(requestString);

                if (!result.Success)
                    return new HttpRequestValidationException(XSS_REQUEST_DEBUG_MESSAGE + " (" + result.FailedValidationType.Name + "):" + request.Url.AbsolutePath);
            }

            if ( request.UrlReferrer != null && !string.IsNullOrWhiteSpace(request.UrlReferrer.Host) && request.UrlReferrer.Host != request.Url.Host)
                return new HttpRequestValidationException(CSRF_INVALID_DEBUG_MESSAGE + " (" + request.Url.AbsolutePath + ")");

            return null;
        }

        private string GetRequestContent(HttpRequest request)
        {
            string requestString = null;

            if (request.InputStream != null && request.InputStream.Length > 0)
            {
                StreamReader streamReader = new StreamReader(request.InputStream);
                streamReader.BaseStream.Position = 0;
                requestString = streamReader.ReadToEnd().ToLowerInvariant();

                // rewind stream in case the app reads it later (eg reading multipart stream)
                streamReader.BaseStream.Position = 0;
            }

            return requestString;
        }
        
        public void PreRequest(object sender, EventArgs e)
        {
            HttpApplication application = (HttpApplication)sender;
            HttpRequest request = application.Request;
            HttpResponse response = application.Response;
            string unsafe_inline = "";
            string data_image = "";

            string path = request.Path.ToLower();
            //application.Response.Headers.Add("TestPath", path);
            if (path.Contains("/legacy/")) return;
            if (path.Contains("/jakarta/")) return;

            //if (Settings.Config.AppCode.ToLower() == "quoteassist") unsafe_inline = "'unsafe-inline'";
            if (Settings.Config.AppCode.ToLower() == "solutioncenter") data_image = "data:";

            // New InfoSec Security Header Fixes:
            application.Response.Headers.Remove("Content-Security-Policy");
            if (Settings.Config.AppCode != "DIR_SmartStopLite" && Settings.Config.AppCode != "DIR_TrackingGPS" && Settings.Config.AppCode != "BIADRM_DataReq" &&
                Settings.Config.AppCode.ToLower() != "svc_mapping")
                application.Response.AddHeader("Content-Security-Policy", "upgrade-insecure-requests; script-src 'self' gis.bia.inside.ups.com gis.biaalpha.inside.ups.com " + Settings.Config.Server 
                    + " 'unsafe-eval' " + unsafe_inline + ";"
                    + " default-src 'none'; frame-ancestors 'self'; "
                    + " frame-src 'self' https://app.powerbi.com https://ssrs.inside.ups.com https://tableau.bia.inside.ups.com; "
                    + "img-src 'self' " + Settings.Config.Server + " " + data_image + " 'unsafe-inline'; "
                    + "connect-src 'self' " + Settings.Config.Server + "; "
                    + "style-src 'self' gis.bia.inside.ups.com gis.biaalpha.inside.ups.com " + Settings.Config.Server + " 'unsafe-inline'; "
                    + "font-src 'self' " + Settings.Config.Server + "; form-action 'self' " + Settings.Config.Server + "; base-uri 'self' " + Settings.Config.Server + ";");

            //If application developer changes the route name config this will not be active for them

            if (Web.CurrentContext.RequestIsAjax())
            {
                try
                {
                    application.Response.Headers.Add("DebugDataRequestStartTime", DateTime.UtcNow.ToString("yyyy-MM-dd HH:mm:ss.fff", CultureInfo.InvariantCulture));
                }
                catch (Exception ex)
                {
                    if (ex.Message.IndexOf("HTTP header") == -1)
                    {
                        throw;
                    }
                }
            }

            if (!Web.CurrentContext.RequestIsAjax() && BIACore.Settings.Config.AppCode != "BIACore")
            {

                //bool temp = Uri.IsWellFormedUriString(request.RawUrl, UriKind.Relative);
                //BIACore.Log.LogFactory.Error("IsWellFormed: " + temp.ToString() + " RawURI: " + request.RawUrl);
                // Add double filename change (or filename in path), revert to default.aspx
                string pattern = @"\w{2,}\.\w{3,}/\S*";
                string pattern2 = @"\w{2,}\.asmx\/\w*";
                string doubleFilename = request.RawUrl;
                Match m = Regex.Match(doubleFilename, pattern, RegexOptions.IgnoreCase);
                Match n = Regex.Match(doubleFilename, pattern2, RegexOptions.IgnoreCase);
                //BIACore.Log.LogFactory.Error("RawURL: " + doubleFilename + " Match: " + m.Value);
                if (m.Success && !n.Success)
                {
                    BIACore.Log.LogFactory.Error("Invalid RawURL: " + doubleFilename + " Match: " + m.Value);
                    response.Redirect("/", true);
                }
                //// Invalid characters in Path
                //pattern = @"%";
                //string testString = request.Path;
                //m = Regex.Match(testString, pattern, RegexOptions.IgnoreCase);
                ////BIACore.Log.LogFactory.Error("Request.Path: " + testString );
                //if (m.Success)
                //{
                //    BIACore.Log.LogFactory.Error("Invalid Path: " + testString + " Match: " + m.Value);
                //    response.Redirect("/", true);
                //}
            }

        }

        public void RequestEnd(object sender, EventArgs e)
        {
            HttpApplication application = (HttpApplication)sender;
            HttpRequest request = application.Request;

            try { 
                //New Header To Long Catch, specifically when the cookie length is too long.
                int CookieCount = request.Cookies.Count;
                //BIACore.Log.LogFactory.Message("Cookie Header Length: " + CookieLength.ToString() + " URI: " + request.Url.OriginalString);

                if (CookieCount > 20) throw new HttpRequestValidationException("Header cookie count > 20");
            }
            catch (Exception ex)
            {
                //Error silently
            }

            // Skip cache header manipulation for file uploads and downloads.
            // These requests set their own cache/pragma headers (e.g., for IE/SSL compatibility)
            // and overriding them here can break file transfers.
            string contentType = application.Response.ContentType?.ToLower() ?? "";
            bool isFileTransfer = contentType.Contains("application/octet-stream")
                || contentType.Contains("application/vnd.")
                || contentType.Contains("text/csv")
                || request.ContentType?.ToLower().Contains("multipart/form-data") == true
                || application.Response.Headers["Content-Disposition"] != null;

            if (isFileTransfer)
            {
                // Still remove the Server header for security
                application.Response.Headers.Remove("Server");
                return;
            }

            // This section is to change the Cache-Control setting for certain file types.
            try {

                application.Response.Headers.Remove("cache-control");
                application.Response.Headers.Remove("Cache-Control");
                application.Response.Headers.Remove("CACHE-CONTROL");
                application.Response.Headers.Remove("pragma");
                application.Response.Headers.Remove("Pragma");
                application.Response.Headers.Remove("Server");
                application.Response.Headers.Remove("PRAGMA");

                if (application.Response.ContentType.ToLower().Contains("application/ecmascript") 
                     || application.Response.ContentType.ToLower().Contains("application/javascript") 
                     || application.Response.ContentType.ToLower().Contains("font/") 
                     || application.Response.ContentType.ToLower().Contains("image/") 
                     || application.Response.ContentType.ToLower().Contains("text/css")
                     || application.Response.ContentType.ToLower().Contains("text/javascript"))
                {
                    application.Response.Headers.Add("cache-control", "no-cache=\"Set-Cookie\"");
                    application.Response.Headers.Add("cache-BIA-Set", "Set Cached");
                }
                else {
                    application.Response.Headers.Add("cache-control", "no-store, no-cache");
                    application.Response.Headers.Add("cache-BIA-Set", "Set DO NOT Cache");
                    application.Response.Headers.Add("pragma", "no-cache");
                }
            }
            catch (Exception ex)
            {
                //Do nothing
                throw (ex);
                //Error silently
            }

            //TODO: Why are we not using Web.CurrentContext.RequestIsAjax() to determine that the call is Ajax?!! MME 1/20/20
            //If application developer changes the route name config this will not be active for them
            if (request.Url.AbsolutePath.Contains("api/") && application.Response.ContentType.ToLower().IndexOf("application/json") > -1)
            {
                try
                {
                    application.Response.Headers.Add("DebugDataRequestEndTime", DateTime.UtcNow.ToString("yyyy-MM-dd HH:mm:ss.fff", CultureInfo.InvariantCulture));
                }
                catch (Exception ex)
                {
                    if (ex.Message.IndexOf("HTTP header") == -1)
                    {
                        throw;
                    }
                }
            }

            if (HttpContext.Current.Response.StatusCode == (int)HttpStatusCode.NotFound || HttpContext.Current.Response.StatusCode == (int)HttpStatusCode.MethodNotAllowed)
            {
                HttpContext.Current.Response.Clear();
                HttpContext.Current.Response.ClearContent();
                HttpContext.Current.Response.ContentType = "application/json";
                HttpContext.Current.Response.Write(JsonConvert.SerializeObject(new
                {
                    Message = "No HTTP resource was found that matches the request URI.",
                    MessageDetail = "No action was found for request"
                }));
                HttpContext.Current.Response.BufferOutput = true;
                HttpContext.Current.Response.End();
            }

        }

    }
}
