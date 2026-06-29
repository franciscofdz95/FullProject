using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

using System.Data;

using BIACore.Model;
using extjs = BIACore.Web.Model.ExtJS;

namespace BIASecurity.WebAPI.Model
{
    /// <summary>
    /// We are separate from BIACore.Model because we do not belong
    /// on the client side; it's only used by the server for displaying
    /// Log Entries to anybody using the server's Log Browser.
    /// </summary>
    public class LogReport : extjs.Parameter
    {
        public Int64? LogId { get; set; }
        public Int64? StartLogId { get; set; }
        public Int64? EndLogId { get; set; }
        public DateTime? StartLogDate { get; set; }
        public DateTime? EndLogDate { get; set; }
        public string[] AppCode { get; set; }
        public string[] Server { get; set; }
        public string[] User { get; set; }
        public string[] Level { get; set; }
        //public string[] Event { get; set; }
        public string[] TransactionId { get; set; }
        public string[] GroupMessage { get; set; }
        public string EventSearch { get; set; }
        public string DetailSearch { get; set; }

        private LogReport() { }

        public DBParameter[] ToDBParameter(bool LogIdRange = false, bool IncludeCurrentUser = false)
        {
            //Secure_AppCode();

            List<DBParameter> args = new List<DBParameter>();

            //args.Add(new DBParameter("@Breaking", DbType.AnsiString, "Break It"));

            if (null != LogId)
            {
                if (LogIdRange)
                {
                    args.Add(new DBParameter("@StartLogId", DbType.Int64, LogId.Value));
                    args.Add(new DBParameter("@EndLogId", DbType.Int64, LogId.Value));
                }
                else args.Add(new DBParameter("@LogId", DbType.Int64, LogId.Value));
            }
            if (IncludeCurrentUser)
            {
                args.Add(new DBParameter("@CurrentUserId", DbType.Int64, BIACore.Security.User.userId));
            }
            if (null != StartLogId) args.Add(new DBParameter("@StartLogId", DbType.Int64, StartLogId.Value));
            if (null != EndLogId) args.Add(new DBParameter("@EndLogId", DbType.Int64, EndLogId.Value));
            if (null != StartLogDate) args.Add(new DBParameter("@BeginDate", DbType.DateTime, StartLogDate.Value.ToUniversalTime()));
            if (null != EndLogDate) args.Add(new DBParameter("@EndDate", DbType.DateTime, EndLogDate.Value.ToUniversalTime()));

            if (null != AppCode && AppCode.Length > 0) args.Add(new DBParameter("@AppCode", DbType.AnsiString, string.Join(",", AppCode)));
            //else
            //{
            //    List<string> apps = Secure.AdminApps(BIACore.Security.User.userId);
            //    args.Add(new DBParameter("@AppCode", DbType.AnsiString, string.Join(",", apps)));
            //}

            if (null != Server && Server.Length > 0) args.Add(new DBParameter("@Server", DbType.AnsiString, string.Join(",", Server)));
            if (null != User && User.Length > 0) args.Add(new DBParameter("@UserId", DbType.AnsiString, string.Join(",", User)));
            if (null != Level && Level.Length > 0) args.Add(new DBParameter("@Level", DbType.AnsiString, string.Join(",", Level)));
            if (null != TransactionId && TransactionId.Length > 0) args.Add(new DBParameter("@TransactionId", DbType.AnsiString, string.Join(",", TransactionId)));
            if (null != GroupMessage && GroupMessage.Length > 0) args.Add(new DBParameter("@GroupMessage", DbType.AnsiString, string.Join(",", GroupMessage)));

            if (!string.IsNullOrEmpty(EventSearch)) args.Add(new DBParameter("@Event", DbType.AnsiString, EventSearch));
            if (!string.IsNullOrEmpty(DetailSearch)) args.Add(new DBParameter("@Detail", DbType.AnsiString, DetailSearch));

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