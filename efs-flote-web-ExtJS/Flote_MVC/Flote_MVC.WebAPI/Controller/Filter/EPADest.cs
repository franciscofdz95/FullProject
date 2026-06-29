using System.Data;
using System.Web.Http;
using BIACore.Model;
using BIACore.Web.Model;

namespace Flote.WebAPI.WebAPI.Controller
{
    public partial class WebApiFilterController
    {

        [HttpPost]
        [ActionName("EPADest")]
        public ClientResult EPADest([FromBody] dynamic request)
        {

            if (request["query"].Value != "")
            {
                return LoadClientResult(DBConstants.GetEPADest, new DBParameter("@EPADest", DbType.AnsiString, request["query"].Value));
            }
            else
            {
                return LoadClientResult(DBConstants.GetEPADest, new DBParameter("@EPADest", DbType.AnsiString, ""));
            }
        }
    }

}



