using BIACore.Log;
using BIACore.Web;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace BIACore.Internal
{
    internal static partial class Request
    {
        private static object sessionLock = new object();

        internal static Model.Session Session(string Token)
        {
            bool anonymous = Settings.Security.Anonymous || Settings.Security.Anonymous_Uri.List.Any(x => HttpContext.Current.Request.Path.ToLower().Contains(x.ToLower()));
            string key = string.Format("Session_S{0}{3}_A{1}_{2}_{4}", Token, Settings.Config.AppCode, HttpContext.Current.Request.UserHostAddress, CurrentContext.GetSessionCookieValue(), anonymous);
            Model.Session session = null;
            lock (sessionLock)
            {
                if ((session = (Model.Session)Cache.Get(key)) == null && (!string.IsNullOrWhiteSpace(Token) || !string.IsNullOrWhiteSpace(Web.CurrentContext.GetSessionCookieValue())))
                {
                    DateTime start = DateTime.UtcNow;
                    try
                    {
                        // load the session
#if LocalTest
                        string sessionId = null;

                        if (HttpContext.Current.Request.Cookies[API.SESSION_COOKIE] != null) sessionId = HttpContext.Current.Request.Cookies[API.SESSION_COOKIE].Value;
                        else if (!String.IsNullOrWhiteSpace(Token) && Utility.Token.GetTokenValue(Token) != null) sessionId = Utility.Token.GetTokenValue(Token).ToString().Reverse();

                        session = LocalRequest.Session(sessionId, Settings.Config.AppCode,HttpContext.Current.Request.UserHostAddress);
#else
                        session = Web.Client.Post<Model.Session>(API.URL(API.SESSION),
                            new { TokenLocal = Token, AppCode = Settings.Config.AppCode, Anonymous = anonymous });
#endif

                        // save it to the cache
                        if (Security.Session.IsCachable(session))
                            Cache.Set(key, session, DateTime.UtcNow.AddSeconds(Cache.DEFAULT_CACHE_DURATION));
                    }
                    catch (Exception ex)
                    {
                        // catching an exception from Web.Client.Post at this point.
                        // let session get returned as 'null'. it will be checked for validity
                        // and then thrown to a redirect.
                    }
                    finally
                    {
                        LogFactory.Performance("Request Session", DateTime.UtcNow.Subtract(start).TotalSeconds);
                    }
                }
            }
            return session;
        }

        internal static void SessionClientUpdate(Dictionary<string, object> sessionClientParams)
        {
#if LocalTest
            LocalRequest.LoginLog_InsertSQL(log);
#else
            Web.Client.Post<dynamic>(API.URL(API.SESSION_CLIENT), sessionClientParams);
#endif
        }

        internal static dynamic SessionSecureStart(Dictionary<string, object> sessionParams)
        {
#if LocalTest
            LocalRequest.LoginLog_InsertSQL(log);
#else
            return Web.Client.Post<dynamic>(API.URL(API.SESSION_SECURE_START), sessionParams);
#endif
        }

    }
}
