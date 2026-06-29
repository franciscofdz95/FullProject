using System;
using System.Collections.Generic;
using System.Data;
using System.Dynamic;
using System.Linq;

using System.Web;
using System.Web.Http;

using BIACore.Model;
using BIACore.Web.Model;
using BIACore.Website.Controller.Model;

namespace BIACore.Website.Controller.Security
{
    public partial class AppSecurityController
    {
        [HttpPost]
        [ActionName("UserId")]
        public ClientResult UserId([FromBody] SecurityFilter request)
        {
            if (!BIACore.Security.User.isSA)
                return null;

            return LoadClientResult("biacoreObject.Security_Filter_UserId", request.ToDBParameter());
        }
    }
}