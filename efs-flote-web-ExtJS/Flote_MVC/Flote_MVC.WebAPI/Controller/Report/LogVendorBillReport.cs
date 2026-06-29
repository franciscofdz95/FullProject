/* ====================================================================================================
NAME:				[Common Report Controller]
BEHAVIOR:		Returns Common reports data for selected filter criteria.
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
using BIACore.Provider;

namespace Flote.WebAPI.WebAPI.Controller
{
    public partial class WebApiReportController
    {
        /// <summary>
        /// Vat Tax Amount Details.
        /// </summary>
        /// <param name="param"></param>
        /// <returns></returns>
        [HttpPost]
        [ActionName("VatTaxAmt")]
        public ClientResult VatTaxAmt([FromBody] biafilter.Filter param)
        {
            try
            {
                List<DBParameter> args = new List<DBParameter>();
                args.Add(new DBParameter("@invoice_id", DbType.AnsiString, param.InvoiceId));
                args.Add(new DBParameter("@location_code", DbType.AnsiString, param.LocCode));
                return LoadClientNullableResult(DBConstants.GetVATCodesDN, args.ToArray());
            }
            catch (Exception ex)
            {
                BIACore.Log.LogFactory.Exception(ex);
                return null;
            }
        }

        /// <summary>
        /// Get the log vendor fields details.
        /// </summary>
        /// <param name="info"></param>
        /// <returns></returns>
        [HttpPost]
        [ActionName("GetLVBFieldsData")]
        public object GetLVBFieldsData([FromBody] dynamic info)
        {
            try
            {
                return LoadSingle(DBConstants.GetForEditInvoice, new DBParameter("@invoice_id", DbType.AnsiString, info["InvoiceId"].Value));
            }
            catch (Exception ex)
            {
                BIACore.Log.LogFactory.Exception(ex);
                return null;
            }
        }

        /// <summary>
        /// Get the Region Info by Location code.
        /// </summary>
        /// <param name="info"></param>
        /// <returns></returns>
        [HttpPost]
        [ActionName("GetRegionInfo")]
        public object GetRegionInfo([FromBody] dynamic info)
        {
            try
            {
                return LoadSingle(DBConstants.GetRegion, new DBParameter("@location_code", DbType.AnsiString, info["InvLoc"].Value));
            }
            catch (Exception ex)
            {
                BIACore.Log.LogFactory.Exception(ex);
                return null;
            }
        }

        /// <summary>
        /// Get the Account Number based on Location and Invoice Date.
        /// </summary>
        /// <param name="info"></param>
        /// <returns></returns>
        [HttpPost]
        [ActionName("GetAccName")]
        public object GetAccName([FromBody] dynamic info)
        {
            try
            {
                List<DBParameter> args = new List<DBParameter>();
                args.Add(new DBParameter("@location_code", DbType.AnsiString, info["LocCode"].Value));
                args.Add(new DBParameter("@invoice_date", DbType.AnsiString, info["InvDate"].Value));
                return LoadClientResult(DBConstants.GetAccName, args.ToArray());
            }
            catch (Exception ex)
            {
                BIACore.Log.LogFactory.Exception(ex);
                return null;
            }
        }

        /// <summary>
        /// Delete VAT Data.
        /// </summary>
        /// <param name="param"></param>
        /// <returns></returns>
        [HttpPost]
        [ActionName("DeleteVATData")]
        public object DeleteVATData([FromBody] dynamic info)
        {
            var removed = "Deleted";
            try
            {
                List<DBParameter> argsRm = new List<DBParameter>();
                argsRm.Add(new DBParameter("@invoice_id", DbType.AnsiString, info["InvoiceId"].Value));
                argsRm.Add(new DBParameter("@vat_code", DbType.AnsiString, info["VatCode"].Value));
                SQL.Execute(Connection, DBConstants.DeleteInvoiceVAT, argsRm.ToArray());
            }
            catch (Exception ex)
            {
                BIACore.Log.LogFactory.Exception(ex);
                throw ex;
            }
            return removed;
        }

        /// <summary>
        /// Delete VAT Data.
        /// </summary>
        /// <param name="param"></param>
        /// <returns></returns>
        [HttpPost]
        [ActionName("UpdateDeleteInvoiceVatData")]
        public object UpdateDeleteInvoiceVatData([FromBody] dynamic info)
        {
            var removed = "Deleted";
            try
            {
                List<DBParameter> argsRm = new List<DBParameter>();
                argsRm.Add(new DBParameter("@invoice_id", DbType.AnsiString, info["InvoiceId"].Value));
                argsRm.Add(new DBParameter("@vat_code", DbType.AnsiString, info["VatCode"].Value));
                SQL.Execute(Connection, DBConstants.UpdateDeleteInvoiceVatData, argsRm.ToArray());
            }
            catch (Exception ex)
            {
                BIACore.Log.LogFactory.Exception(ex);
                throw ex;
            }
            return removed;
        }
        /// <summary>
        /// Set the Invoice Status 
        /// </summary>
        /// <param name="param"></param>
        /// <returns></returns>
        [HttpPost]
        [ActionName("PostInvoice")]
        public object PostInvoice([FromBody] dynamic info)
        {
            try
            {
                List<DBParameter> argsUpd = new List<DBParameter>();
                argsUpd.Add(new DBParameter("@vendor_id", DbType.Int32, info["VendorId"].Value));
                argsUpd.Add(new DBParameter("@location_code", DbType.AnsiString, Convert.ToString(info["LocationCode"].Value)));
                DataTable CheckVendorPref = SQL.Execute(Connection, DBConstants.GetVendorByVendorLocation, argsUpd.ToArray());

                if (CheckVendorPref.Rows.Count == 0)
                {
                    SQL.Execute(Connection, DBConstants.InsertVendorLocation, argsUpd.ToArray());
                }

                argsUpd.Add(new DBParameter("@InvRefNo", DbType.AnsiString, Convert.ToString(info["InvRefNo"].Value).ToUpper()));
                argsUpd.Add(new DBParameter("@invoice_id", DbType.AnsiString, Convert.ToString(info["InvoiceId"].Value)));
                argsUpd.RemoveAt(1);
                DataTable CheckReadInv = SQL.Execute(Connection, DBConstants.ReadInvoiceByInvRefNo, argsUpd.ToArray());
                argsUpd.RemoveAt(2);
                argsUpd.Add(new DBParameter("@location_code", DbType.AnsiString, Convert.ToString(info["LocationCode"].Value)));
                argsUpd.Add(new DBParameter("@remote_check_location_code", DbType.AnsiString, Convert.ToString(info["RemoteCheckLocationCode"].Value))); //This is being hard coded to TPE               
                argsUpd.Add(new DBParameter("@TotInvAmt", DbType.Decimal, Convert.ToDecimal(info["TotInvAmt"].Value)));
                argsUpd.Add(new DBParameter("@Invoice_CID", DbType.AnsiString, Convert.ToString(info["InvoiceCID"].Value))); //This is being hard coded to TPE
                argsUpd.Add(new DBParameter("@Invoice_Status", DbType.AnsiString, Convert.ToString(info["InvoiceStatus"].Value)));
                argsUpd.Add(new DBParameter("@userid", DbType.AnsiString, Convert.ToString(info["UserId"].Value)));
                argsUpd.Add(new DBParameter("@InvoiceDate", DbType.AnsiString, Convert.ToDateTime(info["InvoiceDate"].Value).ToString("yyyy-MM-dd"))); //This is being hard coded to TPE
                argsUpd.Add(new DBParameter("@InvoiceDueDate", DbType.AnsiString, Convert.ToDateTime(info["InvoiceDueDate"].Value).ToString("yyyy-MM-dd")));
                argsUpd.Add(new DBParameter("@VATPointDate", DbType.AnsiString, Convert.ToDateTime(info["VATPointDate"].Value).ToString("yyyy-MM-dd")));
                argsUpd.Add(new DBParameter("@ReferenceFilter", DbType.AnsiString, Convert.ToString(info["ReferenceFilter"].Value))); //This is being hard coded to TPE
                argsUpd.Add(new DBParameter("@Reference_Id", DbType.Int32, info["ReferenceId"].Value));
                argsUpd.Add(new DBParameter("@OtherReference", DbType.AnsiString, Convert.ToString(info["OtherReference"].Value)));
                argsUpd.Add(new DBParameter("@CheckNumber", DbType.AnsiString, Convert.ToString(info["CheckNumber"].Value))); //This is being hard coded to TPE
                argsUpd.Add(new DBParameter("@StampNumber", DbType.AnsiString, Convert.ToString(info["StampNumber"].Value)));
                argsUpd.Add(new DBParameter("@ImageNumber", DbType.AnsiString, DBNull.Value));
                argsUpd.Add(new DBParameter("@AccNumber", DbType.AnsiString, Convert.ToString(info["AccNumber"].Value))); //This is being hard coded to TPE
                argsUpd.Add(new DBParameter("@value_pay_invoice_type_code", DbType.AnsiString, info["ValuePayInvoiceTypeCode"].Value));
                argsUpd.Add(new DBParameter("@GL_Currency_rate", DbType.Decimal, Convert.ToDecimal(info["GLCurrencyRate"].Value)));
                argsUpd.Add(new DBParameter("@pay_alone_flag", DbType.Int32, info["PayAloneFlag"].Value)); //This is being hard coded to TPE


                if (CheckReadInv.Rows.Count == 0)
                {

                    if (info["InvoiceId"].Value == "0")
                    {
                        //Insert Invoice.
                        DataTable dtInsertInvoice = new DataTable();
                        try
                        {
                            dtInsertInvoice = SQL.Execute(Connection, DBConstants.InsertInvoice, argsUpd.ToArray());
                        }
                        catch (Exception ex)
                        {
                            BIACore.Log.LogFactory.Exception(ex);
                            throw ex;

                        }
                        DataTable dtUpdateStat = UpdateInvoiceStatus(dtInsertInvoice.Rows[0]["Invoice_id"].ToString(), info["InvoiceStatus"].Value, info["UserId"].Value);
                        if (info["VATData"].Value != null)
                        { if (Convert.ToString(info["VATData"].Value).Length > 1) { var vatInsert = SetVATData(dtInsertInvoice.Rows[0]["Invoice_id"].ToString(), info["VATData"].Value); } }
                        return dtInsertInvoice.Rows[0]["Invoice_id"].ToString();
                    }
                    else
                    {
                        // update invoice                        
                        argsUpd.Add(new DBParameter("@invoice_id", DbType.AnsiString, Convert.ToString(info["InvoiceId"].Value)));
                        SQL.Execute(Connection, DBConstants.UpdateInvoiceInfo, argsUpd.ToArray());
                        DataTable dtUpdateStat = UpdateInvoiceStatus(info["InvoiceId"].Value, info["InvoiceStatus"].Value, info["UserId"].Value);
                        if (info["VATData"].Value != null)
                        {
                            if (Convert.ToString(info["VATData"].Value).Length > 1)
                            {
                                SetVATData(Convert.ToString(info["InvoiceId"].Value), info["VATData"].Value);
                            }
                        }
                        return "Updated";
                    }
                }
                else
                {
                    return "VendorInvoice";
                }
            }
            catch (Exception ex)
            {
                BIACore.Log.LogFactory.Exception(ex);
                return "Exception";
            }
        }
        /// <summary>
        /// Get Approve Invoice Count by week.
        /// </summary>
        /// <param name="param"></param>
        /// <returns></returns>
        [HttpPost]
        [ActionName("ValidateUPSReference")]
        public object ValidateUPSReference([FromBody] dynamic info)
        {
            DataTable dtKeyValuePair = new DataTable();
            try
            {
                List<DBParameter> args = new List<DBParameter>();
                args.Add(new DBParameter("@ReferenceKey", DbType.AnsiString, info["Key"].Value));
                args.Add(new DBParameter("@ReferenceValues", DbType.AnsiString, info["Values"].Value));
                if (info["Key"].Value != 99)
                {
                    dtKeyValuePair = SQL.Execute(Connection, DBConstants.ValidateUPSReference, args.ToArray());
                }

            }
            catch (Exception ex)
            {
                BIACore.Log.LogFactory.Exception(ex);
                throw ex;
            }
            return dtKeyValuePair;
        }
        /// <summary>
        /// Check Invoice Detail For Existing VatCode
        /// </summary>
        /// <param name="param"></param>
        /// <returns></returns>
        [HttpPost]
        [ActionName("CheckInvoiceDetailForExVatCode")]
        public object CheckInvoiceDetailForExVatCode([FromBody] dynamic info)
        {
            try
            {
                var result = false;
                List<DBParameter> args = new List<DBParameter>();
                args.Add(new DBParameter("@invoice_id", DbType.AnsiString, info["InvoiceId"].Value));
                args.Add(new DBParameter("@vat_code", DbType.AnsiString, info["VatCode"].Value));
                DataTable dtResult = SQL.Execute(Connection, DBConstants.CheckInvoiceDetailForExVatCode, args.ToArray());
                if (dtResult.Rows.Count > 0)
                {
                    int count = Convert.ToInt32(dtResult.Rows[0]["VatCount"].ToString());
                    if (count > 0)
                    {
                        result = true;
                    }
                    else { result = false; }
                }
                return result;
            }
            catch (Exception ex)
            {
                BIACore.Log.LogFactory.Exception(ex);
                return null;
            }
        }
        /// <summary>
        /// Set the Vat Data record details as below.
        /// </summary>
        /// <param name="invoiceId"></param>
        /// <param name="vatString"></param>
        /// <returns></returns>
        private object SetVATData(string invoiceId, string vatString)
        {
            try
            {
                if (vatString != null && vatString != "")
                {
                    string[] vatDataList = vatString.Split('|');
                    foreach (string vatRecord in vatDataList)
                    {
                        if (vatRecord != "")
                        {
                            var vatData = vatRecord.Split('_');
                            var vatCode = vatData[0];
                            var vatPercent = vatData[1];
                            Double vatPer;
                            var vInv = 0;
                            bool flagVatPer = Double.TryParse(vatPercent, out vatPer);
                            if (!flagVatPer)
                            {
                                vatPercent = "0";
                            }
                            var vatAmount = Convert.ToDecimal(vatData[2]);
                            var retRate = vatData[3];
                            var twhAmount = vatData[4];
                            var osoffset = vatData[5];

                            if (retRate == "false")
                            { vInv = 1; }
                            else { vInv = -1; }
                            List<DBParameter> argsRm = new List<DBParameter>();
                            argsRm.Add(new DBParameter("@invoice_id", DbType.AnsiString, invoiceId));
                            argsRm.Add(new DBParameter("@vatCode", DbType.AnsiString, vatCode));
                            argsRm.Add(new DBParameter("@vatPercent", DbType.AnsiString, vatPercent));
                            argsRm.Add(new DBParameter("@amt", DbType.AnsiString, vatAmount));
                            argsRm.Add(new DBParameter("@TWHAmt", DbType.AnsiString, twhAmount));
                            argsRm.Add(new DBParameter("@vInv", DbType.AnsiString, vInv));
                            argsRm.Add(new DBParameter("@osoffset", DbType.AnsiString, osoffset));
                            SQL.Execute(Connection, DBConstants.SetInvoiceVAT, argsRm.ToArray());
                        }
                    }
                }
            }
            catch (Exception ex)
            {
                BIACore.Log.LogFactory.Exception(ex);
                throw ex;
            }
            return "Updated";
        }
        /// <summary>
        /// Get the TWH code by location code.
        /// </summary>
        /// <param name="param"></param>
        /// <returns></returns>
        [HttpPost]
        [ActionName("GetTWHCodesByLoc")]
        public object GetTWHCodesByLoc(biafilter.Filter param)
        {
            try
            {
                return LoadSingle(DBConstants.GetTWHCodesByLoc, new DBParameter("@location_code", DbType.AnsiString, param.LocCode));
            }
            catch (Exception ex)
            {
                BIACore.Log.LogFactory.Exception(ex);
                return null;
            }
        }
        /// <summary>
        /// Delete VAT Data.
        /// </summary>
        /// <param name="param"></param>
        /// <returns></returns>
        [HttpPost]
        [ActionName("UpdateInvCheckInfo")]
        public object UpdateInvCheckInfo([FromBody] dynamic info)
        {
            var removed = "Updated";
            try
            {
                List<DBParameter> argsRm = new List<DBParameter>();
                argsRm.Add(new DBParameter("@invoice_id", DbType.AnsiString, info["InvoiceId"].Value));
                argsRm.Add(new DBParameter("@Check_date", DbType.AnsiString, Convert.ToDateTime(info["CheckDate"].Value).ToString("yyyy-MM-dd HH:mm:ss"))); //This is being hard coded to TPE
                argsRm.Add(new DBParameter("@CheckNumber", DbType.AnsiString, info["CheckNumber"].Value));
                argsRm.Add(new DBParameter("@Check_amt_nbr", DbType.Decimal, Convert.ToDecimal(info["CheckAmtNbr"].Value)));
                argsRm.Add(new DBParameter("@Bank_info", DbType.AnsiString, info["BankInfo"].Value));
                argsRm.Add(new DBParameter("@Pymt_upd_user", DbType.AnsiString, Convert.ToString(info["PymtUpdUser"].Value)));

                SQL.Execute(Connection, DBConstants.UpdateInvCheckInfo, argsRm.ToArray());
            }
            catch (Exception ex)
            {
                BIACore.Log.LogFactory.Exception(ex);
                throw ex;
            }
            return removed;
        }

        [HttpPost]
        [ActionName("GetRemotePrintLocations")]
        public object GetRemotePrintLocations(biafilter.Filter param)
        {
            try
            {
                return LoadSingle(DBConstants.GetTWHCodesByLoc, new DBParameter("@location_code", DbType.AnsiString, param.LocCode));
            }
            catch (Exception ex)
            {
                BIACore.Log.LogFactory.Exception(ex);
                return null;
            }
        }

    }
}
