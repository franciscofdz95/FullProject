using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

using System.Data;
using System.Data.SqlClient;
using BIACore.Model;

namespace BIACore.Server.Model
{
    internal class AuthLog
    {
        internal Guid TransactionId { get; set; }
        internal string Client { get; set; }
        internal string User { get; set; }
        internal string Target { get; set; }
        internal string Event { get; set; }
        internal string Message { get; set; }

        private DateTime Date { get; set; }
        private string Server { get; set; }

        internal AuthLog()
        {
            Server = Environment.MachineName;
            Date = DateTime.UtcNow;
        }

        internal void Insert()
        {
            try
            {
                BIACore.Provider.SQL.ExecuteSQLRaw(Connections.Security, "secObject.LoginEvent", CommandType.StoredProcedure, true, new DBParameter[] {
                    new DBParameter("@TransactionId",DbType.AnsiString,TransactionId),
                    new DBParameter("@Server",DbType.AnsiString,Server),
                    new DBParameter("@Ip",DbType.AnsiString,Client),
                    new DBParameter("@UserId",DbType.AnsiString,User),
                    new DBParameter("@TargetId",DbType.AnsiString,Target),
                    new DBParameter("@LogDate",DbType.AnsiString,Date),
                    new DBParameter("@Event",DbType.AnsiString,Event),
                    new DBParameter("@Detail",DbType.AnsiString,Message)
                });
            }
            catch { }
        }
    }
}