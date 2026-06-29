using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

using System.Data;
using BIACore.Provider;
using BIACore.Model;

namespace BIACore.Website.Controller.Model
{
    public static class Secure
    {
        public static List<string> AdminApps(string userId)
        {
            return SQL.ExecuteToString(Connections.Security, "secObject.getAppList",
                new DBParameter("@userId", DbType.AnsiString, userId));
        }
    }
}