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
        [ActionName("UserMapping")]
        public object UserMapping()
        {
            return LoadClientResult("[userObject].GetUserMapping", new DBParameter[] {
                new DBParameter("@sysm",DbType.AnsiString, BIACore.Security.Session.userId),
                new DBParameter("@env",DbType.AnsiString, BIACore.Settings.Config.BIAEnvironment)
            });
        }
        [HttpPost]
        [ActionName("UserRoles")]
        public object UserRoles()
        {
            return new { Roles = CurrentUser.GetAllRoles() };
        }
    }
}
