using BIACore.Extensions;
using System;
using System.Collections.Generic;
using System.Dynamic;
using System.Linq;
using System.Web;

namespace BIACore
{
    public partial class BIACoreModule
    {
        private static bool Log(HttpRequest request)
        {
            // This test is to determine if the request is local or from the server itself, we do not log these calls with the Activity Log
            // Added test to skip logging extModel events, this is related to Ext store .sync() calls generating a bad request.
            if (request.IsLocal || request.Url.AbsoluteUri.IndexOf(Settings.Config.Server + Settings.Config.BaseURL + "/api/") > -1 
                || request.Url.AbsoluteUri.IndexOf("extmodel", StringComparison.InvariantCultureIgnoreCase) > -1)
                return false;
            // aspx pagess
            if (request.Path.EndsWith(".aspx", StringComparison.InvariantCultureIgnoreCase)
                || (request.AppRelativeCurrentExecutionFilePath == "~/" && request.CurrentExecutionFilePathExtension == ""))
                return true;
            // ajax calls
            if (request["X-Requested-With"] == "XMLHttpRequest" || request.Headers["X-Requested-With"] == "XMLHttpRequest")
                return true;
            // default
            return false;
        }

        /// <summary>
        /// We are called in the EndRequest event; here we decide whether or not to log the event.
        /// </summary>
        /// <param name="sender"></param>
        /// <param name="e"></param>
        public void Activity(object sender, EventArgs e)
        {
            if (!Settings.Activity.Enabled) return;

            HttpRequest request = ((HttpApplication)sender).Request;

            if (!Log(request)) return;

            dynamic data = new ExpandoObject();

            data = BIACoreModule.GetActivityData(request);

            BIACore.Activity.Factory.Insert(request, data);
        }

        /// <summary>
        /// Exposes the param build code externally for use with Enterprise Logging of Logins
        /// </summary>
        /// <param name="request"></param>
        /// <returns></returns>
        public static dynamic GetActivityData(HttpRequest request)
        {
            dynamic data = new ExpandoObject();
            BIACoreModule me = BIACoreModule.me;

            try
            {
                data.URL = request.Path;
                data.Method = request.HttpMethod;
                data.Cookies = me.CollectCookies(request);
                data.Query = me.CollectQuery(request);
                data.Form = me.CollectForm(request);
                data.Content = me.CollectContent(request);
            }
            catch (Exception ex)
            {
                BIACore.Log.LogFactory.Exception(ex);
            }

            return data;
        }

        private Dictionary<string, string> Exclude(Dictionary<string, string> list, string[] excludes)
        {
            foreach (string exclude in excludes)
            {
                if (exclude == null) continue;
                list.Remove(exclude);
            }
            return list;
        }

        private Dictionary<string, string> CollectCookies(HttpRequest request)
        {
            Dictionary<string, string> cookies = new Dictionary<string, string>();
            if (request.Cookies.Get(BIACore.API.SESSION_COOKIE) != null) cookies.Add(BIACore.API.SESSION_COOKIE, request.Cookies.Get(BIACore.API.SESSION_COOKIE).Value);
            if (request.Cookies.Get(BIACore.API.SECHASH_COOKIE) != null) cookies.Add(BIACore.API.SECHASH_COOKIE, request.Cookies.Get(BIACore.API.SECHASH_COOKIE).Value);
            if (request.Cookies.Get(BIACore.API.LOCALHOST_TOKEN_COOKIE) != null) cookies.Add(BIACore.API.LOCALHOST_TOKEN_COOKIE, request.Cookies.Get(BIACore.API.LOCALHOST_TOKEN_COOKIE).Value);
            return cookies;
        }

        private Dictionary<string, string> CollectForm(HttpRequest request)
        {
            if (request.Path.ToLower() == Settings.Security.LoginUri.ToLower() || request.Path.ToLower() == Settings.Security.LogoutUri.ToLower()) return new Dictionary<string, string>();

            string[] exclude = (Settings.Activity.Form.List.Length > 0)
                ? Settings.Activity.Form.List :
                new string[] {
                    "__VIEWSTATE",
                    "__LASTFOCUS"
                    // none yet.
                };
            if (Settings.Activity.Form.ContainsWildCard) return new Dictionary<string, string>();
            return Exclude(request.Form.ToDictionary(), exclude);
        }

        private Dictionary<string, string> CollectQuery(HttpRequest request)
        {
            string[] exclude = (Settings.Activity.Query.List.Length > 0)
                ? Settings.Activity.Query.List :
                new string[] {
                    // cachebreakers
                    "_dc",
                    "dc"
                };
            if (Settings.Activity.Query.ContainsWildCard) return new Dictionary<string, string>();
            return Exclude(request.QueryString.ToDictionary(), exclude);
        }

        private string CollectContent(HttpRequest request)
        {
            if (!Settings.Activity.Content) return string.Empty;

            if (request.Path.ToLower() == Settings.Security.LoginUri.ToLower() || request.Path.ToLower() == Settings.Security.LogoutUri.ToLower()) return string.Empty;

            // can't use stream operations because those close the input stream and prevent
            // later operations from using it.
            byte[] bytes = new byte[request.InputStream.Length];
            request.InputStream.Read(bytes, 0, bytes.Length);
            request.InputStream.Position = 0;
            return request.ContentEncoding.GetString(bytes).TrimEnd('\0');
        }
    }
}
