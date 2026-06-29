/* ====================================================================================================
NAME:				[Shipment Number Filter Criteria]
BEHAVIOR:		Returns Shipment Number reports data for selected filter criteria.
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
        [ActionName("ShipmentNo")]
        public ClientResult ShipmentNo([FromBody] dynamic request)
        {


            if (request["query"].Value != "")
            {
                return LoadClientResult(DBConstants.AutoCompShipment, new DBParameter("@shpmnt_nbr", DbType.AnsiString, request["query"].Value));
            }
            else
            {
                return LoadClientResult(DBConstants.AutoCompShipment, new DBParameter("@shpmnt_nbr", DbType.AnsiString, ""));
            }


        }
    }
}
