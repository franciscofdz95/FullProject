using System.Data;
using System.Web.Http;
using BIACore.Model;
using BIACore.Web.Model;

namespace Flote.WebAPI.WebAPI.Controller
{
    public partial class WebApiFilterController
    {

        [HttpPost]
        [ActionName("LocRegion")]
        public ClientResult LocRegion([FromBody] dynamic request)
        {
            return LoadClientResult(DBConstants.GetLocRegion);
            
        }
    }

}
