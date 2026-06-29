using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Text;
using System.Net.Http;
using System.Net;
using System.IO;

using BIACore.Web.Model;
using System.Reflection;
using BIACore.Provider;
using BIACore.Model;
using OfficeOpenXml;
using OfficeOpenXml.Style;
using System.Drawing;


namespace Flote.WebAPI.WebAPI
{
    public class ExcelExporter
    {
        /// <summary>
        /// Get the datatable to excel .
        /// </summary>
        /// <param name="cr"></param>
        /// <param name="Filename"></param>
        /// <param name="Columns"></param>
        /// <param name="Filters"></param>
        /// <returns></returns>
        public static HttpResponseMessage DatatableToExcel(ClientResult cr, string Filename, string Columns, string Filters)
        {
            HttpResponseMessage response = new HttpResponseMessage(HttpStatusCode.OK);
            string FileNameToUse = String.Format("{0}.xlsx", Filename);
            try
            {
                HttpResponseMessage Response = new HttpResponseMessage();

                DataTable data = ExcelExporter.ClientResultToDataTable(cr);

                DataColumn[] columns = new DataColumn[data.Columns.Count];
                List<DataColumn> columnsToRemove = new List<DataColumn>();
                List<DataColumn> columnsToKeep = new List<DataColumn>();
                data.Columns.CopyTo(columns, 0);

                if (Columns != null && Columns != "")
                {
                    columnsToRemove = columns.ToList();

                    dynamic[] Cols = Newtonsoft.Json.JsonConvert.DeserializeObject<dynamic[]>(Columns);

                    for (int colIndex = 0; colIndex < Cols.Length; colIndex++)
                    {
                        if ((bool)Cols[colIndex].visible)
                        {
                            foreach (DataColumn col in columnsToRemove)
                            {
                                if (col.ColumnName == (string)Cols[colIndex].dataIndex)
                                {
                                    columnsToKeep.Add(col);
                                    col.ColumnName = (string)Cols[colIndex].text;
                                    break;
                                }
                            }
                        }
                    }

                    foreach (DataColumn col in columnsToKeep)
                    {
                        columnsToRemove.Remove(col);
                    }

                    foreach (DataColumn col in columnsToRemove)
                    {
                        data.Columns.Remove(col);
                    }
                }
                else
                {
                    columnsToKeep = columns.ToList();
                }



                string filterList = (Filters != null && Filters != "" ? "Filters:" + Filters : "").Replace(":", ":,");

                StringBuilder sb = new StringBuilder();

                sb.Append(filterList).AppendLine();

                string headers = "";
                foreach (var column in columnsToKeep)
                {
                    DataColumn dc = column as DataColumn;
                    headers += dc.ColumnName + ", ";
                }
                sb.Append(headers).AppendLine();

                foreach (DataRow row in data.Rows)
                {
                    string s = "";
                    for (int i = 0; i < columnsToKeep.Count; i++)
                    {
                        s += (row.IsNull(columnsToKeep[i]) ? "," : (row[columnsToKeep[i]].ToString().IndexOf(',') > -1 ? "\"" + row[columnsToKeep[i]].ToString().Trim() + "\"" : row[columnsToKeep[i]].ToString().Trim()) + ",").Replace("\r", " ").Replace("\n", " ");
                    }
                    s = s.Trim(',');
                    //string s = string.Join(", ", row.ItemArray);
                    sb.Append(s).AppendLine();
                }

                response.Content = new StringContent(sb.ToString(), System.Text.Encoding.UTF8, "text/plain");
            }
            catch (Exception err)
            {
                response.StatusCode = HttpStatusCode.InternalServerError;
                response.Content = new StringContent(string.Format("Issue exporting to excel file: {1}{0}{2}{0}{3}{0}", Environment.NewLine, FileNameToUse, err.Message, err.StackTrace));
                response.ReasonPhrase = err.Message + Environment.NewLine + err.StackTrace;
            }
            return response;
        }
        /// <summary>
        /// Get result set to client side as datatable
        /// </summary>
        /// <param name="cr"></param>
        /// <returns></returns>
        public static DataTable ClientResultToDataTable(ClientResult cr)
        {
            object[] data = new object[cr.GetData().Count];
            cr.GetData().CopyTo(data, 0);

            DataTable dt = GetDataTableFromObjects(data);

            return dt;
        }
        /// <summary>
        /// Get the data table from object.
        /// </summary>
        /// <param name="objects"></param>
        /// <returns></returns>
        public static DataTable GetDataTableFromObjects(object[] objects)
        {
            if (objects != null && objects.Length > 0)
            {
                Type t = objects[0].GetType();
                DataTable dt = new DataTable(t.Name);
                foreach (PropertyInfo pi in t.GetProperties())
                {
                    dt.Columns.Add(new DataColumn(pi.Name));
                }
                foreach (var o in objects)
                {
                    DataRow dr = dt.NewRow();
                    foreach (DataColumn dc in dt.Columns)
                    {
                        dr[dc.ColumnName] = o.GetType().GetProperty(dc.ColumnName).GetValue(o, null);
                    }
                    dt.Rows.Add(dr);
                }
                return dt;
            }
            return null;
        }
        /// <summary>
        /// Get the data table 
        /// </summary>
        /// <param name="invoceId"></param>
        /// <param name="sortParam"></param>
        /// <returns></returns>
        public static DataTable GetDataTable(string invoceId, string sortParam)
        {
            DataTable dt = new DataTable();
            List<DBParameter> args = new List<DBParameter>();
            args.Add(new DBParameter("@invoice_id", DbType.AnsiString, invoceId));
            //  var dtInvSumHeader = SQL.Execute(Connections.Flote, "usp_GetInvoiceSumHeader", args.ToArray());
            args.Add(new DBParameter("@sort", DbType.AnsiString, sortParam));
            args.Add(new DBParameter("@export", DbType.Int16, 1));
            dt = SQL.Execute(Connections.Flote, "usp_GetInvoiceDetail_TNew", args.ToArray());
            //args.Add(new DBParameter("@AcctYear", DbType.AnsiString, year));
            ////args.Add(new DBParameter("@InvRefNo", DbType.AnsiString, info["InvRefNo"].Value));
            //args.Add(new DBParameter("@location_code", DbType.AnsiString, locCode));
            //args.Add(new DBParameter("@invoice_status", DbType.AnsiString, invoiceStat));
            // args.Add(new DBParameter("@invoice_id", DbType.AnsiString, info["InvoiceId"].Value));

            //dtImage = SQL.Execute(Connections.Flote, "usp_Bills_TNew", args.ToArray());
            return dt;
        }
        /// <summary>
        /// Get the excel export stream data file.
        /// </summary>
        /// <param name="invoceId"></param>
        /// <param name="sortParam"></param>
        /// <returns></returns>
        public static MemoryStream GenerateStreamData(string invoceId, string sortParam)
        {
            MemoryStream ms = new MemoryStream();
            string targetPath = AppDomain.CurrentDomain.BaseDirectory + @"Export\" + "CodingSheetExport" + ".xlsx";
            try
            {
                int rowCount = 14;
                if (File.Exists(targetPath)) { File.Delete(targetPath); }
                FileInfo newFile = new FileInfo(targetPath);

                using (ExcelPackage pck = new ExcelPackage(newFile))
                {
                    ExcelWorksheet ws = pck.Workbook.Worksheets.Add("CodingSheet");
                    var dtInvoiceVat = SQL.Execute(Connections.Flote, "usp_GetInvoiceVAT", new DBParameter("@invoice_id", DbType.AnsiString, invoceId));
                    var dtInvoiceHeader = SQL.Execute(Connections.Flote, "usp_GetInvoiceHeader", new DBParameter("@invoice_id", DbType.AnsiString, invoceId));
                    var dtCodingSheet = SQL.Execute(Connections.Flote, "usp_PrintCodingSheetDetails", new DBParameter("@invoiceid", DbType.AnsiString, invoceId));

                    //Color orange = Color.FromArgb(191, 143, 0);
                    //  Color darkyellow = Color.FromArgb(255, 217, 102);
                    // Color lightyellow = Color.FromArgb(255, 242, 204);
                    ws.PrinterSettings.Orientation = eOrientation.Landscape;
                    ws.PrinterSettings.TopMargin = 1 / 2;
                    ws.PrinterSettings.BottomMargin = 1 / 2;
                    ws.PrinterSettings.LeftMargin = 1 / 4;
                    ws.PrinterSettings.RightMargin = 1 / 4;
                    ws.PrinterSettings.HeaderMargin = 0;
                    ws.PrinterSettings.FooterMargin = 0;
                    ws.Cells.Style.Font.Name = "Calibri";
                    ws.Cells.Style.Font.Size = 12;
                    ws.Cells.Style.HorizontalAlignment = ExcelHorizontalAlignment.Left;
                    ws.Cells["A1:E1"].Merge = true; ws.Cells["A2:E2"].Merge = true; ws.Cells["A3:C3"].Merge = true; ws.Cells["A4:C4"].Merge = true; ws.Cells["D3:E3"].Merge = true;
                    ws.Cells["D4:E4"].Merge = true; ws.Cells["G1:H1"].Merge = true; ws.Cells["G2:H2"].Merge = true; ws.Cells["I1:J1"].Merge = true; ws.Cells["I2:J2"].Merge = true;
                    ws.Cells["A5:F5"].Merge = true; ws.Cells["G3:G4"].Merge = true;
                    ws.Cells["A9:E9"].Merge = true; ws.Cells["A10:E10"].Merge = true; ws.Cells["G5:G6"].Merge = true; ws.Cells["G7:G8"].Merge = true;
                    ws.Cells["G9:H9"].Merge = true; ws.Cells["G10:H10"].Merge = true; ws.Cells["G11:H11"].Merge = true; ws.Cells["G12:H12"].Merge = true;
                    ws.Cells["I9:J9"].Merge = true; ws.Cells["I10:J10"].Merge = true; ws.Cells["I11:J11"].Merge = true; ws.Cells["I12:J12"].Merge = true;
                    ws.Cells["A16:K16"].Merge = true; ws.Cells["A13:K13"].Merge = true; ws.Cells["B14:C14"].Merge = true; ws.Cells["B15:C15"].Merge = true;
                    ws.Cells["E14:F14"].Merge = true; ws.Cells["E15:F15"].Merge = true;

                    SetThickBorder(ws.Cells["A1:K1 "], "all");
                    ws.Cells["A1"].Value = "VENDOR/(LEGAL) NAME";
                    ws.Cells["A2"].Value = dtInvoiceHeader.Rows[0]["vendor_name_english"].ToString();
                    SetFontFormat(SetThinBorder(ws.Cells["A1"]), 12, true, ExcelHorizontalAlignment.Left);
                    SetFontFormatData(SetThinBorder(ws.Cells["A2"]), 12, true, ExcelHorizontalAlignment.Left);

                    ws.Cells["F1"].Value = "SCAN FOLDER";
                    ws.Cells["F2"].Value = dtInvoiceHeader.Rows[0]["scanfolder"].ToString();
                    SetFontFormat(SetThinBorder(ws.Cells["F1"]), 12, true, ExcelHorizontalAlignment.Center);
                    SetFontFormatData(SetThinBorder(ws.Cells["F2"]), 12, true, ExcelHorizontalAlignment.Center);

                    ws.Cells["G1"].Value = "COMPANY ID";
                    ws.Cells["G2"].Value = dtInvoiceHeader.Rows[0]["ora_company"].ToString();
                    SetFontFormat(SetThinBorder(ws.Cells["G1"]), 12, true, ExcelHorizontalAlignment.Center);
                    SetFontFormatData(SetThinBorder(ws.Cells["G2"]), 12, true, ExcelHorizontalAlignment.Center);

                    ws.Cells["I1"].Value = "STAMP NUMBER";
                    ws.Cells["I2"].Value = dtInvoiceHeader.Rows[0]["StampNumber"].ToString();
                    SetFontFormat(SetThinBorder(ws.Cells["I1"]), 12, true, ExcelHorizontalAlignment.Center);
                    SetFontFormatData(SetThinBorder(ws.Cells["I2"]), 12, true, ExcelHorizontalAlignment.Center);

                    ws.Cells["K1"].Value = "APPROVED BY:";
                    ws.Cells["K2:K6"].Merge = true;
                    ws.Cells["K2"].Value = dtInvoiceHeader.Rows[0]["approvedby"].ToString();
                    SetFontFormat(SetThinBorder(ws.Cells["K1"]), 12, true, ExcelHorizontalAlignment.Center);
                    SetFontFormatData(SetThinBorder(ws.Cells["K2"]), 12, true, ExcelHorizontalAlignment.Center);


                    ws.Cells["A3"].Value = "SUPPLIER(VENDOR) NO";
                    ws.Cells["A4"].Value = dtInvoiceHeader.Rows[0]["ap_vendor_id"].ToString();
                    SetFontFormat(SetThinBorder(ws.Cells["A3"]), 12, true, ExcelHorizontalAlignment.Left);
                    SetFontFormatData(SetThinBorder(ws.Cells["A4"]), 12, true, ExcelHorizontalAlignment.Left);

                    ws.Cells["D3"].Value = "(Site)REMIT ID";
                    ws.Cells["D4"].Value = dtInvoiceHeader.Rows[0]["ap_remit_id"].ToString();
                    SetFontFormat(SetThinBorder(ws.Cells["D3"]), 12, true, ExcelHorizontalAlignment.Center);
                    SetFontFormatData(SetThinBorder(ws.Cells["D4"]), 12, true, ExcelHorizontalAlignment.Center);

                    ws.Cells["F3"].Value = "LOCATION";
                    ws.Cells["F4"].Value = dtInvoiceHeader.Rows[0]["location_code"].ToString();
                    SetFontFormat(SetThinBorder(ws.Cells["F3"]), 12, true, ExcelHorizontalAlignment.Center);
                    SetFontFormatData(SetThinBorder(ws.Cells["F4"]), 12, true, ExcelHorizontalAlignment.Center);

                    ws.Cells["G3"].Value = "BILL \n DATE:";
                    SetFontFormat(SetThinBorder(ws.Cells["G3"]), 12, true, ExcelHorizontalAlignment.Center);
                    ws.Cells["G3"].Style.WrapText = true;
                    ws.Cells["G3"].AutoFitColumns();

                    ws.Cells["G5"].Value = "RECEIPT \n DATE:";
                    SetFontFormat(SetThinBorder(ws.Cells["G5"]), 12, true, ExcelHorizontalAlignment.Center);
                    ws.Cells["G5"].Style.WrapText = true;
                    ws.Cells["G5"].AutoFitColumns();

                    ws.Cells["G7"].Value = "BILL DUE \n DATE:";
                    SetFontFormat(SetThinBorder(ws.Cells["G7"]), 12, true, ExcelHorizontalAlignment.Center);
                    ws.Cells["G7"].Style.WrapText = true;
                    ws.Cells["G7"].AutoFitColumns();

                    ws.Cells["H3"].Value = "DD";
                    ws.Cells["H4"].Value = dtInvoiceHeader.Rows[0]["invoiceday"].ToString();
                    SetFontFormat(SetThinBorder(ws.Cells["H3"]), 12, true, ExcelHorizontalAlignment.Center);
                    SetFontFormatData(SetThinBorder(ws.Cells["H4"]), 12, true, ExcelHorizontalAlignment.Center);

                    ws.Cells["H5"].Value = "DD";
                    ws.Cells["H6"].Value = dtInvoiceHeader.Rows[0]["createdday"].ToString();
                    SetFontFormat(SetThinBorder(ws.Cells["H5"]), 12, true, ExcelHorizontalAlignment.Center);
                    SetFontFormatData(SetThinBorder(ws.Cells["H6"]), 12, true, ExcelHorizontalAlignment.Center);

                    ws.Cells["H7"].Value = "DD";
                    ws.Cells["H8"].Value = dtInvoiceHeader.Rows[0]["invoicedueday"].ToString();
                    SetFontFormat(SetThinBorder(ws.Cells["H7"]), 12, true, ExcelHorizontalAlignment.Center);
                    SetFontFormatData(SetThinBorder(ws.Cells["H8"]), 12, true, ExcelHorizontalAlignment.Center);

                    ws.Cells["I3"].Value = "MM";
                    ws.Cells["I4"].Value = dtInvoiceHeader.Rows[0]["invoicemonth"].ToString();
                    SetFontFormat(SetThinBorder(ws.Cells["I3"]), 12, true, ExcelHorizontalAlignment.Center);
                    SetFontFormatData(SetThinBorder(ws.Cells["I4"]), 12, true, ExcelHorizontalAlignment.Center);

                    ws.Cells["I5"].Value = "MM";
                    ws.Cells["I6"].Value = dtInvoiceHeader.Rows[0]["createdmonth"].ToString();
                    SetFontFormat(SetThinBorder(ws.Cells["I5"]), 12, true, ExcelHorizontalAlignment.Center);
                    SetFontFormatData(SetThinBorder(ws.Cells["I6"]), 12, true, ExcelHorizontalAlignment.Center);

                    ws.Cells["I7"].Value = "MM";
                    ws.Cells["I8"].Value = dtInvoiceHeader.Rows[0]["invoiceduemonth"].ToString();
                    SetFontFormat(SetThinBorder(ws.Cells["I7"]), 12, true, ExcelHorizontalAlignment.Center);
                    SetFontFormatData(SetThinBorder(ws.Cells["I8"]), 12, true, ExcelHorizontalAlignment.Center);

                    ws.Cells["J3"].Value = "YYYY";
                    ws.Cells["J4"].Value = dtInvoiceHeader.Rows[0]["invoiceyear"].ToString();
                    SetFontFormat(SetThinBorder(ws.Cells["J3"]), 12, true, ExcelHorizontalAlignment.Center);
                    SetFontFormatData(SetThinBorder(ws.Cells["J4"]), 12, true, ExcelHorizontalAlignment.Center);

                    ws.Cells["J5"].Value = "YYYY";
                    ws.Cells["J6"].Value = dtInvoiceHeader.Rows[0]["createdyear"].ToString();
                    SetFontFormat(SetThinBorder(ws.Cells["J5"]), 12, true, ExcelHorizontalAlignment.Center);
                    SetFontFormatData(SetThinBorder(ws.Cells["J6"]), 12, true, ExcelHorizontalAlignment.Center);

                    ws.Cells["J7"].Value = "YYYY";
                    ws.Cells["J8"].Value = dtInvoiceHeader.Rows[0]["invoicedueyear"].ToString();
                    SetFontFormat(SetThinBorder(ws.Cells["J7"]), 12, true, ExcelHorizontalAlignment.Center);
                    SetFontFormatData(SetThinBorder(ws.Cells["J8"]), 12, true, ExcelHorizontalAlignment.Center);

                    ws.Cells["A5"].Value = "VENDOR BILL NUMBER:";
                    ws.Cells["A6:F8"].Merge = true;
                    ws.Cells["A6"].Value = dtInvoiceHeader.Rows[0]["InvRefNo"].ToString();
                    SetFontFormat(SetThinBorder(ws.Cells["A5"]), 12, true, ExcelHorizontalAlignment.Left);
                    SetFontFormat(SetThinBorder(ws.Cells["A6"]), 12, true, ExcelHorizontalAlignment.Center);
                    SetThinBorder(ws.Cells["A6:F8"]);

                    ws.Cells["K7"].Value = "PAYMENT TERMS";
                    ws.Cells["K8"].Value = dtInvoiceHeader.Rows[0]["terms_id"].ToString();
                    SetFontFormat(SetThinBorder(ws.Cells["K7"]), 12, true, ExcelHorizontalAlignment.Center);
                    SetFontFormatData(SetThinBorder(ws.Cells["K8"]), 12, true, ExcelHorizontalAlignment.Center);

                    ws.Cells["A9"].Value = "BILL TOTAL:";
                    ws.Cells["A10"].Value = Convert.ToDecimal(dtInvoiceHeader.Rows[0]["Invoice_Amt"].ToString());
                    SetFontFormat(SetThinBorder(ws.Cells["A9"]), 12, true, ExcelHorizontalAlignment.Left);
                    SetFontFormatData(SetThinBorder(ws.Cells["A10"]), 12, true, ExcelHorizontalAlignment.Left);

                    ws.Cells["F9"].Value = "BILL CURRENCY";
                    ws.Cells["F10"].Value = dtInvoiceHeader.Rows[0]["invoice_cid"].ToString();
                    SetFontFormat(SetThinBorder(ws.Cells["F9"]), 12, true, ExcelHorizontalAlignment.Center);
                    SetFontFormatData(SetThinBorder(ws.Cells["F10"]), 12, true, ExcelHorizontalAlignment.Center);

                    ws.Cells["G9"].Value = "INV EXCHANGE RATE";
                    SetFontFormat(SetThinBorder(ws.Cells["G9"]), 12, true, ExcelHorizontalAlignment.Center);
                    SetFontFormatData(SetThinBorder(ws.Cells["G10"]), 12, true, ExcelHorizontalAlignment.Center);

                    ws.Cells["I9"].Value = "PMT EXCHANGE RATE";
                    SetFontFormat(SetThinBorder(ws.Cells["I9"]), 12, true, ExcelHorizontalAlignment.Center);

                    ws.Cells["K9"].Value = "VERIFIED BY:";
                    ws.Cells["K10:K12"].Merge = true;
                    ws.Cells["K10"].Value = dtInvoiceHeader.Rows[0]["verifiedby"].ToString();
                    SetFontFormat(SetThinBorder(ws.Cells["K9"]), 12, true, ExcelHorizontalAlignment.Center);
                    SetFontFormatData(SetThinBorder(ws.Cells["K10"]), 12, true, ExcelHorizontalAlignment.Center);
                    SetThinBorder(ws.Cells["K10:k12"]);
                    ws.Cells["A11:F11"].Merge = true;
                    ws.Cells["A12"].Value = "ADDITIONAL INFORMATION:";
                    SetFontFormat(SetThinBorder(ws.Cells["A12"]), 12, true, ExcelHorizontalAlignment.Center);
                    ws.Cells["G11"].Value = "VAT POINT DATE \n (DD/MM/YYYY)";
                    ws.Cells["G11"].Style.WrapText = true;
                    ws.Row(11).Height = 30.75;
                    ws.Cells["G12"].Value = dtInvoiceHeader.Rows[0]["vatpointdate"].ToString();
                    ws.Cells["G12"].AutoFitColumns(60);
                    SetFontFormat(SetThinBorder(ws.Cells["G11"]), 12, true, ExcelHorizontalAlignment.Center);
                    SetFontFormatData(SetThinBorder(ws.Cells["G12"]), 12, true, ExcelHorizontalAlignment.Center);
                    ws.Cells["I11"].Value = "Voucher No.";
                    SetFontFormat(SetThinBorder(ws.Cells["I11"]), 12, true, ExcelHorizontalAlignment.Center);

                    if (dtInvoiceHeader.Rows.Count > 0)
                    {
                        ws.Cells["A2"].Value = dtInvoiceHeader.Rows[0]["vendor_name_english"].ToString();
                        ws.Cells["F2"].Value = dtInvoiceHeader.Rows[0]["scanfolder"].ToString();
                        ws.Cells["G2"].Value = dtInvoiceHeader.Rows[0]["ora_company"].ToString();
                        ws.Cells["I2"].Value = dtInvoiceHeader.Rows[0]["StampNumber"].ToString();
                        ws.Cells["K2"].Value = dtInvoiceHeader.Rows[0]["approvedby"].ToString();
                        ws.Cells["A4"].Value = dtInvoiceHeader.Rows[0]["ap_vendor_id"].ToString();
                        ws.Cells["D4"].Value = dtInvoiceHeader.Rows[0]["ap_remit_id"].ToString();
                        ws.Cells["F4"].Value = dtInvoiceHeader.Rows[0]["location_code"].ToString();
                        ws.Cells["H4"].Value = dtInvoiceHeader.Rows[0]["invoiceday"].ToString();
                        ws.Cells["H6"].Value = dtInvoiceHeader.Rows[0]["createdday"].ToString();
                        ws.Cells["H8"].Value = dtInvoiceHeader.Rows[0]["invoicedueday"].ToString();
                        ws.Cells["I4"].Value = dtInvoiceHeader.Rows[0]["invoicemonth"].ToString();
                        ws.Cells["I6"].Value = dtInvoiceHeader.Rows[0]["createdmonth"].ToString();
                        ws.Cells["I8"].Value = dtInvoiceHeader.Rows[0]["invoiceduemonth"].ToString();
                        ws.Cells["J4"].Value = dtInvoiceHeader.Rows[0]["invoiceyear"].ToString();
                        ws.Cells["J6"].Value = dtInvoiceHeader.Rows[0]["createdyear"].ToString();
                        ws.Cells["J8"].Value = dtInvoiceHeader.Rows[0]["invoicedueyear"].ToString();
                        ws.Cells["A6"].Value = dtInvoiceHeader.Rows[0]["InvRefNo"].ToString();
                        ws.Cells["K8"].Value = dtInvoiceHeader.Rows[0]["terms_id"].ToString();
                        ws.Cells["A10"].Value = dtInvoiceHeader.Rows[0]["Invoice_Amt"].ToString();
                        ws.Cells["F10"].Value = dtInvoiceHeader.Rows[0]["invoice_cid"].ToString();
                        ws.Cells["K10"].Value = dtInvoiceHeader.Rows[0]["verifiedby"].ToString();
                        ws.Cells["G12"].Value = dtInvoiceHeader.Rows[0]["vatpointdate"].ToString();
                    }
                    ws.Cells["A" + rowCount].Value = "VAT CODE";
                    SetFontFormat(SetThinBorder(ws.Cells["A" + rowCount]), 12, true, ExcelHorizontalAlignment.Left);
                    ws.Cells["B" + rowCount].Value = "TAXABLE AMT:";
                    SetFontFormat(SetThinBorder(ws.Cells["B" + rowCount]), 12, true, ExcelHorizontalAlignment.Left);
                    ws.Cells["D" + rowCount].Value = "VAT%";
                    SetFontFormat(SetThinBorder(ws.Cells["D" + rowCount]), 12, true, ExcelHorizontalAlignment.Left);
                    ws.Cells["E" + rowCount].Value = "VAT AMT:";
                    SetFontFormat(SetThinBorder(ws.Cells["E" + rowCount]), 12, true, ExcelHorizontalAlignment.Left);

                    for (int i = 1; i < rowCount; i++)
                    {
                        SetThinBorder(ws.Cells["A" + i + ":" + "K" + i]);
                    }
                    SetFontFormat(SetThickBorder(ws.Cells["A13:K13 "], "all"), 12, true, ExcelHorizontalAlignment.Right);

                    if (dtInvoiceVat.Rows.Count > 0)
                    {
                        for (int i = 1; i <= dtInvoiceVat.Rows.Count; i++)
                        {
                            int count = rowCount + i;
                            ws.Cells["A" + count].Value = dtInvoiceVat.Rows[i - 1]["vat_code"].ToString();
                            ws.Cells["B" + count].Value = dtInvoiceVat.Rows[i - 1]["amount"].ToString();
                            ws.Cells["D" + count].Value = dtInvoiceVat.Rows[i - 1]["vat_percent"].ToString();
                            ws.Cells["E" + count].Value = dtInvoiceVat.Rows[i - 1]["vat_amount"].ToString();
                            SetFontFormatData(SetThinBorder(ws.Cells["A" + count]), 12, true, ExcelHorizontalAlignment.Left);
                            SetFontFormatData(SetThinBorder(ws.Cells["B" + count]), 12, true, ExcelHorizontalAlignment.Left);
                            SetFontFormatData(SetThinBorder(ws.Cells["D" + count]), 12, true, ExcelHorizontalAlignment.Left);
                            SetFontFormatData(SetThinBorder(ws.Cells["E" + count]), 12, true, ExcelHorizontalAlignment.Left);
                            SetThinBorder(ws.Cells["A" + count + ":" + "K" + count]);
                        }
                    }
                    rowCount += dtInvoiceVat.Rows.Count + 1;
                    SetFontFormat(SetThickBorder(ws.Cells["A" + rowCount + ":K" + rowCount], "all"), 12, true, ExcelHorizontalAlignment.Right);
                    rowCount += 1;

                    ws.Cells["A" + rowCount].Value = "RRDD";
                    ws.Cells["B" + rowCount].Value = "CENTER";
                    ws.Cells["C" + rowCount].Value = "OPS TYPE";
                    ws.Cells["D" + rowCount].Value = "PROD";
                    ws.Cells["E" + rowCount].Value = "ACCOUNT";
                    ws.Cells["F" + rowCount].Value = "CLIENT";
                    ws.Cells["G" + rowCount].Value = "VAT CODE";
                    ws.Cells["H" + rowCount].Value = "VAT%";
                    ws.Cells["I" + rowCount].Value = "VAT AMT";
                    ws.Cells["J" + rowCount].Value = "AMOUNT";
                    ws.Cells["K" + rowCount].Value = "REFERENCE";
                    SetFontFormat(SetThinBorder(ws.Cells["A" + rowCount]), 12, true, ExcelHorizontalAlignment.Center);
                    SetFontFormat(SetThinBorder(ws.Cells["B" + rowCount]), 12, true, ExcelHorizontalAlignment.Center);
                    SetFontFormat(SetThinBorder(ws.Cells["C" + rowCount]), 12, true, ExcelHorizontalAlignment.Center);
                    SetFontFormat(SetThinBorder(ws.Cells["D" + rowCount]), 12, true, ExcelHorizontalAlignment.Center);
                    SetFontFormat(SetThinBorder(ws.Cells["E" + rowCount]), 12, true, ExcelHorizontalAlignment.Center);
                    SetFontFormat(SetThinBorder(ws.Cells["F" + rowCount]), 12, true, ExcelHorizontalAlignment.Center);
                    SetFontFormat(SetThinBorder(ws.Cells["G" + rowCount]), 12, true, ExcelHorizontalAlignment.Center);
                    SetFontFormat(SetThinBorder(ws.Cells["H" + rowCount]), 12, true, ExcelHorizontalAlignment.Center);
                    SetFontFormat(SetThinBorder(ws.Cells["I" + rowCount]), 12, true, ExcelHorizontalAlignment.Center);
                    SetFontFormat(SetThinBorder(ws.Cells["J" + rowCount]), 12, true, ExcelHorizontalAlignment.Center);
                    SetFontFormat(SetThinBorder(ws.Cells["K" + rowCount]), 12, true, ExcelHorizontalAlignment.Center);

                    if (dtCodingSheet.Rows.Count > 0)
                    {
                        for (int i = 1; i <= dtCodingSheet.Rows.Count; i++)
                        {
                            int count = rowCount + i;
                            ws.Cells["A" + count].Value = dtCodingSheet.Rows[i - 1]["rrdd"].ToString();
                            ws.Cells["B" + count].Value = dtCodingSheet.Rows[i - 1]["center"].ToString();
                            ws.Cells["C" + count].Value = dtCodingSheet.Rows[i - 1]["OPSTYPE"].ToString();
                            ws.Cells["D" + count].Value = dtCodingSheet.Rows[i - 1]["product"].ToString();
                            ws.Cells["E" + count].Value = dtCodingSheet.Rows[i - 1]["account"].ToString();
                            ws.Cells["G" + count].Value = dtCodingSheet.Rows[i - 1]["vat_code"].ToString();
                            ws.Cells["H" + count].Value = dtCodingSheet.Rows[i - 1]["vat_percent"].ToString();
                            ws.Cells["I" + count].Value = dtCodingSheet.Rows[i - 1]["vat_amount"].ToString();
                            ws.Cells["J" + count].Value = dtCodingSheet.Rows[i - 1]["invoice_amt"].ToString();
                            ws.Cells["K" + count].Value = dtCodingSheet.Rows[i - 1]["reference"].ToString();
                            SetFontFormatData(SetThinBorder(ws.Cells["A" + count]), 12, true, ExcelHorizontalAlignment.Center);
                            SetFontFormatData(SetThinBorder(ws.Cells["B" + count]), 12, true, ExcelHorizontalAlignment.Center);
                            SetFontFormatData(SetThinBorder(ws.Cells["C" + count]), 12, true, ExcelHorizontalAlignment.Center);
                            SetFontFormatData(SetThinBorder(ws.Cells["D" + count]), 12, true, ExcelHorizontalAlignment.Center);
                            SetFontFormatData(SetThinBorder(ws.Cells["E" + count]), 12, true, ExcelHorizontalAlignment.Center);
                            SetFontFormatData(SetThinBorder(ws.Cells["F" + count]), 12, true, ExcelHorizontalAlignment.Center);
                            SetFontFormatData(SetThinBorder(ws.Cells["G" + count]), 12, true, ExcelHorizontalAlignment.Center);
                            SetFontFormatData(SetThinBorder(ws.Cells["H" + count]), 12, true, ExcelHorizontalAlignment.Center);
                            SetFontFormatData(SetThinBorder(ws.Cells["I" + count]), 12, true, ExcelHorizontalAlignment.Center);
                            SetFontFormatData(SetThinBorder(ws.Cells["J" + count]), 12, true, ExcelHorizontalAlignment.Center);
                            SetFontFormatData(SetThinBorder(ws.Cells["K" + count]), 12, true, ExcelHorizontalAlignment.Center);
                            SetThinBorder(ws.Cells["A" + count + ":" + "K" + count]);
                        }
                    }
                    rowCount += dtCodingSheet.Rows.Count;
                    rowCount += 1;
                    SetFontFormat(SetThickBorder(ws.Cells["A" + rowCount + ":K" + rowCount], "all"), 12, true, ExcelHorizontalAlignment.Right);
                    ws.Cells["A" + rowCount + ":K" + rowCount].Merge = true;
                    rowCount += 1;
                    ws.Row(rowCount).Height = 50;
                    ws.Cells["A" + rowCount].Value = "PMT TYPE";
                    ws.Cells["B" + rowCount].Value = "MANUAL \n CHECK NO.";
                    ws.Cells["B1:B" + rowCount].AutoFitColumns(35);
                    ws.Cells["B" + rowCount].Style.WrapText = true;
                    ws.Cells["C" + rowCount].Value = "MANUAL CHECK \n DATE OR DIRECT \n DEBIT DATE";
                    ws.Cells["C" + rowCount + "," + "D" + rowCount].AutoFitColumns(25);
                    ws.Cells["C" + rowCount].Style.WrapText = true;
                    ws.Cells["E" + rowCount].Value = "BANK STATEMENT NO.";
                    ws.Cells["G" + rowCount].Value = "CA";
                    ws.Cells["H" + rowCount].Value = "TOTAL CHECK/DEBIT \n AMT-CURRENCY OF PMT";
                    ws.Cells["H" + rowCount + "," + "I" + rowCount + "," + "J" + rowCount].AutoFitColumns(25);
                    ws.Cells["H" + rowCount].Style.WrapText = true;
                    ws.Cells["K" + rowCount].Value = "KID/RUC/Other";
                    ws.Cells["C" + rowCount + ":D" + rowCount].Merge = true;
                    ws.Cells["H" + rowCount + ":J" + rowCount].Merge = true;
                    // ws.Row(rowCount).Height = 50;

                    SetFontFormat(SetThinBorder(ws.Cells["A" + rowCount]), 12, true, ExcelHorizontalAlignment.Center);
                    SetFontFormat(SetThinBorder(ws.Cells["B" + rowCount]), 12, true, ExcelHorizontalAlignment.Center);
                    SetFontFormat(SetThinBorder(ws.Cells["C" + rowCount]), 12, true, ExcelHorizontalAlignment.Center);
                    SetFontFormat(SetThinBorder(ws.Cells["E" + rowCount]), 12, true, ExcelHorizontalAlignment.Center);
                    SetFontFormat(SetThinBorder(ws.Cells["G" + rowCount]), 12, true, ExcelHorizontalAlignment.Center);
                    SetFontFormat(SetThinBorder(ws.Cells["H" + rowCount]), 12, true, ExcelHorizontalAlignment.Center);
                    SetFontFormat(SetThinBorder(ws.Cells["K" + rowCount]), 12, true, ExcelHorizontalAlignment.Center);
                    SetThinBorder(ws.Cells["A" + rowCount + ":" + "K" + rowCount]);
                    if (dtInvoiceHeader.Rows.Count > 0)
                    {
                        rowCount += 1;
                        ws.Cells["A" + rowCount].Value = dtInvoiceHeader.Rows[0]["Pay_Group"].ToString();
                        ws.Cells["B" + rowCount].Value = dtInvoiceHeader.Rows[0]["CheckNumber"].ToString();
                        ws.Cells["C" + rowCount].Value = dtInvoiceHeader.Rows[0]["check_date"].ToString();
                        ws.Cells["E" + rowCount].Value = dtInvoiceHeader.Rows[0]["Bank_info"].ToString();
                        ws.Cells["H" + rowCount].Value = dtInvoiceHeader.Rows[0]["Check_amt_nbr"].ToString();
                        ws.Cells["K" + rowCount].Value = dtInvoiceHeader.Rows[0]["OtherReference"].ToString();
                        ws.Cells["C" + rowCount + ":D" + rowCount].Merge = true;
                        ws.Cells["H" + rowCount + ":J" + rowCount].Merge = true;
                        SetFontFormatData(SetThinBorder(ws.Cells["A" + rowCount + ",K" + rowCount + 1]), 12, true, ExcelHorizontalAlignment.Center);
                        SetFontFormatData(SetThinBorder(ws.Cells["A" + rowCount]), 12, true, ExcelHorizontalAlignment.Center);
                        SetFontFormatData(SetThinBorder(ws.Cells["B" + rowCount]), 12, true, ExcelHorizontalAlignment.Center);
                        SetFontFormatData(SetThinBorder(ws.Cells["C" + rowCount]), 12, true, ExcelHorizontalAlignment.Center);
                        SetFontFormatData(SetThinBorder(ws.Cells["E" + rowCount]), 12, true, ExcelHorizontalAlignment.Center);
                        SetFontFormatData(SetThinBorder(ws.Cells["G" + rowCount]), 12, true, ExcelHorizontalAlignment.Center);
                        SetFontFormatData(SetThinBorder(ws.Cells["H" + rowCount]), 12, true, ExcelHorizontalAlignment.Center);
                        SetFontFormatData(SetThinBorder(ws.Cells["K" + rowCount]), 12, true, ExcelHorizontalAlignment.Center);
                    }
                    SetThickBorder(ws.Cells["K1:K" + rowCount], "right");
                    SetThickBorder(ws.Cells["A" + rowCount + ":K" + rowCount], "bottom");
                    rowCount += 1;
                    SetThinBorder(ws.Cells["A" + rowCount + ":" + "K" + rowCount]);
                    ws.Cells["A" + rowCount].Value = "Flote Bill ID:" + dtInvoiceHeader.Rows[0]["invoice_id"].ToString();

                    ws.Cells[rowCount + 3, 2, rowCount + 3, 10].Merge = true;
                    ws.Cells[rowCount + 3, 2].Value = "Copyright ©" + DateTime.Now.Year.ToString() + ", United Parcel Service of America, Inc. All Rights Reserved. For internal use only.";
                    ws.Cells[rowCount + 4, 2, rowCount + 4, 10].Merge = true;
                    ws.Cells[rowCount + 4, 2].Value = "Source:  BIA Flote Coding Sheet";
                    SetFontFormat(ws.Cells[rowCount + 4, 2], 10, true, ExcelHorizontalAlignment.Center);
                    SetFontFormat(ws.Cells[rowCount + 3, 2], 10, true, ExcelHorizontalAlignment.Center);
                    ws.Cells.AutoFitColumns();
                    //pck.Save();

                    pck.SaveAs(ms);
                    //pck.SaveAs()
                    pck.Dispose();
                }
            }
            catch (Exception ex)
            {
                BIACore.Log.LogFactory.Exception(ex);
                return null;
            }
            //return targetPath;
            return ms;
        }
        public static DataTable GetRecords_Identifier_UserID(int Identifier, bool ShowErrors, bool IsExport, int start = 0, int limit = 9999, string sort = "", string errType = "", string userId = "System")
        {
            try
            {
                List<DBParameter> args = new List<DBParameter>();
                if (userId == "")
                {
                    userId = "System";
                }

                //SqlCommand sqlCom = new SqlCommand("dbo.usp_GetImportData", sqlCon);
                //sqlCom.CommandType = CommandType.StoredProcedure;
                args.Add(new DBParameter("@Identifier", DbType.AnsiString, Identifier));
                args.Add(new DBParameter("@UserID", DbType.AnsiString, userId));
                args.Add(new DBParameter("@Start", DbType.AnsiString, start));
                args.Add(new DBParameter("@Limit", DbType.AnsiString, limit));
                args.Add(new DBParameter("@ShowErrors", DbType.AnsiString, ShowErrors));
                args.Add(new DBParameter("@Export", DbType.AnsiString, IsExport));
                //if (!String.IsNullOrEmpty(sort))
                //    args.Add(new DBParameter("@sortList", DbType.AnsiString, sort));
                args.Add(new DBParameter("@errType", DbType.AnsiString, errType));
                //SqlDataAdapter Adapter = new SqlDataAdapter(sqlCom);
                //DataTable dt = new DataTable();
                //Adapter.Fill(dt);

                return SQL.Execute(Connections.Flote, "usp_GetImportData", args.ToArray()); ;

            }
            catch (Exception ex)
            {
                BIACore.Log.LogFactory.Exception(ex);
                if (System.Diagnostics.Debugger.IsAttached)
                    System.Diagnostics.Debugger.Break();
                return null;
            }
        }
        /// <summary>
        /// Format Numaber
        /// </summary>
        /// <param name="range"></param>
        /// <param name="digitsPastZero"></param>
        /// <param name="type"></param>
        /// <returns></returns>
        private static ExcelRange FormatNumber(ExcelRange range, int digitsPastZero, string type)
        {
            if (type == "Currency")
            {
                range.Style.Numberformat.Format = "$###,###,###,##0.";
                for (int i = 0; i < digitsPastZero; i++)
                {
                    range.Style.Numberformat.Format += "0";
                }
            }
            else if (type == "Percentage")
            {
                range.Style.Numberformat.Format = "0.00%";
            }
            else
            {
                range.Style.Numberformat.Format = "###,###,###,##0.";
                digitsPastZero = 2;
                for (int i = 0; i < digitsPastZero; i++)
                {
                    range.Style.Numberformat.Format += "0";
                }
            }

            return range;
        }
        /// <summary>
        /// Format Parcentage.
        /// </summary>
        /// <param name="range"></param>
        /// <returns></returns>
        private static ExcelRange FormatPercentage(ExcelRange range)
        {
            range.Style.Numberformat.Format = "0.00%";
            return range;
        }
        /// <summary>
        /// Set back ground color to cell.
        /// </summary>
        /// <param name="range"></param>
        /// <param name="color"></param>
        /// <returns></returns>
        private static ExcelRange SetBackgroundColor(ExcelRange range, Color color)
        {
            range.Style.Fill.PatternType = ExcelFillStyle.Solid;
            range.Style.Fill.BackgroundColor.SetColor(color);
            return range;
        }
        /// <summary>
        /// Set the thin border
        /// </summary>
        /// <param name="range"></param>
        /// <returns></returns>
        private static ExcelRange SetThinBorder(ExcelRange range)
        {
            range.Style.Border.BorderAround(ExcelBorderStyle.Thin);
            return range;
        }
        /// <summary>
        /// Set the thick border.
        /// </summary>
        /// <param name="range"></param>
        /// <param name="type"></param>
        /// <returns></returns>
        private static ExcelRange SetThickBorder(ExcelRange range, string type)
        {
            if (type == "all")
            {
                range.Style.Border.BorderAround(ExcelBorderStyle.Thick);
            }
            else if (type == "bottom")
            {
                range.Style.Border.Bottom.Style = ExcelBorderStyle.Thick;
            }
            else if (type == "top")
            {
                range.Style.Border.Top.Style = ExcelBorderStyle.Thick;
            }
            else if (type == "left")
            {
                range.Style.Border.Left.Style = ExcelBorderStyle.Thick;
            }
            else if (type == "right")
            {
                range.Style.Border.Right.Style = ExcelBorderStyle.Thick;
            }
            else
            {
                range.Style.Border.BorderAround(ExcelBorderStyle.Thick);
            }
            return range;
        }
        /// <summary>
        /// Set the Font format
        /// </summary>
        /// <param name="range"></param>
        /// <param name="FontSize"></param>
        /// <param name="Bold"></param>
        /// <param name="Alignment"></param>
        /// <returns></returns>
        private static ExcelRange SetFontFormat(ExcelRange range, int FontSize, bool Bold, ExcelHorizontalAlignment Alignment)
        {
            range.Style.Font.Size = FontSize;
            range.Style.Font.Bold = Bold;
            range.Style.HorizontalAlignment = Alignment;
            return range;
        }
        /// <summary>
        /// Set the cell alignment
        /// </summary>
        /// <param name="range"></param>        
        /// <param name="Alignment"></param>
        /// <returns></returns>
        private static ExcelRange SetAlignment(ExcelRange range, ExcelHorizontalAlignment Alignment)
        {
            range.Style.HorizontalAlignment = Alignment;
            return range;
        }
        /// <summary>
        /// Set font format to data field.
        /// </summary>
        /// <param name="range"></param>
        /// <param name="FontSize"></param>
        /// <param name="Bold"></param>
        /// <param name="Alignment"></param>
        /// <returns></returns>
        private static ExcelRange SetFontFormatData(ExcelRange range, int FontSize, bool Bold, ExcelHorizontalAlignment Alignment)
        {
            range.Style.Font.Size = FontSize;
            //range.Style.Font.Bold = Bold;
            range.Style.HorizontalAlignment = Alignment;
            return range;
        }
        /// <summary>
        /// Formart the number value for excel sheet.
        /// </summary>
        /// <param name="range"></param>
        /// <param name="type"></param>
        /// <returns></returns>
        private static ExcelRange FormatNumberValue(ExcelRange range, string type)
        {
            if (type == "Currency")
            {
                range.Style.Numberformat.Format = "$###,###,###,##0_);[Red]($###,###,###,##0)";

            }
            else if (type == "Number")
            {
                range.Style.Numberformat.Format = "###,###,###,##0_);[Red](###,###,###,##0)";
            }
            else
            {
                range.Style.Numberformat.Format = "###,###,###,##0.00_);[Red](###,###,###,##0.00)";
            }
            return range;
        }


    }
}
