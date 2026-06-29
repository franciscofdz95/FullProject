using System;
using System.Collections.Generic;
using System.Data;
using System.Web.Http;

using BIACore.Model;
using BIACore.Web.Model;
using BIASecurity.WebAPI.Model;

namespace BIASecurity.WebAPI.Controller
{
    public partial class BIASecurityController
    {
        [HttpPost]
        [HttpGet]
        [ActionName("GetApplicationList")]
        public ClientResult GetApplicationList([FromBody] ApplicationList request)
        {
            return LoadPagedClientResult("dynAppObject.AppList", request.ToDBParameter());
        }
        [HttpPost]
        [HttpGet]
        [ActionName("AppListUsageGraph")]
        public ClientResult AppListUsageGraph([FromBody] UsageGraph request)
        {
            return LoadClientResult("appObject.AppListUsageGraph", request.ToDBParameter());
        }

        [HttpPost]
        [HttpGet]
        [ActionName("UpdateApplicationQuickSetting")]
        public ClientResult UpdateApplicationQuickSetting([FromBody] dynamic request)
        {
            if (BIACore.Security.User.isSA)
            {
                return LoadClientResult("appObject.UpdateApplicationQuickSetting",
                    new DBParameter("@appCode", DbType.String, request.appCode.Value),
                    new DBParameter("@property", DbType.String, request.property.Value),
                    new DBParameter("@value", DbType.String, request.value.Value),
                    new DBParameter("@value2", DbType.String, (request.value2 != null) ? request.value2.Value : null));
            }

            return null;
        }
    }
}
