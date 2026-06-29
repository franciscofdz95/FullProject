/* ====================================================================================================
NAME:				[Vendor Shipment  Report Controller]
BEHAVIOR:		Returns Vendor Shipment reports data for selected filter criteria.
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
        /// <summary>
        /// Vendor Shipment Details Report.
        /// </summary>
        /// <param name="param"></param>
        /// <returns></returns>
        [HttpPost]
        [ActionName("VendorShipmentRpt")]
        public ClientResult VendorShipmentRpt([FromBody] biafilter.Filter param)
        {
            try
            {
                param.PageName = "VendorShipmentRpt";
                return LoadPagedClientResult(DBConstants.VendorShipmentReport, param.ToDBParameter());
            }
            catch (Exception ex)
            {
                BIACore.Log.LogFactory.Exception(ex);
                return null;
            }
        }
    }
}
