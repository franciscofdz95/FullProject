using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;

using System.Web;
using System.Web.Http;

using BIACore.Model;
using BIACore.Extensions;

namespace BIACore.Server.Controller
{
    public partial class SessionController
    {
        [AllowAnonymous]
        [HttpPost]
        [ActionName("SessionSecureStart")]
        public dynamic SessionSecureStart_Post([FromBody] dynamic request)
        {
            DateTime start = DateTime.UtcNow;
            try
            {

                string UserId = null;
                string AppCode = null;
                string Source = null;
                bool Anonymous = false;

                if (request != null)
                {
                    //UserId = request.UserId != null ? BIACore.Utility.Encryption.EncryptRIGHT.Decrypt(request.UserId.Value) : null;
                    UserId = request.UserId != null ? request.UserId.Value : null;
                    AppCode = request.AppCode != null ? request.AppCode.Value : "biasecurity";
                    Source = request.Source != null ? request.Source.Value : "unknown";
                    Anonymous = request.Anonymous != null ? request.Anonymous.Value : false;
                }

                dynamic authReturn = BIACore.Server.Controller.AuthenticationController.RemoteStartSession(UserId, null, AppCode, Source, null, null, false, Anonymous);

                return new 
                { 
                    SessionId = (string)BIACore.Server.Controller.LoginController.GetTokenValue(authReturn.Token).SessionId,
                    SechashId = (string)authReturn.SecHash,
                    Success = (bool)authReturn.Success 
                };

            }
            catch (Exception e) { LogFactory.Exception(e); throw; }
            finally { LogFactory.Performance("biacore/api/session/sessionsecurestart", DateTime.UtcNow.Subtract(start).TotalSeconds); }
        }

        [AllowAnonymous]
        [HttpPost]
        [ActionName("Session")]
        public Session Session_Post([FromBody] dynamic request)
        {
            DateTime start = DateTime.UtcNow;
            try
            {
                string SessionId = BIACore.Server.CurrentContext.GetSessionId(request);

                //LogFactory.Error("Session Test Session: {0} - request: {1} - IP: {2}", new object[] { SessionId, request, HttpContext.Current.Request.UserHostAddress });
                //LogFactory.Error("Session Test Session: {0} - request: {1} - IP: {2}", new object[] { SessionId, request, HttpContext.Current.Request.UserHostAddress });

                return Cached.Session(
                    SessionId,
                    (request != null && request.AppCode != null) ? request.AppCode.Value : null,
                    HttpContext.Current.Request.UserHostAddress,
                    (request != null && request.Anonymous != null) ? request.Anonymous.Value : false);
            }
            catch (Exception e) { LogFactory.Exception(e); throw; }
            finally { LogFactory.Performance("biacore/api/session/session", DateTime.UtcNow.Subtract(start).TotalSeconds); }
        }

        [AllowAnonymous]
        [HttpPost]
        [ActionName("SessionApps")]
        public List<SessionApps> SessionApps_Post([FromBody] dynamic request)
        {
            DateTime start = DateTime.UtcNow;
            try
            {
                string SessionId = BIACore.Server.CurrentContext.GetSessionId(request);

                return Cached.SessionApps(SessionId);
            }
            catch (Exception e) { LogFactory.Exception(e); throw; }
            finally { LogFactory.Performance("biacore/api/session/session", DateTime.UtcNow.Subtract(start).TotalSeconds); }
        }

        [AllowAnonymous]
        [HttpPost]
        [ActionName("Status")]
        public object Status_Post([FromBody] dynamic request)
        {
            DateTime start = DateTime.UtcNow;
            try
            {
                string SessionId = BIACore.Server.CurrentContext.GetSessionId(request);

                return Uncached.sessionStatus(
                    SessionId,
                    (request != null && request.AppCode != null) ? request.AppCode.Value : null);
            }
            catch (Exception e) { LogFactory.Exception(e); throw; }
            finally { LogFactory.Performance("biacore/api/session/status", DateTime.UtcNow.Subtract(start).TotalSeconds); }
        }

        [AllowAnonymous]
        [HttpPost]
        [ActionName("SessionClient")]
        public void SessionClient_Post([FromBody] dynamic request)
        {
            DateTime start = DateTime.UtcNow;
            try
            {
                Uncached.sessionClient(
                    (request != null && request.SecHashId != null) ? request.SecHashId.Value : null,
                    (request != null && request.UserId != null) ? request.UserId.Value : null,
                    (request != null && request.IpAddress != null) ? request.IpAddress.Value : null);
            }
            catch (Exception e) { LogFactory.Exception(e); throw; }
            finally { LogFactory.Performance("biacore/api/session/status", DateTime.UtcNow.Subtract(start).TotalSeconds); }
        }
    }
}