/* ====================================================================================================
NAME:		    [Common data Controller]
BEHAVIOR:		Returns Common data for selected companent and filter criteria.
_______________________________________________________________________________________________________
REVISION HISTORY
-------------------------------------------------------------------------------------------------------
Date			    Modified By			  Modifications
-------------------------------------------------------------------------------------------------------
09/22/2016        Sudhir Dandale		 Created.
 ======================================================================================================*/
using System;
using System.Collections.Generic;
using System.Web.Http;

using biafilter = Flote.WebAPI.WebAPI.Model;
using BIACore.Model;
using System.Data;
using BIACore.Provider;
using Oracle.ManagedDataAccess.Client;
using System.Text;

namespace Flote.WebAPI.WebAPI.Controller
{
    public partial class WebApiReportController
    {
        [HttpPost]
        [ActionName("GetImage")]
        public object GetImage([FromBody] biafilter.Filter param)
        {
            DataTable dtImage;
            List<DBParameter> args = new List<DBParameter>();
            try
            {
                args.Add(new DBParameter("@AcctYear", DbType.AnsiString, param.AcctYear));
                args.Add(new DBParameter("@InvRefNo", DbType.AnsiString, param.InvoiceRefNo));
                args.Add(new DBParameter("@location_code", DbType.AnsiString, param.LocCode));
                args.Add(new DBParameter("@invoice_status", DbType.AnsiString, param.InvoiceStatus));
                args.Add(new DBParameter("@invoice_id", DbType.AnsiString, param.InvoiceId));

                dtImage = SQL.Execute(Connection, DBConstants.Bills, args.ToArray());
                if (dtImage.Rows[0]["ImageURL"].ToString() == "" || dtImage.Rows[0]["ImageURL"] == null)
                {
                    dtImage = ImageData(param.LocCode, param.InvoiceRefNo, param.InvoiceStatus, param.DocumentId, "image", "");
                }
            }
            catch (Exception ex)
            {
                BIACore.Log.LogFactory.Exception(ex);
                return ex.Message;
            }
            return (dtImage == null) ? new DataTable() : dtImage;
        }
        /// <summary>
        /// Search Scan documents based on Inv Ref Number.
        /// </summary>
        /// <param name="param"></param>
        /// <returns></returns>
        [HttpPost]
        [ActionName("SearchScanDocument")]
        public object SearchScanDocument([FromBody] biafilter.Filter param)
        {
            DataTable dtImage = new DataTable();
            List<DBParameter> args = new List<DBParameter>();
            try
            {

                args.Add(new DBParameter("@invoice_id", DbType.AnsiString, param.InvoiceId));
                dtImage = ImageData(param.LocCode, param.InvoiceRefNo, param.InvoiceStatus, "", "search", "");
                StringBuilder docsList = new StringBuilder("");
                for (int i = 0; i < dtImage.Rows.Count; i++)
                {
                    docsList.Append("'");
                    docsList.Append(dtImage.Rows[i]["ImageNumber"].ToString());
                    docsList.Append("'");
                    if (i < dtImage.Rows.Count - 1 && dtImage.Rows.Count != 1) { docsList.Append(","); } else { docsList.Append(string.Empty); }
                }
                if (docsList.ToString() != "")
                {
                    args.Add(new DBParameter("@docsList", DbType.AnsiString, docsList.ToString()));
                    DataTable dtDocExist = SQL.Execute(Connection, DBConstants.GetImageNumberByInvoice, args.ToArray());
                    dtImage.Merge(dtDocExist);
                }
            }
            catch (Exception ex)
            {
                BIACore.Log.LogFactory.Exception(ex);
                return ex.Message;
            }
            return dtImage;
        }
        /// <summary>
        /// Attached is selected scanned document to Invoice Id.
        /// </summary>
        /// <param name="param"></param>
        /// <returns></returns>
        [HttpPost]
        [ActionName("AttachedScanDocument")]
        public object AttachedScanDocument([FromBody] biafilter.Filter param)
        {
            DataTable dtImage ;
            List<DBParameter> args = new List<DBParameter>();
            string result = "";
            try
            {
                if (param.InvoiceId != "0")
                {
                    args.Add(new DBParameter("@invoice_id", DbType.AnsiString, param.InvoiceId));
                    args.Add(new DBParameter("@image_url", DbType.AnsiString, param.ImageURL));
                    args.Add(new DBParameter("@image_number", DbType.AnsiString, param.ImageNumber));
                    args.Add(new DBParameter("@scan_dest", DbType.AnsiString, param.ScanDest));
                    args.Add(new DBParameter("@folder", DbType.AnsiString, param.FolderName));

                    dtImage = SQL.Execute(Connection, DBConstants.SetInvoiceImage, args.ToArray());

                    args.Add(new DBParameter("@invoiceStatusTo", DbType.AnsiString, ""));
                    param.InvoiceStatusTo = "Scanned";

                    SetInvoiceStatus(param);
                    result = "Finished";
                }
            }
            catch (Exception ex)
            {
                BIACore.Log.LogFactory.Exception(ex);
                return null;
            }
            return result;
        }

        /// <summary>
        /// Get the Image data 
        /// </summary>
        /// <param name="locCode"></param>
        /// <param name="invRefNo"></param>
        /// <param name="invStatus"></param>
        /// <param name="imgNo"></param>
        /// <param name="type"></param>
        /// <param name="modDate"></param>
        /// <param name="invoiceId">defalut parameter use only for CheckInvoiceInTDOC </param>
        /// <returns></returns>
        private DataTable ImageData(string locCode, string invRefNo, string invStatus, string imgNo, string type, string modDate, string invoiceId = null)
        {
            try
            {
                DataTable dtLoc = SQL.Execute(Connection, DBConstants.FetchCompanyCode, new DBParameter("@location_code", DbType.AnsiString, locCode));
                DataTable dtImage = new DataTable();
                var sqlImgText = "SELECT a70 folder,a82 scan_dest,SUBSTR (a82, 10, 3) location,a99 imageURL,a113 scan_date,a40 vendor_id,a48 scanner,a83 scan_origin," +
                           " a78 Ven_Invoice,TO_NUMBER(f_pages) pages,TO_NUMBER(f_docnumber) ImageNumber, TO_NUMBER(TO_date(SYSDATE,'dd/mm/yyyy')-TO_date(d.a113,'dd/mm/yyyy')) days_in_folder,a39 Document_type " +
                            " FROM ewwfn_db.tdoc d   " +
                            "  WHERE a39 = 'APInvoice' ";

                var whereClause = "";
                List<string> cmpCodeL = new List<string>();
                cmpCodeL.Add("397");
                cmpCodeL.Add("493");
                switch (type)
                {
                    case "image":

                        if (imgNo == "0")
                        {
                            if (cmpCodeL.IndexOf(dtLoc.Rows[0]["CompanyCode"].ToString().ToUpper()) >= 0)
                            {
                                whereClause += " and SUBSTR (a82, 10, 3) = '" + locCode.ToUpper() + "'";
                            }
                            else
                            {
                                whereClause += " and SUBSTR (a82, 6, 3) = '" + dtLoc.Rows[0]["CompanyCode"].ToString().ToUpper() + "'";
                            }
                            whereClause += " and a78 = '" + invRefNo + "'";
                            if (invStatus == "Archived")
                            {
                                whereClause += " and (a70 like '%ARCHIVE' or a70 like '%ARCHIVE!' or a70 like '%REMOVEDFROMWF' or a70 like '%RemovedFromWF')";
                            }
                        }
                        else
                        {
                            whereClause += " and f_docnumber = '" + imgNo + "'";
                        }
                        break;

                    case "insert":

                        whereClause += " and a78 = '" + invRefNo.ToUpper() + "'";
                        if (imgNo != "")
                        {
                            whereClause += " and f_docnumber = '" + imgNo + "'";
                        }
                        if (cmpCodeL.IndexOf(dtLoc.Rows[0]["CompanyCode"].ToString().ToUpper()) >= 0)
                        {
                            whereClause += " and SUBSTR (a82, 10, 3) = '" + locCode.ToUpper() + "'";
                        }
                        else
                        {
                            whereClause += " and SUBSTR (a82, 6, 3) = '" + dtLoc.Rows[0]["CompanyCode"].ToString().ToUpper() + "'";
                        }
                        break;

                    case "search":

                        whereClause += " and a78 = '" + invRefNo.ToUpper() + "'";
                        if (cmpCodeL.IndexOf(dtLoc.Rows[0]["CompanyCode"].ToString().ToUpper()) >= 0)
                        {
                            whereClause += " and SUBSTR (a82, 10, 3) = '" + locCode.ToUpper() + "'";
                        }
                        else
                        {
                            whereClause += " and SUBSTR (a82, 6, 3) = '" + dtLoc.Rows[0]["CompanyCode"].ToString().ToUpper() + "'";
                        }
                        break;
                    case "tdoc":

                        if (cmpCodeL.IndexOf(dtLoc.Rows[0]["CompanyCode"].ToString().ToUpper()) >= 0)
                        {
                            whereClause += " and SUBSTR (a82, 10, 3) = '" + locCode.ToUpper() + "'";
                        }
                        else
                        {
                            whereClause += " and SUBSTR (a82, 6, 3) = '" + dtLoc.Rows[0]["CompanyCode"].ToString().ToUpper() + "'";
                        }
                        whereClause += " and a78 = '" + "chk_" + invoiceId.ToUpper() + "'"; //Matching this condition with V1
                        whereClause += " and (a70 like '%ARCHIVE' or a70 like '%ARCHIVE!' or a70 like '%REMOVEDFROMWF'  or a70 like '%RemovedFromWF' or a70 like '%RECYCLE')";
                        break;
                    case "invdoc":
                        whereClause += " and d.a113 >= TO_DATE('08/01/2013','mm-dd-yyyy')";
                        if (cmpCodeL.IndexOf(dtLoc.Rows[0]["CompanyCode"].ToString().ToUpper()) >= 0)
                        {
                            whereClause += " and SUBSTR (a82, 10, 3) = '" + locCode.ToUpper() + "'";
                        }
                        else
                        {
                            whereClause += " and SUBSTR (a82, 6, 3) = '" + dtLoc.Rows[0]["CompanyCode"].ToString().ToUpper() + "'";
                        }
                        if (invStatus == "Archived")
                        {
                            whereClause += " and (a70 like '%ARCHIVE' or a70 like '%ARCHIVE!' or a70 like '%REMOVEDFROMWF'  or a70 like '%RemovedFromWF' )";
                            whereClause += " and f_docnumber = '" + imgNo + "'";
                        }
                        else
                        {
                            whereClause += " and a78 = '" + invRefNo.ToUpper() + "'";
                            whereClause += " and (d.a113 - TO_DATE('" + DateTime.Parse(modDate).ToString("MM/dd/yyyy") + "','mm-dd-yyyy')) >= 0";
                            whereClause += " and (a70 not like '%RECYCLE%')";
                        }


                        break;
                    default:
                        break;

                }
                sqlImgText = sqlImgText + whereClause;
                using (OracleConnection conn = new OracleConnection(Connections.E2kImageData_Raw))
                {
                    conn.Open();
                    using (OracleCommand comm = new OracleCommand(sqlImgText, conn))
                    {
                        using (OracleDataReader rdr = comm.ExecuteReader())
                        {
                            dtImage.Load(rdr);
                        }
                    }
                    conn.Dispose();
                }

                return dtImage;
            }
            catch (Exception ex)
            {
                BIACore.Log.LogFactory.Exception(ex);
                throw;
            }
        }
    }
}
