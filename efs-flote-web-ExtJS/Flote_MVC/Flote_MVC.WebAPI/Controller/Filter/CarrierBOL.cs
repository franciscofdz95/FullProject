/* ====================================================================================================
NAME:				[Carrier BOL Filter Criteria]
BEHAVIOR:		Returns Carrier BOL reports data for selected filter criteria.
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
        [ActionName("CarrierBOL")]
        public ClientResult CarrierBOL([FromBody] dynamic request)
        {
            if (request["query"].Value != "")
            {
                return LoadClientResult(DBConstants.AutoCompCarrier, new DBParameter("@mbl_iata_busid", DbType.AnsiString, request["query"].Value));
            }
            else
            {
                return LoadClientResult(DBConstants.AutoCompCarrier, new DBParameter("@mbl_iata_busid", DbType.AnsiString, ""));
            }

        }
    }
}
