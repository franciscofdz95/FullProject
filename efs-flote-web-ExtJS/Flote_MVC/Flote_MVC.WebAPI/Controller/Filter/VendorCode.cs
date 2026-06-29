/* ====================================================================================================
NAME:			[Vendor Code Filter Criteria]
BEHAVIOR:		Returns Vendor Code reports data for selected filter criteria.
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
        [ActionName("VendorCode")]
        public ClientResult VendorCode([FromBody] dynamic request)
        {
            if (request["query"].Value != "")
            {
                return LoadClientResult(DBConstants.AutoCompVendor2, new DBParameter("@vendor_Code", DbType.AnsiString, request["query"].Value));
            }
            else
            {
                return LoadClientResult(DBConstants.AutoCompVendor2, new DBParameter("@vendor_Code", DbType.AnsiString, ""));
            }
        }
    }
}