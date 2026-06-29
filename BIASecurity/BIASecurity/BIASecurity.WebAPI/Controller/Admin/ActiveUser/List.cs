using System;
using System.Collections.Generic;
using System.Data;
using System.Web.Http;

using BIACore.Model;
using BIACore.Web.Model;
using BIASecurity.WebAPI.Model;

namespace BIASecurity.WebAPI.Controller
{
    public partial class BIASecurityController
    {
        [HttpPost]
        [ActionName("GetActiveUserSummary")]
        public object GetActiveUserSummary([FromBody] dynamic request)
        {
            if (BIACore.Security.User.isSA) return LoadClientResult("[userObject].[GetActiveUserServerLocationSummary]");
            else return null;
        }
        [HttpPost]
        [ActionName("GetActiveUserList")]
        public object GetActiveUserList([FromBody] ActiveUserList request)
        {
            if (BIACore.Security.User.isSA)
            {
                return LoadPagedClientResult("[dynUserObject].GetActiveUserServerLocation", request.ToDBParameter());
            }
            else return null;
        }
        [HttpPost]
        [ActionName("ActiveUserServer")]
        public object ActiveUserServer([FromBody] dynamic request)
        {
            if (BIACore.Security.User.isSA)
            {
                return LoadClientResult("[userObject].GetActiveUserServerFilter", new DBParameter[] {
                   new DBParameter("@search",DbType.AnsiString,request.search != null ? request.search.Value : null)
                });
            }
            else return null;
        }

        [HttpPost]
        [ActionName("ActiveUserEnvironment")]
        public object ActiveUserEnvironment([FromBody] dynamic request)
        {
            if (BIASecurity.WebAPI.Controller.Connection.Security.IsBIADeveloper())
            {
                return LoadClientResult("userObject.GetActiveUserEnvironmentFilter");
            }
            else return null;
        }

        [HttpPost]
        [ActionName("ActiveUserAppcode")]
        public object ActiveUserAppcode([FromBody] dynamic request)
        {
            if (BIASecurity.WebAPI.Controller.Connection.Security.IsBIADeveloper())
            {
                return LoadClientResult("userObject.GetActiveUserAppCode");
            }
            else return null;
        }
    }
}