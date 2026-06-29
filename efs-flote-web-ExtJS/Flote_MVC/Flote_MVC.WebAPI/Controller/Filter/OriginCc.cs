using System.Data;
using System.Web.Http;
using BIACore.Model;
using BIACore.Web.Model;

namespace Flote.WebAPI.WebAPI.Controller
{
    public partial class WebApiFilterController
    {

        [HttpPost]
        [ActionName("OriginCc")]
        public ClientResult OriginCc([FromBody] dynamic request)
        {
         
            if (request["query"].Value != "")
            {
                return LoadClientResult(DBConstants.GetOriginCc, new DBParameter("@Orig_cc", DbType.AnsiString, request["query"].Value));
            }
            else
            {
                return LoadClientResult(DBConstants.GetOriginCc, new DBParameter("@Orig_cc", DbType.AnsiString, ""));
            }
        }
    }

}



