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
    public class VersionEntry : Entry
    {
        public string AppCode { get; set; }
        public string Server { get; set; }
        public string Version { get; set; }

        public VersionEntry() { }

        internal override void Insert_SQL()
        {
            try
            {
                BIACore.Provider.SQL.ExecuteSQLRaw(Connections.Security, "biacoreObject.Version_ISP", CommandType.StoredProcedure, true, new DBParameter[] {
                    new DBParameter("@appCode",DbType.AnsiString,AppCode),
                    new DBParameter("@server",DbType.AnsiString,Server),
                    new DBParameter("@version",DbType.AnsiString,Version)
                });
            }
            catch(Exception ex) { }
        }

    }
}
