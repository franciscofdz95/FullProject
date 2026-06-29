using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

using BIACore.Extensions;

namespace BIACore.Server
{
    public class CurrentContext
    {
        internal static string GetSessionId(dynamic request)
        {

            string SessionId = null;

            // TODO Why is the localhost origin test used here?
            // This might need to be totally rethought, as TokenLocal doesn't exist so the test "request.TokenLocal != null" doesn't work and throws an error.

            //if (BIACore.Web.CurrentContext.GetRequestOrigin().IndexOf("localhost") > -1 && request != null && request.TokenLocal != null)
            if (BIACore.Settings.Config.BIAEnvironment.ToLower() == "alpha" && request != null && request.TokenLocal != null)  // This breaks in prod, plus we never except TokenLocal in prod!!
                    SessionId = ((string)Token.GetTokenValue(request.TokenLocal.ToString())).Reverse();
            else if (HttpContext.Current.Request.Cookies[API.SESSION_COOKIE] != null && HttpContext.Current.Request.Cookies[API.SESSION_COOKIE].Value != null)
                SessionId = HttpContext.Current.Request.Cookies[API.SESSION_COOKIE].Value;

            //LogFactory.Error("Session Test SessionId: {0} - Request Origin: {1}", new object[] { SessionId, BIACore.Web.CurrentContext.GetRequestOrigin() });

            return SessionId;
        }
    }
}