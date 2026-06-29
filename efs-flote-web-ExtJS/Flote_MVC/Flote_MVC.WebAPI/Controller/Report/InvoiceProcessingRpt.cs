/* ====================================================================================================
NAME:				[Invoice Processing Controller]
BEHAVIOR:		Returns Invoice processing related data.
_______________________________________________________________________________________________________
REVISION HISTORY
-------------------------------------------------------------------------------------------------------
Date			   Created/ Modified By			  Modifications
-------------------------------------------------------------------------------------------------------
12/2/2016        Sudhir Dandale		 Created.
 ======================================================================================================*/
using System;
using System.Collections.Generic;
using System.Web.Http;

using BIACore.Web.Model;
using biafilter = Flote.WebAPI.WebAPI.Model;
using BIACore.Model;
using System.Data;
using BIACore.Provider;


namespace Flote.WebAPI.WebAPI.Controller
{
    public partial class WebApiReportController
    {
        /// <summary>
        /// Invoice processing screen Reports.
        /// </summary>
        /// <param name="param"></param>
        /// <returns></returns>
        [HttpPost]
        [ActionName("InvoiceProcessRpt")]
        public ClientResult InvoiceProcessRpt([FromBody] biafilter.Filter param)
        {
            var PageName = "Selected";
            try
            {
                if (string.IsNullOrEmpty(param.RadioSelection))
                {
                    PageName = "Selected";
                }
                else { PageName = param.RadioSelection.ToString(); }
                if (PageName == "Selected")
                {
                    return LoadPagedClientResult(DBConstants.BPSUnSelectedCharges, param.ToDBParameter());
                }
                else
                {
                    return LoadPagedClientResult(DBConstants.BPSSelectedCharges, param.ToDBParameter());
                }
            }
            catch (Exception ex)
            {
                BIACore.Log.LogFactory.Exception(ex);
                return null;

            }
        }

        /// <summary>
        /// Get the Invoice Chage Details.
        /// </summary>
        /// <param name="info"></param>
        /// <returns></returns>
        [HttpPost]
        [ActionName("InvoiceChargesDetails")]
        public object InvoiceChargesDetails([FromBody] biafilter.Filter param)
        {
            List<DBParameter> args = new List<DBParameter>();

            try
            {
                args.Add(new DBParameter("@Invoice_id", DbType.AnsiString, param.InvoiceId));
                args.Add(new DBParameter("@Type", DbType.AnsiString, param.ColumnNames));
                return LoadSingle(DBConstants.InvoiceChargesDetails, args.ToArray());
            }
            catch (Exception ex)
            {
                BIACore.Log.LogFactory.Exception(ex);
                return null;
            }
        }
        /// <summary>
        /// Get the Non E2k cost data.
        /// </summary>
        /// <param name="request"></param>
        /// <returns></returns>
        [HttpPost]
        [ActionName("GetNonE2kCost")]
        public List<object> GetNonE2kCost([FromBody] dynamic request)
        {
            List<DBParameter> param = new List<DBParameter>();

            try
            {
                if (request["query"] != null || request["shipmentNumber"] != null)
                {
                    string query = null, chargeDesc = "";
                    if (request["query"] != null)
                    {
                        query = request["query"].Value;
                    }
                    else
                    {
                        query = request["shipmentNumber"].Value;
                    }
                    string[] queryVal = query.Split(',');
                    if (request["chargeDescription"] != null)
                    {
                        chargeDesc = Convert.ToString(request["chargeDescription"].Value);
                    }
                    if (queryVal.Length > 0)
                    {
                        var invoice_id = Convert.ToString(queryVal[0]) != "" ? Convert.ToString(queryVal[0]) : "";
                        var shipNo = Convert.ToString(queryVal[1]) != "" ? Convert.ToString(queryVal[1]) : "";
                        param.Add(new DBParameter("@invoice_id", DbType.AnsiString, invoice_id));
                        param.Add(new DBParameter("@shipment_num", DbType.AnsiString, shipNo));
                        DataTable dtTarriff = SQL.Execute(Connection, DBConstants.GetTarriffPointType, param.ToArray());
                        if (dtTarriff.Rows.Count > 0)
                        {
                            param.Add(new DBParameter("@tariff_point_type", DbType.AnsiString, dtTarriff.Rows[0]["tariff_point_type"].ToString()));
                        }
                        param.Add(new DBParameter("@charge_description", DbType.AnsiString, chargeDesc));
                    }
                }
                return LoadResult(DBConstants.GetCustomChargeCodeOptions, param.ToArray());
            }
            catch (Exception ex)
            {
                BIACore.Log.LogFactory.Exception(ex);
                return null;
            }

        }
        /// <summary>
        /// Get tax withholding codes.
        /// </summary>
        /// <param name="request"></param>
        /// <returns></returns>
        [HttpPost]
        [ActionName("GetTWHCodes")]
        public List<object> GetTWHCodes([FromBody] dynamic request)
        {
            try
            {
                List<DBParameter> param = new List<DBParameter>();
                if (request["query"] != null || request["exParams"] != null)
                {
                    string query = null;
                    if (request["query"] != null)
                    {
                        query = request["query"].Value;
                    }
                    else
                    {
                        query = request["exParams"].Value;
                    }
                    string[] queryVal = query.Split(',');

                    if (queryVal.Length > 0)
                    {
                        var invCurr = Convert.ToString(queryVal[0]) != "" ? Convert.ToString(queryVal[0]) : "";
                        var invoice_id = Convert.ToString(queryVal[1]) != "" ? Convert.ToString(queryVal[1]) : "";
                        var locCode = Convert.ToString(queryVal[2]) != "" ? Convert.ToString(queryVal[2]) : "";
                        param.Add(new DBParameter("@location_code", DbType.AnsiString, locCode));
                        param.Add(new DBParameter("@invoice_id", DbType.AnsiString, invoice_id));
                        param.Add(new DBParameter("@invoice_currency", DbType.AnsiString, invCurr));
                    }
                }
                return LoadResult(DBConstants.GetTWHCodes, param.ToArray());
            }
            catch (Exception ex)
            {
                BIACore.Log.LogFactory.Exception(ex);
                return null;
            }

        }
        /// <summary>
        /// Get Validate TWH records.
        /// </summary>
        /// <param name="param"></param>
        /// <returns></returns>
        [HttpPost]
        [ActionName("GetValidateTWHEntry")]
        public object GetValidateTWHEntry([FromBody] biafilter.Filter param)
        {
            try
            {
                var result = false;
                DataTable dtResult = SQL.Execute(Connection, DBConstants.ValidateTWHEntry, new DBParameter("@invoice_id", DbType.AnsiString, param.InvoiceId));
                if (dtResult.Rows.Count > 0) { result = true; } else { result = false; }
                return result;
            }
            catch (Exception ex)
            {
                BIACore.Log.LogFactory.Exception(ex);
                return null;
            }
        }
        /// <summary>
        /// Insert the e2k cost custom charges.
        /// </summary>
        /// <param name="param"></param>
        /// <returns></returns>
        [HttpPost]
        [ActionName("InsertNonE2KCharge")]
        public string InsertNonE2KCharge([FromBody] biafilter.Filter param)
        {
            var result = "inserted";
            try
            {
                List<DBParameter> args = new List<DBParameter>();
                args.Add(new DBParameter("@invoice_id", DbType.AnsiString, param.InvoiceId));
                args.Add(new DBParameter("@shpmnt_nbr", DbType.AnsiString, param.ShipmentNumber));
                args.Add(new DBParameter("@shipment_dim_fk", DbType.AnsiString, param.ShipmentDimFK));
                args.Add(new DBParameter("@userid", DbType.AnsiString, param.UserId));
                args.Add(new DBParameter("@rev_split", DbType.AnsiString, param.RevSplit));
                args.Add(new DBParameter("@charge_code", DbType.AnsiString, param.ChargeCode));
                args.Add(new DBParameter("@description", DbType.AnsiString, param.Description));
                args.Add(new DBParameter("@accountnum", DbType.AnsiString, param.ORAAccount));
                args.Add(new DBParameter("@location_code", DbType.AnsiString, param.LocCode));
                args.Add(new DBParameter("@invoice_currency", DbType.AnsiString, param.CurrencyCode));
                SQL.Execute(Connection, DBConstants.AddNonE2KCostEntry, args.ToArray());
            }
            catch (Exception ex)
            {
                BIACore.Log.LogFactory.Exception(ex);
                return null;
            }
            return result;
        }
        /// <summary>
        /// Inserts tax withholding charges
        /// </summary>
        /// <param name="param"></param>
        /// <returns></returns>
        [HttpPost]
        [ActionName("InsertTaxWithholding")]
        public string InsertTaxWithholding([FromBody] biafilter.Filter param)
        {
            var result = "inserted";
            try
            {
                List<DBParameter> args = new List<DBParameter>();
                args.Add(new DBParameter("@invoice_id", DbType.AnsiString, param.InvoiceId));
                args.Add(new DBParameter("@shpmnt_nbr", DbType.AnsiString, param.ShipmentNumber));
                args.Add(new DBParameter("@shipment_dim_fk", DbType.AnsiString, param.ShipmentDimFK));
                args.Add(new DBParameter("@userid", DbType.AnsiString, param.UserId));
                args.Add(new DBParameter("@VATCode", DbType.AnsiString, param.VATCode));
                args.Add(new DBParameter("@description", DbType.AnsiString, param.Description));
                args.Add(new DBParameter("@location_code", DbType.AnsiString, param.LocCode));
                args.Add(new DBParameter("@invoice_currency", DbType.AnsiString, param.CurrencyCode));
                args.Add(new DBParameter("@twhCode", DbType.AnsiString, param.TWHCode));
                SQL.Execute(Connection, DBConstants.AddTaxWithholdingEntry, args.ToArray());
            }
            catch (Exception ex)
            {
                BIACore.Log.LogFactory.Exception(ex);
                return null;
            }
            return result;
        }
        /// <summary>
        /// Get Vat code for Invoice processing grid.
        /// </summary>
        /// <param name="request"></param>
        /// <returns></returns>        
        [HttpPost]
        [ActionName("GetVATCodesBP")]
        public List<object> GetVATCodesBP([FromBody] biafilter.Filter param)
        {
            try
            {
                List<DBParameter> arg = new List<DBParameter>();
                if (param.InvoiceVATId != "0" && param.InvoiceVATId != "999999999")
                {
                    arg.Add(new DBParameter("@invoicevat_id", DbType.AnsiString, param.InvoiceVATId));
                    return LoadResult(DBConstants.VATSubQuery, arg.ToArray());
                }
                else
                {
                    arg.Add(new DBParameter("@invoice_id", DbType.AnsiString, param.InvoiceId));
                    return LoadResult(DBConstants.GetVATCodesCF, arg.ToArray());
                }
            }
            catch (Exception ex)
            {
                BIACore.Log.LogFactory.Exception(ex);
                return null;
            }

        }
        /// <summary>
        /// Get all the avialable exchange rate based on from cid , to cid and invoiceid
        /// </summary>
        /// <param name="param"></param>
        /// <returns></returns>
        [HttpPost]
        [ActionName("GetExchangeRateData")]
        public ClientResult GetExchangeRateData([FromBody] biafilter.Filter param)
        {
            try
            {
                List<DBParameter> args = new List<DBParameter>();
                args.Add(new DBParameter("@invoice_id", DbType.AnsiString, param.InvoiceId));
                args.Add(new DBParameter("@fromCID", DbType.AnsiString, param.FromCID));
                args.Add(new DBParameter("@toCID", DbType.AnsiString, param.ToCID));
                args.Add(new DBParameter("@Shipment_dim_fk", DbType.AnsiString, param.ShipmentDimFK));
                args.Add(new DBParameter("@mbl_fk", DbType.AnsiString, param.MBLFk));
                args.Add(new DBParameter("@shpmnt_nbr", DbType.AnsiString, param.ShipmentNumber));
                args.Add(new DBParameter("@charge_fk", DbType.AnsiString, param.ChargeFk));
                args.Add(new DBParameter("@charge_code", DbType.AnsiString, param.ChargeCode));

                return LoadClientResult(DBConstants.GetExistingCurrencyDetails, args.ToArray());
            }
            catch (Exception ex)
            {
                BIACore.Log.LogFactory.Exception(ex);
                return null;
            }

        }
        /// <summary>
        /// Post new or updated invoice exchange currency record in invoicecurrency and invoicedetail table.
        /// </summary>
        /// <param name="param"></param>
        /// <returns></returns>
        [HttpPost]
        [ActionName("PostInvoiceCurrency")]
        public object PostInvoiceCurrency([FromBody] biafilter.Filter param)
        {
            DataTable dtInvCurr = new DataTable();
            List<DBParameter> args = new List<DBParameter>();
            try
            {
                args.Add(new DBParameter("@invoice_id", DbType.AnsiString, param.InvoiceId));
                args.Add(new DBParameter("@fromCID", DbType.AnsiString, param.FromCID));
                args.Add(new DBParameter("@toCID", DbType.AnsiString, param.ToCID));
                args.Add(new DBParameter("@fromRate", DbType.Decimal, param.FromRate));
                args.Add(new DBParameter("@toRate", DbType.Decimal, param.ToRate));
                args.Add(new DBParameter("@Shipment_dim_fk", DbType.AnsiString, param.ShipmentDimFK));
                args.Add(new DBParameter("@mbl_fk", DbType.AnsiString, param.MBLFk));
                args.Add(new DBParameter("@shpmnt_nbr", DbType.AnsiString, param.ShipmentNumber));
                args.Add(new DBParameter("@charge_fk", DbType.AnsiString, param.ChargeFk));
                args.Add(new DBParameter("@charge_code", DbType.AnsiString, param.ChargeCode));
                args.Add(new DBParameter("@rate", DbType.Decimal, param.ConvRate));
                args.Add(new DBParameter("@invoice_detail_id", DbType.AnsiString, param.InvoiceDetId));

                dtInvCurr = SQL.Execute(Connection, DBConstants.PostInvoiceCurrency, args.ToArray());
            }
            catch (Exception ex)
            {
                BIACore.Log.LogFactory.Exception(ex);
                return null;
            }
            return dtInvCurr;
        }
        /// <summary>
        /// Inserts/Updates Invoice detail table for selected charges.
        /// </summary>
        /// <param name="param"></param>
        /// <returns></returns>
        [HttpPost, HttpGet]
        [ActionName("PostInvoiceLine")]
        public object PostInvoiceLine([FromBody] dynamic param)
        {
            biafilter.Filter updParams = new biafilter.Filter();
            List<DBParameter> args = new List<DBParameter>();
            var userId = BIACore.Security.User.userId;
            try
            {

                if (param.Count == 1)
                {
                    args.Add(new DBParameter("@invoice_id", DbType.Int32, param[0]["invoice_id"].Value));
                    args.Add(new DBParameter("@Shipment_dim_fk", DbType.VarNumeric, param[0]["shipment_dim_fk"].Value));
                    args.Add(new DBParameter("@mbl_fk", DbType.VarNumeric, param[0]["MBL_fk"].Value));
                    args.Add(new DBParameter("@shpmnt_nbr", DbType.AnsiString, Convert.ToString(param[0]["shpmnt_nbr"].Value)));
                    args.Add(new DBParameter("@charge_fk", DbType.VarNumeric, param[0]["mbl_chg_fk"].Value));
                    args.Add(new DBParameter("@charge_code", DbType.AnsiString, Convert.ToString(param[0]["Charge_code"].Value)));
                    args.Add(new DBParameter("@invoicevat_id", DbType.Int32, param[0]["invoicevat_id"].Value));
                    args.Add(new DBParameter("@charge_Amt", DbType.Decimal, Convert.ToDecimal(param[0]["buy_amt"].Value)));
                    args.Add(new DBParameter("@charge_Cid", DbType.AnsiString, Convert.ToString(param[0]["buy_cid"].Value)));
                    args.Add(new DBParameter("@invoice_Cid", DbType.AnsiString, Convert.ToString(param[0]["invoice_cid"].Value)));
                    args.Add(new DBParameter("@comment", DbType.AnsiString, Convert.ToString(param[0]["comment"].Value)));
                    args.Add(new DBParameter("@PaidDifferentlyReason", DbType.AnsiString, Convert.ToString(param["PaidDifferentlyReason"].Value)));
                    args.Add(new DBParameter("@activeflag", DbType.Int32, Convert.ToInt32(param[0]["frontCheck"].Value)));
                    args.Add(new DBParameter("@userid", DbType.AnsiString, Convert.ToString(userId)));
                    args.Add(new DBParameter("@vat_amt", DbType.Decimal, Convert.ToDecimal(param[0]["invoicevat_amt"].Value)));
                    args.Add(new DBParameter("@accrualflag", DbType.AnsiString, Convert.ToInt32(param[0]["backCheck"].Value)));
                    args.Add(new DBParameter("@split_amt", DbType.Decimal, Convert.ToDecimal(param[0]["sell_amt"].Value)));
                    args.Add(new DBParameter("@conv_Rate", DbType.Decimal, Convert.ToDecimal(param[0]["ConvRate"].Value)));
                    args.Add(new DBParameter("@rowtype", DbType.AnsiString, Convert.ToString(param[0]["rowtype"].Value)));
                }
                else
                {
                    args.Add(new DBParameter("@invoice_id", DbType.Int32, param["invoice_id"].Value));
                    args.Add(new DBParameter("@Shipment_dim_fk", DbType.VarNumeric, param["shipment_dim_fk"].Value));
                    args.Add(new DBParameter("@mbl_fk", DbType.VarNumeric, param["MBL_fk"].Value));
                    args.Add(new DBParameter("@shpmnt_nbr", DbType.AnsiString, Convert.ToString(param["shpmnt_nbr"].Value)));
                    args.Add(new DBParameter("@charge_fk", DbType.VarNumeric, param["mbl_chg_fk"].Value));
                    args.Add(new DBParameter("@charge_code", DbType.AnsiString, Convert.ToString(param["Charge_code"].Value)));
                    args.Add(new DBParameter("@invoicevat_id", DbType.Int32, param["invoicevat_id"].Value));
                    args.Add(new DBParameter("@charge_Amt", DbType.Decimal, Convert.ToDecimal(param["buy_amt"].Value)));
                    args.Add(new DBParameter("@charge_Cid", DbType.AnsiString, Convert.ToString(param["buy_cid"].Value)));
                    args.Add(new DBParameter("@invoice_Cid", DbType.AnsiString, Convert.ToString(param["invoice_cid"].Value)));
                    args.Add(new DBParameter("@comment", DbType.AnsiString, Convert.ToString(param["comment"].Value)));
                    args.Add(new DBParameter("@PaidDifferentlyReason", DbType.AnsiString, Convert.ToString(param["PaidDifferentlyReason"].Value)));
                    args.Add(new DBParameter("@activeflag", DbType.Int32, Convert.ToInt32(param["frontCheck"].Value)));
                    args.Add(new DBParameter("@userid", DbType.AnsiString, Convert.ToString(userId)));
                    args.Add(new DBParameter("@vat_amt", DbType.Decimal, Convert.ToDecimal(param["invoicevat_amt"].Value)));
                    args.Add(new DBParameter("@accrualflag", DbType.AnsiString, Convert.ToInt32(param["backCheck"].Value)));
                    args.Add(new DBParameter("@split_amt", DbType.Decimal, Convert.ToDecimal(param["sell_amt"].Value)));
                    args.Add(new DBParameter("@conv_Rate", DbType.Decimal, Convert.ToDecimal(param["ConvRate"].Value)));
                    args.Add(new DBParameter("@rowtype", DbType.AnsiString, Convert.ToString(param["rowtype"].Value)));

                }
                DataTable dt = SQL.Execute(Connection, DBConstants.PostInvoiceLine, args.ToArray());
                var vatArg = new biafilter.Filter();
                vatArg.InvoiceId = param["invoice_id"].Value == null ? Convert.ToString(param[0]["invoice_id"].Value) : Convert.ToString(param["invoice_id"].Value);
                UpdateInvoiceVATId(vatArg);
                if (dt != null)
                {
                    if (param.Count == null)
                    { param["Invoice_detail_id"].Value = dt.Rows[0]["Invoicedetail_Id"]; }
                    else { param[0]["Invoice_detail_id"].Value = dt.Rows[0]["Invoicedetail_Id"]; }
                }
            }
            catch (Exception ex)
            {
                BIACore.Log.LogFactory.Exception(ex);
                return null;
            }
            return param;
        }
        /// <summary>
        /// Check the valid currency code.
        /// </summary>
        /// <param name="param"></param>
        /// <returns></returns>
        [HttpPost]
        [ActionName("CheckValidCurrency")]
        public object CheckValidCurrency([FromBody] biafilter.Filter param)
        {
            DataTable dt = new DataTable();
            List<DBParameter> args = new List<DBParameter>();
            try
            {
                args.Add(new DBParameter("@currency_code", DbType.AnsiString, param.CurrencyCode));


                dt = SQL.Execute(Connection, DBConstants.CheckValidCurrency, args.ToArray());
            }
            catch (Exception ex)
            {
                BIACore.Log.LogFactory.Exception(ex);
                return null;
            }
            return dt;
        }
        /// <summary>
        /// Get the charge count for invoice by Vat Id.
        /// </summary>
        /// <param name="param"></param>
        /// <returns></returns>
        [HttpPost]
        [ActionName("GetInvoiceChargeCountByVatId")]
        public object GetInvoiceChargeCountByVatId([FromBody] biafilter.Filter param)
        {
            List<DBParameter> args = new List<DBParameter>();
            try
            {
                args.Add(new DBParameter("@invoice_id", DbType.AnsiString, param.InvoiceId));
                args.Add(new DBParameter("@location_code", DbType.AnsiString, param.LocCode));
                return LoadSingle(DBConstants.GetInvoiceDetailCountByVatId, args.ToArray());
            }
            catch (Exception ex)
            {
                BIACore.Log.LogFactory.Exception(ex);
                return null;
            }

        }


        /// <summary>
        /// Update the invoice comment for Scac code acceptance.
        /// </summary>
        /// <param name="param"></param>
        /// <returns></returns>
        [HttpPost]
        [ActionName("UpdateInvoiceComment")]
        public object UpdateInvoiceComment([FromBody] biafilter.Filter param)
        {
            List<DBParameter> args = new List<DBParameter>();
            try
            {
                args.Add(new DBParameter("@invoice_id", DbType.AnsiString, param.InvoiceId));
                args.Add(new DBParameter("@userid", DbType.AnsiString, param.UserId));
                args.Add(new DBParameter("@comment", DbType.AnsiString, param.Comments));
                args.Add(new DBParameter("@status", DbType.AnsiString, param.InvoiceStatusTo));
                args.Add(new DBParameter("@imageNo", DbType.AnsiString, param.ImageNumber));
                return LoadResult(DBConstants.UpdateInvoiceComment, args.ToArray());
            }
            catch (Exception ex)
            {
                BIACore.Log.LogFactory.Exception(ex);
                return null;
            }

        }
        [HttpPost]
        [ActionName("VerifyInvoice")]
        public object VerifyInvoice([FromBody] biafilter.Filter param)
        {
            List<DBParameter> args = new List<DBParameter>();
            try
            {
                UpdateInvoiceVATId(param);
                args.Add(new DBParameter("@invoice_id", DbType.AnsiString, param.InvoiceId));
                args.Add(new DBParameter("@status", DbType.AnsiString, param.InvoiceStatusTo));
                args.Add(new DBParameter("@userid", DbType.AnsiString, param.UserId));
                args.Add(new DBParameter("@activeflag", DbType.Int32, param.ActiveFlag));
                args.Add(new DBParameter("@canApprove", DbType.Int32, param.CanApprove));
                args.Add(new DBParameter("@e2kUserId", DbType.AnsiString, param.E2kUserId));
                return LoadResult(DBConstants.VerifyInvoiceForSelCharges, args.ToArray());
            }
            catch (Exception ex)
            {
                BIACore.Log.LogFactory.Exception(ex);
                return null;
            }

        }
        /// <summary>
        /// Update invoice ids for all the selected. 
        /// </summary>
        /// <param name="param"></param>
        /// <returns></returns>
        [HttpPost]
        [ActionName("UpdateInvoiceVATId")]
        public object UpdateInvoiceVATId([FromBody] biafilter.Filter param)
        {
            List<DBParameter> args = new List<DBParameter>();
            try
            {
                args.Add(new DBParameter("@invoice_id", DbType.AnsiString, param.InvoiceId));
                return LoadResult(DBConstants.UpdateInvoiceVatIds, args.ToArray());
            }
            catch (Exception ex)
            {
                BIACore.Log.LogFactory.Exception(ex);
                return null;
            }

        }
        /// <summary>
        /// GetSplitRemainder
        /// </summary>
        /// <param name="request"></param>
        /// <returns></returns>
        [HttpPost]
        [ActionName("GetSplitRemainder")]
        public object GetSplitRemainder([FromBody] biafilter.Filter param)
        {
            List<DBParameter> args = new List<DBParameter>();
            try
            {
                args.Add(new DBParameter("@shipment_dim_fk", DbType.AnsiString, param.ShipmentDimFK));
                if (param.MBLFk.Equals("0"))
                {
                    args.Add(new DBParameter("@mbl_fk", DbType.AnsiString, DBNull.Value));
                }
                else
                {
                    args.Add(new DBParameter("@mbl_fk", DbType.AnsiString, param.MBLFk));
                }
                args.Add(new DBParameter("@charge_fk", DbType.AnsiString, param.ChargeFk));
                args.Add(new DBParameter("@charge_code", DbType.AnsiString, param.ChargeCode));
                return LoadSingle(DBConstants.GetSplitRemainder, args.ToArray());
            }
            catch (Exception ex)
            {
                BIACore.Log.LogFactory.Exception(ex);
                return null;
            }

        }

        /// <summary>
        /// GetSplitRemainder
        /// </summary>
        /// <param name="request"></param>
        /// <returns></returns>
        [HttpPost]
        [ActionName("GetInvoiceLineCurrency")]
        public object GetInvoiceLineCurrency([FromBody] biafilter.Filter param)
        {
            List<DBParameter> args = new List<DBParameter>();
            try
            {
                args.Add(new DBParameter("@shipment_dim_fk", DbType.AnsiString, param.ShipmentDimFK));
                if (param.MBLFk.Equals("0"))
                {
                    args.Add(new DBParameter("@mbl_fk", DbType.AnsiString, DBNull.Value));
                }
                else
                {
                    args.Add(new DBParameter("@mbl_fk", DbType.AnsiString, param.MBLFk));
                }
                args.Add(new DBParameter("@fromCID", DbType.AnsiString, param.FromCID));
                args.Add(new DBParameter("@invoice_id", DbType.AnsiString, param.InvoiceId));
                args.Add(new DBParameter("@shpmnt_nbr", DbType.AnsiString, param.ShipmentNumber));
                args.Add(new DBParameter("@charge_fk", DbType.AnsiString, param.ChargeFk));
                args.Add(new DBParameter("@charge_code", DbType.AnsiString, param.ChargeCode));
                return LoadSingle(DBConstants.GetInvoiceLineCurrency, args.ToArray());
            }
            catch (Exception ex)
            {
                BIACore.Log.LogFactory.Exception(ex);
                return null;
            }

        }

        [HttpPost]
        [ActionName("CheckInvoiceCurrency")]
        public object CheckInvoiceCurrency([FromBody] biafilter.Filter param)
        {
            List<DBParameter> args = new List<DBParameter>();
            try
            {
                args.Add(new DBParameter("@fromCID", DbType.AnsiString, param.FromCID));
                args.Add(new DBParameter("@invoice_id", DbType.AnsiString, param.InvoiceId));
                return LoadSingle(DBConstants.IsInvoiceCurrencyExist, args.ToArray());
            }
            catch (Exception ex)
            {
                BIACore.Log.LogFactory.Exception(ex);
                return null;
            }

        }
        [HttpPost]
        [ActionName("LoadPaidDifferentlyReasons")]
        public ClientResult LoadPaidDifferentlyReasons([FromBody] dynamic request)
        {
            return LoadClientResult(DBConstants.GetPaidDifferrentlyReason);
        }
    }
}
