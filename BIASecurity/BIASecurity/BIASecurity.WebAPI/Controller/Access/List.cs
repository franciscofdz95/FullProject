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
        [ActionName("GetAccessList")]
        public ClientResult GetAccessList([FromBody] AccessList request)
        {
            return LoadPagedClientResult("dynRoleObject.AccessList", request.ToDBParameter());
        }

    }
}
