using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

using System.Data;

using BIACore.Model;
using extjs = BIACore.Web.Model.ExtJS;

namespace BIASecurity.WebAPI.Model
{
    public class LogFilter : extjs.Parameter
    {
        public string query { get; set; }
        public string search { get; set; }

        private LogFilter() { }

        public override DBParameter[] ToDBParameter()
        {
            List<DBParameter> args = new List<DBParameter>();

            if (!string.IsNullOrEmpty(query)) args.Add(new DBParameter("@search", DbType.AnsiString, query));
            if (!string.IsNullOrEmpty(search)) args.Add(new DBParameter("@search", DbType.AnsiString, search));

            //List<string> apps = Secure.AdminApps(BIACore.Security.User.userId);
            //args.Add(new DBParameter("@appCode", DbType.AnsiString, string.Join(",", apps)));

            args.Add(new DBParameter("@CurrentUserId", DbType.Int64, BIACore.Security.User.userId));

            return args.ToArray();
        }
    }
}
