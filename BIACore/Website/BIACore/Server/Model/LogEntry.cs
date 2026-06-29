using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Data;
using System.Data.SqlClient;
using System.Threading;
using System.Threading.Tasks;
using System.Net.Http;

using BIACore.Model;
using BIACore.Extensions;

namespace BIACore.Server.Model
{
    public class LogEntry : Entry
    {
        public Guid TransactionId { get; set; }
        public DateTime Date { get; set; }

        private string _Server = Environment.MachineName;
        public string Server
        {
            get { return this._Server; }
            set
            {
                if (string.IsNullOrWhiteSpace(value)) _Server = Environment.MachineName;
                else _Server = value;
            }
        }
        public string UserId { get; set; }
        public string AppCode { get; set; }
        public Log.LogLevel Level { get; set; }
        public string Event { get; set; }
        public string Detail { get; set; }

        public LogEntry()
        {
            Date = DateTime.UtcNow;
            //Server = Environment.MachineName;
            UserId = BIACore.Security.User.DEFAULT_USERID;
            AppCode = Settings.Config.AppCode;
            Level = Log.LogLevel.Debug;
            TransactionId = LogFactory.TransactionId;
        }

        internal override void Insert_SQL()
        {
            try
            {
                // Convert to CSV/Log file..
                // Log Export

                BIACore.Provider.SQL.ExecuteSQLRaw(Connections.Security, "biacoreObject.Log_ISP_3", CommandType.StoredProcedure, true, new DBParameter[] {
                    new DBParameter("@TransactionId",DbType.AnsiString,TransactionId),
                    new DBParameter("@Date",DbType.AnsiString,Date),
                    new DBParameter("@Server",DbType.AnsiString,Server),
                    new DBParameter("@UserId",DbType.AnsiString,string.IsNullOrWhiteSpace(UserId) ? BIACore.Security.User.DEFAULT_USERID : UserId),
                    new DBParameter("@AppCode",DbType.AnsiString,AppCode),
                    new DBParameter("@Level",DbType.AnsiString,Level.ToString()),
                    new DBParameter("@Event",DbType.AnsiString,Event),
                    new DBParameter("@Detail",DbType.AnsiString,Detail)
                });
            }
            catch(Exception ex)
            {
                //Ignore Exception 
            }
        }

        public static string GetAppCodeFromURL(string path)
        {

            DataTable result = null;
            DBParameter[] args = new DBParameter[] { new DBParameter("@path", DbType.AnsiString, path) };
            using (SqlConnection con = new SqlConnection(Connections.Security))
            {
                using (SqlCommand cmd = new SqlCommand("appObject.usp_BIASecurity_GetApplicationFromPath", con))
                {
                    cmd.CommandTimeout = Settings.Sql.Timeout;
                    cmd.CommandType = CommandType.StoredProcedure;
                    if (null != args)
                        foreach (DBParameter arg in args)
                            cmd.Parameters.Add(arg.ToSQLParameter());

                    con.Open();
                    using (SqlDataAdapter adapter = new SqlDataAdapter(cmd))
                    {
                        result = new DataTable();
                        adapter.Fill(result);
                    }
                }
            }

            List<Dictionary<string, string>> list = (result == null) ? new List<Dictionary<string, string>>() : result.ToList<Dictionary<string, string>>();
            Dictionary<string, string> record = (list.Count == 1) ? list[0] : default(Dictionary<string, string>);
            return record["AppCode"];
        }
    }
}
