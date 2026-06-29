using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

using System.Data;

using BIACore.Model;
using extjs = BIACore.Web.Model.ExtJS;

namespace BIACore.Website.Controller.Model
{
    /// <summary>
    /// We are separate from BIACore.Model because we do not belong
    /// on the client side; it's only used by the server for displaying
    /// Log Entries to anybody using the server's Log Browser.
    /// </summary>
    public class LogReport : extjs.Parameter
    {
        public Int64? LogId { get; set; }
        public DateTime? BeginDate { get; set; }
        public DateTime? EndDate { get; set; }
        public string[] AppCode { get; set; }
        public string[] Server { get; set; }
        public string[] UserId { get; set; }
        public string[] Level { get; set; }
        //public string[] Event { get; set; }
        public string[] TransactionId { get; set; }
        public string Event { get; set; }
        public string Search { get; set; }

        private LogReport() { }

        public override DBParameter[] ToDBParameter()
        {
            Secure_AppCode();

            List<DBParameter> args = new List<DBParameter>();

            if (null != LogId) args.Add(new DBParameter("@LogId", DbType.Int64, LogId.Value));
            if (null != BeginDate) args.Add(new DBParameter("@BeginDate", DbType.DateTime, BeginDate.Value));
            if (null != EndDate) args.Add(new DBParameter("@EndDate", DbType.DateTime, EndDate.Value));

            if (null != AppCode && AppCode.Length > 0) args.Add(new DBParameter("@AppCode", DbType.AnsiString, string.Join(",", AppCode)));
            if (null != Server && Server.Length > 0) args.Add(new DBParameter("@Server", DbType.AnsiString, string.Join(",", Server)));
            if (null != UserId && UserId.Length > 0) args.Add(new DBParameter("@UserId", DbType.AnsiString, string.Join(",", UserId)));
            if (null != Level && Level.Length > 0) args.Add(new DBParameter("@Level", DbType.AnsiString, string.Join(",", Level)));
            //if (null != Event && Event.Length > 0) args.Add(new DBParameter("@Event", DbType.AnsiString, string.Join(",", Event)));
            if (null != TransactionId && TransactionId.Length > 0) args.Add(new DBParameter("@TransactionId", DbType.AnsiString, string.Join(",", TransactionId)));

            if (!string.IsNullOrWhiteSpace(Event)) args.Add(new DBParameter("@Event", DbType.AnsiString, Event));
            if (!string.IsNullOrWhiteSpace(Search)) args.Add(new DBParameter("@Detail", DbType.AnsiString, Search));

            args.AddRange(base.ToDBParameter());
            return args.ToArray();
        }

        private void Secure_AppCode()
        {
            List<string> apps = Secure.AdminApps(BIACore.Security.User.userId);

            List<string> valid = new List<string>();

            if (AppCode == null || AppCode.Length == 0)
            {
                valid = apps;
            }
            else
            {
                foreach (string app in AppCode)
                {
                    if (apps.Contains(app, StringComparer.InvariantCultureIgnoreCase))
                        valid.Add(app);
                }
            }
            AppCode = valid.ToArray();
        }
    }
}