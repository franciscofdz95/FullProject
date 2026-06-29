using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

using System.Data;

using BIACore.Model;

using extjs = BIACore.Web.Model.ExtJS;

namespace BIACore.Website.Controller.Model
{
    public class SecurityFilter : extjs.Parameter
    {
        public string query { get; set; }

        private SecurityFilter() { }

        public override DBParameter[] ToDBParameter()
        {
            List<DBParameter> args = new List<DBParameter>();

            if (!string.IsNullOrWhiteSpace(query)) args.Add(new DBParameter("@search", DbType.AnsiString, query));

            return args.ToArray();
        }
    }
}
