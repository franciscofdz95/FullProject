using System;
using System.Web.Http;

using BIACore.Web.Model;

namespace Flote.WebAPI.WebAPI.Controller
{
    public partial class WebApiFilterController
    {

        [HttpPost]
        [ActionName("RegionDest")]
        public ClientResult RegionDest([FromBody] dynamic request)
        {
            return LoadClientResult(DBConstants.GetRegionDest);
        }
    }

}



