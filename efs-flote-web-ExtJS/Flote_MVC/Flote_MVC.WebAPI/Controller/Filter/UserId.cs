/* ====================================================================================================
NAME:			[User Id Filter Criteria]
BEHAVIOR:		Returns Start Date reports data for selected filter criteria.
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
        [ActionName("userId")]
        public ClientResult userId(string query, [FromBody] dynamic request)
        {
            return LoadClientResult(DBConstants.FilterUserId,
                new DBParameter("@search", DbType.AnsiString, query));
        }

        [HttpPost]
        [ActionName("userId")]
        public ClientResult userId([FromBody] dynamic request)
        {
            return LoadClientResult(DBConstants.FilterUserId);
        }
    }
}
