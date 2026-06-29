using System;
using System.Collections.Generic;
using System.Web.Http;

using Flote.WebAPI.WebAPI.Model;
using BIACore.Model;
using System.Data;
using BIACore.Provider;
using System.IO;
using System.Data.OleDb;
using System.Text.RegularExpressions;
using System.Configuration;
using System.Text;
using GemBox.Spreadsheet;

namespace Flote.WebAPI.WebAPI.Controller
{
    public partial class WebApiReportController
    {
        /// <summary>
        /// Import the excel data on grid for display.
        /// </summary>
        /// <param name="info"></param>
        /// <returns></returns>
        [HttpPost]
        [ActionName("ExcelImport")]
        public object ExcelImport([FromBody] ExcelInfoModel info)
        {
            try
            {
                List<ExcelModel> aReturn = new List<ExcelModel>();

                string networkDrivePath = ConfigurationManager.AppSettings["NetworkDriveName"] + "\\ftp\\FLOTE";
                string fileName = Path.Combine(@"\\" + networkDrivePath + "", "data", info.FileName);
                var wb = ExcelFile.Load(fileName);
                if (wb == null || wb.Worksheets.Count <= 0)
                {
                    return null;
                }
                var ws = wb.Worksheets[info.TabName];

                if (ws == null)
                {
                    return null;
                }


                var dt = ws.CreateDataTable(new CreateDataTableOptions()
                {
                    ColumnHeaders = false,
                    StartRow = 0,
                    NumberOfColumns = 13,
                    NumberOfRows = 50,
                    Resolution = ColumnTypeResolution.AutoPreferStringCurrentCulture
                });

                if (dt != null && dt.Rows.Count > 0)
                {
                    foreach (DataRow dr in dt.Rows)
                    {
                        ExcelModel e = new ExcelModel();
                        e.F1 = getFieldIfAvailable(dr, 0);
                        e.F2 = getFieldIfAvailable(dr, 1);
                        e.F3 = getFieldIfAvailable(dr, 2);
                        e.F4 = getFieldIfAvailable(dr, 3);
                        e.F5 = getFieldIfAvailable(dr, 4);
                        e.F6 = getFieldIfAvailable(dr, 5);
                        e.F7 = getFieldIfAvailable(dr, 6);
                        e.F8 = getFieldIfAvailable(dr, 7);
                        e.F9 = getFieldIfAvailable(dr, 8);
                        e.F10 = getFieldIfAvailable(dr, 9);
                        e.F11 = getFieldIfAvailable(dr, 10);
                        e.F12 = getFieldIfAvailable(dr, 11);
                        e.F13 = getFieldIfAvailable(dr, 12);
                        aReturn.Add(e);
                    }
                }


                return aReturn;
            }
            catch (Exception ex)
            {
                BIACore.Log.LogFactory.Exception(ex);
                return null;
            }
        }
        /// <summary>
        /// Method to check field available.
        /// </summary>
        /// <param name="dr"></param>
        /// <param name="index"></param>
        /// <returns></returns>
        private string getFieldIfAvailable(DataRow dr, int index)
        {
            if (dr.Table.Columns.Count > index)
                return dr[index].ToString();
            else
                return "";
        }
        /// <summary>
        /// Get the Excel tab list.
        /// </summary>
        /// <param name="info"></param>
        /// <returns></returns>
        [HttpPost, HttpGet]
        [ActionName("ExcelTabList")]
        public DataTable ExcelTabList([FromBody] dynamic info)
        {
            DataTable dtSchema = new DataTable();
            try
            {
                dtSchema.Columns.Add(new DataColumn("TABLE_NAME"));
                string fileName = info.Filename.ToString();

                if (fileName != "" && fileName != null)
                {
                    var wb = ExcelFile.Load(fileName);
                    if (wb == null || wb.Worksheets.Count <= 0)
                    {
                        return null;
                    }

                    foreach (ExcelWorksheet worksheet in wb.Worksheets)
                    {
                        dtSchema.Rows.Add(worksheet.Name);
                    }
                }
            }
            catch (Exception ex)
            {
                BIACore.Log.LogFactory.Exception(ex);
                return null;
            }
            return dtSchema;
        }
        /// <summary>
        /// Get the Field list.
        /// </summary>
        /// <returns></returns>        
        [HttpPost, HttpGet]
        [ActionName("FieldList")]
        public object FieldList()
        {
            try
            {
                return SQL.Execute(Connections.Flote_Raw, DBConstants.GetColumnSpecList, null);
            }
            catch (Exception ex)
            {
                BIACore.Log.LogFactory.Exception(ex);
                return null;
            }
        }
        /// <summary>
        /// Insert the excel import data into workbookdata table.
        /// </summary>
        /// <param name="info"></param>
        /// <returns></returns>
        [HttpPost]
        [ActionName("ExcelCommit")]
        public object ExcelCommit([FromBody] ExcelInfoModel info)
        {
            List<DBParameter> args = new List<DBParameter>();
            try
            {
                args.Add(new DBParameter("@Invoice_ID", DbType.AnsiString, info.Invoice_ID));
                args.Add(new DBParameter("@UserID", DbType.AnsiString, info.UserId));
                SQL.Execute(Connection, DBConstants.WorkbookCtrlInsert, args.ToArray());

                string networkDrivePath = ConfigurationManager.AppSettings["NetworkDriveName"] + "\\ftp\\FLOTE";
                string fileName = Path.Combine(@"\\" + networkDrivePath + "", "data", info.FileName);
                string fname = Path.GetFileName(info.FileName);
                string tabName = info.TabName.ToString();
                tabName = tabName.Replace("'", "");

                // use this to get the data types of the columns               
                using (DataTable dtExcel = ReadSheet(info, true))
                {
                    int iRow = 1;

                    if (dtExcel.Rows.Count > 0)
                    {
                        DataTable wkbookDataType = new DataTable("FloteWorkbooDataType");

                        foreach (ExcelInfoColumnMap cm in info.ColumnMap)
                        {
                            wkbookDataType.Columns.Add(new DataColumn(cm.ColumnName));
                        }
                        wkbookDataType.Columns.Add(new DataColumn("SSROWNUMBER", typeof(int)) { AutoIncrement = true, AutoIncrementSeed = 1, AutoIncrementStep = 1 });
                        foreach (DataRow dr in dtExcel.Rows)
                        {
                            if ((iRow >= info.DataRowStart) && (iRow <= info.DataRowEnd))
                            {
                                wkbookDataType.Rows.Add(dr.ItemArray);
                            }
                            ++iRow;
                        }
                        DataColumn createUserName = new DataColumn("USER_ID", typeof(string));
                        createUserName.DefaultValue = BIACore.Security.User.userId;
                        wkbookDataType.Columns.Add(createUserName);

                        DataColumn createGuid = new DataColumn("GUID", typeof(string));
                        createGuid.DefaultValue = fname;
                        wkbookDataType.Columns.Add(createGuid);

                        DataColumn createSheetName = new DataColumn("SHEET_NAME", typeof(string));
                        createSheetName.DefaultValue = tabName;
                        wkbookDataType.Columns.Add(createSheetName);

                        DataColumn createInvoiceId = new DataColumn("INVOICE_ID", typeof(string));
                        createInvoiceId.DefaultValue = info.Invoice_ID;
                        wkbookDataType.Columns.Add(createInvoiceId);

                        wkbookDataType.Columns["SSROWNUMBER"].SetOrdinal(0);
                        wkbookDataType.Columns["USER_ID"].SetOrdinal(1);
                        wkbookDataType.Columns["GUID"].SetOrdinal(2);
                        wkbookDataType.Columns["INVOICE_ID"].SetOrdinal(3);
                        wkbookDataType.Columns["SHEET_NAME"].SetOrdinal(4);
                        wkbookDataType.Columns["DATE"].SetOrdinal(5);
                        wkbookDataType.Columns["CONTAINER_NBR"].SetOrdinal(6);
                        wkbookDataType.Columns["CONTAINER_TYPE"].SetOrdinal(7);
                        wkbookDataType.Columns["CONTAINER_COUNT"].SetOrdinal(8);
                        wkbookDataType.Columns["CARRIER_BOL"].SetOrdinal(9);
                        wkbookDataType.Columns["JOB_NBR"].SetOrdinal(10);
                        wkbookDataType.Columns["CHARGE_DESCRIPTION"].SetOrdinal(11);
                        wkbookDataType.Columns["AMOUNT"].SetOrdinal(12);
                        wkbookDataType.Columns["VERIFIED_AMOUNT"].SetOrdinal(13);
                        wkbookDataType.Columns["RATES_MATCH"].SetOrdinal(14);
                        wkbookDataType.Columns["COMMENT"].SetOrdinal(15);
                        wkbookDataType.Columns["HBL"].SetOrdinal(16);
                        wkbookDataType.Columns["CHARGE_CODE"].SetOrdinal(17);
                        args.Add(new DBParameter("@WorkbookDataType", DbType.AnsiString, wkbookDataType));
                        SQL.Execute(Connection, DBConstants.WorkbookDataImportExcel, args.ToArray());
                    }

                }
                UpdateChargeCodeByChargeDesc(Convert.ToInt32(info.Invoice_ID), info.UserId);
                GetMatchCarrierBOL(Convert.ToInt32(info.Invoice_ID));
                Utility.ExpireExcelFiles(Path.GetDirectoryName(fileName));
                return new { success = true, message = "File committed successfully!" };
            }
            catch (Exception ex)
            {
                BIACore.Log.LogFactory.Exception(ex);
                if (System.Diagnostics.Debugger.IsAttached)
                    System.Diagnostics.Debugger.Break();
                return new { success = false, message = ex.Message.ToString() };
            }
        }
        /// <summary>
        /// Method clean formatting to clean data.
        /// </summary>
        /// <param name="value"></param>
        /// <returns></returns>
        public string CleanFormatting(string value)
        {
            value = value.Replace("$", "");
            value = value.Replace(",", "");
            value = value.Replace("'", "");
            if (string.IsNullOrEmpty(value))
            { value = "NULL"; }
            return value;
        }
        /// <summary>
        /// Method to clean string data.
        /// </summary>
        /// <param name="info"></param>
        /// <param name="dr"></param>
        /// <param name="value"></param>
        /// <param name="ColumnName"></param>
        /// <returns></returns>
        public string CleanString(ExcelInfoModel info, DataRow dr, string value, string ColumnName)
        {
            try
            {
                value = value.Replace("'", "");
                if (string.IsNullOrEmpty(value))
                    value = "";                
                value = value.Replace(" ", "");
                return value.Trim();
            }
            catch (Exception ex)
            {
                BIACore.Log.LogFactory.Exception(ex);
                if (System.Diagnostics.Debugger.IsAttached)
                    System.Diagnostics.Debugger.Break();
                return "ERR";
            }
        }
        /// <summary>
        /// Clean string for date format.
        /// </summary>
        /// <param name="info"></param>
        /// <param name="dr"></param>
        /// <param name="value"></param>
        /// <param name="ColumnName"></param>
        /// <returns></returns>
        public string CleanStringForDate(ExcelInfoModel info, DataRow dr, string value, string ColumnName)
        {
            try
            {
                value = value.Replace("'", "");
                value = Regex.Replace(value, @"[A-Za-z\s]", string.Empty);
                if (string.IsNullOrEmpty(value))
                    value = DateTime.Today.Date.ToString("yyyy-MM-dd");

                return value.Trim();
            }
            catch (Exception ex)
            {
                BIACore.Log.LogFactory.Exception(ex);
                if (System.Diagnostics.Debugger.IsAttached)
                    System.Diagnostics.Debugger.Break();
                return "ERR";
            }
        }
        /// <summary>
        /// Get the workbook control data by invoice id.
        /// </summary>
        /// <param name="info"></param>
        /// <returns></returns>
        [HttpPost]
        [ActionName("WorkbookByInvoiceId")]
        public object WorkbookByInvoiceId([FromBody] dynamic info)
        {
            List<DBParameter> args = new List<DBParameter>();
            args.Add(new DBParameter("@INVOICE_ID", DbType.AnsiString, Convert.ToInt32(info["Invoice_Id"].Value)));
            DataTable dt = SQL.Execute(Connection, DBConstants.WorkbookControlByInvID, args.ToArray());
            string UserID = "System";
            var INVOICE_ID = -1;
            if (dt.Rows.Count > 0)
            {
                UserID = dt.Rows[0]["UserID"].ToString();
                INVOICE_ID = (int)dt.Rows[0]["INVOICE_ID"];
            }
            return new { INVOICE_ID = INVOICE_ID, userId = UserID };
        }
        /// <summary>
        /// Update charge code value by charge dersciprtion using mapping table.
        /// </summary>
        /// <param name="Invoice_ID"></param>
        /// <param name="userId"></param>
        private void UpdateChargeCodeByChargeDesc(int Invoice_ID, string userId)
        {
            try
            {
                List<DBParameter> args = new List<DBParameter>();
                args.Add(new DBParameter("@Invoice_ID", DbType.AnsiString, Invoice_ID));
                args.Add(new DBParameter("@UserID", DbType.AnsiString, userId));
                SQL.Execute(Connection, DBConstants.UpdateChargeCodeByChargeDesc, args.ToArray());
            }
            catch (Exception ex)
            {
                BIACore.Log.LogFactory.Exception(ex);
                if (System.Diagnostics.Debugger.IsAttached)
                    System.Diagnostics.Debugger.Break();
            }
        }
        /// <summary>
        /// Get Matched carrierBOL
        /// </summary>
        /// <param name="info"></param>
        private void GetMatchCarrierBOL(int Invoice_ID)
        {
            List<DBParameter> args = new List<DBParameter>();
            args.Add(new DBParameter("@INVOICE_ID", DbType.AnsiString, Invoice_ID));
            SQL.Execute(Connection, DBConstants.GetMatchCarrierBOL, args.ToArray());
        }
        /// <summary>
        /// Read the excel sheet using oledb drivers.
        /// </summary>
        /// <param name="info"></param>
        /// <param name="isCommit"></param>
        /// <returns></returns>
        public DataTable ReadSheet(ExcelInfoModel info, Boolean isCommit)
        {
            try
            {
                string networkDrivePath = ConfigurationManager.AppSettings["NetworkDriveName"] + "\\ftp\\FLOTE";
                string fileName = Path.Combine(@"\\" + networkDrivePath + "", "data", info.FileName);
                var wb = ExcelFile.Load(fileName);
                if (wb == null || wb.Worksheets.Count <= 0)
                {
                    return null;
                }
                var ws = wb.Worksheets[info.TabName];

                if (ws == null)
                {
                    return null;
                }
                var dt = new DataTable();

                if (!isCommit)
                {
                    dt = ws.CreateDataTable(new CreateDataTableOptions()
                    {
                        ColumnHeaders = false,
                        StartRow = 0,
                        NumberOfColumns = 13,
                        NumberOfRows = 50,
                        Resolution = ColumnTypeResolution.AutoPreferStringCurrentCulture
                    });
                }
                else
                {
                    dt = ws.CreateDataTable(new CreateDataTableOptions()
                    {
                        ColumnHeaders = false,
                        StartRow = 0,
                        NumberOfColumns = 13,
                        NumberOfRows = ws.Rows.Count,
                        Resolution = ColumnTypeResolution.AutoPreferStringCurrentCulture
                    });
                }
                return dt;
            }
            catch (Exception ex)
            {
                BIACore.Log.LogFactory.Exception(ex);
                if (System.Diagnostics.Debugger.IsAttached)
                    System.Diagnostics.Debugger.Break();
                return null;
            }
        }
    }
}