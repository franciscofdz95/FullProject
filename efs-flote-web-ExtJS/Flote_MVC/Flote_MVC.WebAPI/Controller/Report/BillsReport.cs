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
using System.Linq;
using System.Web.Http;
using BIACore.Web.Model;
using biafilter = Flote.WebAPI.WebAPI.Model;
using BIACore.Model;
using System.Data;
using System.Data.SqlClient;
using BIACore.Provider;
using System.IO;
using System.Net;
using System.Net.Mail;
using Renci.SshNet;
using System.Web.Configuration;
using System.Configuration;
using GemBox.Spreadsheet;
using GemExcelWorksheet = GemBox.Spreadsheet.ExcelWorksheet;
namespace Flote.WebAPI.WebAPI.Controller
{
    public partial class WebApiReportController
    {
        /// <summary>
        /// Get Bill Report Data.
        /// </summary>
        /// <param name="param"></param>
        /// <returns></returns>
        [HttpPost]
        [ActionName("BillsReport")]
        public ClientResult BillsReport([FromBody] biafilter.Filter param)
        {
            try
            {
                param.PageName = "BillsReport";
                return LoadPagedClientResult(DBConstants.Bills, param.ToDBParameter());
            }
            catch (Exception ex)
            {
                BIACore.Log.LogFactory.Exception(ex);
                return null;
            }
        }
        /// <summary>
        /// Return Bill Status count. 
        /// </summary>
        /// <param name="param"></param>
        /// <returns></returns> 
        [HttpPost]
        [ActionName("BillStatusCount")]
        public object BillStatusCount([FromBody] biafilter.Filter param)
        {
            try
            {
                return LoadSingle(DBConstants.BillsStatusSummary, param.ToDBParameter());
            }
            catch (Exception ex)
            {
                BIACore.Log.LogFactory.Exception(ex);
                return null;
            }
        }
        /// <summary>
        /// Return Invoice details charges/info  by invoice id
        /// </summary>
        /// <param name="param"></param>
        /// <returns></returns>
        [HttpPost]
        [ActionName("BillDetailGridData")]
        public ClientResult BillDetailGridData([FromBody] biafilter.Filter param)
        {
            try
            {
                param.PageName = "BillDetailGridData";
                return LoadPagedClientResult(DBConstants.GetInvoiceDetail, param.ToDBParameter());
            }
            catch (Exception ex)
            {
                BIACore.Log.LogFactory.Exception(ex);
                return null;
            }
        }

        /// <summary>
        /// Return Invoice payment details by invoice ref number,vendor number
        /// </summary>
        /// <param name="param"></param>
        /// <returns></returns>
        [HttpPost]
        [ActionName("PaymentDetailsGridData")]
        public ClientResult PaymentDetailsGridData([FromBody] biafilter.Filter param)
        {
            try
            {
                param.PageName = "PaymentDetailsGridData";
                return LoadPagedClientResult(DBConstants.GetInvoiceVendorPaymentDetails, param.ToDBParameter());
            }
            catch (Exception ex)
            {
                BIACore.Log.LogFactory.Exception(ex);
                return null;
            }
        }
        /// <summary>
        /// Return Invoice detail Info.
        /// </summary>
        /// <param name="info"></param>
        /// <returns></returns> 
        [HttpPost]
        [ActionName("BillDetailInfo")]
        public object BillDetailInfo([FromBody] dynamic info)
        {
            try
            {
                return LoadSingle(DBConstants.GetInvoiceSumHeader, new DBParameter("@Invoice_id", DbType.AnsiString, info["invoice_id"].Value));
            }
            catch (Exception ex)
            {
                BIACore.Log.LogFactory.Exception(ex);
                return null;
            }
        }
        /// <summary>
        /// Return Invoice VAT detail for bill details report.
        /// </summary>
        /// <param name="info"></param>
        /// <returns></returns> 
        [HttpPost]
        [ActionName("BillVATDetail")]
        public ClientResult BillVATDetail([FromBody] dynamic info)
        {
            try
            {
                return LoadClientResult(DBConstants.GetInvoiceSumVAT, new DBParameter("@invoice_id", DbType.AnsiString, info["Invoice_Id"].Value));
            }
            catch (Exception ex)
            {
                BIACore.Log.LogFactory.Exception(ex);
                return null;
            }
        }

        /// <summary>
        /// Return the invoices status history on image Hover .
        /// </summary>
        /// <param name="info"></param>
        /// <returns></returns> 
        [HttpPost]
        [ActionName("InvoiceStatusHistory")]
        public ClientResult InvoiceStatusHistory([FromBody] dynamic info)
        {
            try
            {
                return LoadClientResult(DBConstants.GetBillDetailStatusInfo, new DBParameter("@invoice_id", DbType.AnsiString, info["Invoice_Id"].Value));
            }
            catch (Exception ex)
            {
                BIACore.Log.LogFactory.Exception(ex);
                return null;
            }
        }


        /// <summary>
        /// Clear Invoice from the Flote.
        /// </summary>
        /// <param name="info"></param>
        /// <returns></returns> 
        [HttpPost]
        [ActionName("ClearInvoice")]
        public object ClearInvoice([FromBody] dynamic info)
        {
            try
            {
                List<DBParameter> args = new List<DBParameter>();
                args.Add(new DBParameter("@invoiceid", DbType.AnsiString, info["Invoice_Id"].Value));
                args.Add(new DBParameter("@userid", DbType.AnsiString, info["User_Id"].Value));
                return LoadSingle(DBConstants.ClearInvoice, args.ToArray());
            }
            catch (Exception ex)
            {
                BIACore.Log.LogFactory.Exception(ex);
                return null;
            }
        }

        /// <summary>
        /// Check the document in TDOC Server.
        /// </summary>
        /// <param name="param"></param>
        /// <returns></returns>
        [HttpPost]
        [ActionName("CheckInvoiceInTDOC")]
        public object CheckInvoiceInTDOC([FromBody] biafilter.Filter param)
        {
            DataTable dtImage = new DataTable();
            string result = "";
            try
            {
                if (param.LocCode != "")
                {
                    dtImage = ImageData(param.LocCode, param.InvoiceRefNo, param.InvoiceStatus, param.DocumentId, "tdoc", "", param.InvoiceId);
                }
                if (dtImage.Rows.Count > 0)
                {
                    result = "This invoice('" + param.InvoiceRefNo + "' - '" + dtImage.Rows[0]["ImageNumber"].ToString() + "') has already been processed to '" + dtImage.Rows[0]["Folder"].ToString() + "' folder. Please review. This invoice cannot be added to APUT queue.";
                }
                else
                {
                    result = "";
                    SetInvoiceStatus(param);
                }
            }
            catch (Exception ex)
            {
                BIACore.Log.LogFactory.Exception(ex);
                return ex.Message;
            }
            return result;
        }
        /// <summary>
        /// Live Back ground process to move invoices based on image number and status.
        /// </summary>
        /// <param name="param"></param>
        /// <returns></returns>
        [HttpPost]
        [ActionName("LiveInvoiceBKGRDProcess")]
        public object LiveInvoiceBKGRDProcess([FromBody] biafilter.Filter param)
        {
            MessageOb result = new MessageOb();
            try
            {
                DataTable dtMisingInvs = GetInvoicesMissingDocId(param.LocCode, param.InvoiceStatus);
                var floteUploadProcessUsers = System.Web.Configuration.WebConfigurationManager.AppSettings["FloteUploadProcess"].ToString();
                if (dtMisingInvs.Rows.Count > 0)
                {
                    foreach (DataRow drow in dtMisingInvs.Rows)
                    {
                        bool isFloteExternalCharges = false;
                        DataTable dtImg;
                        // code is added to handle charges processed out of the flote application 
                        dtImg = (drow["Reference_Id"].ToString() == Constants.SHIPCO || drow["Reference_Id"].ToString() == Constants.OPUD || drow["Reference_Id"].ToString() == Constants.OCB || drow["Reference_Id"].ToString() == Constants.UFrieght || drow["Reference_Id"].ToString() == Constants.Coyote) ? null : ImageData(param.LocCode, drow["InvRefNo"].ToString(), param.InvoiceStatus, drow["ImageNumber"].ToString(), "invdoc", drow["ModifiedDT"].ToString());
                        isFloteExternalCharges = (dtImg == null) && (drow["Reference_Id"].ToString() == Constants.SHIPCO || drow["Reference_Id"].ToString() == Constants.OPUD || drow["Reference_Id"].ToString() == Constants.OCB || drow["Reference_Id"].ToString() == Constants.UFrieght || drow["Reference_Id"].ToString() == Constants.Coyote) && floteUploadProcessUsers.IndexOf(BIACore.Security.User.userId.ToString().ToUpper()) >= 0;
                        if (isFloteExternalCharges || (dtImg != null && dtImg.Rows.Count > 0))
                        {
                            List<DBParameter> args = new List<DBParameter>();
                            args.Add(new DBParameter("@invoice_id", DbType.AnsiString, drow["invoice_id"].ToString()));
                            args.Add(new DBParameter("@invStatus", DbType.AnsiString, param.InvoiceStatus));
                            args.Add(new DBParameter("@apRemitId", DbType.AnsiString, drow["AP_Remit_id"].ToString()));
                            args.Add(new DBParameter("@RefId", DbType.AnsiString, drow["Reference_id"].ToString()));
                            if (dtImg != null && dtImg.Rows.Count == 1)
                            {
                                args.Add(new DBParameter("@imageNumber", DbType.AnsiString, dtImg.Rows[0]["ImageNumber"].ToString()));
                                args.Add(new DBParameter("@imgURL", DbType.AnsiString, dtImg.Rows[0]["imageURL"].ToString()));
                                args.Add(new DBParameter("@imgFolder", DbType.AnsiString, dtImg.Rows[0]["folder"].ToString()));
                                args.Add(new DBParameter("@scanDest", DbType.AnsiString, dtImg.Rows[0]["scan_dest"].ToString()));

                            }
                            args.Add(new DBParameter("@count", DbType.AnsiString, dtImg != null ? dtImg.Rows.Count : 1));
                            SQL.Execute(Connection, DBConstants.UpdateInvoiceForBG, args.ToArray());
                            result.success = true;
                            result.message = "Successfully performed Operation";
                        }

                    }
                }
            }
            catch (Exception ex)
            {
                result.success = false;
                result.message = ex.Message;
                BIACore.Log.LogFactory.Exception(ex);
                return result;
            }
            return result;

        }
        /// <summary>
        /// Get the Invoices Mising Doc Id.
        /// </summary>
        /// <param name="locCode"></param>
        /// <param name="invStatus"></param>
        /// <returns></returns>
        private DataTable GetInvoicesMissingDocId(string locCode, string invStatus)
        {
            DataTable dtInvMiss = new DataTable();
            try
            {
                List<DBParameter> args = new List<DBParameter>();
                args.Add(new DBParameter("@location_code", DbType.AnsiString, locCode));
                args.Add(new DBParameter("@invoice_status", DbType.AnsiString, invStatus));
                dtInvMiss = SQL.Execute(Connection, DBConstants.GetInvoicesMissingDocId, args.ToArray());
            }
            catch (Exception ex)
            {
                BIACore.Log.LogFactory.Exception(ex);
                throw;
            }
            return dtInvMiss;
        }
        /// <summary>
        /// Create Batch for selected Invoices.
        /// </summary>
        /// <param name="param"></param>
        /// <returns></returns>
        [HttpPost]
        [ActionName("CreateBatch")]
        public object CreateBatch([FromBody] biafilter.Filter param)
        {
            MessageOb result = new MessageOb();
            List<DBParameter> args = new List<DBParameter>();
            DataTable dtInvBatchCreate = SQL.Execute(Connection, DBConstants.CreateBatchforInvoices, args.ToArray());
            var newBtachId = dtInvBatchCreate.Rows[0]["newBatchID"].ToString();
            SqlConnection conn = new SqlConnection(Connections.Flote_Raw);
            conn.Open();
            using (IDbTransaction tran = conn.BeginTransaction())
            {
                try
                {
                    if (dtInvBatchCreate.Rows.Count > 0 && newBtachId != "")
                    {
                        args.Add(new DBParameter("@location_code", DbType.AnsiString, param.LocCode));
                        args.Add(new DBParameter("@company_code", DbType.AnsiString, param.CompanyCode));
                        args.Add(new DBParameter("@geocode", DbType.AnsiString, param.GeoCode));
                        args.Add(new DBParameter("@geoid", DbType.AnsiString, param.GeoId));
                        args.Add(new DBParameter("@userId", DbType.AnsiString, param.UserId));
                        args.Add(new DBParameter("@newBatchId", DbType.AnsiString, newBtachId));
                        args.Add(new DBParameter("@selectedInvoices", DbType.AnsiString, param.SelectedInvoices));
                        DataTable dtInvBatchInserts = SQL.Execute(Connection, DBConstants.InsertInvoicesBatch, args.ToArray());
                        result = UploadToFTPNBatch(param, newBtachId);
                        if (result.success && dtInvBatchInserts.Rows.Count > 0)
                        {
                            for (var i = 0; i < dtInvBatchInserts.Rows.Count; i++)
                            {
                                UpdateInvoiceStatus(dtInvBatchInserts.Rows[i]["invoice_id"].ToString(), "Sent", param.UserId);
                            }
                        }
                        tran.Commit();
                    }
                    else
                    {
                        tran.Rollback();
                    }
                }
                catch (Exception ex)
                {
                    result.message = "FLOTE APUT file creation error:<BR/> The APUT file ( batch id –" + newBtachId + ") could not be loaded to the FTP server. Please try again in 2 minutes.";
                    result.success = false;
                    result.emailNotification = ex.Message;
                    tran.Rollback();
                    BIACore.Log.LogFactory.Exception(ex);
                    conn.Close();
                    return result;
                }
                conn.Close();
            }
            return result;
        }
        /// <summary>
        /// Upload the  APUT file to FTP server
        /// </summary>
        //[HttpPost]
        //[ActionName("UploadToFTPNBatch")]
        private MessageOb UploadToFTPNBatch(biafilter.Filter param, string newBatchId)
        {
            MessageOb result = new MessageOb();
            result.success = false;
            List<DBParameter> argsReg = new List<DBParameter>();
            argsReg.Add(new DBParameter("@location_code", DbType.AnsiString, param.LocCode));
            argsReg.Add(new DBParameter("@company_code", DbType.AnsiString, param.CompanyCode));
            try
            {
                DataTable dtreg = SQL.Execute(Connection, DBConstants.GetRegion1, argsReg.ToArray());
                var fileName = "S" + dtreg.Rows[0]["CountryCode"] + "FLOTEOCEANUPL" + DateTime.Now.ToString("MMddyyyy") + newBatchId + ".csv";
                var localDrivePath = "";
                string uploadPath = "";

                param.IsDev = Convert.ToBoolean(WebConfigurationManager.AppSettings["isDev"]);
                if (param.IsDev) { uploadPath = WebConfigurationManager.AppSettings["UploadBatchFolderDev"].ToString(); } else { uploadPath = WebConfigurationManager.AppSettings["UploadBatchFolderProd"].ToString(); }
                if (!Directory.Exists(uploadPath))
                    Directory.CreateDirectory(uploadPath);
                localDrivePath = uploadPath + @"\" + fileName;
                //Create and Upload file into batch folder.
                List<DBParameter> args = new List<DBParameter>();
                args.Add(new DBParameter("@BatchId", DbType.AnsiString, newBatchId));
                args.Add(new DBParameter("@isDev", DbType.AnsiString, param.IsDev));
                DataTable dtSendAPUT = new DataTable();
                if (param.ScanDest.ToUpper() == "NEXT_DAY")
                {
                    dtSendAPUT = SQL.Execute(Connection, DBConstants.SendAPBatchData_RFC16_Next, args.ToArray());
                }
                else
                {
                    dtSendAPUT = SQL.Execute(Connection, DBConstants.SendAPBatchData_RFC16, args.ToArray());
                }

                dtSendAPUT.Columns.Remove("invoice_id");
                var lines = new List<string>();
                var colCount = "";
                for (var i = 1; i <= dtSendAPUT.Columns.Count; i++)
                {
                    colCount = colCount + i;
                    if (i != dtSendAPUT.Columns.Count)
                    {
                        colCount = colCount + ",";
                    }
                }
                lines.Add(colCount);
                string[] columnNames = dtSendAPUT.Columns.Cast<DataColumn>()
                             .Select(x => x.ColumnName)
                             .ToArray();

                var header = string.Join(",", columnNames);
                lines.Add(header);
                var row3 = "Required,Required,Required,Required,Optional,Optional...";
                lines.Add(row3);
                var valueLines = dtSendAPUT.AsEnumerable()
                                   .Select(row => string.Join(",", row.ItemArray));
                lines.AddRange(valueLines);
                File.WriteAllLines(localDrivePath, lines);

                var folder = "FLOTE";

                //Upload the file into FTP server
                var BIAFTPServerHostName = ConfigurationManager.AppSettings["SFTPServerHostName"];
                var ftp2ServerHostName = ConfigurationManager.AppSettings["FTP2ServerHostName"];

                if (param.IsDev)
                {
                    //BIAFTPV
                    var BIAFTPVDevUploadFolder = "/" + Properties.Settings.Default.FTPUserIdBatchDev;

                    using (SftpClient clientBIAFTPVDev = new SftpClient(BIAFTPServerHostName, Properties.Settings.Default.FTPUserIdBatchDev, Properties.Settings.Default.FTPUserPSWBatchDev))
                    {
                        clientBIAFTPVDev.Connect();

                        var memoryStream = new MemoryStream(File.ReadAllBytes(localDrivePath));
                        //BIAFTPV
                        var region = dtreg.Rows[0]["RegionId"].ToString();
                        //EMEA- //ZA //America
                        if (region.Contains("10") || region.Contains("20") || region.Contains("13"))
                        {
                            folder = "/inbound/europe/" + fileName;
                            BIAFTPVDevUploadFolder = BIAFTPVDevUploadFolder + "/inbound/europe";
                        }
                        switch (dtreg.Rows[0]["RegionId"].ToString())
                        {

                            //APAC
                            case "11":
                                folder = "/inbound/asia/" + fileName;
                                BIAFTPVDevUploadFolder = BIAFTPVDevUploadFolder + "/inbound/asia";
                                break;
                            //North America
                            case "14":
                                folder = "/inbound/northamerica/" + fileName;
                                BIAFTPVDevUploadFolder = BIAFTPVDevUploadFolder + "/inbound/northamerica";
                                break;
                            default:
                                break;
                        }
                        clientBIAFTPVDev.ChangeDirectory(BIAFTPVDevUploadFolder);
                        clientBIAFTPVDev.UploadFile(memoryStream, fileName);
                    }
                }
                else
                {
                    //BIAFTPV
                    var BIAFTPVProdUploadFolder = "/" + Properties.Settings.Default.FTPUserIdDev;

                    using (SftpClient clientBIAFTPVProd = new SftpClient(BIAFTPServerHostName, Properties.Settings.Default.FTPUserIdDev, Properties.Settings.Default.FTPUserPSWDev))
                    {

                        clientBIAFTPVProd.Connect();
                        var memoryStream = new MemoryStream(File.ReadAllBytes(localDrivePath));

                        var region = dtreg.Rows[0]["RegionId"].ToString();
                        //EMEA- //ZA //America
                        if (region.Contains("10") || region.Contains("20") || region.Contains("13"))
                        {
                            folder = "/inbound/europe/" + fileName;
                            BIAFTPVProdUploadFolder = BIAFTPVProdUploadFolder + "/inbound/europe";
                        }

                        switch (dtreg.Rows[0]["RegionId"].ToString())
                        {
                            //APAC
                            case "11":
                                folder = "/inbound/asia/" + fileName;
                                BIAFTPVProdUploadFolder = BIAFTPVProdUploadFolder + "/inbound/asia";
                                break;
                            //North America
                            case "14":
                                folder = "/inbound/northamerica/" + fileName;
                                BIAFTPVProdUploadFolder = BIAFTPVProdUploadFolder + "/inbound/northamerica";
                                break;
                            default:
                                break;
                        }
                        clientBIAFTPVProd.ChangeDirectory(BIAFTPVProdUploadFolder);
                        clientBIAFTPVProd.UploadFile(memoryStream, fileName);
                    }

                    //FTP2
                    var ftp2UserName = "";
                    var ftp2Password = "";
                    var ftp2Port = 10022;
                    var ftp2ProdUploadFolder = "";

                    switch (dtreg.Rows[0]["RegionId"].ToString())
                    {
                        //EMEA
                        case "10":
                            folder = "/inbound/europe/" + fileName;
                            ftp2ProdUploadFolder = "/inbound/europe/";
                            ftp2UserName = Properties.Settings.Default.FTPUserIdEMEA;
                            ftp2Password = Properties.Settings.Default.FTPUserPSWEMEA;
                            break;
                        //ZA
                        case "20":
                            folder = "/inbound/europe/" + fileName;
                            ftp2ProdUploadFolder = "/inbound/europe/";
                            ftp2UserName = Properties.Settings.Default.FTPUserIdZA;
                            ftp2Password = Properties.Settings.Default.FTPUserPSWZA;
                            break;
                        //APAC
                        case "11":
                            folder = "/inbound/asia/" + fileName;
                            ftp2ProdUploadFolder = "/inbound/asia/";
                            ftp2UserName = Properties.Settings.Default.FTPUserIdAPAC;
                            ftp2Password = Properties.Settings.Default.FTPUserPSWAPAC;
                            break;
                        //America
                        case "13":
                            folder = "/inbound/europe/" + fileName;
                            ftp2ProdUploadFolder = "/inbound/europe/";
                            ftp2UserName = Properties.Settings.Default.FTPUserIdAmerica;
                            ftp2Password = Properties.Settings.Default.FTPUserPSWAmerica;
                            break;
                        //North America
                        case "14":
                            folder = "/inbound/northamerica/" + fileName;
                            ftp2ProdUploadFolder = "/inbound/northamerica/";
                            ftp2UserName = Properties.Settings.Default.FTPUserIdNAmerica;
                            ftp2Password = Properties.Settings.Default.FTPUserPSWNAmerica;
                            break;
                        default:
                            break;
                    }

                    using (SftpClient clientftp2Prod = new SftpClient(ftp2ServerHostName, ftp2Port, ftp2UserName, ftp2Password))
                    {
                        clientftp2Prod.Connect();
                        var memoryStream = new MemoryStream(File.ReadAllBytes(localDrivePath));
                        clientftp2Prod.ChangeDirectory(ftp2ProdUploadFolder);
                        clientftp2Prod.UploadFile(memoryStream, fileName);
                    }
                }

                List<DBParameter> argsUpd = new List<DBParameter>();
                argsUpd.Add(new DBParameter("@folder", DbType.AnsiString, folder));
                argsUpd.Add(new DBParameter("@newBtachId", DbType.AnsiString, newBatchId));
                SQL.Execute(Connection, DBConstants.UpdateInvoiceBatch, argsUpd.ToArray());

                var query = (from p in dtSendAPUT.AsEnumerable()
                             where p.Field<string>("source") == "CONTROL"
                             select new
                             {
                                 invNum = p.Field<string>("invoice_num"),
                                 invLineTot = p.Field<decimal>("invoice_line_amount")
                             }).FirstOrDefault();

                result.emailNotification = SendNotificationEmail(newBatchId, query.invNum, query.invLineTot.ToString(), fileName, param.IsDev, folder);
                result.filename = fileName;
                result.success = true;
                result.message = "<div style =\"height: 110px;\"> <div style =\"font-size:12;font-weight: bold;\">Send AP File (APUT Upload)" +
                                 "Batch: <br/>" +
                                  newBatchId + "<br/></div>" +
                                 "<div style =\"font-size:12;font-weight: bold;\">Batch Date (EST): <br/> " +
                                 DateTime.Now.ToString() + "<br/></div>" +
                                 "<div style =\"font-size:12;font-weight: bold;\"><img src=\"images/accept-16x16.gif\">" +
                                 "Email to Accounts Payable <br/></div> " +
                                 "<div style =\"font-size:12;font-weight: bold;\"><img src=\"images/accept-16x16.gif\">" +
                                 "FTP File Sent to Accounts Payable <br/></div> </div>";
            }
            catch (Exception ex)
            {
                result.success = false;
                result.message = ex.Message;
                BIACore.Log.LogFactory.Exception(ex);
                throw;
            }
            return result;
        }

        /// <summary>
        /// Recall the Batch 
        /// </summary>
        /// <param name="param"></param>
        /// <returns></returns>
        [HttpPost]
        [ActionName("RecallBatch")]
        public object RecallBatch(biafilter.Filter param)
        {
            MessageOb result = new MessageOb();
            result.success = false;
            param.IsDev = Convert.ToBoolean(WebConfigurationManager.AppSettings["isDev"]);
            try
            {
                if (param.BatchId != "")
                {
                    DataTable dtBatchDet = SQL.Execute(Connection, DBConstants.GetBatchDetails, new DBParameter("@batch_id", DbType.AnsiString, param.BatchId));
                    var fileFullName = dtBatchDet.Rows[0]["file_path"].ToString();
                    var fileName = fileFullName.Split('/');
                    var length = fileName.Length - 1;


                    //FTP web  server
                    FtpWebRequest request;
                    if (param.IsDev)
                    {
                        request = (FtpWebRequest)WebRequest.Create(Properties.Settings.Default.FTPFilePathDev + fileName[length]);
                        request.Method = WebRequestMethods.Ftp.DeleteFile;
                        request.Credentials = new NetworkCredential(Properties.Settings.Default.FTPUserIdDev, Properties.Settings.Default.FTPUserPSWDev);

                    }
                    else
                    {
                        request = (FtpWebRequest)WebRequest.Create(Properties.Settings.Default.FTPFilePathProd + fileFullName);
                        request.Method = WebRequestMethods.Ftp.DeleteFile;

                        switch (dtBatchDet.Rows[0]["RegionId"].ToString())
                        {
                            //EMEA
                            case "10":
                                request.Credentials = new NetworkCredential(Properties.Settings.Default.FTPUserIdEMEA, Properties.Settings.Default.FTPUserPSWEMEA);
                                break;
                            //ZA
                            case "20":
                                request.Credentials = new NetworkCredential(Properties.Settings.Default.FTPUserIdZA, Properties.Settings.Default.FTPUserPSWZA);
                                break;
                            //APAC
                            case "11":
                                request.Credentials = new NetworkCredential(Properties.Settings.Default.FTPUserIdAPAC, Properties.Settings.Default.FTPUserPSWAPAC);
                                break;
                            //America
                            case "13":
                                request.Credentials = new NetworkCredential(Properties.Settings.Default.FTPUserIdAmerica, Properties.Settings.Default.FTPUserPSWAmerica);
                                break;
                            //North America
                            case "14":
                                request.Credentials = new NetworkCredential(Properties.Settings.Default.FTPUserIdNAmerica, Properties.Settings.Default.FTPUserPSWNAmerica);
                                break;
                            default:
                                break;
                        }
                    }

                    FtpWebResponse response = (FtpWebResponse)request.GetResponse();
                    response.Close();

                    DataTable dtBatchIds = SQL.Execute(Connection, DBConstants.GetBatchDetailsArchiveBatch, new DBParameter("@batch_id", DbType.AnsiString, param.BatchId));
                    if (dtBatchIds.Rows.Count > 0)
                    {
                        foreach (DataRow drow in dtBatchIds.Rows)
                        {
                            param.InvoiceId = drow["invoice_id"].ToString();
                            param.InvoiceStatusTo = "Approved";
                            MoveInvoiceToApproveOrScanned(param);
                        }
                    }
                }


            }
            catch (Exception ex)
            {
                result.success = false;
                result.message = ex.Message;
                BIACore.Log.LogFactory.Exception(ex);
            }
            return result;
        }
        /// <summary>
        /// Send the notification message ato users about APUT file.
        /// </summary>
        /// <param name="newBatchId"></param>
        /// <param name="invNum"></param>
        /// <param name="invLineTot"></param>
        /// <param name="fileName"></param>
        /// <param name="isDev"></param>
        /// <param name="folder"></param>
        /// <returns></returns>
        private string SendNotificationEmail(string newBatchId, string invNum, string invLineTot, string fileName, bool isDev, string folder)
        {
            var fromEmail = "bia@ups.com";
            var result = "Sent";
            var str_Default_Email_List = "";
            var default_Dev_Email_List = System.Web.Configuration.WebConfigurationManager.AppSettings["EmailListDev"].ToString();
            var default_Prod_Email_List = System.Web.Configuration.WebConfigurationManager.AppSettings["EmailListProd"].ToString();

            try
            {
                DataTable dtEmailList = SQL.Execute(Connection, DBConstants.GetEmailsOnAPUTBatch, new DBParameter("@APUT_id", DbType.AnsiString, newBatchId));
                MailMessage Msg = new MailMessage();
                MailAddress fromMail = new MailAddress(fromEmail);
                Msg.From = fromMail;
                if (dtEmailList.Rows.Count > 0)
                {
                    var emailList = dtEmailList.Rows[0]["Email_List"].ToString().Replace(",", ";");
                    if (dtEmailList.Rows.Count == 1)
                    { str_Default_Email_List = (isDev ? (default_Dev_Email_List + ";" + emailList) : (default_Prod_Email_List + ";" + emailList)); }
                    else
                    { str_Default_Email_List = (isDev ? (default_Dev_Email_List + emailList) : (default_Prod_Email_List + emailList)); }
                }
                else
                {
                    str_Default_Email_List = isDev ? default_Dev_Email_List : default_Prod_Email_List;
                }
                string[] toEmailList = str_Default_Email_List.Split(';');
                if (toEmailList.Length > 0)
                {
                    foreach (var str in toEmailList)
                    {
                        if (str != "")
                        { Msg.To.Add(new MailAddress(str)); }
                    }
                }
                var href = "";
                if (isDev)
                {
                    href = Properties.Settings.Default.FTPFilePathFloteBatchDev + folder;
                }
                else
                {
                    href = Properties.Settings.Default.FTPFilePathDev + folder;
                }
                Msg.Subject = "FLOTE AP Notification Batch: " + newBatchId;
                Msg.IsBodyHtml = true;
                var strBody = "FLOTE AP Notification:<BR/>" +
                "An APUT file has been sent to the FTP server for processing.<BR/>" +
                "Batch Number: " + newBatchId + "<BR/>" +
                "Total Count of Invoices: " + invNum + "<BR/>" +
                "Total Line Amount Sum: " + invLineTot + "<BR/>" +
                "Date/Time: " + DateTime.Now.ToString("MM/dd/yyyy  HH:mm:ss") + "<BR/>" +
                "FileName: " + fileName + "<BR/>" +
                "Link: <a href=" + href + ">" + href + "</a>" + "<BR/>" +
                "Environment: " + (isDev ? "Dev" : "Prod");
                Msg.Body = strBody;

                SmtpClient a = new SmtpClient(Properties.Settings.Default.SMTPServer);
                a.EnableSsl = true;
                a.Send(Msg);
            }
            catch (Exception ex)
            {
                result = "failed";
                BIACore.Log.LogFactory.Exception(ex);
                throw;
            }
            return result;
        }
        /// <summary>
        /// Printing Bill details reports.
        /// </summary>
        /// <param name="param"></param>
        /// <returns></returns>
        public static void PrintBillDetailsReport(GemExcelWorksheet ws, biafilter.Filter param, ref int dCount)
        {
            try
            {
                int rowCount = 6;
                if (ws != null)
                {
                    List<DBParameter> args = new List<DBParameter>();
                    args.Add(new DBParameter("@invoice_id", DbType.AnsiString, param.InvoiceId));

                    var dtInvSumHeader = SQL.Execute(Connections.Flote_Raw, DBConstants.GetInvoiceSumHeader, args.ToArray());
                    args.Add(new DBParameter("@sort", DbType.AnsiString, param.SortParam));
                    args.Add(new DBParameter("@export", DbType.Int16, 1));
                    var dtBillsDet = SQL.Execute(Connections.Flote_Raw, DBConstants.GetInvoiceDetail, args.ToArray());

                    ws.PrintOptions.TopMargin = 0.5;
                    ws.PrintOptions.BottomMargin = 0.5;
                    ws.PrintOptions.LeftMargin = 0.25;
                    ws.PrintOptions.RightMargin = 0.25;
                    ws.PrintOptions.HeaderMargin = 0;
                    ws.PrintOptions.FooterMargin = 0;
                    ws.Cells.Style.Font.Name = "Calibri";
                    ws.Cells.Style.Font.Size = 200;
                    ws.Cells.Style.HorizontalAlignment = HorizontalAlignmentStyle.Left;
                    if (!ws.Cells.GetSubrange("A1:R1").IsAnyCellMerged)
                    {
                        ws.Cells.GetSubrange("A1:R1").Merged = true;
                    }

                    SetThickBorder(ws.Cells.GetSubrange("A1:R1"), "top");
                    ws.Cells["A1"].Value = "Bill Detail Report";
                    SetAlignment(ws.Cells.GetSubrange("A1:R1"), HorizontalAlignmentStyle.Left);


                    if (dtInvSumHeader.Rows.Count > 0)
                    {
                        ws.Cells.GetSubrange("A3:F3").Style.WrapText = true;
                        ws.Cells["A3"].Value = "Bill ID:";
                        ws.Cells["B3"].Value = dtInvSumHeader.Rows[0]["Invoice_id"].ToString();
                        SetAlignment(ws.Cells["A3"], HorizontalAlignmentStyle.Left);
                        SetAlignment(ws.Cells["B3"], HorizontalAlignmentStyle.Left);

                        ws.Cells["C3"].Value = "Bill Ref. No:";
                        ws.Cells["D3"].Value = dtInvSumHeader.Rows[0]["InvRefNo"].ToString();
                        SetAlignment(ws.Cells["C3"], HorizontalAlignmentStyle.Left);
                        SetAlignment(ws.Cells["D3"], HorizontalAlignmentStyle.Left);

                        ws.Cells["E3"].Value = "E2K Carrier Code:";
                        ws.Cells["F3"].Value = dtInvSumHeader.Rows[0]["e2k_carrier_code"].ToString();
                        SetAlignment(ws.Cells["E3"], HorizontalAlignmentStyle.Left);
                        SetAlignment(ws.Cells["F3"], HorizontalAlignmentStyle.Left);

                        ws.Cells.GetSubrange("A4:F4").Style.WrapText = true;
                        ws.Cells["A4"].Value = "Vendor Name:";
                        ws.Cells["B4"].Value = dtInvSumHeader.Rows[0]["vendor_name_english"].ToString();
                        SetAlignment(ws.Cells["A4"], HorizontalAlignmentStyle.Left);
                        SetAlignment(ws.Cells["B4"], HorizontalAlignmentStyle.Left);

                        ws.Cells["C4"].Value = "Vendor Code:";
                        ws.Cells["D4"].Value = dtInvSumHeader.Rows[0]["vendor_code"].ToString();
                        SetAlignment(ws.Cells["C4"], HorizontalAlignmentStyle.Left);
                        SetAlignment(ws.Cells["D4"], HorizontalAlignmentStyle.Left);

                        ws.Cells["E4"].Value = "Vendor Number:";
                        ws.Cells["F4"].Value = dtInvSumHeader.Rows[0]["AP_Vendor_ID"].ToString();
                        SetAlignment(ws.Cells["E4"], HorizontalAlignmentStyle.Left);
                        SetAlignment(ws.Cells["F4"], HorizontalAlignmentStyle.Left);

                        ws.Cells.GetSubrange("A5:F5").Style.WrapText = true;
                        ws.Cells["A5"].Value = "Vendor Site Code:";
                        ws.Cells["B5"].Value = dtInvSumHeader.Rows[0]["AP_Remit_id"].ToString();
                        SetAlignment(ws.Cells["A5"], HorizontalAlignmentStyle.Left);
                        SetAlignment(ws.Cells["B5"], HorizontalAlignmentStyle.Left);


                        ws.Cells["C5"].Value = "Location Code:";
                        ws.Cells["D5"].Value = dtInvSumHeader.Rows[0]["location_code"].ToString();
                        SetAlignment(ws.Cells["C5"], HorizontalAlignmentStyle.Left);
                        SetAlignment(ws.Cells["D5"], HorizontalAlignmentStyle.Left);

                        ws.Cells["E5"].Value = "Bill Currency:";
                        ws.Cells["F5"].Value = dtInvSumHeader.Rows[0]["Invoice_CID"].ToString();
                        SetAlignment(ws.Cells["E5"], HorizontalAlignmentStyle.Left);
                        SetAlignment(ws.Cells["F5"], HorizontalAlignmentStyle.Left);

                        ws.Cells.GetSubrange("A6:F6").Style.WrapText = true;
                        ws.Cells["A6"].Value = "Bill Date:";
                        ws.Cells["B6"].Value = dtInvSumHeader.Rows[0]["InvoiceDate"].ToString();
                        SetAlignment(ws.Cells["A6"], HorizontalAlignmentStyle.Left);
                        SetAlignment(ws.Cells["B6"], HorizontalAlignmentStyle.Left);


                        ws.Cells["C6"].Value = "Bill Due Date:";
                        ws.Cells["D6"].Value = dtInvSumHeader.Rows[0]["InvoiceDueDate"].ToString();
                        SetAlignment(ws.Cells["D6"], HorizontalAlignmentStyle.Left);
                        SetAlignment(ws.Cells["C6"], HorizontalAlignmentStyle.Left);

                        ws.Cells["E6"].Value = "VAT Point Date:";
                        ws.Cells["F6"].Value = dtInvSumHeader.Rows[0]["VATPointDate"].ToString();
                        SetAlignment(ws.Cells["E6"], HorizontalAlignmentStyle.Left);
                        SetAlignment(ws.Cells["F6"], HorizontalAlignmentStyle.Left);
                    }

                    rowCount += dtInvSumHeader.Rows.Count + 3;

                    ws.Rows[rowCount].Height = 70;

                    ws.Cells.GetSubrange("A" + rowCount + ":R" + rowCount).Style.WrapText = true;
                    ws.Cells["A" + rowCount].Value = "Rcvd At Date \n (mm/dd/yyyy)";

                    ws.Cells["B" + rowCount].Value = "Shipment \n Number";
                    ws.Cells["C" + rowCount].Value = "Masterbill";
                    ws.Cells["D" + rowCount].Value = "Charge \n Code";
                    ws.Cells["E" + rowCount].Value = "Charge \n Description";
                    ws.Cells["F" + rowCount].Value = "E2k Created \n By";
                    ws.Cells["G" + rowCount].Value = "Flote \n Submitted \n By";
                    ws.Cells["H" + rowCount].Value = "Flote \n Submitted \n Date";
                    ws.Cells["I" + rowCount].Value = "Org. \n Buy \n Amt";
                    ws.Cells["J" + rowCount].Value = "Org. \n Buy \n Curr";
                    ws.Cells["K" + rowCount].Value = "Charge \n Amt";
                    ws.Cells["L" + rowCount].Value = "Charge \n Curr";
                    ws.Cells["M" + rowCount].Value = "Bill \n Buy \n Amt";
                    ws.Cells["N" + rowCount].Value = "Bill \n Buy \n Curr";
                    ws.Cells["O" + rowCount].Value = "Diff \n Amt";
                    ws.Cells["P" + rowCount].Value = "Paid \n Differently \n Reason";
                    ws.Cells["Q" + rowCount].Value = "Comments";
                    ws.Cells["R" + rowCount].Value = "Reference";


                    SetAlignment(ws.Cells["A" + rowCount], HorizontalAlignmentStyle.Left);
                    SetAlignment(ws.Cells["B" + rowCount], HorizontalAlignmentStyle.Left);
                    SetAlignment(ws.Cells["C" + rowCount], HorizontalAlignmentStyle.Left);
                    SetAlignment(ws.Cells["D" + rowCount], HorizontalAlignmentStyle.Left);
                    SetAlignment(ws.Cells["E" + rowCount], HorizontalAlignmentStyle.Left);
                    SetAlignment(ws.Cells["F" + rowCount], HorizontalAlignmentStyle.Left);
                    SetAlignment(ws.Cells["G" + rowCount], HorizontalAlignmentStyle.Left);
                    SetAlignment(ws.Cells["H" + rowCount], HorizontalAlignmentStyle.Left);
                    SetAlignment(ws.Cells["I" + rowCount], HorizontalAlignmentStyle.Left);
                    SetAlignment(ws.Cells["J" + rowCount], HorizontalAlignmentStyle.Left);
                    SetAlignment(ws.Cells["K" + rowCount], HorizontalAlignmentStyle.Left);
                    SetAlignment(ws.Cells["L" + rowCount], HorizontalAlignmentStyle.Left);
                    SetAlignment(ws.Cells["M" + rowCount], HorizontalAlignmentStyle.Left);
                    SetAlignment(ws.Cells["N" + rowCount], HorizontalAlignmentStyle.Left);
                    SetAlignment(ws.Cells["O" + rowCount], HorizontalAlignmentStyle.Left);
                    SetAlignment(ws.Cells["P" + rowCount], HorizontalAlignmentStyle.Left);
                    SetAlignment(ws.Cells["Q" + rowCount], HorizontalAlignmentStyle.Left);
                    SetAlignment(ws.Cells["R" + rowCount], HorizontalAlignmentStyle.Left);

                    if (dtBillsDet.Rows.Count > 0)
                    {
                        for (int i = 1; i <= dtBillsDet.Rows.Count; i++)
                        {
                            ws.Rows[rowCount].Height = 600;
                            rowCount++;
                            ws.Rows.InsertCopy(rowCount, ws.Rows[rowCount - 1]);
                            ws.Cells.GetSubrange("A" + rowCount + ":R" + rowCount).Style.WrapText = true;
                            ws.Cells["A" + rowCount].Value = dtBillsDet.Rows[i - 1]["rcvd_at_dt"] == DBNull.Value ? "" : Convert.ToDateTime(dtBillsDet.Rows[i - 1]["rcvd_at_dt"]).ToShortDateString();
                            ws.Cells["B" + rowCount].Value = dtBillsDet.Rows[i - 1]["shpmnt_nbr"] == DBNull.Value ? "" : dtBillsDet.Rows[i - 1]["shpmnt_nbr"].ToString();
                            ws.Cells["C" + rowCount].Value = dtBillsDet.Rows[i - 1]["mbl_nbr"] == DBNull.Value ? "" : dtBillsDet.Rows[i - 1]["mbl_nbr"].ToString();
                            ws.Cells["D" + rowCount].Value = dtBillsDet.Rows[i - 1]["Charge_code"] == DBNull.Value ? "" : dtBillsDet.Rows[i - 1]["Charge_code"].ToString();
                            ws.Cells["E" + rowCount].Value = dtBillsDet.Rows[i - 1]["CHARGE_DESCRIPTION"] == DBNull.Value ? "" : dtBillsDet.Rows[i - 1]["CHARGE_DESCRIPTION"].ToString();
                            ws.Cells["G" + rowCount].Value = (dtBillsDet.Rows[i - 1]["first_name"] == DBNull.Value || dtBillsDet.Rows[i - 1]["last_name"] == DBNull.Value) ? "" : dtBillsDet.Rows[i - 1]["first_name"].ToString() + dtBillsDet.Rows[i - 1]["last_name"].ToString();
                            ws.Cells["H" + rowCount].Value = dtBillsDet.Rows[i - 1]["ModifiedBy"] == DBNull.Value ? "" : dtBillsDet.Rows[i - 1]["ModifiedBy"].ToString();
                            ws.Cells["I" + rowCount].Value = dtBillsDet.Rows[i - 1]["ModifiedDT"] == DBNull.Value ? "" : Convert.ToDateTime(dtBillsDet.Rows[i - 1]["ModifiedDT"]).ToShortDateString();
                            ws.Cells["J" + rowCount].Value = dtBillsDet.Rows[i - 1]["buy_amt"] == DBNull.Value ? 0 : Convert.ToDecimal(dtBillsDet.Rows[i - 1]["buy_amt"]);
                            ws.Cells["K" + rowCount].Value = dtBillsDet.Rows[i - 1]["buy_cid"] == DBNull.Value ? "" : dtBillsDet.Rows[i - 1]["buy_cid"].ToString();
                            ws.Cells["L" + rowCount].Value = dtBillsDet.Rows[i - 1]["Charge_amt"] == DBNull.Value ? 0 : Convert.ToDecimal(dtBillsDet.Rows[i - 1]["Charge_amt"].ToString());
                            ws.Cells["M" + rowCount].Value = dtBillsDet.Rows[i - 1]["Charge_cid"] == DBNull.Value ? "" : dtBillsDet.Rows[i - 1]["Charge_cid"].ToString();
                            ws.Cells["N" + rowCount].Value = dtBillsDet.Rows[i - 1]["invoice_amt"] == DBNull.Value ? 0 : Convert.ToDecimal(dtBillsDet.Rows[i - 1]["invoice_amt"].ToString());
                            ws.Cells["O" + rowCount].Value = dtBillsDet.Rows[i - 1]["invoice_cid"] == DBNull.Value ? "" : dtBillsDet.Rows[i - 1]["invoice_cid"].ToString();
                            ws.Cells["P" + rowCount].Value = dtBillsDet.Rows[i - 1]["PaidDifferentlyReason"] == DBNull.Value ? "" : dtBillsDet.Rows[i - 1]["PaidDifferentlyReason"].ToString();
                            ws.Cells["Q" + rowCount].Value = dtBillsDet.Rows[i - 1]["comment"] == DBNull.Value ? "" : dtBillsDet.Rows[i - 1]["comment"].ToString();
                            ws.Cells["R" + rowCount].Value = dtBillsDet.Rows[i - 1]["Reference"] == DBNull.Value ? "" : dtBillsDet.Rows[i - 1]["Reference"].ToString();

                            SetAlignment(ws.Cells["A" + rowCount], HorizontalAlignmentStyle.Left);
                            SetAlignment(ws.Cells["B" + rowCount], HorizontalAlignmentStyle.Left);
                            SetAlignment(ws.Cells["C" + rowCount], HorizontalAlignmentStyle.Left);
                            SetAlignment(ws.Cells["D" + rowCount], HorizontalAlignmentStyle.Left);
                            SetAlignment(ws.Cells["E" + rowCount], HorizontalAlignmentStyle.Left);
                            SetAlignment(ws.Cells["F" + rowCount], HorizontalAlignmentStyle.Left);
                            SetAlignment(ws.Cells["G" + rowCount], HorizontalAlignmentStyle.Left);
                            SetAlignment(ws.Cells["H" + rowCount], HorizontalAlignmentStyle.Left);
                            SetAlignment(ws.Cells["I" + rowCount], HorizontalAlignmentStyle.Left);
                            SetAlignment(ws.Cells["J" + rowCount], HorizontalAlignmentStyle.Left);
                            SetAlignment(ws.Cells["K" + rowCount], HorizontalAlignmentStyle.Left);
                            SetAlignment(ws.Cells["L" + rowCount], HorizontalAlignmentStyle.Left);
                            SetAlignment(ws.Cells["M" + rowCount], HorizontalAlignmentStyle.Left);
                            SetAlignment(ws.Cells["N" + rowCount], HorizontalAlignmentStyle.Left);
                            SetAlignment(ws.Cells["O" + rowCount], HorizontalAlignmentStyle.Left);
                            SetAlignment(ws.Cells["P" + rowCount], HorizontalAlignmentStyle.Left);
                            SetAlignment(ws.Cells["Q" + rowCount], HorizontalAlignmentStyle.Left);
                            SetAlignment(ws.Cells["R" + rowCount], HorizontalAlignmentStyle.Left);
                            SetThickBorder(ws.Cells.GetSubrange("R" + rowCount + ":R" + rowCount), "right");

                        }
                    }
                    rowCount++;
                    SetThickBorder(ws.Cells.GetSubrange("R" + rowCount + ":R" + rowCount), "right");
                    rowCount = rowCount + 1;
                    SetThickBorder(ws.Cells.GetSubrange("R" + rowCount + 1 + ":R" + rowCount + 1), "right");
                    SetThickBorder(ws.Cells.GetSubrange("R" + rowCount + 2 + ":R" + rowCount + 2), "right");
                    SetThickBorder(ws.Cells.GetSubrange("R" + rowCount + 3 + ":R" + rowCount + 3), "right");
                    if (!ws.Cells.GetSubrange("A" + rowCount + ":R" + rowCount).IsAnyCellMerged)
                    {
                        ws.Cells.GetSubrange("A" + rowCount + ":R" + rowCount).Merged = true;
                    }
                    ws.Rows[rowCount].Height = 600;
                    ws.Cells[rowCount, 0].Value = "Copyright ©" + DateTime.Now.Year.ToString() + ", United Parcel Service of America, Inc. All Rights Reserved. For internal use only.";
                    SetFontFormat(ws.Cells[rowCount, 0], 300, true, HorizontalAlignmentStyle.Center);
                    SetThickBorder(ws.Cells.GetSubrange("A" + rowCount + ":R" + rowCount), "all");
                    SetAlignment(ws.Cells.GetSubrange("A" + rowCount + ":R" + rowCount), HorizontalAlignmentStyle.Center);
                    rowCount++;
                    if (!ws.Cells.GetSubrange("A" + rowCount + ":R" + rowCount).IsAnyCellMerged)
                    {
                        ws.Cells.GetSubrange("A" + rowCount + ":R" + rowCount).Merged = true;
                    }
                    ws.Rows[rowCount].Height = 400;
                    ws.Cells[rowCount, 0].Value = "Source:  BIA Flote Bills Details Reports";
                    SetFontFormat(ws.Cells[rowCount, 0], 200, true, HorizontalAlignmentStyle.Center);
                    SetThickBorder(ws.Cells.GetSubrange("A" + rowCount + ":R" + rowCount), "all");
                    SetAlignment(ws.Cells.GetSubrange("A" + rowCount + ":R" + rowCount), HorizontalAlignmentStyle.Center);
                    rowCount++;
                    if (!ws.Cells.GetSubrange("A" + rowCount + ":R" + rowCount).IsAnyCellMerged)
                    {
                        ws.Cells.GetSubrange("A" + rowCount + ":R" + rowCount).Merged = true;
                    }
                    SetThickBorder(ws.Cells.GetSubrange("A" + rowCount + ":R" + rowCount), "all");
                    SetAlignment(ws.Cells.GetSubrange("A" + rowCount + ":R" + rowCount), HorizontalAlignmentStyle.Center);
                    dCount = rowCount;
                }
            }
            catch (Exception ex)
            {
                BIACore.Log.LogFactory.Exception(ex);
            }

        }
        /// <summary>
        /// Update Reference Value per charge and invoice det id.
        /// </summary>
        /// <param name="param"></param>
        /// <returns></returns>
        [HttpPost]
        [ActionName("UpateReferenceValue")]
        public object UpateReferenceValue(biafilter.Filter param)
        {
            try
            {
                List<DBParameter> argsUpd = new List<DBParameter>();
                argsUpd.Add(new DBParameter("@userid", DbType.AnsiString, param.UserId));
                argsUpd.Add(new DBParameter("@reference", DbType.AnsiString, param.Comments));
                argsUpd.Add(new DBParameter("@invoice_detail_id", DbType.AnsiString, param.InvoiceDetId));
                return LoadSingle(DBConstants.UpdateInvoiceDetailReference, argsUpd.ToArray());

            }
            catch (Exception ex)
            {
                BIACore.Log.LogFactory.Exception(ex);
                throw;

            }
        }
    }
}

public class MessageOb
{
    public bool success { get; set; }
    public string message { get; set; }
    public string filename { get; set; }
    public string emailNotification { get; set; }
}

