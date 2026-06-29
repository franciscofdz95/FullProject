/* ====================================================================================================
NAME:				[Value Pay Locations Lsit]
BEHAVIOR:		Returns List valuepay locations.
_______________________________________________________________________________________________________
REVISION HISTORY
-------------------------------------------------------------------------------------------------------
Date			    Modified By			  Modifications
-------------------------------------------------------------------------------------------------------
04/21/2017        Sudhir Dandale		 Created.
 ======================================================================================================*/
using System.Web.Http;

using BIACore.Web.Model;

namespace Flote.WebAPI.WebAPI.Controller
{
    public partial class WebApiFilterController
    {

        [HttpPost]
        [ActionName("GetValuePayList")]
        public ClientResult GetValuePayList([FromBody] dynamic request)
        {
            return LoadClientResult(DBConstants.GetValuePayList);
        }

    }
}
