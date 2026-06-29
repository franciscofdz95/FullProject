using System;
using System.Collections.Generic;
using System.Data;

using System.Net;
using System.Net.Http;
using System.Threading.Tasks;
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
        public class Status
        {
            public bool Enabled { get; set; }
            public string Message { get; set; }
        }

        [HttpPost]
        [ActionName("AgentStatus")]
        public HttpResponseMessage AgentStatus(string TokenLocal, string AppCode, [FromBody] dynamic request)
        {
            User user = Cached.User(CurrentContext.GetSessionId(new { TokenLocal = TokenLocal }), null, AppCode);
            if (null == user) ErrorUnauthorized();

            return Request.CreateResponse<Status>(HttpStatusCode.OK, GetAgentStatus(AppCode));
        }

        [HttpPost]
        [ActionName("AgentUpdate")]
        public HttpResponseMessage AgentUpdate(string TokenLocal, string AppCode, [FromBody] dynamic request)
        {
            User user = Cached.User(CurrentContext.GetSessionId(new { TokenLocal = TokenLocal }), null, AppCode);
            if (null == user) ErrorUnauthorized();

            if (!Rules.User.isAdmin(user))
                return new HttpResponseMessage(HttpStatusCode.Unauthorized) { ReasonPhrase = "User does not have permissions to change Agent status." };

            bool enable = (null != request.Enable) ? request.Enable.Value : false;

            //"myreports.
            Execute("appObject.Agent_Update",
                new DBParameter("@UserId", DbType.AnsiString, user.userId),
                new DBParameter("@AppCode", DbType.AnsiString, AppCode),
                new DBParameter("@Enabled", DbType.Boolean, enable));

            return Request.CreateResponse<Status>(HttpStatusCode.OK, GetAgentStatus(AppCode));
        }

        private Status GetAgentStatus(string AppCode)
        {
            bool enabled = ExportEnabled(AppCode);
            return new Status()
            {
                Enabled = enabled,
                Message = (enabled) ? "Agent Enabled." : "Agent Disabled."
            };
        }
    }
}
