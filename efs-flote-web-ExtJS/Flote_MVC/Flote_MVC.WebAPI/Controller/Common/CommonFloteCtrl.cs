/* ====================================================================================================
NAME:				[Common Flote Controller]
BEHAVIOR:		Returns Common reports data for selected filter criteria.
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
using BIACore.Provider;
using System.Data.SqlClient;

namespace Flote.WebAPI.WebAPI.Controller
{
    public partial class WebApiReportController
    {
        /// <summary>
        /// Set the Invoice Status 
        /// </summary>
        /// <param name="param"></param>
        /// <returns></returns>
        [HttpPost]
        [ActionName("SetInvoiceStatus")]
        public object SetInvoiceStatus([FromBody] biafilter.Filter param)
        {
            var result = "Completed";
            SqlConnection conn = new SqlConnection(Connections.Flote_Raw);
            conn.Open();
            using (IDbTransaction tran = conn.BeginTransaction())
            {
                try
                {

                    DataTable dtInvoice = SQL.Execute(Connection, DBConstants.GetInvoiceLocationData, new DBParameter("@invoice_id", DbType.AnsiString, param.InvoiceId));

                    if (dtInvoice.Rows.Count > 0)
                    {
                        if (param.InvoiceStatusTo == "Printed" && dtInvoice.Rows[0]["Invoice_Status"].ToString() == "Scanned" && dtInvoice.Rows[0]["ImageNumber"].ToString() != "")
                        {
                            List<DBParameter> args = new List<DBParameter>();
                            args.Add(new DBParameter("@ImageNumber", DbType.AnsiString, dtInvoice.Rows[0]["ImageNumber"]));
                            args.Add(new DBParameter("@Comments", DbType.AnsiString, param.Comments));
                            args.Add(new DBParameter("@userid", DbType.AnsiString, param.UserId));
                            args.Add(new DBParameter("@Invoice_Id", DbType.AnsiString, param.InvoiceId));
                            SQL.Execute(Connection, DBConstants.LoadInvalidImage, args.ToArray());
                        }

                        ///* Taking this out 04/28/2015 as part of RFC 1.7. Everytime we open the popup for coding sheet, it is overriding the rejected recall flag to ‘N’ --->
                        //<!--- <cfif qryresults.Invoice_Status eq "Printed" and qryresults.Rejected eq "Y">
                        //, RejectedRecall ='N'                  

                        UpdateInvoiceComment(param);
                        DataTable dtUpdateStat = UpdateInvoiceStatus(param.InvoiceId, param.InvoiceStatusTo, param.UserId);

                        if ((param.InvoiceStatusTo == "Printed" && dtInvoice.Rows[0]["Invoice_Status"].ToString() == "Scanned") || (param.InvoiceStatusTo == "Queued" && dtInvoice.Rows[0]["Invoice_Status"].ToString() == "Sent") && dtUpdateStat.Rows.Count > 0)
                        {
                            // Insert records in to Invoice Rejection table.
                            InsertInvoiceRejectionStatus(dtUpdateStat.Rows[0]["InvoiceStatus_id"].ToString(), param.InvoiceId, dtInvoice.Rows[0]["InvRefNo"].ToString(), "", param.Comments, param.UserId, dtInvoice.Rows[0]["Location_Code"].ToString(), dtInvoice.Rows[0]["Invoice_Status"].ToString(), "Resent", dtInvoice.Rows[0]["ImageNumber"].ToString());
                        }
                        if (param.InvoiceStatusTo == "Queued" && dtInvoice.Rows[0]["Invoice_Status"].ToString() == "Sent")
                        {
                            //Remove Invoice from Batch
                            RemoveInvoiceFromBatch(param.InvoiceId, "");
                        }

                        if (param.InvoiceStatusTo == "Approved" && dtInvoice.Rows[0]["Invoice_Status"].ToString() == "Verified")
                        {
                            // Insert record into InvoiceApproved table
                            SQL.Execute(Connection, DBConstants.ApproveInvoice, new DBParameter("@invoice_id", DbType.AnsiString, param.InvoiceId));
                            //RemoveInvoiceFromBatch
                        }
                    }
                    else
                    {
                        result = "Invalid Invoice Id";
                    }
                    tran.Commit();
                }
                catch (Exception ex)
                {
                    tran.Rollback();
                    BIACore.Log.LogFactory.Exception(ex);
                    conn.Close();
                    return ex.Message;

                }
                conn.Close();
            }
            return result;
        }
        /// <summary>
        /// Insert Rejection records entry into invoice rejection table.
        /// </summary>
        /// <param name="invStatId"></param>
        /// <param name="invoiceId"></param>
        /// <param name="invRefNo"></param>
        /// <param name="batchId"></param>
        /// <param name="comments"></param>
        /// <param name="bia_id"></param>
        /// <param name="locCode"></param>
        /// <param name="cmpCode"></param>
        /// <param name="invStatusFrom"></param>
        /// <param name="rejStat"></param>
        /// <param name="docId"></param>
        /// <returns></returns>
        private string InsertInvoiceRejectionStatus(string invStatId, string invoiceId, string invRefNo, string batchId, string comments, string bia_id, string locCode, string invStatusFrom, string rejStat, string docId)
        {
            var insertedCmt = "";
            if (invStatusFrom == "Scanned")
            {
                rejStat = "Rejected";
            }
            try
            {
                List<DBParameter> args = new List<DBParameter>();
                DataTable dtImage = new DataTable();
                try
                {
                    dtImage = ImageData(locCode, invRefNo, invStatusFrom, docId, "insert", "");
                }
                catch (Exception)
                {
                    dtImage = null;
                }
                if (dtImage != null && dtImage.Rows.Count > 0)
                {
                    args.Add(new DBParameter("@InvoiceStatus_id", DbType.AnsiString, invStatId));
                    args.Add(new DBParameter("@Invoice_id", DbType.AnsiString, invoiceId));
                    args.Add(new DBParameter("@Vendor_Invoice_id", DbType.AnsiString, invRefNo));
                    args.Add(new DBParameter("@invoice_status", DbType.AnsiString, rejStat));
                    args.Add(new DBParameter("@Batch_id", DbType.AnsiString, batchId));
                    args.Add(new DBParameter("@Scan_Dest", DbType.AnsiString, dtImage.Rows[0]["scan_dest"]));
                    args.Add(new DBParameter("@Folder", DbType.AnsiString, dtImage.Rows[0]["folder"]));
                    args.Add(new DBParameter("@Doc_Id", DbType.AnsiString, dtImage.Rows[0]["ImageNumber"]));
                    args.Add(new DBParameter("@UserID", DbType.AnsiString, bia_id));
                    args.Add(new DBParameter("@Rejected_From", DbType.AnsiString, invStatusFrom));
                    args.Add(new DBParameter("@Scan_Date", DbType.AnsiString, dtImage.Rows[0]["scan_date"]));
                    args.Add(new DBParameter("@Comment", DbType.AnsiString, comments));
                }
                else
                {
                    DataTable dtInvoice = SQL.Execute(Connection, DBConstants.GetInvoiceLocationData, new DBParameter("@invoice_id", DbType.AnsiString, invoiceId));

                    args.Add(new DBParameter("@InvoiceStatus_id", DbType.AnsiString, invStatId));
                    args.Add(new DBParameter("@Invoice_id", DbType.AnsiString, invoiceId));
                    args.Add(new DBParameter("@Vendor_Invoice_id", DbType.AnsiString, invRefNo));
                    args.Add(new DBParameter("@invoice_status", DbType.AnsiString, rejStat));
                    args.Add(new DBParameter("@Batch_id", DbType.AnsiString, batchId));
                    args.Add(new DBParameter("@Scan_Dest", DbType.AnsiString, dtInvoice.Rows[0]["scan_dest"]));
                    args.Add(new DBParameter("@Folder", DbType.AnsiString, dtInvoice.Rows[0]["ScanFolder"]));
                    args.Add(new DBParameter("@Doc_Id", DbType.AnsiString, dtInvoice.Rows[0]["ImageNumber"]));
                    args.Add(new DBParameter("@UserID", DbType.AnsiString, bia_id));
                    args.Add(new DBParameter("@Rejected_From", DbType.AnsiString, invStatusFrom));
                    args.Add(new DBParameter("@Scan_Date", DbType.AnsiString, dtInvoice.Rows[0]["stampDT"]));
                    args.Add(new DBParameter("@Comment", DbType.AnsiString, comments));
                }

                insertedCmt = SQL.Execute(Connection, DBConstants.InsertInvoiceRejectionStatus, args.ToArray()).ToString();
                return insertedCmt.ToString();
            }
            catch (Exception ex)
            {
                BIACore.Log.LogFactory.Exception(ex);
                throw;
            }

        }
        /// <summary>
        /// Remove Invoices from Batch
        /// </summary>
        /// <param name="invoiceId"></param>
        /// <param name="bia_id"></param>
        /// <returns></returns>
        private void RemoveInvoiceFromBatch(string invoiceId, string bia_id)
        {
            try
            {
                List<DBParameter> argsRm = new List<DBParameter>();
                argsRm.Add(new DBParameter("@batch_id", DbType.AnsiString, bia_id));
                argsRm.Add(new DBParameter("@invoice_id", DbType.AnsiString, invoiceId));
                SQL.Execute(Connection, DBConstants.RemoveInvoiceFromBatch, argsRm.ToArray());
            }
            catch (Exception ex)
            {
                BIACore.Log.LogFactory.Exception(ex);
                throw;
            }
        }
        /// <summary>
        /// Update Invoice Status
        /// </summary>
        /// <param name="invoiceId"></param>
        /// <param name="bia_id"></param>
        /// <returns></returns>
        private DataTable UpdateInvoiceStatus(string invoiceId, string invStatus, string userId)
        {
            try
            {
                List<DBParameter> argsUpd = new List<DBParameter>();
                argsUpd.Add(new DBParameter("@Invoice_Status", DbType.AnsiString, invStatus));
                argsUpd.Add(new DBParameter("@UserID", DbType.AnsiString, userId));
                argsUpd.Add(new DBParameter("@Invoice_Id", DbType.AnsiString, invoiceId));

                return SQL.Execute(Connection, DBConstants.UpdateInvoiceStatus, argsUpd.ToArray());

            }
            catch (Exception ex)
            {
                BIACore.Log.LogFactory.Exception(ex);
                throw;
            }
        }
        /// <summary>
        /// Move Invoice to Archived status.
        /// </summary>
        /// <param name="invoiceId"></param>
        /// <param name="batch_id"></param>
        /// <param name="userId"></param>
        /// <returns></returns>
        private void MoveInvoicetoArchived(string invoiceId, string userId)
        {
            try
            {
                List<DBParameter> argsMovA = new List<DBParameter>();
                argsMovA.Add(new DBParameter("@UserID", DbType.AnsiString, userId));
                argsMovA.Add(new DBParameter("@Invoice_Id", DbType.AnsiString, invoiceId));

                SQL.Execute(Connection, DBConstants.MoveInvoicetoArchived, argsMovA.ToArray());
                UpdateInvoiceStatus(invoiceId, "Archived", userId);
            }
            catch (Exception ex)
            {
                BIACore.Log.LogFactory.Exception(ex);
                throw;
            }
        }

        /// <summary>
        /// Moved the Invoice to Approved Status.
        /// </summary>
        /// <param name="param"></param>
        /// <returns></returns>
        public object MoveInvoiceToApproveOrScanned([FromBody] biafilter.Filter param)
        {
            try
            {
                DataTable dtInvoice = SQL.Execute(Connection, DBConstants.GetInvoiceLocationData, new DBParameter("@invoice_id", DbType.AnsiString, param.InvoiceId));
                DataTable dtUpd = new DataTable();

                List<DBParameter> argsMovA = new List<DBParameter>();
                argsMovA.Add(new DBParameter("@bia_id", DbType.AnsiString, param.UserId));
                argsMovA.Add(new DBParameter("@Invoice_Id", DbType.AnsiString, param.InvoiceId));

                if (param.InvoiceStatusTo == "Approved")
                {
                    argsMovA.Add(new DBParameter("@comments", DbType.AnsiString, param.Comments));
                    SQL.Execute(Connection, DBConstants.MoveInvoicetoApproved, argsMovA.ToArray());
                    RemoveInvoiceFromBatch(param.InvoiceId, param.BatchId);
                    dtUpd = UpdateInvoiceStatus(param.InvoiceId, "Approved", param.UserId);
                }
                else if (param.InvoiceStatusTo == "Scanned")
                {
                    var status = "Scanned";
                    var msg = "Move Invoice to Scanned Status";
                    if (dtInvoice.Rows[0]["ImageNumber"].ToString() == "")
                    {
                        status = "Approved";
                        msg = "Moving invoice back to Approved";
                    }
                    argsMovA.Add(new DBParameter("@Invoice_Status", DbType.AnsiString, status));
                    SQL.Execute(Connection, DBConstants.MoveInvoicebacktoScan, argsMovA.ToArray());
                    dtUpd = UpdateInvoiceStatus(param.InvoiceId, status, param.UserId);
                    param.Comments = msg;
                }

                if (dtUpd.Rows.Count > 0)
                {
                    // Insert records in to Invoice Rejection table.
                    InsertInvoiceRejectionStatus(dtUpd.Rows[0]["InvoiceStatus_id"].ToString(), param.InvoiceId, dtInvoice.Rows[0]["InvRefNo"].ToString(), param.BatchId, param.Comments, param.UserId, dtInvoice.Rows[0]["Location_Code"].ToString(), dtInvoice.Rows[0]["Invoice_Status"].ToString(), param.RejectedStatus, dtInvoice.Rows[0]["ImageNumber"].ToString());

                }

            }
            catch (Exception ex)
            {
                BIACore.Log.LogFactory.Exception(ex);
                throw;
            }
            return "Moved";
        }
        /// <summary>
        /// Disable the unapproved invoice charges.
        /// </summary>
        /// <param name="param"></param>
        /// <returns></returns>
        [HttpPost]
        [ActionName("DisableUnapproved")]
        public object DisableUnapproved([FromBody] biafilter.Filter param)
        {
            var removed = "Disabled";
            try
            {
                List<DBParameter> argsRm = new List<DBParameter>();
                argsRm.Add(new DBParameter("@invoice_id", DbType.AnsiString, param.InvoiceId));
                SQL.Execute(Connection, DBConstants.DisableUnapproved, argsRm.ToArray());
            }
            catch (Exception ex)
            {
                BIACore.Log.LogFactory.Exception(ex);
                throw;
            }
            return removed;
        }
        /// <summary>
        /// Check the deleted e2k changes in invoice Detail table.
        /// </summary>
        /// <param name="param"></param>
        /// <returns></returns>
        [HttpPost]
        [ActionName("IsReProcessInvoice")]
        public object IsReProcessInvoice([FromBody] biafilter.Filter param)
        {
            var retFlag = false;
            DataTable dtInv = new DataTable();
            try
            {
                List<DBParameter> argsRm = new List<DBParameter>();
                argsRm.Add(new DBParameter("@invoice_id", DbType.AnsiString, param.InvoiceId));
                dtInv = SQL.Execute(Connection, DBConstants.IsReProcessInvoice, argsRm.ToArray());

                if (dtInv.Rows.Count > 0)
                {
                    retFlag = true;
                }
            }
            catch (Exception ex)
            {
                BIACore.Log.LogFactory.Exception(ex);
                throw;
            }
            return retFlag;
        }
        /// <summary>
        /// Check the values of charges in Invoice coding table for related invoice.
        /// </summary>
        /// <param name="param"></param>
        /// <returns></returns>
        [HttpPost]
        [ActionName("IsNullCheckForInvoice")]
        public object IsNullCheckForInvoice([FromBody] biafilter.Filter param)
        {
            var retFlag = false;
            DataTable dtInv = new DataTable();
            try
            {
                List<DBParameter> argsRm = new List<DBParameter>();
                argsRm.Add(new DBParameter("@invoice_id", DbType.AnsiString, param.InvoiceId));
                dtInv = SQL.Execute(Connection, DBConstants.CheckInvoiceHasNULLValues, argsRm.ToArray());

                if (dtInv.Rows.Count > 0)
                {
                    retFlag = true;
                }
            }
            catch (Exception ex)
            {
                BIACore.Log.LogFactory.Exception(ex);
                throw;
            }
            return retFlag;
        }
        /// <summary>
        /// Get Approve Invoice Count by week.
        /// </summary>
        /// <param name="param"></param>
        /// <returns></returns>
        [HttpPost]
        [ActionName("GetApproveInvCountByWeek")]
        public object GetApproveInvCountByWeek([FromBody] biafilter.Filter param)
        {
            DataTable dtInv = new DataTable();
            try
            {
                List<DBParameter> args = new List<DBParameter>();
                args.Add(new DBParameter("@location_code", DbType.AnsiString, param.LocCode));
                args.Add(new DBParameter("@company_code", DbType.AnsiString, param.CompanyCode));
                args.Add(new DBParameter("@AcctYear", DbType.AnsiString, param.AcctYear));
                dtInv = SQL.Execute(Connection, DBConstants.GetApprovedInvoiceCountByWeek, args.ToArray());

            }
            catch (Exception ex)
            {
                BIACore.Log.LogFactory.Exception(ex);
                throw;
            }
            return dtInv;
        }
        /// <summary>
        /// Get the Scac Code.
        /// </summary>
        /// <param name="param"></param>
        /// <returns></returns>
        [HttpPost]
        [ActionName("GetSCACCode")]
        public object GetSCACCode([FromBody] biafilter.Filter param)
        {
            try
            {
                return SQL.Execute(Connection, DBConstants.GetSCACCode, new DBParameter("@invoice_id", DbType.AnsiString, param.InvoiceId));
            }
            catch (Exception ex)
            {
                BIACore.Log.LogFactory.Exception(ex);
                throw;
            }
        }
        /// <summary>
        /// Get the batch details by batch id
        /// </summary>
        /// <param name="param"></param>
        /// <returns></returns>
        [HttpPost]
        [ActionName("GetBatchDetailsData")]
        public DataTable GetBatchDetailsData([FromBody] biafilter.Filter param)
        {
            try
            {
                if (param.BatchId != "")
                {
                    return SQL.Execute(Connection, DBConstants.GetBatchDetails, new DBParameter("@batch_id", DbType.AnsiString, param.BatchId));
                }

            }
            catch (Exception ex)
            {
                BIACore.Log.LogFactory.Exception(ex);
                return null;
            }
            return null;
        }
        /// <summary>
        /// Moved the batch to archived status.
        /// </summary>
        /// <param name="param"></param>
        /// <returns></returns>
        [HttpPost]
        [ActionName("ArchiveBatch")]
        public object ArchiveBatch([FromBody] biafilter.Filter param)
        {
            string result = "";
            DataTable dtBatchIds = new DataTable();
            try
            {
                if (param.BatchId != "")
                {
                    dtBatchIds = SQL.Execute(Connection, DBConstants.GetBatchDetailsArchiveBatch, new DBParameter("@batch_id", DbType.AnsiString, param.BatchId));
                    if (dtBatchIds.Rows.Count > 0)
                    {
                        foreach (DataRow drow in dtBatchIds.Rows)
                        {
                            MoveInvoicetoArchived(drow["invoice_id"].ToString(), param.UserId);
                        }
                    }
                }
                result = "sucess";
            }
            catch (Exception ex)
            {
                BIACore.Log.LogFactory.Exception(ex);
                return "failed";
            }
            return result;
        }
        /// <summary>
        /// Return and Check the matching input data.
        /// </summary>
        /// <param name="info"></param>
        /// <returns></returns>
        [HttpPost]
        [ActionName("IsDataExists")]
        public object IsDataExists([FromBody] dynamic info)
        {
            try
            {
                biafilter.Filter p1 = new biafilter.Filter();
                p1.Table = info.Table.Value;
                p1.WhereClause = info.WhereClause.Value;
                p1.TestValue = info.TestValue.Value;

                return LoadSingle(DBConstants.IsDataExists, p1.ToDBParameter());
            }
            catch (Exception ex)
            {
                BIACore.Log.LogFactory.Exception(ex);
                return null;
            }
        }

        [HttpPost]
        [ActionName("GetShipmentNote")]
        public ClientResult GetShipmentNote([FromBody] dynamic info)
        {
            try
            {
                List<DBParameter> args = new List<DBParameter>();
                args.Add(new DBParameter("@frn_id", DbType.AnsiString, info["frn_Id"].Value));
                args.Add(new DBParameter("@frn_type", DbType.AnsiString, info["frn_Type"].Value));
                args.Add(new DBParameter("@key_id", DbType.AnsiString, info["key_Id"].Value));
                return LoadClientResult(DBConstants.GetReferenceNotes, args.ToArray());
            }
            catch (Exception ex)
            {
                BIACore.Log.LogFactory.Exception(ex);
                return null;
            }
        }
        /// <summary>
        /// Get the user name by Id.
        /// </summary>
        /// <param name="param"></param>
        /// <returns></returns>
        [HttpPost]
        [ActionName("GetUserNameById")]
        public object GetUserNameById([FromBody] biafilter.Filter param)
        {
            try
            {
                List<DBParameter> args = new List<DBParameter>();
                args.Add(new DBParameter("@userId", DbType.AnsiString, param.UserId));
                return LoadSingle(DBConstants.GetUserNameById, args.ToArray());
            }
            catch (Exception ex)
            {
                BIACore.Log.LogFactory.Exception(ex);
                return null;
            }
        }

        /// <summary>
        /// Get the by pass image by location code.
        /// </summary>
        /// <param name="param"></param>
        /// <returns></returns>
        [HttpPost]
        [ActionName("GetByPassImgByLocCode")]
        public object GetByPassImgByLocCode([FromBody] biafilter.Filter param)
        {
            try
            {
                List<DBParameter> args = new List<DBParameter>();
                args.Add(new DBParameter("@Location_Code", DbType.AnsiString, param.LocCode));
                args.Add(new DBParameter("@Company_Code", DbType.AnsiString, param.CompanyCode));
                return LoadSingle(DBConstants.GetBypassImageByLocCode, args.ToArray());
            }
            catch (Exception ex)
            {
                BIACore.Log.LogFactory.Exception(ex);
                return null;
            }
        }
        /// <summary>
        /// Get the by pass image by company code.
        /// </summary>
        /// <param name="param"></param>
        /// <returns></returns>
        [HttpPost]
        [ActionName("GetAPUTFlag")]
        public object GetAPUTFlag([FromBody] biafilter.Filter param)
        {
            try
            {
                List<DBParameter> args = new List<DBParameter>();
                args.Add(new DBParameter("@Location_Code", DbType.AnsiString, param.LocCode));
                args.Add(new DBParameter("@Company_Code", DbType.AnsiString, param.CompanyCode));
                return LoadSingle(DBConstants.GetAPUTFlag, args.ToArray());

            }
            catch (Exception ex)
            {
                BIACore.Log.LogFactory.Exception(ex);
                return null;
            }
        }
        /// <summary>
        /// Get the security details by geoid and geo code
        /// </summary>
        /// <param name="info"></param>
        /// <returns></returns>
        [HttpPost]
        [ActionName("GetSecurity")]
        public object GetSecurity([FromBody] dynamic info)
        {
            try
            {

                List<DBParameter> args = new List<DBParameter>();
                args.Add(new DBParameter("@Geocode", DbType.AnsiString, info["GeoCode"].Value));
                args.Add(new DBParameter("@Geoid", DbType.AnsiString, info["GeoId"].Value));

                return LoadSingle(DBConstants.GetSecurity, args.ToArray());
            }
            catch (Exception ex)
            {
                BIACore.Log.LogFactory.Exception(ex);
                return null;
            }
        }
        /// <summary>
        /// Get User Preference
        /// </summary>
        /// <param name="info"></param>
        /// <returns></returns>
        [HttpPost]
        [ActionName("GetUserPreference")]
        public object GetUserPreference([FromBody] dynamic info)
        {
            try
            {
                List<DBParameter> args = new List<DBParameter>();
                args.Add(new DBParameter("@userID", DbType.AnsiString, info["UserId"].Value));
                args.Add(new DBParameter("@key", DbType.AnsiString, info["Key"].Value));
                args.Add(new DBParameter("@page", DbType.AnsiString, info["Page"].Value));

                return LoadSingle(DBConstants.GetUserPreference, args.ToArray());
            }
            catch (Exception ex)
            {
                BIACore.Log.LogFactory.Exception(ex);
                return null;
            }
        }
        /// <summary>
        /// Set the user preference.
        /// </summary>
        /// <param name="info"></param>
        /// <returns></returns>
        [HttpPost]
        [ActionName("SetUserPreference")]
        public object SetUserPreference([FromBody] dynamic info)
        {
            try
            {
                List<DBParameter> args = new List<DBParameter>();
                args.Add(new DBParameter("@userid", DbType.AnsiString, info["UserId"].Value));
                args.Add(new DBParameter("@key", DbType.AnsiString, info["Key"].Value));
                args.Add(new DBParameter("@page", DbType.AnsiString, info["Page"].Value));
                args.Add(new DBParameter("@key_value", DbType.AnsiString, info["KeyVal"].Value));

                return LoadSingle(DBConstants.InsertUpdateUserPerferences, args.ToArray());
            }
            catch (Exception ex)
            {
                BIACore.Log.LogFactory.Exception(ex);
                return null;
            }
        }

        /// <summary>
        /// Get Last Updated.
        /// </summary>
        /// <param name="info"></param>
        /// <returns></returns>
        [HttpPost]
        [ActionName("GetLastUpdated")]
        public object GetLastUpdated([FromBody] dynamic info)
        {
            try
            {
                List<DBParameter> args = new List<DBParameter>();
                return LoadSingle(DBConstants.GetLastUpdated, args.ToArray());
            }
            catch (Exception ex)
            {
                BIACore.Log.LogFactory.Exception(ex);
                return null;
            }
        }
        /// <summary>
        /// Get the admin message.
        /// </summary>
        /// <param name="info"></param>
        /// <returns></returns>
        [HttpPost]
        [ActionName("GetAdminMessage")]
        public object GetAdminMessage([FromBody] dynamic info)
        {
            try
            {
                List<DBParameter> args = new List<DBParameter>();
                return LoadSingle(DBConstants.GetAdminMessage, args.ToArray());
            }
            catch (Exception ex)
            {
                BIACore.Log.LogFactory.Exception(ex);
                return null;
            }
        }
        /// <summary>
        /// UPdate Admin Message.
        /// </summary>
        /// <param name="info"></param>
        /// <returns></returns>
        [HttpPost]
        [ActionName("UpdateAdminMessage")]
        public object UpdateAdminMessage([FromBody] dynamic info)
        {
            try
            {
                List<DBParameter> args = new List<DBParameter>();
                args.Add(new DBParameter("@Admin_Message", DbType.AnsiString, info["AdminMsg"].Value));
                args.Add(new DBParameter("@Required_Reading", DbType.Int16, info["RequiredFlag"].Value));
                return LoadSingle(DBConstants.UpdateAdminMessage, args.ToArray());
            }
            catch (Exception ex)
            {
                BIACore.Log.LogFactory.Exception(ex);
                return null;
            }
        }
        /// <summary>
        /// Update admin message by User Id and admin Id.
        /// </summary>
        /// <param name="info"></param>
        /// <returns></returns>
        [HttpPost]
        [ActionName("UpdateAdminMessageByUser")]
        public object UpdateAdminMessageByUser([FromBody] dynamic info)
        {
            try
            {
                List<DBParameter> args = new List<DBParameter>();
                args.Add(new DBParameter("@message_id", DbType.AnsiString, Convert.ToInt32(info["MessageId"].Value)));
                args.Add(new DBParameter("@user_id", DbType.AnsiString, info["UserId"].Value));
                return LoadResult(DBConstants.UpdateAdminMessageByUser, args.ToArray());
            }
            catch (Exception ex)
            {
                BIACore.Log.LogFactory.Exception(ex);
                return null;
            }
        }
        /// <summary>
        /// Is Message is read by User.
        /// </summary>
        /// <param name="info"></param>
        /// <returns></returns>
        [HttpPost]
        [ActionName("IsReadByUser")]
        public object IsReadByUser([FromBody] dynamic info)
        {
            try
            {
                List<DBParameter> args = new List<DBParameter>();
                args.Add(new DBParameter("@user_id", DbType.Int16, info["UserId"].Value));
                return LoadSingle(DBConstants.IsReadByUser, args.ToArray());
            }
            catch (Exception ex)
            {
                BIACore.Log.LogFactory.Exception(ex);
                return null;
            }
        }
        /// <summary>
        /// Get value pay details by required location.
        /// </summary>
        /// <param name="info"></param>
        /// <returns></returns>
        [HttpPost]
        [ActionName("GetValuePayByRLoc")]
        public object GetValuePayByRLoc([FromBody] dynamic info)
        {
            try
            {
                List<DBParameter> args = new List<DBParameter>();
                args.Add(new DBParameter("@reqLoc", DbType.AnsiString, info["LocCode"].Value));
                return LoadResult(DBConstants.GetValuePayByRLoc, args.ToArray());
            }
            catch (Exception ex)
            {
                BIACore.Log.LogFactory.Exception(ex);
                return null;
            }
        }
        /// <summary>
        /// Update the value pay location.
        /// </summary>
        /// <param name="info"></param>
        /// <returns></returns>
        [HttpPost]
        [ActionName("GetValuePayUpdateAction")]
        public object GetValuePayUpdateAction([FromBody] dynamic info)
        {
            try
            {
                List<DBParameter> args = new List<DBParameter>();
                args.Add(new DBParameter("@reqLoc", DbType.AnsiString, info["LocCode"].Value));
                args.Add(new DBParameter("@valuePayLoc", DbType.AnsiString, info["ValuePayLoc"].Value));
                args.Add(new DBParameter("@invoiceTypeCode", DbType.AnsiString, info["InvoiceTypeCode"].Value));

                return LoadSingle(DBConstants.GetValuePayUpdateAction, args.ToArray());
            }
            catch (Exception ex)
            {
                BIACore.Log.LogFactory.Exception(ex);
                return null;
            }
        }
        /// <summary>
        /// Get the all company codes list.
        /// </summary>
        /// <param name="info"></param>
        /// <returns></returns>
        [HttpPost]
        [ActionName("GetCompanyCodesAll")]
        public object GetCompanyCodesAll([FromBody] dynamic info)
        {
            try
            {
                List<DBParameter> args = new List<DBParameter>();
                return LoadResult(DBConstants.GetCompanyCodesAll, args.ToArray());
            }
            catch (Exception ex)
            {
                BIACore.Log.LogFactory.Exception(ex);
                return null;
            }
        }
        /// <summary>
        /// Get the company codes by user id.
        /// </summary>
        /// <param name="info"></param>
        /// <returns></returns>
        [HttpPost]
        [ActionName("GetCompanyCodesByUserId")]
        public ClientResult GetCompanyCodesByUserId([FromBody] dynamic info)
        {
            try
            {
                List<DBParameter> args = new List<DBParameter>();
                args.Add(new DBParameter("@userId", DbType.AnsiString, info["UserId"].Value));
                return LoadClientResult(DBConstants.GetCompanyCodesByUserId, args.ToArray());
            }
            catch (Exception ex)
            {
                BIACore.Log.LogFactory.Exception(ex);
                return null;
            }
        }
        /// <summary>
        /// Get the all Aput user List
        /// </summary>
        /// <param name="info"></param>
        /// <returns></returns>
        [HttpPost]
        [ActionName("GetAputUserList")]
        public ClientResult GetAputUserList([FromBody] dynamic info)
        {
            try
            {
                List<DBParameter> args = new List<DBParameter>();
                return LoadClientResult(DBConstants.GetAputUserList, args.ToArray());
            }
            catch (Exception ex)
            {
                BIACore.Log.LogFactory.Exception(ex);
                return null;
            }
        }
        /// <summary>
        /// Get  user profie by user search
        /// </summary>
        /// <param name="request"></param>
        /// <returns></returns>
        [HttpPost]
        [ActionName("GetUserProfie")]
        public ClientResult GetUserProfie([FromBody] dynamic request)
        {
            if (request["query"] != null && request["query"].Value != "")
            {
                return LoadClientResult(DBConstants.GetUserProfile, new DBParameter("@sysm", DbType.AnsiString, request["query"].Value));
            }
            else
            {
                return LoadClientResult(DBConstants.GetUserProfile, new DBParameter("@sysm", DbType.AnsiString, ""));
            }
        }
        /// <summary>
        /// Add Aput User by companycode
        /// </summary>
        /// <param name="info"></param>
        /// <returns></returns>
        [HttpPost]
        [ActionName("AddAputUser")]
        public object AddAputUser([FromBody] dynamic info)
        {
            try
            {
                List<DBParameter> args = new List<DBParameter>();
                args.Add(new DBParameter("@sysm", DbType.AnsiString, info["UserId"].Value));
                args.Add(new DBParameter("@Company_Code", DbType.AnsiString, info["CompanyCode"].Value));

                return LoadSingle(DBConstants.AddCompanyToUser, args.ToArray());
            }
            catch (Exception ex)
            {
                BIACore.Log.LogFactory.Exception(ex);
                return null;
            }
        }
        /// <summary>
        /// Delete Company code fro the selected user.
        /// </summary>
        /// <param name="info"></param>
        /// <returns></returns>
        [HttpPost]
        [ActionName("RemoveAputUser")]
        public object RemoveAputUser([FromBody] dynamic info)
        {
            try
            {
                List<DBParameter> args = new List<DBParameter>();
                args.Add(new DBParameter("@sysm", DbType.AnsiString, info["UserId"].Value));
                args.Add(new DBParameter("@Company_Code", DbType.AnsiString, info["CompanyCode"].Value));

                return LoadSingle(DBConstants.DeleteCompanyToUser, args.ToArray());
            }
            catch (Exception ex)
            {
                BIACore.Log.LogFactory.Exception(ex);
                return null;
            }
        }

    }
}
