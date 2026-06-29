using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

using System.Threading;
using System.Web.Http;
using BIACore.Web.Model;
using BIACore.Server.Model;
using BIACore.Extensions;

namespace BIACore.Server.Controller
{
    public partial class AuthenticationController
    {
        // number of times to retry on 'Error' condition.
        /// <summary>
        /// Number of attempts to send to the same authority in the event
        /// of AuthResult.Error (which is a non-true/false authorization 
        /// result caused by e.g. Transport Error).
        /// 
        /// Worst case runtime for this service is 
        /// (RETRY_COUNT - 1) * 2 * RETRY_INTERVAL
        /// </summary>
        private static int RETRY_COUNT = 3;
        /// <summary>
        /// ms to wait between attempts on the same authority in the event 
        /// of AuthResult.Error (which is a non-true/false authorization 
        /// result caused by e.g. Transport Error).
        /// 
        /// Worst case runtime for this service is 
        /// (RETRY_COUNT - 1) * 2 * RETRY_INTERVAL
        /// </summary>
        private static int RETRY_INTERVAL = 3 * 1000;

        //[AllowAnonymous]
        //[HttpPost]
        //[ActionName("Authenticate")]
        public dynamic Authenticate_Post([FromBody] dynamic request)
        {
            DateTime start = DateTime.UtcNow;

            try
            {
                //if (HttpContext.Current.Request.UrlReferrer.Host == Settings.Config.Server && HttpContext.Current.Request.UrlReferrer.PathAndQuery.Split('?')[0].IndexOf("/Login.aspx") > -1)
                //{
                HttpCookie cookie = HttpContext.Current.Request.Cookies[API.SECHASH_COOKIE];
                AuthEvent.Log(Auth.Begin, "{0}", (cookie != null) ? cookie.Value : Token.GetToken(HttpContext.Current.Request.UserHostAddress));
                string target = null;
                string user = (null != request && null != request.User) ? request.User.Value : null;
                string pass = (null != request && null != request.Pass) ? request.Pass.Value : null;
                string appCode = (null != request && null != request.AppCode) ? request.AppCode.Value : null;
                string source = (null != request && null != request.Source) ? request.Source.Value : null;
                bool isLocalHost = (null != request && null != request.isLocalHost) ? request.isLocalHost.Value : false;

                // impersonation: target=user
                if (!string.IsNullOrWhiteSpace(user) && user.Contains('='))
                {
                    string[] parts = user.Split('=');
                    if (parts.Length != 2)
                    {
                        AuthEvent.Log(Auth.Invalid, "Invalid LoginAs format '{0}'.", user);
                        return new { Success = false, Invalid = true, Error = MSG_INVALID };
                    }
                    target = parts[0];
                    user = parts[1];
                }

                // set logging requirements
                AuthEvent.UserId = user;
                AuthEvent.TargetId = target;

                return Authenticator(user, pass, target, appCode, source, isLocalHost);
                //}
                //else return new { Success = false, Error = "BRONCO" };
            }
            catch (Exception e)
            {
                AuthEvent.Log(Auth.Exception, e.Message);
                return new { Success = false, Unknown = true, Message = MSG_ERROR };
            }
            finally { AuthEvent.Log(Auth.End, "{0}", DateTime.UtcNow.Subtract(start).TotalMilliseconds); }
        }

        //[AllowAnonymous]
        ////[HttpGet]
        //[HttpPost]
        //[ActionName("ValidateUsername")]
        //public object ValidateUsername_Post([FromBody] dynamic request, string UserId = null)
        //{
        //    DateTime start = DateTime.UtcNow;
        //    UserId = (UserId == null && request != null && request.UserId != null ? request.UserId.Value : UserId);
        //    UserId = UserId == null ? "" : UserId;
        //    try
        //    {
        //        string serverConfig = Settings.Config.Server;
        //        if (serverConfig.IndexOf("//") > -1) serverConfig = serverConfig.Split("//")[1];
        //        if (serverConfig.IndexOf(":") > -1) serverConfig = serverConfig.Split(":")[0];
        //        if (HttpContext.Current.Request.UrlReferrer.Host == serverConfig && HttpContext.Current.Request.UrlReferrer.PathAndQuery.Split('?')[0].IndexOf("/Login.aspx") > -1)
        //        {
        //            return Cached.Username(UserId);
        //        }
        //        else return new { Success = false, Error = "BRONCO" };
        //    }
        //    catch (Exception e) { LogFactory.Exception(e); throw; }
        //    finally { LogFactory.Performance("biacore/api/user/validateusername", DateTime.UtcNow.Subtract(start).TotalSeconds); }
        //}
    }
}