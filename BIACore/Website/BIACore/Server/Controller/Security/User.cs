using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;

using System.Web;
using System.Web.Http;

using BIACore.Model;
using BIACore.Server.Model;

namespace BIACore.Server.Controller
{
    public partial class SecurityController
    {
        [Obsolete("Switch to new biacore/api/user/user")]
        [AllowAnonymous]
        [HttpPost]
        [ActionName("User")]
        public User User_Post([FromBody] SecurityRequest request)
        {
            DateTime start = DateTime.UtcNow;
            try
            {
                return Cached.User(request.SessionId, null, request.AppCode);
            }
            catch (Exception e) { LogFactory.Exception(e); throw; }
            finally { LogFactory.Performance("biacore/api/security/user", DateTime.UtcNow.Subtract(start).TotalSeconds); }
        }

        [Obsolete("Method type has been removed completely")]
        [AllowAnonymous]
        [HttpPost]
        [ActionName("userbyid")]
        public User UserById_Post([FromBody] UserRequest request)
        {
            DateTime start = DateTime.UtcNow;
            try
            {
                return Cached.User(null, request.UserId, request.AppCode);
            }
            catch (Exception e) { LogFactory.Exception(e); throw; }
            finally { LogFactory.Performance("biacore/api/security/userbyid", DateTime.UtcNow.Subtract(start).TotalSeconds); }
        }
    }
}