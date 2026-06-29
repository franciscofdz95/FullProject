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
    public partial class ImpersonationController
    {
        [AllowAnonymous]
        [HttpPost]
        [ActionName("Impersonate")]
        public object Impersonate_Post([FromBody] dynamic request)
        {
            DateTime start = DateTime.UtcNow;
            try
            {
                string SessionId = BIACore.Server.CurrentContext.GetSessionId(request);

                return impersonate(
                    SessionId,
                    (request != null && request.AppCode != null) ? request.AppCode.Value : null,
                    ((request != null && request.ImpersonateId != null) ? request.ImpersonateId.Value : null).ToString());
            }
            catch (Exception e) { LogFactory.Exception(e); throw; }
            finally { LogFactory.Performance("biacore/api/impersonation/impersonate", DateTime.UtcNow.Subtract(start).TotalSeconds); }
        }
    }
}