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
        [ActionName("List")]
        public List<object> List_Post([FromBody] dynamic request)
        {
            DateTime start = DateTime.UtcNow;
            try
            {
                string SessionId = BIACore.Server.CurrentContext.GetSessionId(request);

                return list(
                    SessionId,
                    (request != null && request.AppCode != null) ? request.AppCode.Value : null);
            }
            catch (Exception e)
            {
                LogFactory.Message(String.Format("SessionId: {0}, AppCode: {1}", Web.CurrentContext.GetSessionCookieValue(), (request != null && request.AppCode != null) ? request.AppCode.Value : null));
                LogFactory.Exception(e);
                throw;
            }
            finally { LogFactory.Performance("biacore/api/impersonation/list", DateTime.UtcNow.Subtract(start).TotalSeconds); }
        }
    }
}