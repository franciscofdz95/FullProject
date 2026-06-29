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
        [ActionName("GetUserList")]
        public ClientResult GetUserList([FromBody] UserList request)
        {
            return LoadPagedClientResult("[dynUserObject].UserList", request.ToDBParameter());
        }

        [HttpPost]
        [ActionName("GetUserHistory")]
        public ClientResult GetUserHistory([FromBody] dynamic request)
        {
            return LoadClientResult("[userObject].UserAppAccessHistory", new DBParameter[] {
                new DBParameter("@userid",DbType.AnsiString, request.userid != null ? request.userid.Value : null),
                new DBParameter("@appCode",DbType.AnsiString, request.appCode != null ? request.appcode.Value : null)
            });
        }
    }
}
