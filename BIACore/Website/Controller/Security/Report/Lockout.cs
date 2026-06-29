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

using extjs = BIACore.Web.Model.ExtJS;

namespace BIACore.Website.Controller.Security
{
    public partial class AppSecurityController
    {
        [HttpPost]
        [ActionName("Lockout")]
        public ClientResult Lockout([FromBody] SecurityReport request)
        {
            if (!BIACore.Security.User.isSA)
                return null;

            return LoadPagedClientResult("dynAppObject.Security_Lockout", request.ToDBParameter());
        }

        [HttpPost]
        [ActionName("Unlock")]
        public void Unlock([FromBody] dynamic[] items)
        {
            if (!BIACore.Security.User.isSA)
                return;

            foreach (dynamic item in items)
            {
                Execute("biacoreObject.Security_Unlock", new DBParameter("@UserId", DbType.AnsiString, (null != item.UserId) ? item.UserId.Value : null));
            }
        }
    }
}