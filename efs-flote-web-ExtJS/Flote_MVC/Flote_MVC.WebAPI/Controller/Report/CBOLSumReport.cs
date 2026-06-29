/* ====================================================================================================
NAME:				[Bills Report Controller]
BEHAVIOR:		Returns Bill reports data for selected filter criteria.
_______________________________________________________________________________________________________
REVISION HISTORY
-------------------------------------------------------------------------------------------------------
Date			    Modified By			  Modifications
-------------------------------------------------------------------------------------------------------
07/26/2016        Sudhir Dandale		 Created.
 ======================================================================================================*/
using System;
using System.Collections.Generic;
using System.Web.Http;
using BIACore.Web.Model;
using biafilter = Flote.WebAPI.WebAPI.Model;
using BIACore.Model;
using System.Data;


namespace Flote.WebAPI.WebAPI.Controller
{
    public partial class WebApiReportController
    {
        /// <summary>
        /// Get CBOL Summary by Invoice id, CBOL /Charge code.
        /// </summary>
        /// <param name="param"></param>
        /// <returns></returns>
        [HttpPost]
        [ActionName("GetCBolSumByInvId")]
        public ClientResult GetCBolSumByInvId([FromBody] biafilter.Filter param)
        {
            var sortParam = "Carrier_BOL ASC";
            try
            {
                if (param.sort != null)
                {
                    sortParam = param.sort[0].Value;
                }
                List<DBParameter> args = new List<DBParameter>();
                args.Add(new DBParameter("@invoice_id", DbType.AnsiString, param.InvoiceId));
                args.Add(new DBParameter("@start", DbType.AnsiString, param.start));
                args.Add(new DBParameter("@limit", DbType.AnsiString, param.limit));
                args.Add(new DBParameter("@sort", DbType.AnsiString, sortParam));
                args.Add(new DBParameter("@status", DbType.AnsiString, param.CbolStatus));
                args.Add(new DBParameter("@rdoType", DbType.AnsiString, param.RadioSelection));

                if ((param.CarrierCBOL != null && param.CarrierCBOL != "") || (param.ChargeCode != "" && param.ChargeCode != null) || (param.HBL != null && param.HBL != ""))
                {
                    args.Add(new DBParameter("@carrier_bol", DbType.AnsiString, param.CarrierCBOL));
                    args.Add(new DBParameter("@charge_code", DbType.AnsiString, param.ChargeCode));
                    args.Add(new DBParameter("@hbl", DbType.AnsiString, param.HBL));
                    return LoadPagedClientResult(DBConstants.GetChargeCodeSummaryByCCNCBOL, args.ToArray());
                }
                else
                {
                    return LoadPagedClientResult(DBConstants.GetCarrierBolSummaryByInvoiceId, args.ToArray());
                }
            }
            catch (Exception ex)
            {
                BIACore.Log.LogFactory.Exception(ex);
                return null;
            }

        }
        /// <summary>
        /// Get the CbolAggregateData by invoice Id.
        /// </summary>
        /// <param name="param"></param>
        /// <returns></returns>
        [HttpPost]
        [ActionName("GetCbolAggregateData")]
        public List<object> GetCbolAggregateData([FromBody] biafilter.Filter param)
        {
            try
            {
                List<DBParameter> args = new List<DBParameter>();
                args.Add(new DBParameter("@invoice_id", DbType.AnsiString, param.InvoiceId));
                return LoadResult(DBConstants.GetCbolAggregateData, args.ToArray());
            }
            catch (Exception ex)
            {
                BIACore.Log.LogFactory.Exception(ex);
                return new List<object>();
            }

        }
        /// <summary>
        /// Process the match charges for selected criteria for given invoice.
        /// </summary>
        /// <param name="param"></param>
        /// <returns></returns>
        [HttpPost]
        [ActionName("ProcessExcelDataToFlote")]
        public List<object> ProcessExcelDataToFlote([FromBody] biafilter.Filter param)
        {
            try
            {
                List<DBParameter> args = new List<DBParameter>();
                args.Add(new DBParameter("@Invoice_Id", DbType.AnsiString, param.InvoiceId));
                args.Add(new DBParameter("@Carrier_Bol", DbType.AnsiString, param.CarrierId));
                args.Add(new DBParameter("@Charge_Code", DbType.AnsiString, param.ChargeCode));
                args.Add(new DBParameter("@hbl", DbType.AnsiString, param.HBL));
                args.Add(new DBParameter("@Comments", DbType.AnsiString, param.Comments));
                args.Add(new DBParameter("@User_Id", DbType.AnsiString, param.UserId));
                args.Add(new DBParameter("@rdoType", DbType.AnsiString, param.RadioSelection));
                return LoadResult(DBConstants.ProcessExcelDataToFlote, args.ToArray());
            }
            catch (Exception ex)
            {
                BIACore.Log.LogFactory.Exception(ex);
                return null;
            }

        }
    }
}



