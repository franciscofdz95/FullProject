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
    public class ExportEntry : Entry
    {
        public Int64 ExportLogId { get; set; }
        public DateTime ExportDate { get; set; }

        public string AppCode { get; set; }
        public string ExportUserSysm { get; set; }
        public string Route { get; set; }
        public string Params { get; set; }
        public string ExportType { get; set; }
        public Int32 RowCnt { get; set; }
        public Int32 ColumnCnt { get; set; }

        public ExportEntry()
        {
            ExportDate = DateTime.UtcNow;
            ExportUserSysm = Security.User.userId == null ? BIACore.Security.User.DEFAULT_USERID : Security.User.userId;
            AppCode = Settings.Config.AppCode;
        }

        internal override void Insert_SQL()
        {
            try
            {
                BIACore.Provider.SQL.ExecuteSQLRaw(Connections.Security, "biacoreObject.ExportLogInsert", CommandType.StoredProcedure, true, new DBParameter[] {
                    new DBParameter("@ExportDate",DbType.AnsiString,ExportDate),
                    new DBParameter("@ExportType",DbType.AnsiString,ExportType.ToString().ToUpper()),
                    new DBParameter("@AppCode",DbType.AnsiString,AppCode),
                    new DBParameter("@UserSysm",DbType.AnsiString,ExportUserSysm),
                    new DBParameter("@Route",DbType.AnsiString,Route),
                    new DBParameter("@Params",DbType.AnsiString,Params),
                    new DBParameter("@RowCnt",DbType.AnsiString,RowCnt),
                    new DBParameter("@ColumnCnt",DbType.AnsiString,ColumnCnt)
                });
            }
            catch { }
        }
    }
}
