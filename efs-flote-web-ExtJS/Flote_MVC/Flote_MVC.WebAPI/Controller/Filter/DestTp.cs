using System.Data;
using System.Web.Http;
using BIACore.Model;
using BIACore.Web.Model;

namespace Flote.WebAPI.WebAPI.Controller
{
    public partial class WebApiFilterController
    {

        [HttpPost]
        [ActionName("DestTp")]
        public ClientResult DestTp([FromBody] dynamic request)
        {
            
            if (request["query"].Value != "")
            {
                return LoadClientResult(DBConstants.GetDestTp, new DBParameter("@Dest_tp", DbType.AnsiString, request["query"].Value));
            }
            else
            {
                return LoadClientResult(DBConstants.GetDestTp, new DBParameter("@Dest_tp", DbType.AnsiString, ""));
            }
        }
    }

}



