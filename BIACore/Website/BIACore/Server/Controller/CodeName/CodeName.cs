using System;
using System.Collections.Generic;
using System.Data;
using System.Dynamic;
using System.Linq;

using System.Web;
using System.Web.Http;

using BIACore.Model;

namespace BIACore.Server.Controller
{
    public partial class CodeNameController
    {
        [AllowAnonymous]
        [HttpPost]
        [ActionName("CodeName")]
        public object CodeName_Post([FromBody] dynamic request)
        {
            //DateTime start = DateTime.UtcNow;
            try
            {
                return Cached.CodeName(request.SourceString.Value.ToString());
            }
            catch (Exception e)
            {
                LogFactory.Message("CodeName = Request: {0}", Newtonsoft.Json.JsonConvert.SerializeObject(request));
                LogFactory.Exception(e);
                throw;
            }
            //finally { LogFactory.Performance("biacore/api/application", DateTime.UtcNow.Subtract(start).TotalSeconds); }
        }
    }
}