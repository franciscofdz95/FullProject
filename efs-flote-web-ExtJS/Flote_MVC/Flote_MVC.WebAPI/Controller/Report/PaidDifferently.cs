/* ====================================================================================================
NAME:				[PaidDifferently List  Report Controller]
BEHAVIOR:		Returns PaidDifferently List reports data for selected filter criteria.
_______________________________________________________________________________________________________
REVISION HISTORY
-------------------------------------------------------------------------------------------------------
Date			    Modified By			  Modifications
-------------------------------------------------------------------------------------------------------
02/06/2020          Rama Yagati		 Created.
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
        /// PaidDifferetly reports details/Lists.
        /// </summary>
        /// <param name="param"></param>
        /// <returns></returns>
        [HttpPost]
        [ActionName("PaidDifferently")]
        public ClientResult PaidDifferently([FromBody] biafilter.Filter param)
        {
            try
            {
                param.PageName = "PaidDifferently";
                return LoadPagedClientResult(DBConstants.GetPaidDifferently,param.ToDBParameter());
            }
            catch (Exception ex)
            {
                BIACore.Log.LogFactory.Exception(ex);
                return null;
            }
        }

    }
}
