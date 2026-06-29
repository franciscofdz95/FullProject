using System;
using System.Collections.Generic;
using System.Web.Http;
using biafilter = Flote.WebAPI.WebAPI.Model;
using BIACore.Web.Model;
using Flote.WebAPI.WebAPI.Model;
using BIACore.Model;
using System.Data;
using BIACore.Provider;
using System.Net.Http;
using System.Text;
using System.Net.Http.Headers;
using System.Net;

namespace Flote.WebAPI.WebAPI.Controller
{
    public partial class WebApiReportController
    {
        /// <summary>
        /// Get the validate data from workbookdata table by invoice id.
        /// </summary>
        /// <param name="info"></param>
        /// <returns></returns>
        [HttpPost]
        [ActionName("DataFromImport")]
        public ClientResult DataFromImport([FromBody] biafilter.Filter info)
        {
            try
            {
                List<DBParameter> args = new List<DBParameter>();
                Validate(Convert.ToInt32(info.InvoiceId));

                var sorters = info.sort;

                StringBuilder sort = new StringBuilder("");
                if (sorters != null)
                {
                    for (var i = 0; i < sorters.Length; i++)
                    {
                        sort.Append(sorters[i].property + "  " + sorters[i].direction);
                        if (sorters.Length > 1 && sorters.Length - 1 != i)
                        {
                            sort.Append(',');
                        }
                    }
                }

                args.Add(new DBParameter("@Identifier", DbType.AnsiString, Convert.ToInt32(info.InvoiceId)));
                args.Add(new DBParameter("@UserID", DbType.AnsiString, info.UserId));
                args.Add(new DBParameter("@start", DbType.AnsiString, Convert.ToInt32(info.start)));
                args.Add(new DBParameter("@limit", DbType.AnsiString, Convert.ToInt32(info.limit)));
                args.Add(new DBParameter("@ShowErrors", DbType.AnsiString, Convert.ToBoolean(info.ShowError)));
                args.Add(new DBParameter("@Export", DbType.AnsiString, false));
                args.Add(new DBParameter("@sort", DbType.AnsiString, sort.ToString()));
                args.Add(new DBParameter("@errType", DbType.AnsiString, info.ErrorType));
                ClientResult result = LoadPagedClientResult(DBConstants.GetImportData, args.ToArray());

                return result;

            }
            catch (Exception ex)
            {
                BIACore.Log.LogFactory.Exception(ex);
                return null;
            }

        }
        /// <summary>
        /// Export the Import Excel data.
        /// </summary>
        /// <param name="param"></param>
        /// <returns></returns>
        [HttpPost, HttpGet]
        [ActionName("ValidateDataExcelExport")]
        public HttpResponseMessage ValidateDataExcelExport([FromBody] biafilter.Filter param)
        {
            HttpResponseMessage response = new HttpResponseMessage(HttpStatusCode.OK);
            try
            {
                string filename = "ExportExcel_" + param.PageName + ".xls";
                List<DBParameter> args = new List<DBParameter>();

                args.Add(new DBParameter("@Identifier", DbType.AnsiString, Convert.ToInt32(param.InvoiceId)));
                args.Add(new DBParameter("@UserID", DbType.AnsiString, param.UserId));
                args.Add(new DBParameter("@ShowErrors", DbType.AnsiString, Convert.ToBoolean(param.ShowError)));
                args.Add(new DBParameter("@Export", DbType.AnsiString, true));
                args.Add(new DBParameter("@sort", DbType.AnsiString, param.SortParam));
                args.Add(new DBParameter("@errType", DbType.AnsiString, param.ErrorType));

                DataTable dt = SQL.Execute(Connections.Flote_Raw, DBConstants.GetImportData, args.ToArray());
                StringBuilder colNames = new StringBuilder("");
                var counter = 0;
                foreach (DataColumn dCol in dt.Columns)
                {
                    counter += 1;

                    colNames.Append(dCol.ColumnName);
                    if (dt.Columns.Count > counter && dt.Columns.Count > 1)
                    {
                        colNames.Append(",");
                    }
                }

                StringBuilder str = new StringBuilder();
                str.Append(DataToString(dt, colNames.ToString()));
                response.Content = new StringContent(str.ToString());
                response.Content.Headers.ContentType = new MediaTypeHeaderValue("application/octet-stream");
                response.Content.Headers.ContentDisposition = new ContentDispositionHeaderValue("attachment");
                response.Content.Headers.ContentDisposition.FileName = filename.Replace(AppDomain.CurrentDomain.BaseDirectory + @"Export\", "");
                // Fix IE download issue over SSL with caching enabled.
                response.Headers.CacheControl = new CacheControlHeaderValue() { Private = true, MaxAge = new TimeSpan(0, 0, 0, 1) };
                response.Headers.Add("Pragma", "token");
                return response;
            }
            catch (Exception ex)
            {
                BIACore.Log.LogFactory.Exception(ex);
                return null;
            }
        }
        /// <summary>
        /// Update the selected record in grid by invoice id and row id.
        /// </summary>
        /// <param name="info"></param>
        /// <returns></returns>
        [HttpPost, HttpGet]
        [ActionName("UpdateDataFromImport")]
        public object UpdateDataFromImport([FromBody] dynamic info)
        {
            try
            {
                List<DBParameter> args = new List<DBParameter>();
                if (info.Count == 1)
                {
                    DateTime date = info[0]["DATE"].Value == null ? DateTime.Today : Convert.ToDateTime(info[0]["DATE"].Value);

                    args.Add(new DBParameter("@Identifier", DbType.AnsiString, Convert.ToInt32(info[0]["INVOICE_ID"].Value)));
                    args.Add(new DBParameter("@UserID", DbType.AnsiString, info[0]["USER_ID"].Value));
                    args.Add(new DBParameter("@ID", DbType.AnsiString, Convert.ToInt32(info[0]["ROW_ID"].Value)));
                    args.Add(new DBParameter("@Date", DbType.AnsiString, date));
                    args.Add(new DBParameter("@ContainerNumber", DbType.AnsiString, info[0]["CONTAINER_NBR"].Value));
                    args.Add(new DBParameter("@ContainerType", DbType.AnsiString, info[0]["CONTAINER_TYPE"].Value));
                    args.Add(new DBParameter("@ContainerCount", DbType.AnsiString, Convert.ToInt32(info[0]["CONTAINER_COUNT"].Value)));
                    args.Add(new DBParameter("@CarrierBOL", DbType.AnsiString, info[0]["CARRIER_BOL"].Value));
                    args.Add(new DBParameter("@JobNumber", DbType.AnsiString, info[0]["JOB_NBR"].Value));
                    args.Add(new DBParameter("@ChargeDesc", DbType.AnsiString, info[0]["CHARGE_DESCRIPTION"].Value));
                    args.Add(new DBParameter("@Amount", DbType.AnsiString, Convert.ToDecimal(info[0]["AMOUNT"].Value)));
                    args.Add(new DBParameter("@VerifiedAmt", DbType.AnsiString, Convert.ToDecimal(info[0]["VERIFIED_AMOUNT"].Value)));
                    args.Add(new DBParameter("@RatesMtch", DbType.AnsiString, info[0]["RATES_MATCH"].Value));
                    args.Add(new DBParameter("@Comment", DbType.AnsiString, info[0]["COMMENT"].Value));
                    args.Add(new DBParameter("@HBL", DbType.AnsiString, info[0]["HBL"].Value));
                    args.Add(new DBParameter("@ShowErrors", DbType.AnsiString, info[0]["HBL"].Value));

                }
                else
                {
                    DateTime date = info[0]["DATE"].Value == null ? DateTime.Today : Convert.ToDateTime(info["DATE"].Value);

                    args.Add(new DBParameter("@Identifier", DbType.AnsiString, Convert.ToInt32(info["INVOICE_ID"].Value)));
                    args.Add(new DBParameter("@UserID", DbType.AnsiString, info["USER_ID"].Value));
                    args.Add(new DBParameter("@ID", DbType.AnsiString, Convert.ToInt32(info["ROW_ID"].Value)));
                    args.Add(new DBParameter("@Date", DbType.AnsiString, date));
                    args.Add(new DBParameter("@ContainerNumber", DbType.AnsiString, info["CONTAINER_NBR"].Value));
                    args.Add(new DBParameter("@ContainerType", DbType.AnsiString, info["CONTAINER_TYPE"].Value));
                    args.Add(new DBParameter("@ContainerCount", DbType.AnsiString, Convert.ToInt32(info["CONTAINER_COUNT"].Value)));
                    args.Add(new DBParameter("@CarrierBOL", DbType.AnsiString, info["CARRIER_BOL"].Value));
                    args.Add(new DBParameter("@JobNumber", DbType.AnsiString, info["JOB_NBR"].Value));
                    args.Add(new DBParameter("@ChargeDesc", DbType.AnsiString, info["CHARGE_DESCRIPTION"].Value));
                    args.Add(new DBParameter("@Amount", DbType.AnsiString, Convert.ToDecimal(info["AMOUNT"].Value)));
                    args.Add(new DBParameter("@VerifiedAmt", DbType.AnsiString, Convert.ToDecimal(info["VERIFIED_AMOUNT"].Value)));
                    args.Add(new DBParameter("@RatesMtch", DbType.AnsiString, info["RATES_MATCH"].Value));
                    args.Add(new DBParameter("@Comment", DbType.AnsiString, info["COMMENT"].Value));
                    args.Add(new DBParameter("@HBL", DbType.AnsiString, info["HBL"].Value));
                    args.Add(new DBParameter("@ShowErrors", DbType.AnsiString, info["HBL"].Value));
                }
                SQL.Execute(Connection, DBConstants.UpdateDataImport, args.ToArray());
                return info;
            }
            catch (Exception ex)
            {
                BIACore.Log.LogFactory.Exception(ex);
                return null;
            }
        }
        /// <summary>
        /// Delete all data from workbookdata and workbook_control table by invoice id.
        /// </summary>
        /// <param name="info"></param>
        [HttpPost]
        [ActionName("DeleteDataFromImport")]
        public void DeleteDataFromImport([FromBody] biafilter.Filter info)
        {
            try
            {
                List<DBParameter> args = new List<DBParameter>();
                args.Add(new DBParameter("@INVOICE_ID", DbType.AnsiString, Convert.ToInt32(info.InvoiceId)));
                args.Add(new DBParameter("@CBOL", DbType.AnsiString, info.CarrierCBOL));
                args.Add(new DBParameter("@CHARGECODE", DbType.AnsiString, info.ChargeCode));
                args.Add(new DBParameter("@ROW_ID", DbType.AnsiString, Convert.ToInt32(info.RowId)));
                args.Add(new DBParameter("@USERID", DbType.AnsiString, info.UserId));
                args.Add(new DBParameter("@HBL", DbType.AnsiString, info.HBL));
                SQL.Execute(Connection, DBConstants.DeleteDataImport, args.ToArray());
            }
            catch (Exception ex)
            {
                BIACore.Log.LogFactory.Exception(ex);
            }
        }
        /// <summary>
        /// Is Charges Deleted fro selected row.
        /// </summary>
        /// <param name="info"></param>
        [HttpPost, HttpGet]
        [ActionName("IsChargesDeleted")]
        public object IsChargesDeleted([FromBody] biafilter.Filter info)
        {
            try
            {
                List<DBParameter> args = new List<DBParameter>();
                args.Add(new DBParameter("@INVOICE_ID", DbType.AnsiString, Convert.ToInt32(info.InvoiceId)));
                args.Add(new DBParameter("@CBOL", DbType.AnsiString, info.CarrierCBOL));
                args.Add(new DBParameter("@CHARGECODE", DbType.AnsiString, info.ChargeCode));
                args.Add(new DBParameter("@USERID", DbType.AnsiString, info.UserId));
                DataTable dt = SQL.Execute(Connection, DBConstants.IsChargeDeleted, args.ToArray());
                return dt;
            }
            catch (Exception ex)
            {
                BIACore.Log.LogFactory.Exception(ex);
                return null;
            }
        }
        /// <summary>
        /// Delete selected invoice id and row id from workbookdata table.
        /// </summary>
        /// <param name="info"></param>
        [HttpPost]
        [ActionName("DeleteAllByInvoiceID")]
        public void DeleteAllByInvoiceID([FromBody] dynamic info)
        {
            try
            {
                List<DBParameter> args = new List<DBParameter>();
                args.Add(new DBParameter("@INVOICE_ID", DbType.AnsiString, Convert.ToInt32(info["Invoice_Id"].Value)));
                args.Add(new DBParameter("@USERID", DbType.AnsiString, Convert.ToString(info["User_Id"].Value)));
                SQL.Execute(Connection, DBConstants.DeleteAllByInvoiceID, args.ToArray());
            }
            catch (Exception ex)
            {
                BIACore.Log.LogFactory.Exception(ex);
            }
        }

        /// <summary>
        /// Validate all uploaded charges from excel.
        /// </summary>
        /// <param name="info"></param>
        //[HttpPost]
        // [ActionName("Validate")]
        private void Validate(int invoiceId)
        {
            try
            {
                List<DBParameter> args = new List<DBParameter>();
                args.Add(new DBParameter("@Invoice_ID", DbType.AnsiString, invoiceId));
                SQL.Execute(Connection, DBConstants.ValidateData, args.ToArray());
            }
            catch (Exception ex)
            {
                BIACore.Log.LogFactory.Exception(ex);
            }
        }
        /// <summary>
        /// Process to flote method.
        /// </summary>
        /// <param name="info"></param>
        [HttpPost]
        [ActionName("ProcessToFlote")]
        public void ProcessToFlote([FromBody] dynamic info)
        {

        }
        /// <summary>
        /// Update recommended carrier bol with existing carrier bol.
        /// </summary>
        /// <param name="info"></param>
        [HttpPost]
        [ActionName("UpdateCBOL")]
        public void UpdateCBOL([FromBody] dynamic info)
        {
            try
            {
                List<DBParameter> args = new List<DBParameter>();
                args.Add(new DBParameter("@Invoice_ID", DbType.AnsiString, Convert.ToInt32(info["Invoice_Id"].Value)));
                SQL.Execute(Connection, DBConstants.UpdateMatchCBOL, args.ToArray());
            }
            catch (Exception ex)
            {
                BIACore.Log.LogFactory.Exception(ex);
            }
        }        

    }
}