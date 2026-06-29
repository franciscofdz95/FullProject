/* ====================================================================================================
NAME:				[Vendor List  Report Controller]
BEHAVIOR:		Returns LVendor List reports data for selected filter criteria.
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
        /// Vendor reports details/Lists.
        /// </summary>
        /// <param name="param"></param>
        /// <returns></returns>
        [HttpPost]
        [ActionName("VendorsRpt")]
        public ClientResult VendorsRpt([FromBody] biafilter.Filter param)
        {
            try
            {
                param.PageName = "VendorsRpt";
                return LoadPagedClientResult(DBConstants.GetVendor, param.ToDBParameter());
            }
            catch (Exception ex)
            {
                BIACore.Log.LogFactory.Exception(ex);
                return null;
            }
        }


    }
}
