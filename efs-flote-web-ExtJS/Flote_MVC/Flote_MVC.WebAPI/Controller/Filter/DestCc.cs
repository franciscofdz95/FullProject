using System.Data;
using System.Web.Http;
using BIACore.Model;
using BIACore.Web.Model;

namespace Flote.WebAPI.WebAPI.Controller
{
    public partial class WebApiFilterController
    {

        [HttpPost]
        [ActionName("DestCc")]
        public ClientResult DestCc([FromBody] dynamic request)
        {

            if (request["query"].Value != "")
            {
                return LoadClientResult(DBConstants.GetDestCc, new DBParameter("@Dest_cc", DbType.AnsiString, request["query"].Value));
            }
            else
            {
                return LoadClientResult(DBConstants.GetDestCc, new DBParameter("@Dest_cc", DbType.AnsiString, ""));
            }
        }
    }

}



