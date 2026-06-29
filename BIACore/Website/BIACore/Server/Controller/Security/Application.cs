using System;
using System.Collections.Generic;
using System.Data;
using System.Dynamic;
using System.Linq;

using System.Web;
using System.Web.Http;

using BIACore.Model;
using BIACore.Server.Model;

namespace BIACore.Server.Controller
{
    public partial class SecurityController
    {
        [Obsolete("Switch to new biacore/api/application/application")]
        [AllowAnonymous]
        [HttpPost]
        [ActionName("Application")]
        public Application Application_Post([FromBody] SecurityRequest request)
        {
            DateTime start = DateTime.UtcNow;
            try
            {
                return Cached.Application(request.SessionId, request.AppCode);
            }
            catch (Exception e) { LogFactory.Exception(e); throw; }
            finally { LogFactory.Performance("biacore/api/security/application", DateTime.UtcNow.Subtract(start).TotalSeconds); }
        }
    }
}