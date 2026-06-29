using System;
using System.Collections.Generic;
using System.Data;
using System.Dynamic;
using System.Linq;

using System.Web;
using System.Web.Http;

using BIACore.Model;

namespace BIACore.Server.Controller
{
    public partial class ApplicationController
    {
        [AllowAnonymous]
        [HttpPost]
        [ActionName("UserList")]
        public List<UserApp> UserList_Post([FromBody] dynamic request)
        {
            DateTime start = DateTime.UtcNow;
            try
            {
                return Uncached.Userlist((request != null && request.AppCode != null) ? request.AppCode.Value : null,
                    (request != null && request.Level != null) ? request.Level.Value : null,
                    (request != null && request.Search != null) ? request.Search.Value : null);
            }
            catch (Exception e) { LogFactory.Exception(e); throw; }
            finally { LogFactory.Performance("biacore/api/userlist", DateTime.UtcNow.Subtract(start).TotalSeconds); }
        }
    }
}