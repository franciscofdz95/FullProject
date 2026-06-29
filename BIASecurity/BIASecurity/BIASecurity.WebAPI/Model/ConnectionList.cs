using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

using System.Data;

using BIACore.Model;
using extjs = BIACore.Web.Model.ExtJS;

namespace BIASecurity.WebAPI.Model
{
    public class ConnectionList : extjs.Parameter
    {
        public string search { get; set; }
        public string category { get; set; }
        public bool? showInactive { get; set; }
        public bool? showEnvironmentMismatch { get; set; }
        public int? environmentId { get; set; }
        private ConnectionList() { }

        public override DBParameter[] ToDBParameter()
        {
            List<DBParameter> args = new List<DBParameter>();

            if (!string.IsNullOrEmpty(search)) args.Add(new DBParameter("@search", DbType.AnsiString, search));
            if (!string.IsNullOrEmpty(category)) args.Add(new DBParameter("@category", DbType.AnsiString, category));
            if (showInactive != null) args.Add(new DBParameter("@showInactive", DbType.AnsiString, showInactive));
            if (showEnvironmentMismatch != null) args.Add(new DBParameter("@showEnvironmentMismatch", DbType.AnsiString, showEnvironmentMismatch));
            if (environmentId != null) args.Add(new DBParameter("@environmentId", DbType.AnsiString, environmentId));

            args.AddRange(base.ToDBParameter());
            return args.ToArray();
        }
    }
}
