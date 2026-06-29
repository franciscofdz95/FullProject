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
        [ActionName("Search")]
        public object Search_Post([FromBody] dynamic request)
        {
            DateTime start = DateTime.UtcNow;
            try
            {
                string SessionId = BIACore.Server.CurrentContext.GetSessionId(request);

                return search(
                    SessionId,
                    (request != null && request.AppCode != null) ? request.AppCode.Value : null,
                    (request != null && request.Query != null) ? request.Query.Value : null);
            }
            catch (Exception e) { LogFactory.Exception(e); throw; }
            finally { LogFactory.Performance("biacore/api/impersonation/search", DateTime.UtcNow.Subtract(start).TotalSeconds); }
        }
    }
}