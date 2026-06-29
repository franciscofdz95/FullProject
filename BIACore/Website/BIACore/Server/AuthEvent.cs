using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

using System.Threading.Tasks;

using BIACore.Server.Model;

namespace BIACore.Server
{
    internal enum Auth
    {
        // used by Authenticate Route
        Begin,      // request start, timing
        End,        // request complete, timing
        Exception,  // unhandled error somewhere

        // used by Authenticator
        Invalid,    // user/pass missing
        Success,    // Session created
        Error,      // retry fail, session start fail
        Lockout,    // user in lockout period

        // success-but-fails
        LoginAs,    // user not allowed to use LoginAs
        NoAccess,   // user does not currently have access to App
        Offline,    // app is currently offline
        NewUser,    // user does not exist yet

        // generic tracking
        BIAAuthSuccess,
        BIAAuthFail,
        BIAAuthError,

        // service tracking
        ITAuthSuccess,
        ITAuthFail,
        ITAuthError,
        ITAuthUnkown,
        ITAuthCoreLog,

        // service tracking
        CacheSuccess,
        CacheFail,
        CacheError,

        // logout
        Logout,

        // Broken
        Broken,

        // Bad Password log
        BadPassword,

        //WS4ID Error Log
        WS4IDError
    }

    internal class AuthEvent
    {
        private const string TRANSACTION_ID = "BIAAuth_TransactionId";
        internal static Guid TransactionId
        {
            get
            {
                if (HttpContext.Current.Items[TRANSACTION_ID] == null)
                    HttpContext.Current.Items[TRANSACTION_ID] = Guid.NewGuid();

                return (Guid)HttpContext.Current.Items[TRANSACTION_ID];
            }
        }

        private const string USER_ID = "BIAAuth_UserId";
        internal static string UserId
        {
            get { return (string)HttpContext.Current.Items[USER_ID] ?? BIACore.Security.User.DEFAULT_USERID; }
            set { HttpContext.Current.Items[USER_ID] = value; }
        }

        private const string TARGET_ID = "BIAAuth_TargetId";
        internal static string TargetId
        {
            get { return (string)HttpContext.Current.Items[TARGET_ID]; }
            set { HttpContext.Current.Items[TARGET_ID] = value; }
        }

        internal static void Log(Auth Event, string Message)
        {
            // copy elements to be used in the task locally.
            // http://blogs.msdn.com/b/ericlippert/archive/2009/11/12/closing-over-the-loop-variable-considered-harmful.aspx
            AuthLog log = new AuthLog()
            {
                TransactionId = TransactionId,
                Client = HttpContext.Current.Request.UserHostAddress,
                User = UserId,
                Target = TargetId,
                Event = Event.ToString(),
                Message = Message
            };

            Task.Factory.StartNew((l) => {
                log.Insert();
            },log);
        }

        internal static void Log(Auth Event, string format, params object[] args)
        {
            Log(Event, string.Format(format, args));
        }
    }
}