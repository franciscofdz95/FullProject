using System.Data;
using System.Web.Http;
using BIACore.Model;
using BIACore.Web.Model;

namespace Flote.WebAPI.WebAPI.Controller
{
    public partial class WebApiFilterController
    {

        [HttpPost]
        [ActionName("LocCountry")]
        public ClientResult LocCountry([FromBody] dynamic request)
        {
            
            if (request["query"].Value != "")
            {
                return LoadClientResult(DBConstants.GetLocCountry, new DBParameter("@LocCountry", DbType.AnsiString, request["query"].Value));
            }
            else
            {
                return LoadClientResult(DBConstants.GetLocCountry, new DBParameter("@LocCountry", DbType.AnsiString, ""));
            }
        }
    }

}
