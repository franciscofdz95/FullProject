using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

using System.Data;

using BIACore.Model;
using extjs = BIACore.Web.Model.ExtJS;

namespace BIASecurity.WebAPI.Model
{
    public class UsageGraph : extjs.Parameter
    {
        public string appCode { get; set; }
        public string time { get; set; }
        public string usage { get; set; }

        private UsageGraph() { }

        public override DBParameter[] ToDBParameter()
        {
            List<DBParameter> args = new List<DBParameter>();

            if (!string.IsNullOrEmpty(appCode)) args.Add(new DBParameter("@appCode", DbType.AnsiString, appCode));
            if (!string.IsNullOrEmpty(time)) args.Add(new DBParameter("@time", DbType.AnsiString, time));
            if (!string.IsNullOrEmpty(usage)) args.Add(new DBParameter("@usage", DbType.AnsiString, usage));

            args.AddRange(base.ToDBParameter());

            return args.ToArray();
        }
    }
}
