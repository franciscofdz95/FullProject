/* ====================================================================================================
NAME:				[Company Code Filter Criteria]
BEHAVIOR:		Returns Company Code reports data for selected filter criteria.
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
        [ActionName("CompanyCode")]
        public ClientResult CompanyCode([FromBody] dynamic request)
        {
            if (request["query"].Value != "")
            {
                return LoadClientResult(DBConstants.AutoCompCompanyCode, new DBParameter("@company_code", DbType.AnsiString, request["query"].Value));
            }
            else
            {
                return LoadClientResult(DBConstants.AutoCompCompanyCode, new DBParameter("@company_code", DbType.AnsiString, ""));
            }
        }
    }
}
