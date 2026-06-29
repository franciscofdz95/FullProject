using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

using System.Data;

using BIACore.Model;
using extjs = BIACore.Web.Model.ExtJS;

namespace BIASecurity.WebAPI.Model
{
    public class DatabaseRecord : extjs.Parameter
    {
        public int? DatabaseId { get; set; }
        public string DatabaseName { get; set; }
        public int? EnvironmentId { get; set; }
        public string GlobalName { get; set; }
        public bool Active { get; set; }
        public DatabaseRecord() { }

        public override DBParameter[] ToDBParameter()
        {
            List<DBParameter> args = new List<DBParameter>();

            if (DatabaseId != null) args.Add(new DBParameter("@databaseId", DbType.AnsiString, DatabaseId));

            if (EnvironmentId != null) args.Add(new DBParameter("@environmentId", DbType.AnsiString, EnvironmentId));
            if (!string.IsNullOrEmpty(DatabaseName)) args.Add(new DBParameter("@databaseName", DbType.AnsiString, DatabaseName));
            if (!string.IsNullOrEmpty(GlobalName)) args.Add(new DBParameter("@globalName", DbType.AnsiString, GlobalName));

            //args.Add(new DBParameter("@databaseId", DbType.AnsiString, DatabaseId));
            args.Add(new DBParameter("@active", DbType.AnsiString, Active));

            return args.ToArray();
        }
    }
}
