/* ====================================================================================================
NAME:				[Account Month Filter Criteria]
BEHAVIOR:		Returns Account Month reports data for selected filter criteria.
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
        [ActionName("AcctMon")]
        public ClientResult AcctMon([FromBody] dynamic request)
        {
            return LoadClientResult(DBConstants.RollingMonthsMon);
        }

    }
}
