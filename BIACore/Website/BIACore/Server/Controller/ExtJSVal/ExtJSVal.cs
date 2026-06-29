using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;

using System.Web;
using System.Web.Http;

using BIACore.Model;
using BIACore.Server.Model;
using BIACore.Extensions;

namespace BIACore.Server.Controller
{
    public partial class ExtJSValController
    {
        [AllowAnonymous]
        [HttpPost]
        [ActionName("ExtJSVal")]
        public object ExtJSVal_Post([FromBody] dynamic request)
        {
            DateTime start = DateTime.UtcNow;
            try
            {
                string SessionId = BIACore.Server.CurrentContext.GetSessionId(request);

                return ValidateClassNameToFileStructure(
                    request != null && request.DistinctClassNames != null ? request.DistinctClassNames.Value : null,
                    SessionId,
                    request != null && request.AppCode != null ? request.AppCode.Value : null);
            }
            catch (Exception e) { LogFactory.Exception(e); throw; }
            finally { LogFactory.Performance("biacore/api/extjsval/extjsval", DateTime.UtcNow.Subtract(start).TotalSeconds); }
        }
    }
}