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
        [ActionName("Active")]
        public ClientResult Active([FromBody] extjs.Parameter request)
        {
            if (!BIACore.Security.User.isSA)
                return null;

            return LoadPagedClientResult("dynAppObject.Security_Active", request.ToDBParameter());
        }

        [HttpPost]
        [ActionName("Logout")]
        public void Logout([FromBody] dynamic[] items)
        {
            if (!BIACore.Security.User.isSA)
                return;

            foreach (dynamic item in items)
            {
                Execute("secObject.Logout",
                    new DBParameter("@sessionId", DbType.AnsiString, (null != item.sessionId) ? item.sessionId.Value : null),
                    new DBParameter("@ip", DbType.AnsiString, HttpContext.Current.Request.UserHostAddress),
                    new DBParameter("@env", DbType.AnsiString, Settings.Config.BIAEnvironment)
                    );
            }
        }
    }
}