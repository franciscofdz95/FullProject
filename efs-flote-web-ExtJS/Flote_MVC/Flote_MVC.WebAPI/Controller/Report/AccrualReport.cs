/* ====================================================================================================
NAME:				[Arrcual Report Controller]
BEHAVIOR:		Returns Accrual reports data for selected filter criteria.
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
        /// Accrual Monthly Jounral Report
        /// </summary>
        /// <param name="param"></param>
        /// <returns></returns>
        [HttpPost]
        [ActionName("AccrualMonJrnlRpt")]
        public ClientResult AccrualMonJrnlRpt([FromBody] biafilter.Filter param)
        {
            try
            {
                param.PageName = "AccrualMonJrnlRpt";
                return LoadPagedClientResult(DBConstants.AccrualMonthlyReport, param.ToDBParameter());
            }
            catch (Exception ex)
            {
                BIACore.Log.LogFactory.Exception(ex);
                return null;
            }
        }
        /// <summary>
        /// Accrual Monthely details report.
        /// </summary>
        /// <param name="param"></param>
        /// <returns></returns>
        [HttpPost]
        [ActionName("AccrualMonDetailRpt")]
        public ClientResult AccrualMonDetailRpt([FromBody] biafilter.Filter param)
        {
            try
            {
                param.PageName = "AccrualMonDetailRpt";
                return LoadPagedClientResult(DBConstants.AccrualMonthlyDetailReport, param.ToDBParameter());
            }
            catch (Exception ex)
            {
                BIACore.Log.LogFactory.Exception(ex);
                return null;
            }
        }
        /// <summary>
        /// Accrual Accruracy Report.
        /// </summary>
        /// <param name="param"></param>
        /// <returns></returns>
        [HttpPost]
        [ActionName("AccrualAccuracy")]
        public ClientResult AccrualAccuracy([FromBody] biafilter.Filter param)
        {
            try
            {
                param.PageName = "AccrualAccuracy";
                return LoadPagedClientResult(DBConstants.AccrualAccuracyReport, param.ToDBParameter());
            }
            catch (Exception ex)
            {
                BIACore.Log.LogFactory.Exception(ex);
                return null;
            }
        }
    }
}
