using System;
using System.Collections.Generic;
using System.Data;

using System.Net;
using System.Net.Http;
using System.Web;
using System.Web.Http;
using BIACore.Model;
using BIACore.Web.Model;
using extjs = BIACore.Web.Model.ExtJS;

using biasec = BIACore.Security;

using BIACore.Server;

namespace BIACore.MyReports.Controller
{
    public partial class MyReportsController
    {
        [HttpPost]
        [ActionName("List")]
        public ClientResult List(string TokenLocal, string AppCode, [FromBody] dynamic request)
        {
            User user = Cached.User(CurrentContext.GetSessionId(new { TokenLocal = TokenLocal }), null, AppCode);
            if (null == user)
            {
                ErrorUnauthorized();
                return null;
            }
            // or do i change it to return an empty set?
            //"myreports.
            return LoadPagedClientResult("appObject.Report_List",
                new DBParameter("@AppCode", DbType.AnsiString, AppCode),
                new DBParameter("@UserId", DbType.AnsiString, Rules.User.isAdmin(user) ? (null != request.User) ? request.User.Value : null : user.userId),
                new DBParameter("@Date", DbType.DateTime, parseDate(request.Date)),
                new DBParameter("@Status", DbType.AnsiString, parse(request.Status)),
                new DBParameter("@Type", DbType.AnsiString, parse(request.Type)),
                new DBParameter("@start", DbType.Int32, (null != request.start) ? request.start.Value : null),
                new DBParameter("@limit", DbType.Int32, (null != request.limit) ? request.limit.Value : null));
        }

        private string parse(dynamic value)
        {
            if (null == value) return null;

            string[] array = value.Value as string[];
            if (null != array) return string.Join(",", array);

            string str = value.Value as string;
            return (string.IsNullOrWhiteSpace(str)) ? null : str;
        }

        private DateTime? parseDate(dynamic Date)
        {
            if (null == Date) return null;
            string date = Date.Value;

            if (string.IsNullOrWhiteSpace(date)) return null;
            switch (date.ToLower())
            {
                case "lastfiveminutes": return DateTime.Now.AddMinutes(-5);
                case "lastthirtyminutes": return DateTime.Now.AddMinutes(-30);
                case "lasthour": return DateTime.Now.AddHours(-1);
                case "today": return DateTime.Now.Date;
                case "yesterday": return DateTime.Now.Date.AddDays(-1);
                case "lastweek": return DateTime.Now.Date.AddDays(-7);
            }
            return null;
        }
    }
}
