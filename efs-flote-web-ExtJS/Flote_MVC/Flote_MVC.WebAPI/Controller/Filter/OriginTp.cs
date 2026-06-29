using System.Data;
using System.Web.Http;
using BIACore.Model;
using BIACore.Web.Model;

namespace Flote.WebAPI.WebAPI.Controller
{ 
    public partial class WebApiFilterController
    {

        [HttpPost]
        [ActionName("OriginTp")]
        public ClientResult OriginTp([FromBody] dynamic request)
        {
            
            if (request["query"].Value != "")
            {
                return LoadClientResult(DBConstants.GetOriginTp, new DBParameter("@Orig_tp", DbType.AnsiString, request["query"].Value));
            }
            else
            {
                return LoadClientResult(DBConstants.GetOriginTp, new DBParameter("@Orig_tp", DbType.AnsiString, ""));
            }
        }
    }
    
}



