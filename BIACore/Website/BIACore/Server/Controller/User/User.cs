using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;

using System.Web;
using System.Web.Http;
using System.Web.Http.Cors;

using BIACore.Model;
using BIACore.Server.Model;
using BIACore.Extensions;
using System.Web.Script.Serialization;

namespace BIACore.Server.Controller
{
    public partial class UserController
    {
        [AllowAnonymous]
        [HttpPost]
        [DisableCors]
        [ActionName("User")]
        public User User_Post([FromBody] dynamic request)
        {
            DateTime start = DateTime.UtcNow;
            try
            {
                string SessionId = BIACore.Server.CurrentContext.GetSessionId(request);

                return Cached.User(
                    SessionId,
                    //(request != null && request.UserId != null) ? request.UserId.Value : null,
                    null,
                    (request != null && request.AppCode != null) ? request.AppCode.Value : null);
            }
            catch (Exception e) { LogFactory.Exception(e); throw; }
            finally { LogFactory.Performance("biacore/api/user/user", DateTime.UtcNow.Subtract(start).TotalSeconds); }
        }

        [AllowAnonymous]
        [HttpPost]
        [DisableCors]
        [ActionName("UserSearch")]
        public object UserSearch_Post([FromBody] dynamic request)
        {
            DateTime start = DateTime.UtcNow;
            try
            {
                return new
                {
                    userSearch = Cached.UserSearch(
                    (request != null && request.UserId != null) ? request.UserId.Value : null,
                    (request != null && request.ADID != null) ? request.ADID.Value : null,
                    (request != null && request.Email != null) ? request.Email.Value : null,
                    (request != null && request.AppCode != null) ? request.AppCode.Value : null)
                };
            }
            catch (Exception e) { LogFactory.Exception(e); throw; }
            finally { LogFactory.Performance("biacore/api/user/UserSearch", DateTime.UtcNow.Subtract(start).TotalSeconds); }
        }

        [AllowAnonymous]
        [HttpPost]
        [DisableCors]
        [ActionName("GetWS4IDUserList")]
        public object GetWS4IDUserList_Post([FromBody] dynamic request)
        {
            string adid = (request != null && request.adid != null) ? request.adid.Value : null;
            string empid = (request != null && request.empid != null) ? request.empid.Value : null;
            string firstname = (request != null && request.firstname != null) ? request.firstname.Value : null;
            string lastname = (request != null && request.lastname != null) ? request.lastname.Value : null;
            string fullname = (request != null && request.fullname != null) ? request.fullname.Value : null;
            bool? exact = (request != null && request.exact != null) ? request.exact.Value : null;

            Log.LogFactory.Message("GetWS4IDUserList request:{0}adid:{1}{0}empid:{2}{0}firstname:{3}{0}lastname:{4}{0}fullname:{5}{0}exact:{6}", new object[] {
                Environment.NewLine, adid, empid, firstname, lastname, fullname, exact.ToString() });

            return BuildUserList(adid, empid, firstname, lastname, fullname, exact);
        }

        [AllowAnonymous]
        [HttpPost]
        [DisableCors]
        [ActionName("AdminUserHeaderLinks")]
        public List<object> AdminUserHeaderLinks_Post([FromBody] dynamic request)
        {
            try
            {
                string SessionId = BIACore.Server.CurrentContext.GetSessionId(request);

                User user = Cached.User(SessionId, null, request != null ? (string)request.AppCode : null);

                if (BIACore.Rules.User.isSA(user))
                {
                    return Cached.AdminHeaderLinks();
                }
                else return new List<object>();
            }
            catch (Exception e) { LogFactory.Exception(e); throw; }
        }

        [AllowAnonymous]
        [HttpPost]
        [DisableCors]
        [ActionName("StandAloneUser")]
        public User StandAloneUser_Post([FromBody] dynamic request)
        {
            try
            {
                User u = new User();
                if (request != null && !string.IsNullOrWhiteSpace((string)request.ParamCode))
                {
                    FingerprintValue fv = Uncached.WhiteboardGetById((string)request.ParamCode);
                    if (!string.IsNullOrWhiteSpace(fv.Value))
                    {
                        JavaScriptSerializer jss = new JavaScriptSerializer() { MaxJsonLength = 2147483647 };
                        Dictionary<string, string> param = jss.Deserialize<Dictionary<string, string>>(fv.Value);
                        if (param.Count > 0 && !string.IsNullOrWhiteSpace(param["UserId"]) && !string.IsNullOrWhiteSpace(param["AppCode"])
                            && param["AppCode"].EndsWith("_Service"))
                        {
                            u = Cached.StandaloneUser(param["UserId"], param["AppCode"].Remove(param["AppCode"].Length - 8));
                        }
                    }
                }

                return u;
            }
            catch (Exception e) { LogFactory.Exception(e); throw; }
        }

        [AllowAnonymous]
        [HttpPost]
        [DisableCors]
        [ActionName("UserAzure")]
        public object UserAzure_Post([FromBody] dynamic request)
        {
            DateTime start = DateTime.UtcNow;
            try
            {

                return Cached.UserAzure((request != null && request.AzureId != null) ? request.AzureId.Value : null);
            }
            catch (Exception e) { LogFactory.Exception(e); throw; }
            finally { LogFactory.Performance("biacore/api/user/userazure", DateTime.UtcNow.Subtract(start).TotalSeconds); }
        }

        private static Dictionary<string, object> GetUserId(string user)
        {

            try
            {
                return Provider.SQL.ExecuteSQLRaw(Connections.Security, "secObject.LoginUserCheck", new DBParameter("@userId", DbType.AnsiString, user));
            
            }
            catch (Exception e)
            {
                LogFactory.Exception(e);
            }

            return null;
        }

        //[AllowAnonymous]
        [HttpPost]
        [DisableCors]
        [ActionName("APRSRoles")]
        public object APRSRoles_Post([FromBody] dynamic request)
        {
            DateTime start = DateTime.UtcNow;

            try
            {

                Dictionary<string, object> userId = GetUserId((request != null && request.UserId != null) ? request.UserId.Value : null);

                return Cached.APRSRoles(
                    userId["AD_ID"].ToString(),
                    (request != null && request.AppCode != null) ? request.AppCode.Value : null);
            }
            catch (Exception e) { LogFactory.Exception(e); throw; }
            finally { LogFactory.Performance("biacore/api/user/aprsroles", DateTime.UtcNow.Subtract(start).TotalSeconds); }
        }
    }
}