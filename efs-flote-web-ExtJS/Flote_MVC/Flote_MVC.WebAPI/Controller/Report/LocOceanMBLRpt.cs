/* ====================================================================================================
NAME:				[Location Ocean MBL Report Controller]
BEHAVIOR:		Returns Location Ocean MBL reports data for selected filter criteria.
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
using BIACore.Model;
using System.Collections.Generic;
using System.Data;

namespace Flote.WebAPI.WebAPI.Controller
{
    public partial class WebApiReportController
    {
        [HttpPost]
        [ActionName("LocOceanMBLRpt")]
        public ClientResult LocOceanMBLRpt([FromBody] biafilter.Filter param)
        {
            try
            {   //when going from Location Shipment to Location Ocean MBL the Location Ocean MBL page comes up with no matches found.  
                 //After pressing F5 to reload the page and selecting the Location Ocean MBL page directly it loads normally by Sriram
                if (param.OrigDest == "All") param.OrigDest = string.Empty;

                return LoadPagedClientResult(DBConstants.LocationOceanMBL, param.ToDBParameter());
            }
            catch (Exception ex)
            {
                BIACore.Log.LogFactory.Exception(ex);
                return null;
            }

        }
        /// <summary>
        /// Get Ocean MBL Summary details.
        /// </summary>
        /// <param name="param"></param>
        /// <returns></returns>
        [HttpPost]
        [ActionName("OceanMBLSummary")]
        public ClientResult OceanMBLSummary([FromBody] biafilter.Filter param)
        {
            List<DBParameter> args = new List<DBParameter>();
            try
            {
                args.Add(new DBParameter("@mbl_number", DbType.AnsiString, param.MBLNumber));
                args.Add(new DBParameter("@display_currency", DbType.AnsiString, param.DisplayCurr));
                return LoadPagedClientResult(DBConstants.GetOceanMBL, args.ToArray());
            }
            catch (Exception ex)
            {
                BIACore.Log.LogFactory.Exception(ex);
                return null;
            }

        }
    }
}
