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
        [ActionName("UserFilter")]
        public ClientResult UserFilter([FromBody] dynamic request)
        {
            return LoadClientResult("dimObject.GetUserFilter", new DBParameter[] {
                new DBParameter("@query",DbType.AnsiString, request.query != null ? request.query.Value : null)
            });
        }

        [HttpPost]
        [ActionName("ApplicationFilter")]
        public ClientResult ApplicationFilter([FromBody] dynamic request)
        {
            return LoadClientResult("dimObject.GetApplicationFilter", new DBParameter[] {
                new DBParameter("@query",DbType.AnsiString, request.query != null ? request.query.Value : null)
            });
        }

        [HttpPost]
        [ActionName("GetSubscriptionTypes")]
        public ClientResult GetSubscriptionTypes([FromBody] dynamic request)
        {
            return LoadClientResult("[dimObject].[GetSubscriptionTypes]", null);
        }
    }
}
