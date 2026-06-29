using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

using System.Data;

using BIACore.Model;
using extjs = BIACore.Web.Model.ExtJS;

namespace BIACore.Website.Controller.Model
{
    /// <summary>
    /// We are separate from BIACore.Model because we do not belong
    /// on the client side; it's only used by the server for displaying
    /// Log Entries to anybody using the server's Log Browser.
    /// </summary>
    public class LogFilter : extjs.Parameter
    {
        public string query { get; set; }

        private LogFilter() { }

        public override DBParameter[] ToDBParameter()
        {
            List<DBParameter> args = new List<DBParameter>();

            if (!string.IsNullOrWhiteSpace(query)) args.Add(new DBParameter("@search", DbType.AnsiString, query));

            List<string> apps = Secure.AdminApps(BIACore.Security.User.userId);
            args.Add(new DBParameter("@appCode", DbType.AnsiString, string.Join(",", apps)));

            return args.ToArray();
        }
    }
}