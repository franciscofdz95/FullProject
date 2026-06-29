/* ====================================================================================================
NAME:				[Account Year Filter Criteria]
BEHAVIOR:		Returns Account  Year reports data for selected filter criteria.
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
        [ActionName("AcctYear")]
        public ClientResult AcctYear(string query, [FromBody] dynamic request)
        {
            return LoadClientResult(DBConstants.RollingMonths, new DBParameter("@AcctYear", DbType.AnsiString, query));
        }

        [HttpPost]
        [ActionName("AcctYear")]
        public ClientResult AcctYear([FromBody] dynamic request)
        {
            return LoadClientResult(DBConstants.RollingMonths);
        }

    }
}
