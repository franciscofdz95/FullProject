using System;

namespace BIACore.Export
{
    internal class Factory
    {
        internal class ExportEntry
        {
            public Int64 ExportLogId { get; set; }
            public DateTime ExportDate { get; set; }
            public string ExportType { get; set; }

            public string AppCode { get; set; }
            public string ExportUserSysm { get; set; }
            public string Route { get; set; }
            public string Params { get; set; }
            public int RowCnt { get; set; }
            public int ColumnCnt { get; set; }

            public ExportEntry()
            {
                ExportDate = DateTime.UtcNow;
                ExportUserSysm = Security.User._userId;
                AppCode = Settings.Config.AppCode;
            }

            public void Insert()
            {
                try
                {
                    System.Threading.Tasks.Task.Factory.StartNew((l) => {
                        Internal.Request.ExportLog((ExportEntry)l);
                    }, this);
                    //Internal.Request.ExportLog(this);
                }
                catch { }
            }
        }

        internal static void Insert(string ExportType, string Route, string Params, int RowCnt, int ColumnCnt)
        {
            ExportEntry item = new ExportEntry()
            {
                ExportType = ExportType,
                Route = Route,
                Params = Params,
                RowCnt = RowCnt,
                ColumnCnt = ColumnCnt
            };
            item.Insert();
        }
    }
}
