using System.Data;
using System.Web.Http;

using BIACore.Model;
using BIACore.Web.Model;

namespace Flote.WebAPI.WebAPI.Controller
{
    public partial class WebApiFilterController
    {

        [HttpPost]
        [ActionName("DivisionOrig")]
        public ClientResult DivisionOrig([FromBody] dynamic request)
        {

            if (request["query"].Value != "")
            {
                return LoadClientResult(DBConstants.GetDivisionOrig, new DBParameter("@DIVN_CODE", DbType.AnsiString, request["query"].Value));
            }
            else
            {
                return LoadClientResult(DBConstants.GetDivisionOrig, new DBParameter("@DIVN_CODE", DbType.AnsiString, ""));
            }
        }
    }

}



