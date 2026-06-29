using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using System.Dynamic;
using System.Linq;

using System.Web;
using System.Web.Http;

using BIACore.Model;
using BIACore.Server.Model;

namespace BIACore.Server.Controller
{
    public partial class TrackController
    {
        [AllowAnonymous]
        [HttpPost]
        [ActionName("Browser")]
        public object Browser_Post([FromBody] BrowserEntry request)
        {
            // we don't care to catch exceptions.
            try
            {
                request.Insert_SQL();
            }
            catch { }

            return new { };
        }
    }
}