using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;

using System.Web;
using System.Web.Http;

using BIACore.Model;

namespace BIACore.Server.Controller
{
    public partial class LoginController
    {
        public dynamic TokenValue_Post(dynamic request)
        {
            //request = { Token = authResult.Token, AppCode = appCode }
            try
            {
                return Cached.TokenValue((request != null && request.Token != null) ? request.Token : null);
            }
            catch (Exception e) { LogFactory.Exception(e); throw; }
        }

        public static dynamic GetTokenValue(string token)
        {
            //request = { Token = authResult.Token, AppCode = appCode }
            try
            {
                return Cached.TokenValue(token);
            }
            catch (Exception e) { LogFactory.Exception(e); throw; }
        }
    }
}