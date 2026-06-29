using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Data;
using System.Data.SqlClient;
using System.Threading;
using System.Net.Http;
using BIACore.Model;

namespace BIACore.Server.Model
{
    public class ConnectionEntry : Entry
    {
        public string AppCode { get; set; }
        public string Server { get; set; }
        public string ConfigName { get; set; }
        public string ConnectionString { get; set; }
        public string Provider { get; set; }

        public ConnectionEntry() { }

        internal override void Insert_SQL()
        {
            try
            {
                BIACore.Provider.SQL.ExecuteSQLRaw(Connections.Security, "appObject.UpsertAppWebConfigConnectionString", CommandType.StoredProcedure, true, new DBParameter[] {
                    new DBParameter("@server",DbType.AnsiString,Server),
                    new DBParameter("@appCode",DbType.AnsiString,AppCode),
                    new DBParameter("@configName",DbType.AnsiString,ConfigName),
                    new DBParameter("@connectionString",DbType.AnsiString,ConnectionString),
                    new DBParameter("@provider",DbType.AnsiString,Provider)
                });
            }
            catch { }
        }

    }
}
