using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Web.Http;

using BIACore.Web.Model;
using biafilter = Flote.WebAPI.WebAPI.Model;

namespace Flote.WebAPI.WebAPI.Controller
{
    public partial class WebAPIReportController
    {
        [HttpPost]
        [ActionName("UserList")]
        public ClientResult UserList([FromBody] biafilter.Filter param)
        {
            return LoadPagedClientResult("demo.UserList", param.ToDBParameter());
        }
    }
}
