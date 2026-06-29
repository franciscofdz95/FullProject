using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

using System.Data;

using BIACore.Model;

using extjs = BIACore.Web.Model.ExtJS;

namespace BIACore.Website.Controller.Model
{
    public class SecurityReport : extjs.Parameter
    {
        public Int64? LogId { get; set; }
        public DateTime? BeginDate { get; set; }
        public DateTime? EndDate { get; set; }
        public string[] Client { get; set; }
        public string[] UserId { get; set; }
        public string[] TargetId { get; set; }
        public string[] Event { get; set; }
        public string[] TransactionId { get; set; }
        public string Search { get; set; }

        public SecurityReport() { }

        public override DBParameter[] ToDBParameter()
        {
            List<DBParameter> args = new List<DBParameter>();

            if (null != LogId) args.Add(new DBParameter("@LogId", DbType.Int64, LogId.Value));
            if (null != BeginDate) args.Add(new DBParameter("@BeginDate", DbType.DateTime, BeginDate.Value));
            if (null != EndDate) args.Add(new DBParameter("@EndDate", DbType.DateTime, EndDate.Value));

            if (null != Client && Client.Length > 0) args.Add(new DBParameter("@Client", DbType.AnsiString, string.Join(",", Client)));
            if (null != UserId && UserId.Length > 0) args.Add(new DBParameter("@UserId", DbType.AnsiString, string.Join(",", UserId)));
            if (null != TargetId && TargetId.Length > 0) args.Add(new DBParameter("@TargetId", DbType.AnsiString, string.Join(",", TargetId)));
            if (null != Event && Event.Length > 0) args.Add(new DBParameter("@Event", DbType.AnsiString, string.Join(",", Event)));
            if (null != TransactionId && TransactionId.Length > 0) args.Add(new DBParameter("@TransactionId", DbType.AnsiString, string.Join(",", TransactionId)));

            if (!string.IsNullOrWhiteSpace(Search)) args.Add(new DBParameter("@Detail", DbType.AnsiString, Search));

            args.AddRange(base.ToDBParameter());
            return args.ToArray();
        }

    }
}
