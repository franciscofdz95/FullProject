using System;
using System.Collections.Generic;
using System.Web;

namespace BIACore.Security
{
    /// <summary>
    /// This static class is for accessing the current Session object.
    /// Internally, it contains an Obj property which is a reference to
    /// the current session object; if none exists, nulls will (usually)
    /// be returned.
    /// As a client, you shouldn't worry about this; also it doesn't
    /// exist in standalone mode.
    /// </summary>
    public static class Session
    {
        private const string SESSION = "BIACore.Session";

        /// <summary>
        /// How long this Session can be considered "valid" for
        /// </summary>
        [Obsolete("Item is no longer included in return data")]
        public static int pollInterval { get { return Obj.pollInterval; } }

        /// <summary>
        /// The UserId associated with this Session
        /// </summary>
        public static string sessionId { get { return Obj.sessionId; } }

        /// <summary>
        /// The UserId associated with this Session
        /// </summary>
        public static string ad_id { get { return Obj.ad_id; } }

        /// <summary>
        /// The UserId associated with this Session
        /// </summary>
        public static string empId { get { return Obj.empId; } }

        /// <summary>
        /// The UserId associated with this Session
        /// </summary>
        public static string userId { get { return Obj.userId; } }

        /// <summary>
        /// The UserId associated with this Session
        /// </summary>
        public static string authenticatedId { get { return Obj.authenticatedId; } }

        /// <summary>
        /// The UserId associated with this Session
        /// </summary>
        public static string authenticated_ad_id { get { return Obj.authenticated_ad_id; } }

        /// <summary>
        /// The UserId associated with this Session
        /// </summary>
        public static string appCode { get { return Obj.appCode; } }

        /// <summary>
        /// The UserId associated with this Session
        /// </summary>
        public static int appOnline { get { return Obj.appOnline; } }

        /// <summary>
        /// The UserId associated with this Session
        /// </summary>
        public static int status { get { return Obj.status; } }

        /// <summary>
        /// The UserId associated with this Session
        /// </summary>
        public static string msg { get { return Obj.msg; } }

        internal static List<string> nonCachingSessionDetails
        {
            get { return new List<string> { "AppAuth", "AppReAuth", "AppOffline" }; }
        }

        internal static List<string> loggingSessionDetails
        {
            get { return new List<string> { "AppAuth", "AppReAuth", "SessionTimeout", "SessionInactive" }; }
        }

        [ThreadStatic]
        private static Model.Session _session;
        [ThreadStatic]
        private static bool _sessionGet = false;
        [ThreadStatic]
        private static bool _sessionGetTry = false;
        internal static Model.Session Obj
        {
            get
            {
                _sessionGetTry = true;
                if (HttpContext.Current != null)
                {
                    if (HttpContext.Current.Items[SESSION] == null)
                    {
                        Model.Session item = null;
                        try
                        {
                            string token = HttpContext.Current.Request.Cookies[API.LOCALHOST_TOKEN_COOKIE] != null && HttpContext.Current.Request.Cookies[API.LOCALHOST_TOKEN_COOKIE].Value != null ? HttpContext.Current.Request.Cookies[API.LOCALHOST_TOKEN_COOKIE].Value : null;
                            item = Internal.Request.Session(token);
                            if (item == null) item = new Model.Session();
                            _sessionGet = true;
                            // This code was used to verify the status flag result - M.Erdmann 4/23/2020 2:32 AM
                            // Log.LogFactory.Debug("userId: {0} - status {1}",item.userId,item.status);
                        }
                        catch
                        {
                            item = new Model.Session();
                        }
                        HttpContext.Current.Items[SESSION] = item;
                    }
                }
                else if (_session == null) // standalone
                {
                    _session = new Model.Session();
                    _sessionGet = true;
                }
                return (HttpContext.Current != null) ? (Model.Session)HttpContext.Current.Items[SESSION] : _session;
            }
            set
            {
                if (HttpContext.Current != null)
                    HttpContext.Current.Items[SESSION] = value;
                else
                    _session = value;
            }
        }

        internal static bool isValid
        {
            get { return (null != Obj) && (Obj.status == 1); }
        }

        internal static bool Exists
        {
            get
            {
                bool isValid;
                if (!_sessionGetTry) isValid = Session.isValid;
                return (_session != null && HttpContext.Current == null) || (HttpContext.Current != null && HttpContext.Current.Items[SESSION] != null);
            }
        }

        /// <summary>
        /// Determines if the session object is available for Http caching
        /// </summary>
        /// <param name="s"></param>
        /// <returns></returns>
        public static bool IsCachable(Model.Session s)
        {
            return s != null && s.status == 1 && !Session.nonCachingSessionDetails.Contains(s.detail);
        }

        /// <summary>
        /// Logs session if detail is a loggable event
        /// </summary>
        /// <param name="s"></param>
        public static void LogSessionStatus(Model.Session s)
        {
            if (s != null && loggingSessionDetails.Contains(s.detail))
            {
                string userId = String.IsNullOrWhiteSpace(s.userId) ? (String.IsNullOrWhiteSpace(Session.userId) ? BIACore.Security.User.DEFAULT_USERID : Session.userId) : s.userId;
                Activity.ActivityFactory.Log(HttpContext.Current.Request, s.appCode, userId, "AppLogin", s.detail);
            }
        }
    }
}
