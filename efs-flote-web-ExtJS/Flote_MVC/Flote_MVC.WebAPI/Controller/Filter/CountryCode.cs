/* ====================================================================================================
NAME:				[Country Code Filter Criteria]
BEHAVIOR:		Returns Country Code reports data for selected filter criteria.
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
        [ActionName("Country")]
        public ClientResult Country([FromBody] dynamic request)
        {
            if (request["query"].Value != "")
            {
                return LoadClientResult(DBConstants.AutoCompCountry, new DBParameter("@country_code", DbType.AnsiString, request["query"].Value));
            }
            else
            {
                return LoadClientResult(DBConstants.AutoCompCountry, new DBParameter("@country_Code", DbType.AnsiString, ""));
            }
        }
    }
}
