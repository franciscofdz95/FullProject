using System;
using System.Collections.Generic;
using System.Data;
using System.Dynamic;
using System.Linq;

using System.Web;
using System.Web.Http;

using BIACore.Model;
using BIACore.Web.Model;
using BIACore.Website.Controller.Model;

namespace BIACore.Website.Controller.Security
{
    public partial class AppSecurityController
    {
        [HttpPost]
        [ActionName("History")]
        public ClientResult History([FromBody] SecurityReport request)
        {
            if (!BIACore.Security.User.isSA)
                return null;

            return LoadPagedClientResult("dynAppObject.Security_LSP", request.ToDBParameter());
        }

        [HttpPost]
        [ActionName("ById")]
        public ClientResult ById([FromBody] dynamic request)
        {
            return LoadClientResult("biacoreObject.Security_ById",
                new DBParameter("@LogId", DbType.Int64, (request.LogId != null) ? request.LogId.Value : null));
        }
    }
}