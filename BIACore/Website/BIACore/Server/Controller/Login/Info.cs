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
    public partial class LoginController
    {
        public object SessionAppInfo_Post([FromBody] dynamic request)
        {
            try
            {
                return Cached.SessionAppInfo(
                Security.Session.sessionId,
                (request != null && request.AppCode != null) ? request.AppCode.Value : null);
            }
            catch (Exception e) { LogFactory.Exception(e); throw; }
        }
        public List<BIAMessage> BIAMessages(dynamic request)
        {
            try
            {
                return Uncached.BIAMessages();
            }
            catch (Exception e) { LogFactory.Exception(e); throw; }
        }
    }
}