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
    public partial class UploadController
    {
        [AllowAnonymous]
        [HttpPost]
        [ActionName("UploadExtension")]
        public object UploadExtension_Post([FromBody] dynamic request)
        {
            //DateTime start = DateTime.UtcNow;
            try
            {
                return Uncached.UploadExtension(request.Extension.Value.ToString());
            }
            catch (Exception e)
            {
                LogFactory.Message(String.Format("UploadExtension = Request: {0}", Newtonsoft.Json.JsonConvert.SerializeObject(request)));
                LogFactory.Exception(e);
                throw;
            }
            //finally { LogFactory.Performance("biacore/api/application", DateTime.UtcNow.Subtract(start).TotalSeconds); }
        }
    }
}