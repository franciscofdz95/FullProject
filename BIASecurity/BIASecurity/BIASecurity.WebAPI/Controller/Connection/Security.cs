using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BIASecurity.WebAPI.Controller.Connection
{
    public static class Security
    {
        public static bool IsConnectionAdmin()
        {
            return CurrentUser.GetRoleByCode("ConnAdmin", "App") != null || BIACore.Security.User.isSA;
        }
        public static bool IsBIAAppManager()
        {
            return BIASecurity.WebAPI.Controller.Connection.Security.IsConnectionAdmin() || CurrentUser.GetRoleByCode("AppDevMgr", "Dept") != null || BIACore.Security.User.isSA;
        }
        public static bool IsBIADeveloper()
        {
            return BIASecurity.WebAPI.Controller.Connection.Security.IsBIAAppManager() || CurrentUser.GetRoleByCode("AppDeveloper", "Dept") != null || BIACore.Security.User.isSA;
        }
    }
}