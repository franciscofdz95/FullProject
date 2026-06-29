using System;
using System.Collections.Generic;
using System.Web;

namespace BIACore.Activity
{
    public class ActivityFactory
    {
        private const string BIACORE_SESSION_USER_CACHE_KEY = "BIACore_S{0}_UserId";
        public static void Log(HttpRequest request, string appCode, string userId, string groupName, string objectName)
        {
            try
            {
                Dictionary<string, object> log = new Dictionary<string, object>()
            {
                { "AppCode", appCode },
                { "UserId", userId },
                { "Page", appCode + "/" + groupName + "/" + objectName },
                { "IpAddress", HttpContext.Current.Request.UserHostAddress },
                { "Browser", HttpContext.Current.Request.UserAgent },
                { "Params", Newtonsoft.Json.JsonConvert.SerializeObject(BIACoreModule.GetActivityData(HttpContext.Current.Request)) },
                { "SessionId", HttpContext.Current.Request.Cookies[API.SESSION_COOKIE] != null ? HttpContext.Current.Request.Cookies[API.SESSION_COOKIE].Value : null },
                //{ "SecHash", HttpContext.Current.Request.Cookies[API.SECHASH_COOKIE] != null ? HttpContext.Current.Request.Cookies[API.SECHASH_COOKIE].Value : null }
            };

                System.Threading.Tasks.Task.Factory.StartNew((l) => {
                    Internal.Request.LoginLog((Dictionary<string,object>)l);
                }, log);
            }
            catch { }
        }
        public static void LoginLog(HttpRequest request, string appCode, string userId, string targetId)
        {
            Log(request, appCode, userId, "AppLogin", "LoginSuccess");
        }        
        internal static string GetCachedActivityUserId()
        {
            string userId = Security.User.DEFAULT_USERID;
            if (Web.CurrentContext.IsBIACoreApp()) {
                string sessionId = Web.CurrentContext.GetSessionCookieValue();
                if (!string.IsNullOrWhiteSpace(sessionId))
                {
                    string sessionUser = Internal.Cache.Get<string>(string.Format(BIACORE_SESSION_USER_CACHE_KEY, sessionId));
                    if (!string.IsNullOrWhiteSpace(sessionUser)) userId = sessionUser;
                }
            }

            return userId;
        }
        public static void SetActivityUserId(string userId, string sessionId)
        {
            if (Web.CurrentContext.IsBIACoreApp() && !string.IsNullOrWhiteSpace(sessionId) && !string.IsNullOrWhiteSpace(userId))
                Internal.Cache.Set(string.Format(BIACORE_SESSION_USER_CACHE_KEY, sessionId), userId, DateTime.UtcNow.AddHours(1));
        }
    }
}
