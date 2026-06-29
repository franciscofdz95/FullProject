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
        [ActionName("department")]
        public ClientResult department(string query, [FromBody] dynamic request)
        {
            return LoadClientResult("demo.Filter_Department",
                new DBParameter("@search", DbType.AnsiString, query));
        }

        [HttpPost]
        [ActionName("department")]
        public ClientResult department([FromBody] dynamic request)
        {
            return LoadClientResult("demo.Filter_Department");
        }
    }
}
