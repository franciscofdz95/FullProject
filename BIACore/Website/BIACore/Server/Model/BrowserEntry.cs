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

namespace BIACore.Server.Model
{
    public class BrowserEntry : Entry
    {
        public string UserId { get; set; }
        public string AppCode { get; set; }
        public string Browser { get; set; }

        public BrowserEntry()
        {
            UserId = "";
            AppCode = Settings.Config.AppCode;
            Browser = "";
        }
        
        internal override void Insert_SQL()
        {
            try
            {
                // don't use the provider based calls here - otherwise we get into nasty logging loops.
                // and nobody wants that.
                if (!string.IsNullOrWhiteSpace(Browser) && !string.IsNullOrWhiteSpace(UserId))
                {
                    BIACore.Provider.SQL.ExecuteSQLRaw(Connections.Security, "biacoreObject.Browser_ISP", CommandType.StoredProcedure, true, new DBParameter[] {
                        new DBParameter("@UserId",DbType.AnsiString,UserId),
                        new DBParameter("@AppCode",DbType.AnsiString,AppCode),
                        new DBParameter("@Browser",DbType.AnsiString,Browser)
                    });
                }
            }
            catch { }
        }
    }
}
