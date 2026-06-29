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
    public partial class SmartFilterController
    {
        [AllowAnonymous]
        [HttpPost]
        [ActionName("AppDimConfig")]
        public object AppDimConfig_Post([FromBody] dynamic request)
        {
            DateTime start = DateTime.UtcNow;
            try
            {
                return Cached.ApplicationDimensionConfig(request != null && request.AppCode != null ? request.AppCode.ToString() : null);
            }
            catch (Exception e) { LogFactory.Exception(e); throw; }
            finally { LogFactory.Performance("biacore/api/SmartFilter/AppDimConfig_Post", DateTime.UtcNow.Subtract(start).TotalSeconds); }
        }
    }
}