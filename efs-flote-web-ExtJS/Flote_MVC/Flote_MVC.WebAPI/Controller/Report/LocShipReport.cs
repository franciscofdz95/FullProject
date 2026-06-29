/* ====================================================================================================
NAME:				[Location Shipment  Report Controller]
BEHAVIOR:		Returns Location Shipment reports data for selected filter criteria.
_______________________________________________________________________________________________________
REVISION HISTORY
-------------------------------------------------------------------------------------------------------
Date			    Modified By			  Modifications
-------------------------------------------------------------------------------------------------------
07/26/2016        Sudhir Dandale		 Created.
 ======================================================================================================*/
using System;
using System.Web.Http;

using BIACore.Web.Model;
using biafilter = Flote.WebAPI.WebAPI.Model;

namespace Flote.WebAPI.WebAPI.Controller
{
    public partial class WebApiReportController
    {

        [HttpPost]
        [ActionName("LocShipReport")]
        public ClientResult LocShipReport([FromBody] biafilter.Filter param)
        {
            try
            {
                param.PageName = "LocShipReport";
                if (param.Loctype == "TP")
                { return LoadPagedClientResult(DBConstants.LocationShipmentTP, param.ToDBParameter()); }
                else
                { return LoadPagedClientResult(DBConstants.LocationShipmentDEP, param.ToDBParameter()); }
            }
            catch (Exception ex)
            {
                BIACore.Log.LogFactory.Exception(ex);
                return null;
            }
        }
    }
}
