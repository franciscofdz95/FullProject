/* ====================================================================================================
NAME:				[Coding Sheet Export]
BEHAVIOR:		Returns Export the coding sheet for selected Invoice.
_______________________________________________________________________________________________________
REVISION HISTORY
-------------------------------------------------------------------------------------------------------
Date			    Modified By			  Modifications
-------------------------------------------------------------------------------------------------------
08/31/2016        Sudhir Dandale		 Created.
 ======================================================================================================*/
using BIACore.Provider;
using System;
using System.Data;
using System.Drawing;
using System.IO;
using System.Net;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Text.RegularExpressions;
using System.Web.Http;
using System.Globalization;
using biafilter = Flote.WebAPI.WebAPI.Model;
using BIACore.Model;
using System.Collections.Generic;
using System.Text;
using System.Linq;
using System.ComponentModel;
using GemBox.Spreadsheet;
using GemExcelWorksheet = GemBox.Spreadsheet.ExcelWorksheet;
using BIACore.Log;

namespace Flote.WebAPI.WebAPI.Controller
{
    public partial class WebApiReportController
    {

        /// <summary>
        /// Format Parcentage.
        ///   Excel changes by Sriram Sundara
        /// </summary>
        /// <param name="value"></param>
        /// <returns>string</returns>
        private string FormatPercentage(string value)
        {
            return (decimal.Parse(value) / 100).ToString("P", CultureInfo.InvariantCulture);
        }
        /// <summary>
        /// Set the thin border
        /// </summary>
        /// <param name="range"></param>
        /// <returns></returns>
        private static AbstractRange SetThinBorder(AbstractRange range)
        {
            range.Style.Borders.SetBorders(MultipleBorders.All, Color.Black, LineStyle.Thin);
            return range;
        }
        /// <summary>
        /// Set the thick border.
        /// </summary>
        /// <param name="range"></param>
        /// <param name="type"></param>
        /// <returns></returns>
        private static AbstractRange SetThickBorder(AbstractRange range, string type)
        {
            if (type == "all")
            {
                range.Style.Borders.SetBorders(MultipleBorders.All, Color.Black, LineStyle.Thick);
            }
            else if (type == "bottom")
            {
                range.Style.Borders.SetBorders(MultipleBorders.Bottom, Color.Black, LineStyle.Thin);
            }
            else if (type == "top")
            {
                range.Style.Borders.SetBorders(MultipleBorders.Top, Color.Black, LineStyle.Thin);
            }
            else if (type == "left")
            {
                range.Style.Borders.SetBorders(MultipleBorders.Left, Color.Black, LineStyle.Thick);
            }
            else if (type == "right")
            {
                range.Style.Borders.SetBorders(MultipleBorders.Right, Color.Black, LineStyle.Thick);
            }
            else
            {
                range.Style.Borders.SetBorders(MultipleBorders.All, Color.Black, LineStyle.Thick);
            }
            range.Style.Font.Color = SpreadsheetColor.FromName(ColorName.Black);
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
        private static void SetFontFormat(AbstractRange range, int FontSize, bool Bold, HorizontalAlignmentStyle Alignment)
        {
            range.Style.Font.Color = SpreadsheetColor.FromName(ColorName.Black);
            range.Style.Font.Size = FontSize;
            if (Bold) { range.Style.Font.Weight = ExcelFont.BoldWeight; } else { range.Style.Font.Weight = ExcelFont.NormalWeight; }
            range.Style.HorizontalAlignment = Alignment;
        }

        private static void SetFontFormatBlueBold(AbstractRange range)
        {
            range.Style.Font.Color = SpreadsheetColor.FromName(ColorName.Black);
        }

        private static void SetFontFormatBlackBold(AbstractRange range)
        {
            range.Style.Font.Weight = GemBox.Spreadsheet.ExcelFont.BoldWeight;
            range.Style.Font.Color = SpreadsheetColor.FromName(ColorName.Black);
        }
        private static void SetFontFormatItalic(AbstractRange range, bool format)
        {
            range.Style.Font.Italic = format;
            range.Style.Font.Color = SpreadsheetColor.FromName(ColorName.Black);
        }
        /// <summary>
        /// Set the cell alignment
        /// </summary>
        /// <param name="range"></param>        
        /// <param name="Alignment"></param>
        /// <returns></returns>
        private static void SetAlignment(AbstractRange range, HorizontalAlignmentStyle Alignment)
        {
            range.Style.HorizontalAlignment = Alignment;
        }
        /// <summary>
        /// Set font format to data field.
        /// </summary>
        /// <param name="range"></param>
        /// <param name="FontSize"></param>
        /// <param name="Bold"></param>
        /// <param name="Alignment"></param>
        /// <returns></returns>
        private static void SetFontFormatData(AbstractRange range, int FontSize, HorizontalAlignmentStyle Alignment)
        {
            range.Style.Font.Size = FontSize;
            range.Style.Font.Color = SpreadsheetColor.FromName(ColorName.Black);
            range.Style.HorizontalAlignment = Alignment;
        }
        /// <summary>
        /// Bill Details Report.
        /// </summary>
        /// <param name="param"></param>
        /// <returns></returns>
        [HttpPost]
        [ActionName("BillDetailsReport")]
        public HttpResponseMessage BillDetailsReport([FromBody] biafilter.Filter param)
        {
            string templateFilePath = AppDomain.CurrentDomain.BaseDirectory + @"Export\" + "BillsDetailsReport.xlsx";

            var dCount = 0;
            var workBook = ExcelFile.Load(templateFilePath);
            HttpResponseMessage response = null;
            if (workBook != null && workBook.Worksheets.Count > 0)
            {
                switch (param.ExportType)
                {
                    case "PDF":
                        {
                            PrintBillDetailsReport(workBook.Worksheets["BillsDetailsReport"], param, ref dCount);
                            workBook.Worksheets[0].PrintOptions.FitToPage = true;
                            workBook.Worksheets[0].PrintOptions.TopMargin = 0.25;
                            workBook.Worksheets[0].PrintOptions.RightMargin = 0.25;
                            workBook.Worksheets[0].PrintOptions.LeftMargin = 0.25;
                            workBook.Worksheets[0].PrintOptions.BottomMargin = 0.25;
                            string pdfFileName = "BillsDetailsReport_" + param.InvoiceId + ".pdf";
                            Stream stream = new MemoryStream();
                            workBook.Save(stream, SaveOptions.PdfDefault);
                            response = new HttpResponseMessage(HttpStatusCode.OK) { Content = new StreamContent(stream) };
                            response.Content.Headers.ContentDisposition = new ContentDispositionHeaderValue("attachment") { FileName = pdfFileName };
                            response.Content.Headers.ContentType = new MediaTypeHeaderValue("application/pdf");
                            LogFactory.Message(string.Format("BillsDetailsReport Report and stream length is {0}", stream.Length));
                            break;
                        }
                    case "EXCEL":
                        {
                            PrintBillDetailsReport(workBook.Worksheets["BillsDetailsReport"], param, ref dCount);
                            string fileName = "BillsDetailsReport_" + param.InvoiceId + ".xlsx";
                            Stream stream = new MemoryStream();
                            workBook.Save(stream, SaveOptions.XlsxDefault);
                            response = new HttpResponseMessage(HttpStatusCode.OK) { Content = new StreamContent(stream) };
                            response.Content.Headers.ContentDisposition = new ContentDispositionHeaderValue("attachment") { FileName = fileName };
                            response.Content.Headers.ContentType = new MediaTypeHeaderValue("application/vnd.ms-excel");
                            LogFactory.Message(string.Format("BillsDetailsReport Report and stream length is {0}", stream.Length));
                            break;
                        }

                    default:
                        break;
                }
            }
            return response;

        }

        [HttpPost, HttpGet]
        [ActionName("OceanMBLExport")]
        public HttpResponseMessage OceanMBLExport([FromBody] biafilter.Filter param)
        {
            try
            {
                int dCount = 0;
                HttpResponseMessage response = new HttpResponseMessage(HttpStatusCode.OK);
                string filename = "OceanMBLExport_" + param.PageName + ".xls";
                StringBuilder str = new StringBuilder();
                str.Append(GenerateOceanMBL(param, ref dCount));
                response.Content = new StringContent(str.ToString());
                response.Content.Headers.ContentType = new MediaTypeHeaderValue("application/octet-stream");
                response.Content.Headers.ContentDisposition = new ContentDispositionHeaderValue("attachment");
                response.Content.Headers.ContentDisposition.FileName = filename.Replace(AppDomain.CurrentDomain.BaseDirectory + @"Export\", "");
                // Fix IE download issue over SSL with caching enabled.
                response.Headers.CacheControl = new CacheControlHeaderValue() { Private = true, MaxAge = new TimeSpan(0, 0, 0, 1) };
                response.Headers.Add("Pragma", "token");
                LogFactory.Export("excel", "api/WebAPIReport/OceanMBLExport", Newtonsoft.Json.JsonConvert.SerializeObject(param.ToDBParameter()), dCount, 11);
                return response;
            }
            catch (Exception ex)
            {
                LogFactory.Exception(ex);
                return null;
            }
        }

        [HttpPost, HttpGet]
        [ActionName("ShipmentDetailsExport")]
        ///<summary>
        ///</summary>
        public HttpResponseMessage ShipmentDetailsExport([FromBody] biafilter.Filter param)
        {
            try
            {
                var dCount = 0;
                var workBook = new ExcelFile();
                workBook.Worksheets.Add("ShipmentDetails");
                HttpResponseMessage response = null;
                if (workBook.Worksheets.Count > 0)
                {
                    GenerateShpDtlData(workBook.Worksheets["ShipmentDetails"], param, ref dCount);
                    workBook.Worksheets[0].PrintOptions.FitToPage = true;
                    string ExcelFileName = "ShipmentDetailsExport.xlsx";
                    Stream stream = new MemoryStream();
                    workBook.Save(stream, SaveOptions.XlsxDefault);
                    response = new HttpResponseMessage(HttpStatusCode.OK) { Content = new StreamContent(stream) };
                    response.Content.Headers.ContentDisposition = new ContentDispositionHeaderValue("attachment") { FileName = ExcelFileName };
                    response.Content.Headers.ContentType = new MediaTypeHeaderValue("application/vnd.ms-excel");
                    LogFactory.Message(string.Format("ShipmentDetailsExport Report and stream length is {0}", stream.Length));
                }
                return response;
            }
            catch (Exception ex)
            {
                BIACore.Log.LogFactory.Exception(ex);
                return null;
            }
        }
        /// <summary>
        /// Return Biggest Number.
        /// </summary>
        /// <param name="shpCnt"></param>
        /// <param name="containerCnt"></param>
        /// <param name="mblCnt"></param>
        /// <returns></returns>
        public int BiggestNum(int shpCnt, int containerCnt, int mblCnt)
        {


            if (shpCnt > containerCnt && shpCnt > mblCnt)
            {
                return shpCnt;
            }
            else if (containerCnt > shpCnt && containerCnt > mblCnt)
            {
                return containerCnt;
            }
            else
            {
                return mblCnt;
            }
        }

        /// <summary>
        /// Shipment Detail Excel workbook formatting  
        /// </summary>
        /// <param name="param"></param>
        /// <returns></returns>
        public string GenerateShpDtlData(GemExcelWorksheet ws, biafilter.Filter param, ref int dCount)
        {
            string targetPath = AppDomain.CurrentDomain.BaseDirectory + @"Export\" + "ShipDtlExport" + ".xlsx";
            int FontSize = 200;
            try
            {
                int hdrRowCount = 3;

                if (ws == null)
                {
                    return targetPath;
                }
                var dtShpSummary = SQL.Execute(Connections.Flote_Raw, DBConstants.GetShipmentSummary, new DBParameter("@shipment_number", DbType.AnsiString, param.ShipmentNumber));
                var dtCntSummary = SQL.Execute(Connections.Flote_Raw, DBConstants.GetContainerSummary, new DBParameter("@shipment_number", DbType.AnsiString, param.ShipmentNumber));
                var dtMBLSummary = SQL.Execute(Connections.Flote_Raw, DBConstants.GetMBLSummary, new DBParameter("@shipment_number", DbType.AnsiString, param.ShipmentNumber));
                List<DBParameter> args = new List<DBParameter>();

                args.Add(new DBParameter("@shipment_number", DbType.AnsiString, param.ShipmentNumber));
                args.Add(new DBParameter("@display_currency", DbType.AnsiString, param.DisplayCurr));
                args.Add(new DBParameter("@Export", DbType.AnsiString, 1));
                var dtShpDtl = SQL.Execute(Connections.Flote_Raw, DBConstants.GetShipmentDetails, args.ToArray());

                ws.PrintOptions.TopMargin = 0.5;
                ws.PrintOptions.BottomMargin = 0.5;
                ws.PrintOptions.LeftMargin = 0.25;
                ws.PrintOptions.RightMargin = 0.25;
                ws.PrintOptions.HeaderMargin = 0;
                ws.PrintOptions.FooterMargin = 0;
                ws.Cells.Style.Font.Name = "Calibri";
                ws.Cells.Style.Font.Size = FontSize;
                ws.Cells.Style.HorizontalAlignment = HorizontalAlignmentStyle.Left;
                ws.Cells.GetSubrange("A1:Q1").Merged = true; ws.Cells.GetSubrange("A2:B2").Merged = true; ws.Cells.GetSubrange("C2:H2").Merged = true; ws.Cells.GetSubrange("I2:R2").Merged = true;
                ws.Cells.GetSubrange("A4:A6").Merged = true; ws.Cells.GetSubrange("B4:B6").Merged = true;
                ws.Cells.GetSubrange("A7:A9").Merged = true; ws.Cells.GetSubrange("B7:B9").Merged = true;
                ws.Cells.GetSubrange("A10:A12").Merged = true; ws.Cells.GetSubrange("B10:B12").Merged = true;
                //Excel changes by Sriram Sundara

                ws.Cells.GetSubrange("A1:Q1").Style.WrapText = true; ws.Cells.GetSubrange("A2:Q2").Style.WrapText = true; ws.Cells.GetSubrange("C2:H2").Style.WrapText = true; ws.Cells.GetSubrange("I2:R2").Style.WrapText = true;
                ws.Cells.GetSubrange("A10:A12").Style.WrapText = true;
                //Excel changes by Sriram Sundara 
                int containerCnt = dtCntSummary.Rows.Count;
                int blankSpcContainer = 0;
                int blankSpcMBL = 0;
                int mblCnt = dtMBLSummary.Rows.Count;
                int rowCount = BiggestNum(13, containerCnt, mblCnt);
                int rowCountContainer = 0;
                if (containerCnt > 0)
                {
                    blankSpcContainer = containerCnt + 4; //4 is for headers 
                    rowCountContainer = blankSpcContainer; // Set RowCount based on the max count of container + header
                }
                else
                {
                    blankSpcContainer = 5;
                }
                if (mblCnt > 0)
                {
                    blankSpcMBL = mblCnt + 4; //4 is for headers 
                }
                else
                {
                    blankSpcMBL = 5;
                }

                rowCount = rowCountContainer > rowCount ? rowCountContainer : rowCount;

                if (!ws.Cells.GetSubrange("C" + blankSpcContainer + ":" + "H" + rowCount).IsAnyCellMerged) ws.Cells.GetSubrange("C" + blankSpcContainer + ":" + "H" + rowCount).Merged = true; //Column C ending at ContainerCount plus Header rows (4) until end of longest grid. 
                if (!ws.Cells.GetSubrange("I" + blankSpcMBL + ":" + "R" + rowCount).IsAnyCellMerged) ws.Cells.GetSubrange("I" + blankSpcMBL + ":" + "R" + rowCount).Merged = true; //Column C ending at MBl Count plus Header rows (4) until end of longest grid. 


                SetThinBorder(ws.Cells.GetSubrange("A1:Q1"));
                var shpHdr = "";
                if (dtShpDtl.Rows.Count > 0)
                {
                    shpHdr = "  TP:(" + dtShpDtl.Rows[0]["orig_tp"].ToString() + " to " + dtShpDtl.Rows[0]["dest_tp"].ToString() + " )   SC: " + dtShpDtl.Rows[0]["service_code"].ToString();
                }
                ws.Cells["A1"].Value = "Shipment Number: " + param.ShipmentNumber + shpHdr;
                ws.Cells["A2"].Value = "Customer";
                ws.Cells["C2"].Value = "Container Fact";
                SetFontFormat(SetThinBorder(ws.Cells["A1"]), FontSize, true, HorizontalAlignmentStyle.Left);
                SetFontFormat(SetThinBorder(ws.Cells.GetSubrange("A2:R2")), FontSize, true, HorizontalAlignmentStyle.Left);
                if (!ws.Cells.GetSubrange("E3:H4").IsAnyCellMerged) ws.Cells.GetSubrange("E3:H4").Merged = true;
                SetFontFormat(SetThinBorder(ws.Cells.GetSubrange("E3:H4")), FontSize, true, HorizontalAlignmentStyle.Left);
                ws.Cells["I2"].Value = "MBL Fact";
                ws.Cells["A3"].Value = "Group:";
                SetFontFormat(SetThinBorder(ws.Cells.GetSubrange("B3")), FontSize, false, HorizontalAlignmentStyle.Left);
                ws.Cells["A4"].Value = "Shipper:";
                ws.Cells["B4"].Style.WrapText = true;
                ws.Cells["A7"].Value = "Consignee:";
                ws.Cells["B7"].Style.WrapText = true;
                ws.Cells["A10"].Value = "Freight Payer:";
                if (dtShpSummary.Rows.Count > 0)
                {
                    ws.Cells["B3"].Value = dtShpSummary.Rows[0]["CUSTOMER_GROUP"].ToString();
                    ws.Cells["B4"].Value = dtShpSummary.Rows[0]["SH_ACCOUNT_NBR"].ToString() + "-" + dtShpSummary.Rows[0]["SH_NAME"].ToString() + "\n" + dtShpSummary.Rows[0]["SH_ADDRESS_ONE"].ToString() + "\n" +
                        dtShpSummary.Rows[0]["SH_CITY"].ToString() + " , " + dtShpSummary.Rows[0]["SH_STATE_CODE"].ToString() + " - " + dtShpSummary.Rows[0]["SH_POSTAL_CODE"].ToString() + " , " + dtShpSummary.Rows[0]["SH_COUNTRY_CODE"].ToString();

                    ws.Cells["B7"].Value = dtShpSummary.Rows[0]["CO_ACCOUNT_NBR"].ToString() + "-" + dtShpSummary.Rows[0]["CO_NAME"].ToString() + "\n" + dtShpSummary.Rows[0]["CO_ADDRESS_ONE"].ToString() + "\n" +
                        dtShpSummary.Rows[0]["CO_CITY"].ToString() + " , " + dtShpSummary.Rows[0]["CO_STATE_CODE"].ToString() + " - " + dtShpSummary.Rows[0]["CO_POSTAL_CODE"].ToString() + " , " + dtShpSummary.Rows[0]["CO_COUNTRY_CODE"].ToString();


                    ws.Cells["B10"].Value = dtShpSummary.Rows[0]["PAYOR_ACCOUNT_NBR"].ToString() + "-" + dtShpSummary.Rows[0]["PAYOR_NAME"].ToString() + "\n" + dtShpSummary.Rows[0]["FP_ADDRESS_ONE"].ToString() + "\n" +
                        dtShpSummary.Rows[0]["FP_CITY"].ToString() + " , " + dtShpSummary.Rows[0]["FP_STATE_CODE"].ToString() + " - " + dtShpSummary.Rows[0]["FP_POSTAL_CODE"].ToString() + " , " + dtShpSummary.Rows[0]["FP_COUNTRY_CODE"].ToString();
                }

                //Excel changes by Sriram Sundara


                //Excel changes by Sriram Sundara
                ws.Cells["C3"].Value = "Number";
                SetFontFormat(SetThinBorder(ws.Cells.GetSubrange("C3")), FontSize, true, HorizontalAlignmentStyle.Left);
                ws.Cells["D3"].Value = "Type";
                SetFontFormat(SetThinBorder(ws.Cells.GetSubrange("D3")), FontSize, true, HorizontalAlignmentStyle.Left);

                //Excel changes by Sriram Sundara
                SetFontFormat(SetThinBorder(ws.Cells.GetSubrange("A4:A6")), FontSize, true, HorizontalAlignmentStyle.Left);
                SetFontFormat(SetThinBorder(ws.Cells.GetSubrange("A7:A9")), FontSize, true, HorizontalAlignmentStyle.Left);
                SetFontFormat(SetThinBorder(ws.Cells.GetSubrange("A10:A12")), FontSize, true, HorizontalAlignmentStyle.Left);
                ws.Cells["A4"].Style.VerticalAlignment = ws.Cells["A7"].Style.VerticalAlignment = ws.Cells["A10"].Style.VerticalAlignment = VerticalAlignmentStyle.Top;
                ws.Cells["B4"].Style.VerticalAlignment = ws.Cells["B7"].Style.VerticalAlignment = ws.Cells["B10"].Style.VerticalAlignment = VerticalAlignmentStyle.Top;


                SetFontFormatData(SetThinBorder(ws.Cells.GetSubrange("B4:B6")), FontSize, HorizontalAlignmentStyle.Left);
                SetFontFormatData(SetThinBorder(ws.Cells.GetSubrange("B7:B9")), FontSize, HorizontalAlignmentStyle.Left);
                SetFontFormatData(SetThinBorder(ws.Cells.GetSubrange("B10:B12")), FontSize, HorizontalAlignmentStyle.Left);
                //Excel changes by Sriram Sundara

                if (dtCntSummary.Rows.Count > 0)
                {
                    for (int i = 1; i <= dtCntSummary.Rows.Count; i++)
                    {
                        int count = hdrRowCount + i;
                        ws.Cells["C" + count].Value = dtCntSummary.Rows[i - 1]["container_busid"].ToString();
                        ws.Cells["D" + count].Value = dtCntSummary.Rows[i - 1]["container_type"].ToString();
                        //Excel changes by Sriram Sundara
                        SetFontFormatData(SetThinBorder(ws.Cells.GetSubrange("C" + count)), FontSize, HorizontalAlignmentStyle.Left);
                        SetFontFormatData(SetThinBorder(ws.Cells.GetSubrange("D" + count)), FontSize, HorizontalAlignmentStyle.Left);
                        SetThinBorder(ws.Cells.GetSubrange("C" + count + ":" + "D" + count));
                    }
                }
                else
                {
                    ws.Cells["C4"].Value = "No Matches Found!";
                }

                //Excel changes by Sriram Sundara
                ws.Cells["I3"].Value = "MBL Number";
                SetFontFormat(SetThinBorder(ws.Cells.GetSubrange("I3")), FontSize, true, HorizontalAlignmentStyle.Left);
                ws.Cells["J3"].Value = "Mode";
                SetFontFormat(SetThinBorder(ws.Cells.GetSubrange("J3")), FontSize, true, HorizontalAlignmentStyle.Left);
                ws.Cells["K3"].Value = "E2K Carried Code";
                SetFontFormat(SetThinBorder(ws.Cells.GetSubrange("K3")), FontSize, true, HorizontalAlignmentStyle.Left);
                ws.Cells["L3"].Value = "Carrier BOL";
                SetFontFormat(SetThinBorder(ws.Cells.GetSubrange("L3")), FontSize, true, HorizontalAlignmentStyle.Left);
                ws.Cells["M3"].Value = "Depart Date";
                SetFontFormat(SetThinBorder(ws.Cells.GetSubrange("M3")), FontSize, true, HorizontalAlignmentStyle.Left);
                ws.Cells["N3"].Value = "MBL Origin";
                SetFontFormat(SetThinBorder(ws.Cells.GetSubrange("N3")), FontSize, true, HorizontalAlignmentStyle.Left);
                ws.Cells["O3"].Value = "MBL Destination";
                SetFontFormat(SetThinBorder(ws.Cells.GetSubrange("O3")), FontSize, true, HorizontalAlignmentStyle.Left);
                ws.Cells["P3"].Value = "Cost Basis Code";
                SetFontFormat(SetThinBorder(ws.Cells.GetSubrange("P3")), FontSize, true, HorizontalAlignmentStyle.Left);
                ws.Cells["Q3"].Value = "Total MBL Cost USD";
                SetFontFormat(SetThinBorder(ws.Cells.GetSubrange("Q3")), FontSize, true, HorizontalAlignmentStyle.Left);
                ws.Cells["R3"].Value = "Closed Date";
                SetFontFormat(SetThinBorder(ws.Cells.GetSubrange("R3")), FontSize, true, HorizontalAlignmentStyle.Left);

                //Excel changes by Sriram Sundara


                if (dtMBLSummary.Rows.Count > 0)
                {
                    for (int i = 1; i <= dtMBLSummary.Rows.Count; i++)
                    {
                        int count = hdrRowCount + i;
                        ws.Cells["I" + count].Value = dtMBLSummary.Rows[i - 1]["mbl_nbr"].ToString();
                        ws.Cells["J" + count].Value = dtMBLSummary.Rows[i - 1]["mode"].ToString();
                        ws.Cells["K" + count].Value = dtMBLSummary.Rows[i - 1]["vendor_code"].ToString();
                        ws.Cells["L" + count].Value = dtMBLSummary.Rows[i - 1]["carrier_bol"].ToString();
                        DateTime? departDate = (DateTime)dtMBLSummary.Rows[i - 1]["mbl_depart_date"];
                        ws.Cells["M" + count].Value = departDate.Value.ToString("MM/dd/yyyy");
                        ws.Cells["N" + count].Value = dtMBLSummary.Rows[i - 1]["orig_tp"].ToString();
                        ws.Cells["O" + count].Value = dtMBLSummary.Rows[i - 1]["dest_tp"].ToString();
                        ws.Cells["P" + count].Value = dtMBLSummary.Rows[i - 1]["mbl_cost_basis"].ToString();

                        string buyUSD = dtMBLSummary.Rows[i - 1]["Total_buy_USD"].ToString();
                        if (buyUSD == "")
                        {
                            ws.Cells["Q" + count].Value = dtMBLSummary.Rows[i - 1]["Total_buy_USD"].ToString();
                        }
                        else
                        {
                            ws.Cells["Q" + count].Value = String.Format("{0:n}", Math.Round(Convert.ToDecimal(buyUSD), 2));
                        }
                        DateTime? closedDate = (DateTime)dtMBLSummary.Rows[i - 1]["mbl_closed_date"];
                        ws.Cells["R" + count].Value = closedDate.Value.ToString("MM/dd/yyyy");

                        //Excel changes by Sriram Sundara
                        SetFontFormatData(SetThinBorder(ws.Cells.GetSubrange("I" + count)), FontSize, HorizontalAlignmentStyle.Left);
                        SetFontFormatData(SetThinBorder(ws.Cells.GetSubrange("J" + count)), FontSize, HorizontalAlignmentStyle.Left);
                        SetFontFormatData(SetThinBorder(ws.Cells.GetSubrange("K" + count)), FontSize, HorizontalAlignmentStyle.Left);
                        SetFontFormatData(SetThinBorder(ws.Cells.GetSubrange("L" + count)), FontSize, HorizontalAlignmentStyle.Left);
                        SetFontFormatData(SetThinBorder(ws.Cells.GetSubrange("M" + count)), FontSize, HorizontalAlignmentStyle.Left);
                        SetFontFormatData(SetThinBorder(ws.Cells.GetSubrange("N" + count)), FontSize, HorizontalAlignmentStyle.Left);
                        SetFontFormatData(SetThinBorder(ws.Cells.GetSubrange("O" + count)), FontSize, HorizontalAlignmentStyle.Left);
                        SetFontFormatData(SetThinBorder(ws.Cells.GetSubrange("P" + count)), FontSize, HorizontalAlignmentStyle.Left);
                        SetFontFormatData(SetThinBorder(ws.Cells.GetSubrange("Q" + count)), FontSize, HorizontalAlignmentStyle.Left);
                        SetFontFormatData(SetThinBorder(ws.Cells.GetSubrange("R" + count)), FontSize, HorizontalAlignmentStyle.Left);
                        //Excel changes by Sriram Sundara
                        SetThinBorder(ws.Cells.GetSubrange("I" + count + ":" + "R" + count));
                    }
                }
                else
                {
                    ws.Cells["I4"].Value = "No Matches Found!";
                }
                int beginHdrCnt = rowCount + 1;
                rowCount += 3;
                if (!ws.Cells.GetSubrange("A" + beginHdrCnt + ":" + "A" + rowCount).IsAnyCellMerged) ws.Cells.GetSubrange("A" + beginHdrCnt + ":" + "A" + rowCount).Merged = true; ws.Cells.GetSubrange("B" + beginHdrCnt + ":" + "B" + rowCount).Merged = true; ws.Cells.GetSubrange("C" + beginHdrCnt + ":" + "C" + rowCount).Merged = true;
                if (!ws.Cells.GetSubrange("D" + beginHdrCnt + ":" + "D" + rowCount).IsAnyCellMerged) ws.Cells.GetSubrange("D" + beginHdrCnt + ":" + "D" + rowCount).Merged = true; ws.Cells.GetSubrange("E" + beginHdrCnt + ":" + "E" + rowCount).Merged = true; ws.Cells.GetSubrange("F" + beginHdrCnt + ":" + "F" + rowCount).Merged = true;
                if (!ws.Cells.GetSubrange("G" + beginHdrCnt + ":" + "G" + rowCount).IsAnyCellMerged) ws.Cells.GetSubrange("G" + beginHdrCnt + ":" + "G" + rowCount).Merged = true; ws.Cells.GetSubrange("H" + beginHdrCnt + ":" + "H" + rowCount).Merged = true; ws.Cells.GetSubrange("I" + beginHdrCnt + ":" + "I" + rowCount).Merged = true;
                if (!ws.Cells.GetSubrange("J" + beginHdrCnt + ":" + "J" + rowCount).IsAnyCellMerged) ws.Cells.GetSubrange("J" + beginHdrCnt + ":" + "J" + rowCount).Merged = true; ws.Cells.GetSubrange("K" + beginHdrCnt + ":" + "K" + rowCount).Merged = true; ws.Cells.GetSubrange("L" + beginHdrCnt + ":" + "L" + rowCount).Merged = true;
                if (!ws.Cells.GetSubrange("M" + beginHdrCnt + ":" + "M" + rowCount).IsAnyCellMerged) ws.Cells.GetSubrange("M" + beginHdrCnt + ":" + "M" + rowCount).Merged = true; ws.Cells.GetSubrange("N" + beginHdrCnt + ":" + "N" + rowCount).Merged = true; ws.Cells.GetSubrange("O" + beginHdrCnt + ":" + "O" + rowCount).Merged = true;
                if (!ws.Cells.GetSubrange("P" + beginHdrCnt + ":" + "P" + rowCount).IsAnyCellMerged) ws.Cells.GetSubrange("P" + beginHdrCnt + ":" + "P" + rowCount).Merged = true; ws.Cells.GetSubrange("Q" + beginHdrCnt + ":" + "Q" + rowCount).Merged = true;
                ws.Cells["A" + beginHdrCnt].Value = "Location";
                ws.Cells["B" + beginHdrCnt].Value = "Row Type";
                ws.Cells["C" + beginHdrCnt].Value = "Status";
                ws.Cells["D" + beginHdrCnt].Value = "Vendor Code";
                ws.Cells["E" + beginHdrCnt].Value = "MBL \n Number";
                ws.Cells["F" + beginHdrCnt].Value = "Charge Code";
                ws.Cells["G" + beginHdrCnt].Value = "Charge Desc";
                ws.Cells["H" + beginHdrCnt].Value = "Charge Split";
                ws.Cells["I" + beginHdrCnt].Value = "Rev Top \n Ind";
                ws.Cells["J" + beginHdrCnt].Value = "Sell \n Amount";
                ws.Cells["K" + beginHdrCnt].Value = "Sell \n Curr.";
                //Excel changes by Sriram Sundara
                ws.Cells["L" + beginHdrCnt].Value = string.Format("Sell \n Amt \n ({0})", param.DisplayCurr);
                ws.Cells["M" + beginHdrCnt].Value = "Buy \n Amount";
                ws.Cells["N" + beginHdrCnt].Value = "Buy \n Curr";

                //Excel changes by Sriram Sundara

                ws.Cells["O" + beginHdrCnt].Value = string.Format("Buy \n Amt \n ({0})", param.DisplayCurr);
                ws.Cells["P" + beginHdrCnt].Value = string.Format("Margin \n Amt \n ({0})", param.DisplayCurr);
                ws.Cells["Q" + beginHdrCnt].Value = "Margin \n Pct ";


                ws.Cells["D" + beginHdrCnt].Style.WrapText = true;
                ws.Cells["E" + beginHdrCnt].Style.WrapText = true;
                ws.Cells["F" + beginHdrCnt].Style.WrapText = true;
                ws.Cells["G" + beginHdrCnt].Style.WrapText = true;
                ws.Cells["H" + beginHdrCnt].Style.WrapText = true;
                ws.Cells["I" + beginHdrCnt].Style.WrapText = true;
                ws.Cells["J" + beginHdrCnt].Style.WrapText = true;
                ws.Cells["K" + beginHdrCnt].Style.WrapText = true;
                ws.Cells["L" + beginHdrCnt].Style.WrapText = true;
                ws.Cells["N" + beginHdrCnt].Style.WrapText = true;
                ws.Cells["O" + beginHdrCnt].Style.WrapText = true;
                ws.Cells["P" + beginHdrCnt].Style.WrapText = true;
                ws.Cells["Q" + beginHdrCnt].Style.WrapText = true;



                SetFontFormat(SetThinBorder(ws.Cells.GetSubrange("A" + beginHdrCnt + ":" + "A" + rowCount)), FontSize, true, HorizontalAlignmentStyle.Left);
                SetFontFormat(SetThinBorder(ws.Cells.GetSubrange("B" + beginHdrCnt + ":" + "B" + rowCount)), FontSize, true, HorizontalAlignmentStyle.Left);
                SetFontFormat(SetThinBorder(ws.Cells.GetSubrange("C" + beginHdrCnt + ":" + "C" + rowCount)), FontSize, true, HorizontalAlignmentStyle.Left);
                SetFontFormat(SetThinBorder(ws.Cells.GetSubrange("D" + beginHdrCnt + ":" + "D" + rowCount)), FontSize, true, HorizontalAlignmentStyle.Left);
                SetFontFormat(SetThinBorder(ws.Cells.GetSubrange("E" + beginHdrCnt + ":" + "E" + rowCount)), FontSize, true, HorizontalAlignmentStyle.Left);
                SetFontFormat(SetThinBorder(ws.Cells.GetSubrange("F" + beginHdrCnt + ":" + "F" + rowCount)), FontSize, true, HorizontalAlignmentStyle.Left);
                SetFontFormat(SetThinBorder(ws.Cells.GetSubrange("G" + beginHdrCnt + ":" + "G" + rowCount)), FontSize, true, HorizontalAlignmentStyle.Left);
                SetFontFormat(SetThinBorder(ws.Cells.GetSubrange("H" + beginHdrCnt + ":" + "H" + rowCount)), FontSize, true, HorizontalAlignmentStyle.Left);
                SetFontFormat(SetThinBorder(ws.Cells.GetSubrange("I" + beginHdrCnt + ":" + "I" + rowCount)), FontSize, true, HorizontalAlignmentStyle.Left);
                SetFontFormat(SetThinBorder(ws.Cells.GetSubrange("J" + beginHdrCnt + ":" + "J" + rowCount)), FontSize, true, HorizontalAlignmentStyle.Left);
                SetFontFormat(SetThinBorder(ws.Cells.GetSubrange("K" + beginHdrCnt + ":" + "K" + rowCount)), FontSize, true, HorizontalAlignmentStyle.Left);
                SetFontFormat(SetThinBorder(ws.Cells.GetSubrange("L" + beginHdrCnt + ":" + "L" + rowCount)), FontSize, true, HorizontalAlignmentStyle.Left);
                SetFontFormat(SetThinBorder(ws.Cells.GetSubrange("M" + beginHdrCnt + ":" + "M" + rowCount)), FontSize, true, HorizontalAlignmentStyle.Left);
                SetFontFormat(SetThinBorder(ws.Cells.GetSubrange("N" + beginHdrCnt + ":" + "N" + rowCount)), FontSize, true, HorizontalAlignmentStyle.Left);
                SetFontFormat(SetThinBorder(ws.Cells.GetSubrange("O" + beginHdrCnt + ":" + "O" + rowCount)), FontSize, true, HorizontalAlignmentStyle.Left);
                SetFontFormat(SetThinBorder(ws.Cells.GetSubrange("P" + beginHdrCnt + ":" + "P" + rowCount)), FontSize, true, HorizontalAlignmentStyle.Left);
                SetFontFormat(SetThinBorder(ws.Cells.GetSubrange("Q" + beginHdrCnt + ":" + "Q" + rowCount)), FontSize, true, HorizontalAlignmentStyle.Left);

                //Excel changes by Sriram Sundara


                var type = "";

                if (dtShpDtl.Rows.Count > 0)
                {
                    int count = 0;
                    int rowNoCount = 0;
                    for (int i = 1; i <= dtShpDtl.Rows.Count; i++)
                    {
                        count = rowCount + i;
                        string buyAmount = dtShpDtl.Rows[i - 1]["buy_amt"].ToString();
                        string sellAmount = dtShpDtl.Rows[i - 1]["sell_amt"].ToString();
                        float sellAmountValue = 0, buyAmountValue = 0, buyUSDValue = 0, sellUSDValue = 0, marginAmountValue = 0, marginPercentageValue = 0;
                        if (sellAmount != "" && sellAmount != null) { sellAmountValue = float.Parse(sellAmount); } else { sellAmountValue = 0; }
                        if (buyAmount != "" && buyAmount != null) { buyAmountValue = float.Parse(buyAmount); } else { buyAmountValue = 0; }
                        string buyUSD = dtShpDtl.Rows[i - 1]["buy_usd"].ToString();
                        if (buyUSD != "" && buyUSD != null) { buyUSDValue = float.Parse(buyUSD); } else { buyUSDValue = 0; }
                        string sellUSD = dtShpDtl.Rows[i - 1]["sell_usd"].ToString();
                        if (sellUSD != "" && sellUSD != null) { sellUSDValue = float.Parse(sellUSD); } else { sellUSDValue = 0; }
                        string marginAmount = dtShpDtl.Rows[i - 1]["margin_amt"].ToString();
                        if (marginAmount != "" && marginAmount != null) { marginAmountValue = float.Parse(marginAmount); } else { marginAmountValue = 0; }
                        string marginPercentage = dtShpDtl.Rows[i - 1]["margin_per"].ToString();
                        if (marginPercentage != "" && marginPercentage != null) { marginPercentageValue = float.Parse(marginPercentage); } else { marginPercentageValue = 0; }

                        if (int.TryParse(dtShpDtl.Rows[i - 1]["Container_Alloc"].ToString(), out int ca)
                            && !(int.TryParse(dtShpDtl.Rows[i - 1]["invoice_detail_id"].ToString(), out int id))
                            && (int.Parse(dtShpDtl.Rows[i - 1]["Container_Alloc"].ToString()) > 0))
                        {
                            SetFontFormatBlueBold(ws.Cells.GetSubrange("M" + count + ":" + "M" + count));
                            SetFontFormatBlueBold(ws.Cells.GetSubrange("O" + count + ":" + "O" + count));
                        }
                        else if (int.TryParse(dtShpDtl.Rows[i - 1]["invoice_detail_id"].ToString(), out int idd)
                                && (int.Parse(dtShpDtl.Rows[i - 1]["invoice_detail_id"].ToString()) > 0))
                        {
                            SetFontFormatBlackBold(ws.Cells.GetSubrange("M" + count + ":" + "M" + count));
                            SetFontFormatBlackBold(ws.Cells.GetSubrange("O" + count + ":" + "O" + count));
                        }
                        else if (int.TryParse(dtShpDtl.Rows[i - 1]["mbl_fk"].ToString(), out int mbl) &&
                        (int.Parse(dtShpDtl.Rows[i - 1]["mbl_fk"].ToString()) > 0))
                        {
                            SetFontFormatItalic(ws.Cells.GetSubrange("M" + count + ":" + "M" + count), true);
                            SetFontFormatItalic(ws.Cells.GetSubrange("O" + count + ":" + "O" + count), true);
                        }

                        if (type != dtShpDtl.Rows[i - 1]["type"].ToString() && dtShpDtl.Rows[i - 1]["prec"].ToString() == "1")
                        {
                            ws.Cells["A" + count].Value = dtShpDtl.Rows[i - 1]["type"].ToString();
                            ws.Cells.GetSubrange("A" + count + ":" + "Q" + count).Merged = true;
                            count++; rowCount++;
                            ws.Cells["A" + count].Value = dtShpDtl.Rows[i - 1]["location_code"].ToString();
                            ws.Cells["B" + count].Value = dtShpDtl.Rows[i - 1]["rowtype"].ToString();
                            ws.Cells["C" + count].Value = dtShpDtl.Rows[i - 1]["CHARGE_STATUS"].ToString();
                            ws.Cells["D" + count].Value = dtShpDtl.Rows[i - 1]["vendor_name"].ToString();
                            ws.Cells["E" + count].Value = dtShpDtl.Rows[i - 1]["mbl_nbr"].ToString();
                            ws.Cells["F" + count].Value = dtShpDtl.Rows[i - 1]["charge_code"].ToString();
                            ws.Cells["G" + count].Value = dtShpDtl.Rows[i - 1]["CHARGE_DESCRIPTION"].ToString();
                            ws.Cells["H" + count].Value = dtShpDtl.Rows[i - 1]["rev_split"].ToString();
                            ws.Cells["I" + count].Value = dtShpDtl.Rows[i - 1]["intl_ahl_topline_ind"].ToString();

                            if (sellAmountValue == 0)
                            {
                                ws.Cells["J" + count].Value = sellAmountValue;
                            }
                            else if (sellAmountValue > 0 && sellAmountValue <= 999)
                            {
                                ws.Cells["J" + count].Value = Math.Round(Convert.ToDecimal(sellAmount), 2).ToString();
                            }
                            else
                            {
                                ws.Cells["J" + count].Value = String.Format("{0:n}", Math.Round(Convert.ToDecimal(sellAmountValue), 2));
                            }

                            ws.Cells["K" + count].Value = dtShpDtl.Rows[i - 1]["sell_cid"].ToString();

                            if (sellUSDValue == 0)
                            {
                                ws.Cells["L" + count].Value = sellUSDValue;
                            }
                            else if (sellUSDValue >= 0 && sellUSDValue <= 999)
                            {
                                ws.Cells["L" + count].Value = Math.Round(Convert.ToDecimal(sellUSD), 2).ToString();
                            }
                            else
                            {
                                ws.Cells["L" + count].Value = String.Format("{0:n}", Math.Round(Convert.ToDecimal(sellUSD), 2));
                            }

                            if (buyAmountValue == 0)
                            {
                                ws.Cells["M" + count].Value = buyAmountValue;
                            }
                            else if (buyAmountValue >= 0 && buyAmountValue <= 999)
                            {
                                ws.Cells["M" + count].Value = Math.Round(Convert.ToDecimal(buyAmount), 2).ToString();
                            }
                            else
                            {
                                ws.Cells["M" + count].Value = String.Format("{0:n}", Math.Round(Convert.ToDecimal(buyAmount), 2));

                            }
                            ws.Cells["N" + count].Value = dtShpDtl.Rows[i - 1]["buy_cid"].ToString();
                            if (buyUSDValue == 0)
                            {
                                ws.Cells["O" + count].Value = buyUSDValue;
                            }
                            else if (buyUSDValue >= 0 && buyUSDValue <= 999)
                            {
                                ws.Cells["O" + count].Value = Math.Round(Convert.ToDecimal(buyUSD), 2).ToString();
                            }
                            else
                            {
                                ws.Cells["O" + count].Value = String.Format("{0:n}", Math.Round(Convert.ToDecimal(buyUSD), 2));
                            }
                            if (marginAmountValue == 0)
                            {
                                ws.Cells["P" + count].Value = marginAmountValue;
                            }
                            else if (marginAmountValue >= 0 && marginAmountValue <= 999)
                            {
                                ws.Cells["P" + count].Value = dtShpDtl.Rows[i - 1]["margin_amt"].ToString();
                            }
                            else
                            {
                                ws.Cells["P" + count].Value = String.Format("{0:n}", Math.Round(Convert.ToDecimal(marginAmount), 2));
                            }

                            //Excel changes by Sriram Sundara
                            if (marginPercentageValue == 0)
                            {
                                ws.Cells["Q" + count].Value = marginPercentageValue;
                            }
                            else
                            {
                                ws.Cells["Q" + count].Value = FormatPercentage(dtShpDtl.Rows[i - 1]["margin_per"].ToString());
                            }

                            SetFontFormatData(SetThinBorder(ws.Cells.GetSubrange("A" + count)), FontSize, HorizontalAlignmentStyle.Left);
                            SetFontFormatData(SetThinBorder(ws.Cells.GetSubrange("B" + count)), FontSize, HorizontalAlignmentStyle.Left);
                            SetFontFormatData(SetThinBorder(ws.Cells.GetSubrange("C" + count)), FontSize, HorizontalAlignmentStyle.Left);
                            SetFontFormatData(SetThinBorder(ws.Cells.GetSubrange("D" + count)), FontSize, HorizontalAlignmentStyle.Left);
                            SetFontFormatData(SetThinBorder(ws.Cells.GetSubrange("E" + count)), FontSize, HorizontalAlignmentStyle.Left);
                            SetFontFormatData(SetThinBorder(ws.Cells.GetSubrange("F" + count)), FontSize, HorizontalAlignmentStyle.Right);
                            SetFontFormatData(SetThinBorder(ws.Cells.GetSubrange("G" + count)), FontSize, HorizontalAlignmentStyle.Left);
                            SetFontFormatData(SetThinBorder(ws.Cells.GetSubrange("H" + count)), FontSize, HorizontalAlignmentStyle.Left);
                            SetFontFormatData(SetThinBorder(ws.Cells.GetSubrange("I" + count)), FontSize, HorizontalAlignmentStyle.Left);
                            SetFontFormatData(SetThinBorder(ws.Cells.GetSubrange("J" + count)), FontSize, HorizontalAlignmentStyle.Right);
                            SetFontFormatData(SetThinBorder(ws.Cells.GetSubrange("K" + count)), FontSize, HorizontalAlignmentStyle.Left);
                            SetFontFormatData(SetThinBorder(ws.Cells.GetSubrange("L" + count)), FontSize, HorizontalAlignmentStyle.Right);
                            SetFontFormatData(SetThinBorder(ws.Cells.GetSubrange("M" + count)), FontSize, HorizontalAlignmentStyle.Right);
                            SetFontFormatData(SetThinBorder(ws.Cells.GetSubrange("N" + count)), FontSize, HorizontalAlignmentStyle.Right);
                            SetFontFormatData(SetThinBorder(ws.Cells.GetSubrange("O" + count)), FontSize, HorizontalAlignmentStyle.Right);
                            SetFontFormatData(SetThinBorder(ws.Cells.GetSubrange("P" + count)), FontSize, HorizontalAlignmentStyle.Right);
                            SetFontFormatData(SetThinBorder(ws.Cells.GetSubrange("Q" + count)), FontSize, HorizontalAlignmentStyle.Right);
                            rowNoCount++;

                        }
                        else
                        {
                            if (dtShpDtl.Rows[i - 1]["prec"].ToString() != "1")
                            {
                                ws.Cells["A" + count].Value = dtShpDtl.Rows[i - 1]["type"].ToString();
                                ws.Cells.GetSubrange("A" + count + ":" + "K" + count).Merged = true;
                                if (dtShpDtl.Rows[i - 1]["sell_usd"].ToString() == "")
                                { ws.Cells["L" + count].Value = dtShpDtl.Rows[i - 1]["sell_usd"].ToString(); }
                                else
                                {
                                    ws.Cells["L" + count].Value = String.Format("{0:n}", Math.Round(Convert.ToDecimal(dtShpDtl.Rows[i - 1]["sell_usd"]), 2));
                                }
                                ws.Cells["M" + count].Value = "";
                                ws.Cells.GetSubrange("M" + count + ":" + "N" + count).Merged = true;
                                if (dtShpDtl.Rows[i - 1]["buy_usd"].ToString() == "")
                                {
                                    ws.Cells["O" + count].Value = dtShpDtl.Rows[i - 1]["buy_usd"].ToString();
                                }
                                else
                                {
                                    ws.Cells["O" + count].Value = String.Format("{0:n}", Math.Round(Convert.ToDecimal(dtShpDtl.Rows[i - 1]["buy_usd"]), 2));
                                }
                                if (dtShpDtl.Rows[i - 1]["margin_amt"].ToString() == "")
                                {
                                    ws.Cells["P" + count].Value = dtShpDtl.Rows[i - 1]["margin_amt"].ToString();
                                }
                                else
                                {
                                    ws.Cells["P" + count].Value = String.Format("{0:n}", Math.Round(Convert.ToDecimal(dtShpDtl.Rows[i - 1]["margin_amt"]), 2));
                                }
                                ws.Cells["Q" + count].Value = FormatPercentage(dtShpDtl.Rows[i - 1]["margin_per"].ToString());

                                //Excel changes by Sriram Sundara
                                SetFontFormatData(SetThinBorder(ws.Cells.GetSubrange("L" + count)), FontSize, HorizontalAlignmentStyle.Right);
                                SetFontFormatData(SetThinBorder(ws.Cells.GetSubrange("O" + count)), FontSize, HorizontalAlignmentStyle.Right);
                                SetFontFormatData(SetThinBorder(ws.Cells.GetSubrange("P" + count)), FontSize, HorizontalAlignmentStyle.Right);
                                SetFontFormatData(SetThinBorder(ws.Cells.GetSubrange("Q" + count)), FontSize, HorizontalAlignmentStyle.Right);
                                //Excel changes by Sriram Sundara

                            }
                            else
                            {
                                ws.Cells["A" + count].Value = dtShpDtl.Rows[i - 1]["location_code"].ToString();
                                ws.Cells["B" + count].Value = dtShpDtl.Rows[i - 1]["rowtype"].ToString();
                                ws.Cells["C" + count].Value = dtShpDtl.Rows[i - 1]["CHARGE_STATUS"].ToString();
                                ws.Cells["D" + count].Value = dtShpDtl.Rows[i - 1]["vendor_name"].ToString();
                                ws.Cells["E" + count].Value = dtShpDtl.Rows[i - 1]["mbl_nbr"].ToString();
                                ws.Cells["F" + count].Value = dtShpDtl.Rows[i - 1]["charge_code"].ToString();
                                ws.Cells["G" + count].Value = dtShpDtl.Rows[i - 1]["CHARGE_DESCRIPTION"].ToString();
                                ws.Cells["H" + count].Value = dtShpDtl.Rows[i - 1]["rev_split"].ToString();
                                ws.Cells["I" + count].Value = dtShpDtl.Rows[i - 1]["intl_ahl_topline_ind"].ToString();

                                if (sellAmountValue == 0)
                                {
                                    ws.Cells["J" + count].Value = sellAmountValue;
                                }
                                else if (sellAmountValue >= 0 && sellAmountValue <= 999)
                                {
                                    ws.Cells["J" + count].Value = Math.Round(Convert.ToDecimal(sellAmount), 2).ToString();
                                }
                                else
                                {
                                    ws.Cells["J" + count].Value = String.Format("{0:n}", Math.Round(Convert.ToDecimal(sellAmount), 2));
                                }

                                ws.Cells["K" + count].Value = dtShpDtl.Rows[i - 1]["sell_cid"].ToString();

                                if (sellUSDValue == 0)
                                {
                                    ws.Cells["L" + count].Value = sellUSDValue;
                                }
                                else if (sellUSDValue >= 0 && sellUSDValue <= 999)
                                {
                                    ws.Cells["L" + count].Value = Math.Round(Convert.ToDecimal(sellUSD), 2).ToString();
                                }
                                else
                                {
                                    ws.Cells["L" + count].Value = String.Format("{0:n}", Math.Round(Convert.ToDecimal(sellUSD), 2));
                                }
                                if (buyAmountValue == 0)
                                {
                                    ws.Cells["M" + count].Value = buyAmountValue;
                                }
                                else if (buyAmountValue >= 0 && buyAmountValue <= 999)
                                {
                                    ws.Cells["M" + count].Value = Math.Round(Convert.ToDecimal(buyAmount), 2).ToString();
                                }
                                else
                                {
                                    ws.Cells["M" + count].Value = String.Format("{0:n}", Math.Round(Convert.ToDecimal(buyAmount), 2));

                                }

                                ws.Cells["N" + count].Value = dtShpDtl.Rows[i - 1]["buy_cid"].ToString();

                                if (buyUSDValue == 0)
                                {
                                    ws.Cells["O" + count].Value = buyUSDValue;
                                }
                                else if (buyUSDValue >= 0 && buyUSDValue <= 999)
                                {
                                    ws.Cells["O" + count].Value = Math.Round(Convert.ToDecimal(buyUSD), 2).ToString();
                                }
                                else
                                {
                                    ws.Cells["O" + count].Value = String.Format("{0:n}", Math.Round(Convert.ToDecimal(buyUSD), 2));
                                }

                                if (marginAmountValue == 0)
                                {
                                    ws.Cells["P" + count].Value = marginAmountValue;
                                }
                                else if (marginAmountValue >= 0 && marginAmountValue <= 999)
                                {
                                    ws.Cells["P" + count].Value = dtShpDtl.Rows[i - 1]["margin_amt"].ToString();
                                }
                                else
                                {
                                    ws.Cells["P" + count].Value = String.Format("{0:n}", Math.Round(Convert.ToDecimal(marginAmount), 2));
                                }

                                //Excel changes by Sriram Sundara
                                if (marginPercentageValue == 0)
                                {
                                    ws.Cells["Q" + count].Value = marginPercentageValue;
                                }
                                else
                                {
                                    ws.Cells["Q" + count].Value = FormatPercentage(dtShpDtl.Rows[i - 1]["margin_per"].ToString());
                                }

                                SetFontFormatData(SetThinBorder(ws.Cells.GetSubrange("A" + count)), FontSize, HorizontalAlignmentStyle.Left);
                                SetFontFormatData(SetThinBorder(ws.Cells.GetSubrange("B" + count)), FontSize, HorizontalAlignmentStyle.Left);
                                SetFontFormatData(SetThinBorder(ws.Cells.GetSubrange("C" + count)), FontSize, HorizontalAlignmentStyle.Left);
                                SetFontFormatData(SetThinBorder(ws.Cells.GetSubrange("D" + count)), FontSize, HorizontalAlignmentStyle.Left);
                                SetFontFormatData(SetThinBorder(ws.Cells.GetSubrange("E" + count)), FontSize, HorizontalAlignmentStyle.Left);
                                SetFontFormatData(SetThinBorder(ws.Cells.GetSubrange("F" + count)), FontSize, HorizontalAlignmentStyle.Right);
                                SetFontFormatData(SetThinBorder(ws.Cells.GetSubrange("G" + count)), FontSize, HorizontalAlignmentStyle.Left);
                                SetFontFormatData(SetThinBorder(ws.Cells.GetSubrange("H" + count)), FontSize, HorizontalAlignmentStyle.Left);
                                SetFontFormatData(SetThinBorder(ws.Cells.GetSubrange("I" + count)), FontSize, HorizontalAlignmentStyle.Left);
                                SetFontFormatData(SetThinBorder(ws.Cells.GetSubrange("J" + count)), FontSize, HorizontalAlignmentStyle.Right);
                                SetFontFormatData(SetThinBorder(ws.Cells.GetSubrange("K" + count)), FontSize, HorizontalAlignmentStyle.Left);
                                SetFontFormatData(SetThinBorder(ws.Cells.GetSubrange("L" + count)), FontSize, HorizontalAlignmentStyle.Right);
                                SetFontFormatData(SetThinBorder(ws.Cells.GetSubrange("M" + count)), FontSize, HorizontalAlignmentStyle.Right);
                                SetFontFormatData(SetThinBorder(ws.Cells.GetSubrange("N" + count)), FontSize, HorizontalAlignmentStyle.Right);
                                SetFontFormatData(SetThinBorder(ws.Cells.GetSubrange("O" + count)), FontSize, HorizontalAlignmentStyle.Right);
                                SetFontFormatData(SetThinBorder(ws.Cells.GetSubrange("P" + count)), FontSize, HorizontalAlignmentStyle.Right);
                                SetFontFormatData(SetThinBorder(ws.Cells.GetSubrange("Q" + count)), FontSize, HorizontalAlignmentStyle.Right);
                                //Excel changes by Sriram Sundara
                                rowNoCount++;
                            }
                        }
                        SetThinBorder(ws.Cells.GetSubrange("A" + count + ":" + "Q" + count));
                        type = dtShpDtl.Rows[i - 1]["type"].ToString();
                    }
                    count = count + 2;
                    ws.Cells["A" + count].Value = rowNoCount + " Records";
                    count++;
                    ws.Cells["A" + count].Value = "Italic amounts are from the Master Bill ";
                    count++;
                    ws.Cells["A" + count].Value = "Currency conversions at UPS Treasurys most recent monthly average rate.";
                    count++;
                    ws.Cells["A" + count].Value = "Bold Blue items are calculated based on a Container Allocation process. ";
                    count++;
                    ws.Cells["A" + count].Value = "Bold Black items have been Billed in Flote. ";

                }
                for (int i = 0; i < 17; i++)
                {
                    ws.Columns[i].AutoFit();
                }
                return targetPath;
            }
            catch (Exception ex)
            {
                LogFactory.Exception(ex);
                return null;
            }
        }
        public DataTable ToDataTable<T>(IList<T> data, int rowCount)
        {
            PropertyDescriptorCollection properties =
               TypeDescriptor.GetProperties(typeof(T));
            DataTable table = new DataTable("TableSort");
            foreach (PropertyDescriptor prop in properties)
                table.Columns.Add(prop.Name, Nullable.GetUnderlyingType(prop.PropertyType) ?? prop.PropertyType);
            foreach (T item in data)
            {
                rowCount += 1;
                DataRow row = table.NewRow();
                foreach (PropertyDescriptor prop in properties)
                {
                    if (prop.Name == "ROWNUMBER")
                    {
                        row[prop.Name] = rowCount;
                    }
                    else
                    {
                        row[prop.Name] = prop.GetValue(item) ?? DBNull.Value;
                    }
                }
                table.Rows.Add(row);
            }
            return table;

        }

        /// <summary>
        /// Coding sheet export excel and export pdf.
        /// </summary>
        /// <param name="param"></param>
        /// <returns></returns>
        [HttpPost, HttpGet]
        [ActionName("CodingSheetExport")]
        public HttpResponseMessage CodingSheetExport([FromBody] biafilter.Filter param)
        {
            string targetPath = AppDomain.CurrentDomain.BaseDirectory + @"Export\" + "CodingSheetExport" + ".xlsx";
            var fileName = "CodingSheetExport.xlsx";
            try
            {
                var dCount = 0;
                HttpResponseMessage response = null;
                var workBook = ExcelFile.Load(targetPath);
                if (workBook == null || workBook.Worksheets.Count <= 0)
                {
                    return response;
                }
                GenerateStreamData(workBook.Worksheets["CodingSheet"], param, ref dCount);
                workBook.Worksheets[0].PrintOptions.FitToPage = true;

                switch (param.ExportType)
                {
                    case "PDF":
                        {
                            workBook.Worksheets[0].PrintOptions.TopMargin = 0.25;
                            workBook.Worksheets[0].PrintOptions.BottomMargin = 0.25;
                            workBook.Worksheets[0].PrintOptions.RightMargin = 0.25;
                            workBook.Worksheets[0].PrintOptions.LeftMargin = 0.25;
                            string pdfFileName = "CodingSheetExport.pdf";
                            Stream stream = new MemoryStream();
                            workBook.Save(stream, SaveOptions.PdfDefault);
                            response = new HttpResponseMessage(HttpStatusCode.OK) { Content = new StreamContent(stream) };
                            response.Content.Headers.ContentDisposition = new ContentDispositionHeaderValue("attachment") { FileName = pdfFileName };
                            response.Content.Headers.ContentType = new MediaTypeHeaderValue("application/pdf");
                            LogFactory.Message(string.Format("CodingSheetExport Report and stream length is {0}", stream.Length));
                            break;
                        }
                    case "EXCEL":
                        {
                            Stream stream = new MemoryStream();
                            workBook.Save(stream, SaveOptions.XlsxDefault);
                            response = new HttpResponseMessage(HttpStatusCode.OK) { Content = new StreamContent(stream) };
                            response.Content.Headers.ContentDisposition = new ContentDispositionHeaderValue("attachment") { FileName = fileName };
                            response.Content.Headers.ContentType = new MediaTypeHeaderValue("application/vnd.ms-excel");
                            LogFactory.Message(string.Format("CodingSheetExport Report and stream length is {0}", stream.Length));
                            break;
                        }

                    default:
                        break;
                }
                return response;

            }
            catch (Exception ex)
            {
                LogFactory.Exception(ex);
                return null;
            }

        }

        /// <summary>
        /// Coding sheet excel workbook formatting  
        /// </summary>
        /// <param name="param"></param>
        /// <returns></returns>
        public static void GenerateStreamData(GemExcelWorksheet ws, biafilter.Filter param, ref int dCount)
        {

            try
            {
                int rowCount = 14;

                if (ws != null)
                {
                    var dtInvoiceVat = SQL.Execute(Connections.Flote_Raw, DBConstants.GetInvoiceVAT, new DBParameter("@invoice_id", DbType.AnsiString, param.InvoiceId));
                    var dtInvoiceHeader = SQL.Execute(Connections.Flote_Raw, DBConstants.GetInvoiceHeader, new DBParameter("@invoice_id", DbType.AnsiString, param.InvoiceId));
                    var dtCodingSheet = SQL.Execute(Connections.Flote_Raw, DBConstants.PrintCodingSheetDetails, new DBParameter("@invoiceid", DbType.AnsiString, param.InvoiceId));
                    var FontSize = 200;
                    ws.PrintOptions.FitWorksheetWidthToPages = 1;
                    ws.PrintOptions.TopMargin = 0.5;
                    ws.PrintOptions.BottomMargin = 0.5;
                    ws.PrintOptions.LeftMargin = 0.25;
                    ws.PrintOptions.RightMargin = 0.25;
                    ws.PrintOptions.HeaderMargin = 0;
                    ws.PrintOptions.FooterMargin = 0;
                    ws.Cells.Style.Font.Name = "Verdana";
                    ws.Cells.Style.Font.Size = FontSize;
                    ws.Cells.Style.HorizontalAlignment = HorizontalAlignmentStyle.Left;

                    ws.Cells.GetSubrange("A1:E1").Merged = true; ws.Cells.GetSubrange("A12:F12").Merged = true; ws.Cells.GetSubrange("A2:E2").Merged = true; ws.Cells.GetSubrange("A3:C3").Merged = true;
                    ws.Cells.GetSubrange("A4:C4").Merged = true; ws.Cells.GetSubrange("A5:F5").Merged = true; ws.Cells.GetSubrange("A9:E9").Merged = true; ws.Cells.GetSubrange("A10:E10").Merged = true;
                    ws.Cells.GetSubrange("A13:L13").Merged = true;
                    ws.Cells.GetSubrange("D3:E3").Merged = true;
                    ws.Cells.GetSubrange("D4:E4").Merged = true; ws.Cells.GetSubrange("G1:H1").Merged = true; ws.Cells.GetSubrange("G2:H2").Merged = true; ws.Cells.GetSubrange("I1:J1").Merged = true; ws.Cells.GetSubrange("I2:J2").Merged = true;
                    ws.Cells.GetSubrange("G3:G4").Merged = true;
                    ws.Cells.GetSubrange("G5:G6").Merged = true; ws.Cells.GetSubrange("G7:G8").Merged = true;
                    ws.Cells.GetSubrange("G9:H9").Merged = true; ws.Cells.GetSubrange("G10:H10").Merged = true; ws.Cells.GetSubrange("G11:H11").Merged = true; ws.Cells.GetSubrange("G12:H12").Merged = true;
                    ws.Cells.GetSubrange("I9:J9").Merged = true; ws.Cells.GetSubrange("I10:J10").Merged = true; ws.Cells.GetSubrange("I11:J11").Merged = true; ws.Cells.GetSubrange("I12:J12").Merged = true;
                    ws.Columns[1].AutoFit(1.5);
                    ws.Rows[1].Height = 800;
                    ws.Rows[2].Height = 600;
                    ws.Rows[4].Height = 300;
                    ws.Rows[5].Height = 300;
                    ws.Rows[7].Height = 300;
                    ws.Rows[9].Height = 450;
                    ws.Rows[10].Height = 300;
                    ws.Rows[11].Height = 500;
                    ws.Rows[12].Height = 300;
                    ws.Rows[13].Height = 600;
                    ws.Rows[14].Height = 600;
                    ws.Rows[15].Height = 300;
                    ws.Rows[16].Height = 300;
                    ws.Rows[18].Height = 300;
                    ws.Rows[23].Height = 300;
                    ws.Rows[24].Height = 300;
                    ws.Columns[1].Width = 300;
                    SetThickBorder(ws.Cells.GetSubrange("A1:K1"), "all");
                    ws.Cells["A1"].Value = "VENDOR/(LEGAL) NAME";
                    ws.Cells["A1"].Style.WrapText = true;
                    ws.Cells["A2"].Value = dtInvoiceHeader.Rows[0]["vendor_name_english"].ToString();
                    SetFontFormat(SetThinBorder(ws.Cells.GetSubrange("A1")), FontSize, true, HorizontalAlignmentStyle.Left);
                    SetFontFormatData(SetThinBorder(ws.Cells.GetSubrange("A2")), FontSize, HorizontalAlignmentStyle.Left);
                    SetThickBorder(ws.Cells.GetSubrange("A1"), "all");
                    SetThickBorder(ws.Cells.GetSubrange("A2"), "all");

                    ws.Cells["F1"].Value = "SCAN\nFOLDER";
                    ws.Cells["F1"].Style.WrapText = true;
                    ws.Cells["F2"].Value = dtInvoiceHeader.Rows[0]["scanfolder"].ToString();
                    SetFontFormat(SetThinBorder(ws.Cells.GetSubrange("F1")), FontSize, true, HorizontalAlignmentStyle.Center);
                    SetFontFormatData(SetThinBorder(ws.Cells.GetSubrange("F2")), FontSize, HorizontalAlignmentStyle.Center);
                    SetFontFormatBlackBold(ws.Cells["F2"]);

                    ws.Cells["G1"].Value = "COMPANY ID";
                    ws.Cells["G2"].Value = dtInvoiceHeader.Rows[0]["ora_company"].ToString();
                    SetFontFormat(SetThinBorder(ws.Cells.GetSubrange("G1")), FontSize, true, HorizontalAlignmentStyle.Center);
                    SetFontFormatData(SetThinBorder(ws.Cells.GetSubrange("G2")), FontSize, HorizontalAlignmentStyle.Center);
                    SetFontFormatBlackBold(ws.Cells["G2"]);

                    ws.Cells["I1"].Value = "STAMP\nNUMBER";
                    ws.Cells["I1"].Style.WrapText = true;
                    ws.Cells["I2"].Value = dtInvoiceHeader.Rows[0]["StampNumber"].ToString();
                    SetFontFormat(SetThinBorder(ws.Cells.GetSubrange("I1")), FontSize, true, HorizontalAlignmentStyle.Center);
                    SetFontFormatData(SetThinBorder(ws.Cells.GetSubrange("I2")), FontSize, HorizontalAlignmentStyle.Center);
                    SetFontFormatBlackBold(ws.Cells["I2"]);


                    ws.Cells["K1"].Value = "APPROVED\nBY:";
                    ws.Cells["K1"].Style.WrapText = true;
                    if (!ws.Cells.GetSubrange("K2:L6").IsAnyCellMerged) ws.Cells.GetSubrange("K2:L6").Merged = true;
                    ws.Cells["K2"].Value = dtInvoiceHeader.Rows[0]["approvedby"].ToString().ToUpper();
                    SetFontFormat(SetThinBorder(ws.Cells.GetSubrange("K1")), FontSize, true, HorizontalAlignmentStyle.Center);
                    SetFontFormatData(SetThinBorder(ws.Cells.GetSubrange("K2")), FontSize, HorizontalAlignmentStyle.Center);

                    ws.Cells["A3"].Value = "SUPPLIER(VENDOR) NO";
                    ws.Cells["A4"].Value = dtInvoiceHeader.Rows[0]["ap_vendor_id"].ToString();
                    SetFontFormat(SetThinBorder(ws.Cells.GetSubrange("A3")), FontSize, true, HorizontalAlignmentStyle.Left);
                    SetFontFormatData(SetThinBorder(ws.Cells.GetSubrange("A4")), FontSize, HorizontalAlignmentStyle.Left);

                    ws.Cells["D3"].Value = "(Site)REMIT ID";
                    ws.Cells["D4"].Value = dtInvoiceHeader.Rows[0]["ap_remit_id"].ToString();
                    SetFontFormat(SetThinBorder(ws.Cells.GetSubrange("D3")), FontSize, true, HorizontalAlignmentStyle.Center);
                    SetFontFormatData(SetThinBorder(ws.Cells.GetSubrange("D4")), FontSize, HorizontalAlignmentStyle.Center);
                    SetFontFormatBlackBold(ws.Cells["D4"]);

                    ws.Cells["F3"].Value = "LOCATION";
                    ws.Cells["F4"].Value = dtInvoiceHeader.Rows[0]["location_code"].ToString();
                    SetFontFormat(SetThinBorder(ws.Cells.GetSubrange("F3")), FontSize, true, HorizontalAlignmentStyle.Center);
                    SetFontFormatData(SetThinBorder(ws.Cells.GetSubrange("F4")), FontSize, HorizontalAlignmentStyle.Center);
                    SetFontFormatBlackBold(ws.Cells["F4"]);


                    ws.Cells["G3"].Value = "BILL\nDATE:";
                    ws.Cells["G3"].Style.WrapText = true;
                    SetFontFormat(SetThinBorder(ws.Cells.GetSubrange("G3")), FontSize, true, HorizontalAlignmentStyle.Center);
                    ws.Cells["G3"].Column.AutoFit();
                    ws.Cells["G3"].Style.VerticalAlignment = VerticalAlignmentStyle.Center;

                    ws.Cells["G5"].Value = "RECEIPT\n DATE:";
                    ws.Cells["G5"].Style.WrapText = true;
                    SetFontFormat(SetThinBorder(ws.Cells.GetSubrange("G5")), FontSize, true, HorizontalAlignmentStyle.Center);
                    ws.Cells["G5"].Column.AutoFit();
                    ws.Cells["G5"].Style.VerticalAlignment = VerticalAlignmentStyle.Center;

                    ws.Cells["G7"].Value = "BILL DUE\nDATE:";
                    ws.Cells["G7"].Style.WrapText = true;
                    SetFontFormat(SetThinBorder(ws.Cells.GetSubrange("G7")), FontSize, true, HorizontalAlignmentStyle.Center);
                    ws.Cells["G8"].Column.AutoFit();
                    ws.Cells["G7"].Style.VerticalAlignment = VerticalAlignmentStyle.Center;

                    ws.Cells["H3"].Value = "DD";
                    ws.Cells["H4"].Value = dtInvoiceHeader.Rows[0]["invoiceday"].ToString();
                    SetFontFormat(SetThinBorder(ws.Cells.GetSubrange("H3")), FontSize, true, HorizontalAlignmentStyle.Center);
                    SetFontFormatData(SetThinBorder(ws.Cells.GetSubrange("H4")), FontSize, HorizontalAlignmentStyle.Center);

                    ws.Cells["H5"].Value = "DD";
                    ws.Cells["H6"].Value = dtInvoiceHeader.Rows[0]["createdday"].ToString();
                    SetFontFormat(SetThinBorder(ws.Cells.GetSubrange("H5")), FontSize, true, HorizontalAlignmentStyle.Center);
                    SetFontFormatData(SetThinBorder(ws.Cells.GetSubrange("H6")), FontSize, HorizontalAlignmentStyle.Center);

                    ws.Cells["H7"].Value = "DD";
                    ws.Cells["H8"].Value = dtInvoiceHeader.Rows[0]["invoicedueday"].ToString();
                    SetFontFormat(SetThinBorder(ws.Cells.GetSubrange("H7")), FontSize, true, HorizontalAlignmentStyle.Center);
                    SetFontFormatData(SetThinBorder(ws.Cells.GetSubrange("H8")), FontSize, HorizontalAlignmentStyle.Center);

                    ws.Cells["I3"].Value = "MM";
                    ws.Cells["I4"].Value = dtInvoiceHeader.Rows[0]["invoicemonth"].ToString();
                    SetFontFormat(SetThinBorder(ws.Cells.GetSubrange("I3")), FontSize, true, HorizontalAlignmentStyle.Center);
                    SetFontFormatData(SetThinBorder(ws.Cells.GetSubrange("I4")), FontSize, HorizontalAlignmentStyle.Center);

                    ws.Cells["I5"].Value = "MM";
                    ws.Cells["I6"].Value = dtInvoiceHeader.Rows[0]["createdmonth"].ToString();
                    SetFontFormat(SetThinBorder(ws.Cells.GetSubrange("I5")), FontSize, true, HorizontalAlignmentStyle.Center);
                    SetFontFormatData(SetThinBorder(ws.Cells.GetSubrange("I6")), FontSize, HorizontalAlignmentStyle.Center);

                    ws.Cells["I7"].Value = "MM";
                    ws.Cells["I8"].Value = dtInvoiceHeader.Rows[0]["invoiceduemonth"].ToString();
                    SetFontFormat(SetThinBorder(ws.Cells.GetSubrange("I7")), FontSize, true, HorizontalAlignmentStyle.Center);
                    SetFontFormatData(SetThinBorder(ws.Cells.GetSubrange("I8")), FontSize, HorizontalAlignmentStyle.Center);

                    ws.Cells["J3"].Value = "YYYY";
                    ws.Cells["J4"].Value = dtInvoiceHeader.Rows[0]["invoiceyear"].ToString();
                    SetFontFormat(SetThinBorder(ws.Cells.GetSubrange("J3")), FontSize, true, HorizontalAlignmentStyle.Center);
                    SetFontFormatData(SetThinBorder(ws.Cells.GetSubrange("J4")), FontSize, HorizontalAlignmentStyle.Center);

                    ws.Cells["J5"].Value = "YYYY";
                    ws.Cells["J6"].Value = dtInvoiceHeader.Rows[0]["createdyear"].ToString();
                    SetFontFormat(SetThinBorder(ws.Cells.GetSubrange("J5")), FontSize, true, HorizontalAlignmentStyle.Center);
                    SetFontFormatData(SetThinBorder(ws.Cells.GetSubrange("J6")), FontSize, HorizontalAlignmentStyle.Center);

                    ws.Cells["J7"].Value = "YYYY";
                    ws.Cells["J8"].Value = dtInvoiceHeader.Rows[0]["invoicedueyear"].ToString();
                    SetFontFormat(SetThinBorder(ws.Cells.GetSubrange("J7")), FontSize, true, HorizontalAlignmentStyle.Center);
                    SetFontFormatData(SetThinBorder(ws.Cells.GetSubrange("J8")), FontSize, HorizontalAlignmentStyle.Center);

                    ws.Cells["A5"].Value = "VENDOR BILL NUMBER:";
                    if (!ws.Cells.GetSubrange("A6:F8").IsAnyCellMerged) ws.Cells.GetSubrange("A6:F8").Merged = true;
                    ws.Cells["A6"].Value = dtInvoiceHeader.Rows[0]["InvRefNo"].ToString();
                    SetFontFormat(SetThinBorder(ws.Cells.GetSubrange("A5")), FontSize, true, HorizontalAlignmentStyle.Left);
                    SetFontFormat(SetThinBorder(ws.Cells.GetSubrange("A6:F8")), 300, true, HorizontalAlignmentStyle.Center);
                    ws.Cells["A6"].Style.VerticalAlignment = VerticalAlignmentStyle.Center;
                    SetThinBorder(ws.Cells.GetSubrange("A6:F8"));

                    ws.Cells["K7"].Value = "PAYMENT\nTERMS";
                    ws.Cells["K7"].Style.WrapText = true;
                    ws.Cells["K8"].Value = dtInvoiceHeader.Rows[0]["terms_id"].ToString();
                    SetFontFormat(SetThinBorder(ws.Cells.GetSubrange("K7")), FontSize, true, HorizontalAlignmentStyle.Center);
                    SetFontFormatData(SetThinBorder(ws.Cells.GetSubrange("K8")), FontSize, HorizontalAlignmentStyle.Center);

                    ws.Cells["A9"].Value = "BILL TOTAL:";
                    if (dtInvoiceHeader.Rows[0]["Invoice_Amt"].ToString() == "")
                    {
                        ws.Cells["A10"].Value = dtInvoiceHeader.Rows[0]["Invoice_Amt"].ToString();
                    }
                    else
                    {
                        ws.Cells["A10"].Value = String.Format("{0:n}", Math.Round(Convert.ToDecimal(dtInvoiceHeader.Rows[0]["Invoice_Amt"]), 2));
                    }
                    SetFontFormat(SetThinBorder(ws.Cells.GetSubrange("A9")), FontSize, true, HorizontalAlignmentStyle.Left);
                    SetFontFormatData(SetThinBorder(ws.Cells.GetSubrange("A10:E10")), 300, HorizontalAlignmentStyle.Center);
                    SetFontFormat(SetThinBorder(ws.Cells.GetSubrange("A10:E10")), 300, true, HorizontalAlignmentStyle.Center);
                    ws.Cells["A10"].Style.VerticalAlignment = VerticalAlignmentStyle.Center;

                    ws.Cells["F9"].Value = "BILL\nCURRENCY";
                    ws.Cells["F9"].Style.WrapText = true;
                    ws.Cells["F10"].Value = dtInvoiceHeader.Rows[0]["invoice_cid"].ToString();
                    SetFontFormat(SetThinBorder(ws.Cells.GetSubrange("F9")), FontSize, true, HorizontalAlignmentStyle.Center);
                    SetFontFormatData(SetThinBorder(ws.Cells.GetSubrange("F10")), FontSize, HorizontalAlignmentStyle.Center);

                    ws.Cells["G9"].Value = "INV\nEXCHANGE\nRATE";
                    ws.Cells["G9"].Style.WrapText = true;
                    SetFontFormat(SetThinBorder(ws.Cells.GetSubrange("G9")), FontSize, true, HorizontalAlignmentStyle.Center);
                    SetFontFormatData(SetThinBorder(ws.Cells.GetSubrange("G10")), FontSize, HorizontalAlignmentStyle.Center);

                    ws.Cells["I9"].Value = "PMT\nEXCHANGE\nRATE";
                    ws.Cells["I9"].Style.WrapText = true;
                    SetFontFormat(SetThinBorder(ws.Cells.GetSubrange("I9")), FontSize, true, HorizontalAlignmentStyle.Center);
                    SetFontFormatData(SetThinBorder(ws.Cells.GetSubrange("I10")), FontSize, HorizontalAlignmentStyle.Center);

                    ws.Cells["K9"].Value = "VERIFIED\nBY:";
                    ws.Cells["K9"].Style.WrapText = true;
                    if (!ws.Cells.GetSubrange("K10:L12").IsAnyCellMerged)
                        ws.Cells.GetSubrange("K10:L12").Merged = true;
                    ws.Cells["K10"].Value = dtInvoiceHeader.Rows[0]["verifiedby"].ToString().ToUpper();
                    SetFontFormat(SetThinBorder(ws.Cells.GetSubrange("K9")), FontSize, true, HorizontalAlignmentStyle.Center);
                    SetFontFormatData(SetThinBorder(ws.Cells.GetSubrange("K10")), FontSize, HorizontalAlignmentStyle.Center);
                    SetThinBorder(ws.Cells.GetSubrange("K10:L12"));
                    if (!ws.Cells.GetSubrange("A11:F11").IsAnyCellMerged)
                        ws.Cells.GetSubrange("A11:F11").Merged = true;
                    ws.Cells["A12"].Value = "ADDITIONAL INFORMATION:";
                    ws.Cells["G11"].Value = "VAT POINT\nDATE (DD/MM/YYYY)";
                    ws.Cells["G11"].Style.WrapText = true;
                    ws.Rows[11].Height = 300;
                    ws.Rows[12].Height = 300;
                    ws.Cells["G11"].Style.VerticalAlignment = VerticalAlignmentStyle.Top;

                    ws.Cells["G12"].Column.AutoFit(300);
                    SetFontFormat(SetThinBorder(ws.Cells.GetSubrange("G11")), FontSize, true, HorizontalAlignmentStyle.Center);
                    SetFontFormatData(SetThinBorder(ws.Cells.GetSubrange("G12")), FontSize, HorizontalAlignmentStyle.Center);
                    ws.Cells["I11"].Value = "Voucher No.";
                    ws.Cells["I11"].Style.VerticalAlignment = VerticalAlignmentStyle.Center;
                    SetFontFormat(SetThinBorder(ws.Cells.GetSubrange("I11")), FontSize, true, HorizontalAlignmentStyle.Center);

                    if (dtInvoiceHeader.Rows.Count > 0)
                    {
                        ws.Cells["A2"].Value = dtInvoiceHeader.Rows[0]["vendor_name_english"].ToString();
                        ws.Cells["A2"].Style.WrapText = true;
                        ws.Cells["F2"].Value = dtInvoiceHeader.Rows[0]["scanfolder"].ToString();
                        ws.Cells["F2"].Style.WrapText = true;
                        ws.Cells["G2"].Value = dtInvoiceHeader.Rows[0]["ora_company"].ToString();
                        ws.Cells["I2"].Value = dtInvoiceHeader.Rows[0]["StampNumber"].ToString();
                        ws.Cells["K2"].Value = dtInvoiceHeader.Rows[0]["approvedby"].ToString().ToUpper();
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
                        ws.Cells["K10"].Value = dtInvoiceHeader.Rows[0]["verifiedby"].ToString().ToUpper();
                        if (dtInvoiceHeader.Rows[0]["vatpointdate"].ToString() == "")
                        {
                            ws.Cells["G12"].Value = dtInvoiceHeader.Rows[0]["vatpointdate"].ToString();
                        }
                        else
                        {
                            ws.Cells["G12"].Value = Convert.ToDateTime(dtInvoiceHeader.Rows[0]["vatpointdate"].ToString()).ToString("dd/MM/yyyy");
                        }

                    }

                    for (int i = 1; i < rowCount; i++)
                    {
                        SetThinBorder(ws.Cells.GetSubrange("A" + i + ":" + "L" + i));
                    }
                    SetFontFormat(SetThickBorder(ws.Cells.GetSubrange("A13:L13"), "all"), FontSize, true, HorizontalAlignmentStyle.Right);

                    if (dtInvoiceVat.Rows.Count > 0)
                    {
                        for (int i = 1; i <= dtInvoiceVat.Rows.Count; i++)
                        {
                            rowCount++;
                            ws.Rows.InsertCopy(rowCount, ws.Rows[rowCount - 1]);
                            ws.Cells["A" + rowCount].Value = dtInvoiceVat.Rows[i - 1]["vat_code"].ToString();
                            if (!ws.Cells.GetSubrange("B" + rowCount + ":C" + rowCount).IsAnyCellMerged) ws.Cells.GetSubrange("B" + rowCount + ":C" + rowCount).Merged = true;
                            ws.Cells["B" + rowCount].Value = dtInvoiceVat.Rows[i - 1]["amount"].ToString();
                            ws.Cells["D" + rowCount].Value = dtInvoiceVat.Rows[i - 1]["vat_percent"].ToString();
                            ws.Cells["E" + rowCount].Value = dtInvoiceVat.Rows[i - 1]["vat_amount"].ToString();
                            SetFontFormatData(SetThinBorder(ws.Cells.GetSubrange("A" + rowCount)), FontSize, HorizontalAlignmentStyle.Center);
                            SetFontFormatData(SetThinBorder(ws.Cells.GetSubrange("B" + rowCount)), FontSize, HorizontalAlignmentStyle.Center);
                            SetFontFormatData(SetThinBorder(ws.Cells.GetSubrange("D" + rowCount)), FontSize, HorizontalAlignmentStyle.Center);
                            SetFontFormatData(SetThinBorder(ws.Cells.GetSubrange("E" + rowCount)), FontSize, HorizontalAlignmentStyle.Center);
                            SetThinBorder(ws.Cells.GetSubrange("A" + rowCount + ":" + "L" + rowCount));
                        }
                    }
                    else
                    {
                        rowCount = rowCount + 1;
                        ws.Rows.InsertCopy(rowCount, ws.Rows[rowCount - 1]);
                        if (!ws.Cells.GetSubrange("A" + rowCount + ":L" + rowCount).IsAnyCellMerged) ws.Cells.GetSubrange("A" + rowCount + ":L" + rowCount).Merged = true;
                        ws.Cells["A" + rowCount].Value = "No Matches Found!";
                        SetFontFormat(SetThinBorder(ws.Cells.GetSubrange("A" + rowCount)), FontSize, false, HorizontalAlignmentStyle.Left);
                    }
                    rowCount++;
                    if (!ws.Cells.GetSubrange("A" + rowCount + ":L" + rowCount).IsAnyCellMerged) { ws.Cells.GetSubrange("A" + rowCount + ":K" + rowCount).Merged = true; }
                    ws.Cells.GetSubrange("A" + rowCount + ":L" + rowCount).Style.Borders.SetBorders(MultipleBorders.All, Color.Black, LineStyle.Thick);
                    rowCount++;

                    if (dtCodingSheet.Rows.Count > 0)
                    {
                        for (int i = 1; i <= dtCodingSheet.Rows.Count; i++)
                        {
                            ws.Rows[rowCount].Height = 800;
                            rowCount++;
                            ws.Rows.InsertCopy(rowCount, ws.Rows[rowCount - 1]);
                            ws.Rows[rowCount].Height = 800;
                            ws.Cells["A" + rowCount].SetValue(dtCodingSheet.Rows[i - 1]["rrdd"].ToString());
                            ws.Cells["B" + rowCount].SetValue(dtCodingSheet.Rows[i - 1]["center"].ToString());
                            ws.Cells["C" + rowCount].SetValue(dtCodingSheet.Rows[i - 1]["OPSTYPE"].ToString());
                            ws.Cells["D" + rowCount].SetValue(dtCodingSheet.Rows[i - 1]["product"].ToString());
                            ws.Cells["E" + rowCount].SetValue(dtCodingSheet.Rows[i - 1]["account"].ToString());
                            ws.Cells["G" + rowCount].SetValue(dtCodingSheet.Rows[i - 1]["vat_code"].ToString());
                            ws.Cells["H" + rowCount].SetValue(dtCodingSheet.Rows[i - 1]["vat_percent"].ToString());
                            if (dtCodingSheet.Rows[i - 1]["vat_amount"].ToString() == "")
                            {
                                ws.Cells["I" + rowCount].Value = dtCodingSheet.Rows[i - 1]["vat_amount"].ToString();
                            }
                            else
                            {
                                ws.Cells["I" + rowCount].Value = String.Format("{0:n}", Math.Round(Convert.ToDecimal(dtCodingSheet.Rows[i - 1]["vat_amount"]), 2));
                            }
                            if (dtCodingSheet.Rows[i - 1]["OSOffset"].ToString() == "")
                            {
                                ws.Cells["J" + rowCount].Value = dtCodingSheet.Rows[i - 1]["OSOffset"].ToString();
                            }
                            else
                            {
                                ws.Cells["J" + rowCount].Value = String.Format("{0:n}", Math.Round(Convert.ToDecimal(dtCodingSheet.Rows[i - 1]["OSOffset"]), 2));
                            }
                            if (dtCodingSheet.Rows[i - 1]["invoice_amt"].ToString() == "")
                            {
                                ws.Cells["K" + rowCount].Value = dtCodingSheet.Rows[i - 1]["invoice_amt"].ToString();
                            }
                            else
                            {
                                ws.Cells["K" + rowCount].Value = String.Format("{0:n}", Math.Round(Convert.ToDecimal(dtCodingSheet.Rows[i - 1]["invoice_amt"]), 2));
                            }
                            ws.Cells["L" + rowCount].Value = dtCodingSheet.Rows[i - 1]["reference"].ToString();
                            ws.Cells["L" + rowCount].Style.WrapText = true;
                            SetFontFormatData(SetThinBorder(ws.Cells.GetSubrange("A" + rowCount)), FontSize, HorizontalAlignmentStyle.Center);
                            SetFontFormatData(SetThinBorder(ws.Cells.GetSubrange("B" + rowCount)), FontSize, HorizontalAlignmentStyle.Center);
                            SetFontFormatData(SetThinBorder(ws.Cells.GetSubrange("C" + rowCount)), FontSize, HorizontalAlignmentStyle.Center);
                            SetFontFormatData(SetThinBorder(ws.Cells.GetSubrange("D" + rowCount)), FontSize, HorizontalAlignmentStyle.Center);
                            SetFontFormatData(SetThinBorder(ws.Cells.GetSubrange("E" + rowCount)), FontSize, HorizontalAlignmentStyle.Center);
                            SetFontFormatData(SetThinBorder(ws.Cells.GetSubrange("F" + rowCount)), FontSize, HorizontalAlignmentStyle.Center);
                            SetFontFormatData(SetThinBorder(ws.Cells.GetSubrange("G" + rowCount)), FontSize, HorizontalAlignmentStyle.Center);
                            SetFontFormatData(SetThinBorder(ws.Cells.GetSubrange("H" + rowCount)), FontSize, HorizontalAlignmentStyle.Center);
                            SetFontFormatData(SetThinBorder(ws.Cells.GetSubrange("I" + rowCount)), FontSize, HorizontalAlignmentStyle.Center);
                            SetFontFormatData(SetThinBorder(ws.Cells.GetSubrange("J" + rowCount)), FontSize, HorizontalAlignmentStyle.Center);
                            SetFontFormatData(SetThinBorder(ws.Cells.GetSubrange("K" + rowCount)), FontSize, HorizontalAlignmentStyle.Center);
                            SetFontFormatData(SetThinBorder(ws.Cells.GetSubrange("L" + rowCount)), FontSize, HorizontalAlignmentStyle.Center);
                            ws.Cells["A" + rowCount].Style.VerticalAlignment = VerticalAlignmentStyle.Center;
                            ws.Cells["B" + rowCount].Style.VerticalAlignment = VerticalAlignmentStyle.Center;
                            ws.Cells["C" + rowCount].Style.VerticalAlignment = VerticalAlignmentStyle.Center;
                            ws.Cells["D" + rowCount].Style.VerticalAlignment = VerticalAlignmentStyle.Center;
                            ws.Cells["E" + rowCount].Style.VerticalAlignment = VerticalAlignmentStyle.Center;
                            ws.Cells["F" + rowCount].Style.VerticalAlignment = VerticalAlignmentStyle.Center;
                            ws.Cells["G" + rowCount].Style.VerticalAlignment = VerticalAlignmentStyle.Center;
                            ws.Cells["H" + rowCount].Style.VerticalAlignment = VerticalAlignmentStyle.Center;
                            ws.Cells["I" + rowCount].Style.VerticalAlignment = VerticalAlignmentStyle.Center;
                            ws.Cells["J" + rowCount].Style.VerticalAlignment = VerticalAlignmentStyle.Center;
                            ws.Cells["K" + rowCount].Style.VerticalAlignment = VerticalAlignmentStyle.Center;
                            ws.Cells["L" + rowCount].Style.VerticalAlignment = VerticalAlignmentStyle.Center;
                            SetFontFormatBlackBold(ws.Cells["A" + rowCount]);
                            SetFontFormatBlackBold(ws.Cells["B" + rowCount]);
                            SetFontFormatBlackBold(ws.Cells["C" + rowCount]);
                            SetFontFormatBlackBold(ws.Cells["D" + rowCount]);
                            SetFontFormatBlackBold(ws.Cells["E" + rowCount]);
                            SetFontFormatBlackBold(ws.Cells["F" + rowCount]);
                            SetFontFormatBlackBold(ws.Cells["G" + rowCount]);
                            SetFontFormatBlackBold(ws.Cells["H" + rowCount]);
                            SetFontFormatBlackBold(ws.Cells["I" + rowCount]);
                            SetFontFormatBlackBold(ws.Cells["J" + rowCount]);
                            SetFontFormatBlackBold(ws.Cells["K" + rowCount]);
                            SetFontFormatBlackBold(ws.Cells["L" + rowCount]);
                            SetThinBorder(ws.Cells.GetSubrange("A" + rowCount + ":" + "L" + rowCount));
                        }
                    }
                    rowCount++;
                    if (!ws.Cells.GetSubrange("A" + rowCount + ":L" + rowCount).IsAnyCellMerged) ws.Cells.GetSubrange("A" + rowCount + ":L" + rowCount).Merged = true;
                    rowCount++;
                    SetFontFormat(SetThickBorder(ws.Cells.GetSubrange("A" + rowCount + ":L" + rowCount), "all"), FontSize, true, HorizontalAlignmentStyle.Right);
                    if (!ws.Cells.GetSubrange("A" + rowCount + ":L" + rowCount).IsAnyCellMerged)
                    {
                        ws.Cells.GetSubrange("A" + rowCount + ":L" + rowCount).Merged = true;
                    }
                    if (!ws.Cells.GetSubrange("C" + rowCount + ":D" + rowCount).IsAnyCellMerged)
                    {
                        ws.Cells.GetSubrange("C" + rowCount + ":D" + rowCount).Merged = true;
                    }
                    if (!ws.Cells.GetSubrange("G" + rowCount + ":I" + rowCount).IsAnyCellMerged)
                    {
                        ws.Cells.GetSubrange("G" + rowCount + ":I" + rowCount).Merged = true;
                    }
                    if (!ws.Cells.GetSubrange("J" + rowCount + ":L" + rowCount).IsAnyCellMerged)
                    {
                        ws.Cells.GetSubrange("J" + rowCount + ":L" + rowCount).Merged = true;
                    }

                    SetAlignment(ws.Cells.GetSubrange("A" + rowCount + ":L" + rowCount), HorizontalAlignmentStyle.Center);
                    ws.Cells.GetSubrange("A" + rowCount + ":L" + rowCount).Style.Borders.SetBorders(MultipleBorders.Right, Color.Black, LineStyle.Thick);
                    if (dtInvoiceHeader.Rows.Count > 0)
                    {
                        rowCount++;
                        ws.Rows.InsertCopy(rowCount, ws.Rows[rowCount - 1]);
                        ws.Cells["A" + rowCount].Value = dtInvoiceHeader.Rows[0]["Pay_Group"].ToString();
                        ws.Cells["A" + rowCount].Style.VerticalAlignment = VerticalAlignmentStyle.Center;
                        ws.Cells["A" + rowCount].Column.AutoFit();
                        ws.Cells["A" + rowCount].Style.WrapText = true;
                        ws.Cells["B" + rowCount].Value = dtInvoiceHeader.Rows[0]["CheckNumber"].ToString();
                        ws.Cells["B" + rowCount].Style.VerticalAlignment = VerticalAlignmentStyle.Center;
                        ws.Cells["B" + rowCount].Column.AutoFit();
                        ws.Cells["B" + rowCount].Style.WrapText = true;
                        if (dtInvoiceHeader.Rows[0]["check_date"].ToString() == "")
                        {
                            ws.Cells["C" + rowCount].Value = dtInvoiceHeader.Rows[0]["check_date"].ToString();
                        }
                        else
                        {
                            ws.Cells["C" + rowCount].Value = Convert.ToDateTime(dtInvoiceHeader.Rows[0]["check_date"].ToString()).ToString("dd/MM/yyyy");
                        }
                        ws.Cells.GetSubrange("C" + rowCount + ":" + "D" + rowCount).Style.WrapText = true;
                        ws.Cells["E" + rowCount].Value = dtInvoiceHeader.Rows[0]["Bank_info"].ToString();
                        if (dtInvoiceHeader.Rows[0]["Check_amt_nbr"].ToString() == "")
                        {
                            ws.Cells["G" + rowCount].Value = dtInvoiceHeader.Rows[0]["Check_amt_nbr"].ToString();
                        }
                        else
                        {
                            ws.Cells["G" + rowCount].Value = String.Format("{0:n}", Math.Round(Convert.ToDecimal(dtInvoiceHeader.Rows[0]["Check_amt_nbr"]), 2));
                        }
                        ws.Cells["G" + rowCount].Style.VerticalAlignment = VerticalAlignmentStyle.Center;
                        ws.Cells["F" + rowCount].Style.WrapText = true;
                        ws.Cells["G" + rowCount].Column.AutoFit();
                        ws.Cells["G" + rowCount].Style.WrapText = true;
                        ws.Cells["J" + rowCount].Value = dtInvoiceHeader.Rows[0]["OtherReference"].ToString();
                        if (!ws.Cells.GetSubrange("C" + rowCount + ":D" + rowCount).IsAnyCellMerged)
                        {
                            ws.Cells.GetSubrange("C" + rowCount + ":D" + rowCount).Merged = true;
                        }
                        if (!ws.Cells.GetSubrange("G" + rowCount + ":I" + rowCount).IsAnyCellMerged)
                        {
                            ws.Cells.GetSubrange("G" + rowCount + ":I" + rowCount).Merged = true;
                        }
                        if (!ws.Cells.GetSubrange("J" + rowCount + ":L" + rowCount).IsAnyCellMerged)
                        {
                            ws.Cells.GetSubrange("J" + rowCount + ":L" + rowCount).Merged = true;
                        }
                        SetAlignment(ws.Cells.GetSubrange("A" + rowCount + ":L" + rowCount), HorizontalAlignmentStyle.Center);
                        ws.Cells.GetSubrange("A" + rowCount + ":L" + rowCount).Style.Borders.SetBorders(MultipleBorders.Right, Color.Black, LineStyle.Thick);
                    }
                    SetThickBorder(ws.Cells.GetSubrange("L1:L" + rowCount), "right");
                    SetThickBorder(ws.Cells.GetSubrange("A" + rowCount + ":L" + rowCount), "bottom");
                    rowCount++;
                    if (!ws.Cells.GetSubrange("A" + rowCount + ":L" + rowCount).IsAnyCellMerged) ws.Cells.GetSubrange("A" + rowCount + ":L" + rowCount).Merged = true;
                    ws.Cells.GetSubrange("A" + rowCount + ":L" + rowCount).Style.Borders.SetBorders(MultipleBorders.Right, Color.Black, LineStyle.Thick);
                    rowCount++;
                    ws.Cells["A" + rowCount].Value = "Flote Bill ID:" + dtInvoiceHeader.Rows[0]["invoice_id"].ToString();
                    if (!ws.Cells.GetSubrange("A" + rowCount + ":L" + rowCount).IsAnyCellMerged) ws.Cells.GetSubrange("A" + rowCount + ":L" + rowCount).Merged = true;
                    ws.Cells.GetSubrange("A" + rowCount + ":L" + rowCount).Style.Borders.SetBorders(MultipleBorders.All, Color.Black, LineStyle.Thick);
                    SetAlignment(ws.Cells.GetSubrange("A" + rowCount + ":L" + rowCount), HorizontalAlignmentStyle.Left);
                    rowCount++;
                    ws.Rows.InsertCopy(rowCount, ws.Rows[rowCount - 1]);
                    if (!ws.Cells.GetSubrange("A" + rowCount + ":L" + rowCount).IsAnyCellMerged) ws.Cells.GetSubrange("A" + rowCount + ":L" + rowCount).Merged = true;
                    ws.Cells["A" + rowCount].Value = "";
                    rowCount++;
                    SetAlignment(ws.Cells.GetSubrange("A" + rowCount + ":L" + rowCount), HorizontalAlignmentStyle.Center);
                    rowCount++;
                    SetAlignment(ws.Cells.GetSubrange("A" + rowCount + ":L" + rowCount), HorizontalAlignmentStyle.Center);
                    dCount = rowCount;

                }
            }
            catch (Exception ex)
            {
                BIACore.Log.LogFactory.Exception(ex);
            }

        }

        /// <summary>
        /// Get the Review Edit Coding Sheet.
        /// </summary>
        /// <param name="param"></param>
        /// <returns></returns>
        [HttpPost]
        [ActionName("GetReviewCodingSheet")]
        public object GetReviewCodingSheet([FromBody] biafilter.Filter param)
        {
            object obj = new object();
            try
            {
                if (param.InvoiceId != "0")
                {
                    obj = LoadResult(DBConstants.ReviewCodingSheetDetails, new DBParameter("@Invoice_Id", DbType.AnsiString, param.InvoiceId));
                }
            }
            catch (Exception ex)
            {
                LogFactory.Exception(ex);
                return null;
            }
            return obj;
        }

        /// <summary>
        /// ExcelExport for current page.
        /// </summary>
        /// <param name="param"></param>
        /// <returns></returns>
        [HttpPost, HttpGet]
        [ActionName("ExcelExport")]
        public HttpResponseMessage ExcelExport([FromBody] biafilter.Filter param)
        {
            HttpResponseMessage response = new HttpResponseMessage(HttpStatusCode.OK);
            try
            {
                string filename = "ExportExcel_" + param.PageName + ".xls";
                StringBuilder str = new StringBuilder();
                str.Append(DataToString(GetExcelData(param), param.ColumnNames));
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
        /// Convert the datatable into formatted string.
        /// </summary>
        /// <param name="table"></param>
        /// <returns></returns>
        public static string DataToString(DataTable dtExcel, string colNames)
        {
            StringBuilder result = new StringBuilder();
            result.Append("<table><meta charset=" + "UTF-8" + "><tr style='background-color: #909C5F; border: 1px solid black;'>");
            if (colNames != "")
            {
                var columns = Regex.Split(colNames, ",");
                foreach (var col in columns)
                {
                    if (!col.Contains('*'))
                    {
                        result.Append("<th>" + col.Replace("</BR>", "").Replace("<BR>", "").ToString() + "</th>");
                    }
                }
                result.Append("\n");
            }
            result.Append("</tr>");

            foreach (DataRow row in dtExcel.Rows)
            {
                result.Append("<tr style='background-color: #F5FBDD;border: 1px solid black;'>");
                for (int i = 0; i < dtExcel.Columns.Count; i++)
                {
                    result.Append("<td>" + row[i] + "</td>");
                    result.Append(i == dtExcel.Columns.Count - 1 ? "\n" : "");
                }
                result.Append("</tr>");
            }
            result.Append("</table>");
            return result.ToString();
        }
        /// <summary>
        /// Get Review coding sheet by Invoice Id
        /// </summary>
        /// <param name="param"></param>
        /// <returns></returns>
        //[HttpPost]
        // [ActionName("GetExcelData")]
        private DataTable GetExcelData([FromBody] biafilter.Filter param)
        {
            DataTable dtResult = new DataTable();
            DataTable dtSort = new DataTable("Sorted");
            param.start = -1;
            var procName = "";
            try
            {
                if (param.PageName != "0")
                {
                    switch (param.PageName)
                    {
                        case "Bills":
                            procName = DBConstants.Bills;
                            break;
                        case "locationshipment":
                            if (param.Loctype == "TP")
                            { procName = DBConstants.LocationShipmentTP; }
                            else
                            { procName = DBConstants.LocationShipmentDEP; }
                            break;
                        case "locationmasterbill":
                            procName = DBConstants.LocationOceanMBL;
                            break;
                        case "locationvendor":
                            procName = DBConstants.GetLocationVendor;
                            break;
                        case "vendorshipment":
                            procName = DBConstants.VendorShipmentReport;
                            break;
                        case "vendorlist":
                            procName = DBConstants.GetVendor;
                            break;
                        case "accrualMonJEntry":
                            procName = DBConstants.AccrualMonthlyReport;
                            break;
                        case "accrualDetail":
                            procName = DBConstants.AccrualMonthlyDetailReport;
                            break;
                        case "accrualaccuracy":
                            procName = DBConstants.AccrualAccuracyReport;
                            break;
                        case "InvoiceProcessing":
                            var invoiceId = param.InvoiceId;
                            var dataIndexes = param.DataIndexes;
                            param = new biafilter.Filter();
                            param.InvoiceId = invoiceId;
                            param.DataIndexes = dataIndexes;
                            procName = DBConstants.GetSelectedChargesForBill;
                            break;
                        case "OceanMBL":
                            procName = DBConstants.GetOceanMBL;

                            break;
                        case "PaidDifferently":
                            procName = DBConstants.GetPaidDifferently;
                            break;
                        case "paymentdetails":
                            procName = DBConstants.GetInvoiceVendorPaymentDetails;
                            break;
                        default:
                            break;
                    }
                    dtResult = SQL.Execute(Connection, procName, param.ToDBParameter());

                    foreach (DataRow item in dtResult.Rows)
                    {
                        if (procName == DBConstants.AccrualMonthlyDetailReport && string.IsNullOrEmpty(item["Invoice_Status"].ToString()))
                        {
                            item["Invoice_Status"] = "NULL";
                        }
                    }
                    if (param.DataIndexes != "")
                    {
                        var dataIndexes = Regex.Split(param.DataIndexes, ",");
                        foreach (var str in dataIndexes)
                        {
                            for (int i = 0; i < dtResult.Columns.Count; i++)
                            {
                                if (dtResult.Columns[i].ColumnName == str.ToString() && dtResult.Columns[i].ColumnName != "")
                                {
                                    dtSort.Columns.Add(dtResult.Columns[i].ColumnName, dtResult.Columns[i].DataType);
                                }
                            }
                        }
                        foreach (DataRow drow in dtResult.Rows)
                        {
                            DataRow row = dtSort.NewRow();
                            for (int i = 0; i < dtSort.Columns.Count; i++)
                            {
                                if (dtSort.Columns[i].DataType == typeof(System.Decimal))
                                {
                                    row[i] = drow[dtSort.Columns[i].ColumnName].ToString() != "" ? Math.Round(Convert.ToDecimal(drow[dtSort.Columns[i].ColumnName]), 2) : 0;
                                }
                                else
                                {
                                    row[i] = drow[dtSort.Columns[i].ColumnName].ToString() != "" ? drow[dtSort.Columns[i].ColumnName] : DBNull.Value;
                                }
                            }
                            dtSort.Rows.Add(row);
                        }
                    }
                }
            }
            catch (Exception ex)
            {
                LogFactory.Exception(ex);
                return null;
            }
            LogFactory.Export("excel", param.ApiUrl, Newtonsoft.Json.JsonConvert.SerializeObject(param.ToDBParameter()), dtSort.Rows.Count, dtSort.Columns.Count);
            return dtSort;
        }
        /// <summary>
        /// Update rejected status of invoice id.
        /// </summary>
        /// <param name="info"></param>
        /// <returns></returns>
        [HttpPost]
        [ActionName("UpdateRejectedStatus")]
        public object UpdateRejectedStatus([FromBody] dynamic info)
        {
            var removed = "removed";
            try
            {
                List<DBParameter> argsRm = new List<DBParameter>();
                argsRm.Add(new DBParameter("@reject_flag", DbType.AnsiString, info["RejectedFlag"].Value));
                argsRm.Add(new DBParameter("@invoice_id", DbType.AnsiString, info["InvoiceId"].Value));
                LoadResult(DBConstants.RemoveRejectedStatus, argsRm.ToArray());
            }
            catch (Exception ex)
            {
                BIACore.Log.LogFactory.Exception(ex);
                throw;
            }
            return removed;
        }

        /// <summary>
        /// Generate Ocean MBL reports
        /// </summary>
        /// <param name="param"></param>
        /// <param name="dCount"></param>
        /// <returns></returns>
        public string GenerateOceanMBL(biafilter.Filter param, ref int dCount)
        {
            DataTable dtResult = new DataTable();
            DataTable dtSort = new DataTable("Sorted");
            param.start = -1;
            List<DBParameter> args = new List<DBParameter>();
            List<string> colList = new List<string>();
            colList.Add("ROWNUMBER"); colList.Add("type"); colList.Add("rank"); colList.Add("prec"); colList.Add("mbl_nbr");
            try
            {
                args.Add(new DBParameter("@mbl_number", DbType.AnsiString, param.MBLNumber));
                args.Add(new DBParameter("@display_currency", DbType.AnsiString, param.DisplayCurr));
                args.Add(new DBParameter("@export", DbType.AnsiString, 1));
                dtResult = SQL.Execute(Connection, DBConstants.GetOceanMBL, args.ToArray());
                if (param.DataIndexes != "")
                {
                    var dataIndexes = Regex.Split(param.DataIndexes, ",");
                    foreach (var str in dataIndexes)
                    {
                        for (int i = 0; i < dtResult.Columns.Count; i++)
                        {
                            if (dtResult.Columns[i].ColumnName == str.ToString() && dtResult.Columns[i].ColumnName != "")
                            {
                                dtSort.Columns.Add(dtResult.Columns[i].ColumnName, dtResult.Columns[i].DataType);
                            }
                        }
                    }
                    foreach (DataRow drow in dtResult.Rows)
                    {
                        DataRow row = dtSort.NewRow();
                        for (int i = 0; i < dtSort.Columns.Count; i++)
                        {
                            if (dtSort.Columns[i].DataType == typeof(System.Decimal))
                            {
                                row[i] = drow[dtSort.Columns[i].ColumnName].ToString() != "" ? Math.Round(Convert.ToDecimal(drow[dtSort.Columns[i].ColumnName]), 2) : 0;
                            }
                            else
                            {
                                row[i] = drow[dtSort.Columns[i].ColumnName].ToString() != "" ? drow[dtSort.Columns[i].ColumnName] : DBNull.Value;
                            }
                        }
                        dtSort.Rows.Add(row);
                    }
                }
                StringBuilder result = new StringBuilder();
                dCount = dtSort.Rows.Count;
                result.Append("<html style='background-color: #F5FBDD;border: 1px solid black;'>");
                result.Append("<span style='background-color: #909C5F; border: 1px solid black; font-weight:bold;font-size:14px;'>" + "MBL Number:  " + param.MBLNumber + "     " + dtResult.Rows[0]["orig_tp"] + "  to  " + dtResult.Rows[0]["dest_tp"] + "    " + dtResult.Rows[0]["service_code"] + "</span>");
                result.Append("<table><meta charset=" + "UTF-8" + ">");
                result.Append("<tr style='background-color: #909C5F;color:white; border: 1px solid black;'>");
                if (param.ColumnNames != "")
                {
                    var columns = Regex.Split(param.ColumnNames, ",");
                    foreach (var col in columns)
                    {
                        if (colList.IndexOf(col) < 0)
                        {
                            result.Append("<th align='left' valign='middle' width='50px'>" + col.Replace("</BR>", "").Replace("<BR>", "").ToString() + "</th>");
                        }
                    }
                }
                result.Append("</tr>");
                var type = "";
                var lastChg = "";
                foreach (DataRow row in dtSort.Rows)
                {

                    if (type != row["type"].ToString() && row["prec"].ToString() == "1")
                    {
                        result.Append("<tr style='background-color: #F5FBDD;border: 1px solid black;font-weight:bold;'>");
                        result.Append("<td align='left' valign='middle' width='50px'>" + row["type"].ToString() + "</td>");
                        result.Append("</tr>");
                    }
                    if (row["prec"].ToString() != "1")
                    {
                        result.Append("<tr style='background-color: #F5FBDD;border: 1px solid black;font-weight:bold;'>");
                    }
                    else
                    {
                        result.Append("<tr style='background-color: #F5FBDD;border: 1px solid black;'>");
                    }
                    type = row["type"].ToString();

                    for (int i = 0; i < dtSort.Columns.Count; i++)
                    {
                        if (colList.IndexOf(dtSort.Columns[i].ColumnName) < 0)
                        {
                            if (row["mbl_nbr"].ToString() != "" && i == 15)
                            {
                                result.Append("<td align='left' valign='middle' width='50px'>" + row[i] + " * " + "</td>");
                            }
                            else
                            {
                                if (lastChg == row["charge_code"].ToString() && new[] { 12, 14, 17 }.Contains(i) && row["prec"].ToString() == "1")
                                {
                                    result.Append("<td>" + "-" + "</td>");
                                }
                                else
                                {
                                    if (dtSort.Columns[i].ColumnName == "acctg_per_year" && row["prec"].ToString() != "1")
                                    {
                                        result.Append("<td align='left' valign='middle' width='50px'>" + row["type"].ToString() + "</td>");
                                    }
                                    else if (dtSort.Columns[i].ColumnName == "margin_per")
                                    {
                                        result.Append("<td align='left' valign='middle' width='50px'>" + row[i] + "%" + "</td>");
                                    }
                                    else
                                    {
                                        result.Append("<td align='left' valign='middle' width='50px'>" + row[i] + "</td>");
                                    }
                                }
                            }
                        }
                        result.Append(i == dtSort.Columns.Count - 1 ? "\n" : "");
                    }
                    result.Append("</tr>");
                    lastChg = row["charge_code"].ToString();
                }
                result.Append("<tr style='background-color: #F5FBDD;border: 1px solid black;'> <td align='left' valign='middle'> " + dtResult.Rows[0]["TotalRows"] + "  Records " + "</td></tr>");
                result.Append("</table>");
                result.Append("<p>Items with * after the buy amounts are from the Master Bill Currency conversions at UPS Treasury's most recent monthly average rate.</p>");
                result.Append("</html>");
                return result.ToString();
            }
            catch (Exception ex)
            {
                BIACore.Log.LogFactory.Exception(ex);
                return null;
            }

        }
    }

}

