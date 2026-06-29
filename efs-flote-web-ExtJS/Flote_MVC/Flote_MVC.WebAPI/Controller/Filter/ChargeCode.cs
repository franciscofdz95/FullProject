/* ====================================================================================================
NAME:				[Charge Code Filter Criteria]
BEHAVIOR:		Returns Charge Code reports data for selected filter criteria.
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
        [ActionName("ChargeCode")]
        public ClientResult ChargeCode([FromBody] dynamic request)
        {


            if (request["query"].Value != "")
            {

                return LoadClientResult(DBConstants.AutoCompChargeCode, new DBParameter("@charge_code", DbType.AnsiString, request["query"].Value));
            }
            else
            {


                return LoadClientResult(DBConstants.AutoCompChargeCode, new DBParameter("@charge_code", DbType.AnsiString, ""));
            }


        }
    }
}
