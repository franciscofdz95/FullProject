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

using BIACore.Web.Model.MyReports;
using biasec = BIACore.Security;

using BIACore.Server;

namespace BIACore.MyReports.Controller
{
    public partial class MyReportsController
    {
        [HttpPost]
        [ActionName("User")]
        public new ClientResult User(string TokenLocal, string AppCode, [FromBody] dynamic request)
        {
            User user = Cached.User(CurrentContext.GetSessionId(new { TokenLocal = TokenLocal }), null, AppCode);
            if (null == user) ErrorUnauthorized();

            //"myreports.
            return LoadClientResult("appObject.Filter_User",
                new DBParameter("@search", DbType.AnsiString, (request.query != null) ? request.query.Value : null),
                new DBParameter("@UserId", DbType.AnsiString, Rules.User.isAdmin(user) ? null : user.userId),
                new DBParameter("@AppCode", DbType.AnsiString, AppCode));
        }
    }
}
