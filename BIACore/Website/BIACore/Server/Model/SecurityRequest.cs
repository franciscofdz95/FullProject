using System;
using System.Collections.Generic;
using System.Collections.Specialized;
using System.Linq;
using System.Web;

namespace BIACore.Server.Model
{
    public class ImpersonateRequest : SecurityRequest
    {
        public string ImpersonateId { get; set; }
        public string Query { get; set; }
    }

    public class UserRequest
    {
        public string UserId { get; set; }
        public string AppCode { get; set; }
    }

    public class SecurityRequest
    {
        public string TokenLocal { get; set; }
        public string SessionId { get; set; }
        public string AppCode { get; set; }

        public SecurityRequest()
        {
            if (HttpContext.Current.Request.UrlReferrer != null && TokenLocal != null)
                SessionId = Token.GetTokenValue(TokenLocal);
            else if (HttpContext.Current.Request.Cookies[API.SESSION_COOKIE] != null && HttpContext.Current.Request.Cookies[API.SESSION_COOKIE].Value != null)
                SessionId = HttpUtility.UrlDecode(HttpContext.Current.Request.Cookies[API.SESSION_COOKIE].Value);
        }
    }
}