/* ====================================================================================================
NAME:				[Service Code Filter Criteria]
BEHAVIOR:		Returns Service Code reports data for selected filter criteria.
_______________________________________________________________________________________________________
REVISION HISTORY
-------------------------------------------------------------------------------------------------------
Date			    Modified By			  Modifications
-------------------------------------------------------------------------------------------------------
07/26/2016        Sudhir Dandale		 Created.
 ======================================================================================================*/
using System.Web.Http;

using BIACore.Web.Model;

namespace Flote.WebAPI.WebAPI.Controller
{
    public partial class WebApiFilterController
    {

        [HttpPost]
        [ActionName("SeviceCode")]
        public ClientResult SeviceCode([FromBody] dynamic request)
        {
            return LoadClientResult(DBConstants.GetServiceCodes);
        }
    }
}
