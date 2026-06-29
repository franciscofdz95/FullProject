/* ====================================================================================================
NAME:				[Destination Filter Criteria]
BEHAVIOR:		Returns destination reports data for selected filter criteria.
_______________________________________________________________________________________________________
REVISION HISTORY
-------------------------------------------------------------------------------------------------------
Date			    Modified By			  Modifications
-------------------------------------------------------------------------------------------------------
07/26/2016        Sudhir Dandale		 Created.
 ======================================================================================================*/
using System.Collections.Generic;
using System.Data;
using System.Web.Http;

using BIACore.Model;
using BIACore.Web.Model;


namespace Flote.WebAPI.WebAPI.Controller
{
    public partial class WebApiFilterController
    {
        [HttpPost]
        [ActionName("VendorLocation")]
        public ClientResult VendorLocation([FromBody] dynamic request)
        {
            if (request["query"].Value != "")
            {
                return LoadClientResult(DBConstants.AutoCompleteLocation, new DBParameter("@loc_Code", DbType.AnsiString, request["query"].Value));
            }
            else
            {
                return LoadClientResult(DBConstants.AutoCompleteLocation, new DBParameter("@loc_Code", DbType.AnsiString, ""));
            }
        }
    }
}
