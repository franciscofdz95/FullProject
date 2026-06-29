/* ====================================================================================================
NAME:				[Invoice Ref No Filter Criteria]
BEHAVIOR:		Returns Invoice Ref No reports data for selected filter criteria.
_______________________________________________________________________________________________________
REVISION HISTORY
-------------------------------------------------------------------------------------------------------
Date			    Modified By			  Modifications
-------------------------------------------------------------------------------------------------------
07/26/2016        Sudhir Dandale		 Created.
 ======================================================================================================*/
using System.Data;
using System.Web.Http;

using BIACore.Model;
using BIACore.Web.Model;

namespace Flote.WebAPI.WebAPI.Controller
{
    public partial class WebApiFilterController
    {

        [HttpPost]
        [ActionName("InvRefNo")]
        public ClientResult InvRefNo([FromBody] dynamic request)
        {            
            if (request["query"].Value != "")
            {
                return LoadClientResult(DBConstants.AutoCompInvRefNo, new DBParameter("@invrefno", DbType.AnsiString, request["query"].Value));
            }
            else
            {
                return LoadClientResult(DBConstants.AutoCompInvRefNo, new DBParameter("@invrefno", DbType.AnsiString, ""));
            }
        }
    }
}
