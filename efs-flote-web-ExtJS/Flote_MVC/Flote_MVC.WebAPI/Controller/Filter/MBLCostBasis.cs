/* ====================================================================================================
NAME:				[MBL Cost Basis Filter Criteria]
BEHAVIOR:		Returns MBL Cost Basis reports data for selected filter criteria.
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
        [ActionName("MBLCostBasis")]
        public ClientResult MBLCostBasis([FromBody] dynamic request)
        {
            return LoadClientResult(DBConstants.GetMBLCostBasis);
        }
    }
}
