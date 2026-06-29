using System;
using System.Collections.Generic;
using System.Data;
using System.Web.Http;

using BIACore.Model;
using BIACore.Web.Model;

namespace Flote.WebAPI.WebAPI.Controller
{
    public partial class WebAPIFilterController
    {

        [HttpPost]
        [ActionName("Sysm")]
        public ClientResult Sysm(string query, [FromBody] dynamic request)
        {
            return LoadClientResult("demo.Filter_Sysm",
                new DBParameter("@search", DbType.AnsiString, query));
        }

    }
}
