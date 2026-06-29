using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;

using System.Web;
using System.Web.Http;

using BIACore.Model;
using BIACore.Server.Model;

namespace BIACore.Server.Controller
{
    public partial class SecurityController
    {
        [Obsolete("Switch to new biacore/api/session/session")]
        [AllowAnonymous]
        [HttpPost]
        [ActionName("Session")]
        public Session Session_Post([FromBody] SecurityRequest request)
        {
            DateTime start = DateTime.UtcNow;
            try
            {
                return Cached.Session(request.SessionId, request.AppCode, HttpContext.Current.Request.UserHostAddress);
            }
            catch (Exception e) { LogFactory.Exception(e); throw; }
            finally { LogFactory.Performance("biacore/api/security/session", DateTime.UtcNow.Subtract(start).TotalSeconds); }
        }
    }
}