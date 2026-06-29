using System;
using System.Web.Http;

using BIACore.Web.Model;

namespace Flote.WebAPI.WebAPI.Controller
{
    public partial class WebApiFilterController
    {

        [HttpPost]
        [ActionName("RegionOrig")]
        public ClientResult RegionOrig([FromBody] dynamic request)
        {
            return LoadClientResult(DBConstants.GetRegionOrig);
        }
    }

}



