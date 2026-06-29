/* ====================================================================================================
NAME:				[Location Vendor  Report Controller]
BEHAVIOR:		Returns Location Vendor reports data for selected filter criteria.
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
        [ActionName("LocVendorsRpt")]
        public ClientResult LocVendorsRpt([FromBody] biafilter.Filter param)
        {
            try
            {
                param.PageName = "LocVendorsRpt";
                return LoadPagedClientResult(DBConstants.GetLocationVendor, param.ToDBParameter());
            }
            catch (Exception ex)
            {
                BIACore.Log.LogFactory.Exception(ex);
                return null;
            }

        }
    }
}
