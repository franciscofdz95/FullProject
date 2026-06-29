using System.Data;
using System.Web.Http;
using BIACore.Model;
using BIACore.Web.Model;

namespace Flote.WebAPI.WebAPI.Controller
{
    public partial class WebApiFilterController
    {

        [HttpPost]
        [ActionName("EPAOrig")]
        public ClientResult EPAOrig([FromBody] dynamic request)
        {
            
            if (request["query"].Value != "")
            {
                return LoadClientResult(DBConstants.GetEPAOrig, new DBParameter("@EPAOrig", DbType.AnsiString, request["query"].Value));
            }
            else
            {
                return LoadClientResult(DBConstants.GetEPAOrig, new DBParameter("@EPAOrig", DbType.AnsiString, ""));
            }
        }
    }

}



