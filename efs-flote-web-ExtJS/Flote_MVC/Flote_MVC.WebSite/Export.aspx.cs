//using System;
//using System.IO;
//using System.Web;
//using System.Web.UI.WebControls;
//using System.Data;
//using Flote.WebAPI.WebAPI;
////using iTextSharp.text.pdf;
////using iTextSharp.text;




//namespace Flote.WebSite.Website
//{
//    /// <summary>
//    /// Class Export.
//    /// </summary>
//    public partial class Export : System.Web.UI.Page
//    {
//        protected void Page_Load(object sender, EventArgs e)
//        {
//            try
//            {
//                if (!string.IsNullOrEmpty(Request.QueryString["Invoice_ID"]))
//                {
//                    var Invoice_ID = Convert.ToInt32(Request.QueryString["Invoice_ID"]);

//                    DataTable dtExcel = ExcelExporter.GetRecords_Identifier_UserID(Invoice_ID, true, true, 0, 9999, "", "");
//                    ExportToExcel(dtExcel);
//                }
//            }
//            catch (Exception ex)
//            {
//                string Err = ex.Message.ToString();
//                BIACore.Log.LogFactory.Message(Err);
//            }

//        }
//        /// <summary>
//        /// Method Export to excel the excel data from workbookdata table.
//        /// </summary>
//        /// <param name="dt"></param>
//        public void ExportToExcel(DataTable dt)
//        {
//            if (dt.Rows.Count > 0)
//            {
//                string filename = "ExportExcel.xls";
//                System.IO.StringWriter tw = new System.IO.StringWriter();
//                System.Web.UI.HtmlTextWriter hw = new System.Web.UI.HtmlTextWriter(tw);
//                DataGrid dgGrid = new DataGrid();
//                dgGrid.DataSource = dt;
//                dgGrid.DataBind();
//                dgGrid.HeaderStyle.BackColor = System.Drawing.Color.FromName("#909C5F");
//                dgGrid.HeaderStyle.Font.Bold = true;
//                dgGrid.HeaderStyle.ForeColor = System.Drawing.Color.FromName("#FFFFFF");
//                dgGrid.BackColor = System.Drawing.Color.FromName("#F5FBDD");
//                //Get the HTML for the control.
//                dgGrid.RenderControl(hw);
//                //Write the HTML back to the browser.
//                Response.ContentType = "application/vnd.ms-excel";
//                Response.AppendHeader("Content-Disposition", "attachment; filename=" + filename + "");
//                this.EnableViewState = false;
//                Response.Write(tw.ToString());
//                Response.End();
//            }
//        }
//        //public static MemoryStream DataTableToExcelXlsx(DataTable table, string sheetName)
//        //{
//        //    MemoryStream Result = new MemoryStream();
//        //    var excel = new Microsoft.Office.Interop.Excel.Application();
//        //    var workbook = excel.Workbooks.Add(true);
//        //    //AddExcelSheet(table, workbook);
//        //    workbook.SaveAs(Result);
//        //    return Result;
//        //}
//        /// <summary>
//        /// KK-This method add new Excel Worksheet using DataTable
//        /// </summary>
//        /// <param name="ds"></param>
//        //private static void AddExcelSheet(System.Data.DataTable dt, Excel.Workbook wb)
//        //{
//        //    Excel.Sheets sheets = wb.Sheets;
//        //    Excel.Worksheet newSheet = sheets.Add();
//        //    newSheet.Name = "ExcelExport";

//        //    int iCol = 0;

//        //    foreach (DataColumn c in dt.Columns)
//        //    {
//        //        iCol++;
//        //        newSheet.Cells[1, iCol] = c.ColumnName;
//        //        newSheet.Cells[1, iCol].Interior.Color = System.Drawing.ColorTranslator.ToOle(System.Drawing.Color.RoyalBlue);
//        //        newSheet.Cells[1, iCol].Font.Color = System.Drawing.ColorTranslator.ToOle(System.Drawing.Color.White);
//        //        newSheet.Cells[1, iCol].Font.Bold = true;
//        //        newSheet.Cells[1, iCol].BorderAround(Excel.XlLineStyle.xlContinuous, Excel.XlBorderWeight.xlThin);
//        //    }

//        //    int iRow = 0;
//        //    foreach (DataRow r in dt.Rows)
//        //    {
//        //        iRow++;

//        //        // add each row's cell data...
//        //        iCol = 0;

//        //        foreach (DataColumn c in dt.Columns)
//        //        {
//        //            iCol++;
//        //            newSheet.Cells[iRow + 1, iCol] = r[c.ColumnName];
//        //            newSheet.Cells[iRow + 1, iCol].BorderAround(Excel.XlLineStyle.xlContinuous, Excel.XlBorderWeight.xlThin);
//        //        }
//        //    }

//        //}

//        public bool ExportWorkbookToPdf(string workbookPath, string outputPath, int zoom)
//        {
//            if (zoom == 0 )
//            {
//                zoom = 80;
//            }
//            // If either required string is null or empty, stop and bail out
//            if (string.IsNullOrEmpty(workbookPath) || string.IsNullOrEmpty(outputPath))
//            {
//                return false;
//            }

//            // Create COM Objects
//            Microsoft.Office.Interop.Excel.Application excelApplication;
//            Microsoft.Office.Interop.Excel.Workbook excelWorkbook;

//            // Create new instance of Excel
//            excelApplication = new Microsoft.Office.Interop.Excel.Application();


//            // Make the process invisible to the user
//            excelApplication.ScreenUpdating = false;

//            // Make the process silent
//            excelApplication.DisplayAlerts = false;


//            // Open the workbook that you wish to export to PDF
//            excelWorkbook = excelApplication.Workbooks.Open(workbookPath);

//            // If the workbook failed to open, stop, clean up, and bail out
//            if (excelWorkbook == null)
//            {
//                excelApplication.Quit();

//                excelApplication = null;
//                excelWorkbook = null;

//                return false;
//            }

//            var exportSuccessful = true;
//            try
//            {

//                Microsoft.Office.Interop.Excel.Worksheet sheet = (Microsoft.Office.Interop.Excel.Worksheet)excelWorkbook.Sheets[1];


//                // Take the used range of the sheet. Finally, get an object array of all
//                // of the cells in the sheet (their values). You can do things with those
//                // values. See notes about compatibility.
//                //

//                sheet.PageSetup.PaperSize = Microsoft.Office.Interop.Excel.XlPaperSize.xlPaperLegal;
//                sheet.PageSetup.Orientation = Microsoft.Office.Interop.Excel.XlPageOrientation.xlLandscape;
//                sheet.PageSetup.LeftMargin = 0.75;// Microsoft.Office.Interop.Excel.Application.InchesToPoints(0.5);
//                sheet.PageSetup.RightMargin = 0.75;// Microsoft.Office.Interop.Excel.Application.InchesToPoints(0.75);
//                sheet.PageSetup.TopMargin = 1.5;// Microsoft.Office.Interop.Excel.Application.InchesToPoints(1.5);
//                sheet.PageSetup.BottomMargin = 1;// Microsoft.Office.Interop.Excel.Application.InchesToPoints(1);
//                sheet.PageSetup.HeaderMargin = 0.5;//Microsoft.Office.Interop.Excel.Application.InchesToPoints(0.5);
//                sheet.PageSetup.FooterMargin = 0.5;//Microsoft.Office.Interop.Excel.Application.InchesToPoints(0.5);
//                sheet.PageSetup.PaperSize = Microsoft.Office.Interop.Excel.XlPaperSize.xlPaperLegal;
//                sheet.PageSetup.Zoom = zoom;

//                // Call Excel's native export function (valid in Office 2007 and Office 2010, AFAIK)
//                excelWorkbook.ExportAsFixedFormat(Microsoft.Office.Interop.Excel.XlFixedFormatType.xlTypePDF, outputPath);
//            }
//            catch (System.Exception ex)
//            {
//                // Mark the export as failed for the return value...
//                exportSuccessful = false;
//                throw ex;
//                // Do something with any exceptions here, if you wish...
//                // MessageBox.Show...        
//            }
//            finally
//            {
//                // Close the workbook, quit the Excel, and clean up regardless of the results...
//                excelWorkbook.Close();
//                excelApplication.Quit();

//                excelApplication = null;
//                excelWorkbook = null;
//            }

//            // You can use the following method to automatically open the PDF after export if you wish
//            // Make sure that the file actually exists first...
//            //if (System.IO.File.Exists(outputPath))
//            //{
//            //    System.Diagnostics.Process.Start(outputPath);
//            //}

//            return exportSuccessful;
//        }
//        /// <summary>
//        /// Method Export to excel the excel data from workbookdata table.
//        /// </summary>
//        /// <param name="dt"></param>
//        //public void ExportToExcel(DataTable dt)
//        //{
//        //    // var invoiceId = "1025828";

//        //    try
//        //    {
//        //        //string filePath = ExcelExporter.GenerateStreamData(invoiceId);
//        //        // string outPutPath = @"D:\Projects\Flote\Flote_MVC\Flote_MVC.WebSite\Export\result.pdf";
//        //        // var falg = ExportWorkbookToPdf(filePath, outPutPath);
//        //        //Response.Clear();
//        //        //Response.AddHeader("Content-Type", "application/pdf");
//        //        //Response.AddHeader("Cache-Control", "max-age=0");
//        //        //Response.AddHeader("Accept-Ranges", "none");
//        //        //Response.AddHeader("Content-Disposition", "attachment; filename=ExcelToPdf.pdf");

//        //        //// send the generated PDF
//        //        //ms.WriteTo(Response.OutputStream);
//        //        //Response.Write(ms);
//        //        //ms.Close();
//        //        //Response.Flush();
//        //        // HttpContext.Current.ApplicationInstance.CompleteRequest();
//        //        //HttpContext.Current.Response.End();
//        //        //
//        //        //Response.End();
//        //        /*if (dt.Rows.Count > 0)
//        //        {
//        //            string filename = "ExportExcel.pdf";                   
//        //            DataGrid dgGrid = new DataGrid();
//        //            dgGrid.DataSource = dt;
//        //            dgGrid.DataBind();
//        //            dgGrid.HeaderStyle.BackColor = System.Drawing.Color.FromName("#909C5F");
//        //            dgGrid.HeaderStyle.Font.Bold = true;
//        //            dgGrid.HeaderStyle.ForeColor = System.Drawing.Color.FromName("#FFFFFF");
//        //            dgGrid.BackColor = System.Drawing.Color.FromName("#F5FBDD");
//        //            //Get the HTML for the control.

//        //            //Write the HTML back to the browser.
//        //            Response.ContentType = "application/pdf";
//        //            //Response.ContentType = "application/vnd.ms-excel";
//        //            Response.AppendHeader("Content-Disposition", "attachment; filename=" + filename + "");
//        //            this.EnableViewState = false;
//        //            StringWriter tw = new StringWriter();
//        //            HtmlTextWriter hw = new HtmlTextWriter(tw);
//        //            dgGrid.RenderControl(hw);
//        //            StringReader sr = new StringReader(tw.ToString());
//        //           // SelectPdf.PdfDocument doc = new SelectPdf.PdfDocument();
//        //            Document pdfDoc = new Document(PageSize.A4, 10f, 10f, 10f, 0f);
//        //           // pdfDoc.AddHeader("Test");
//        //            HTMLWorker htmlparser = new HTMLWorker(pdfDoc);
//        //            PdfWriter.GetInstance(pdfDoc, Response.OutputStream);
//        //            pdfDoc.Open();
//        //            htmlparser.Parse(sr);
//        //            pdfDoc.Close();
//        //            Response.Write(pdfDoc);
//        //            Response.End();                    

//        //        }*/
//        //    }
//        //    catch (Exception ex)
//        //    {
//        //        string Err = ex.Message.ToString();
//        //        BIACore.Log.LogFactory.Message(Err);
//        //        HttpContext.Current.Response.End();
//        //        //throw ex;
//        //    }
//        //    finally
//        //    {
//        //        //  ms.Dispose();
//        //    }
//        //}

//        public void ExportToPdfText(DataTable dt)
//        {
//            // var outPutPath = @"D:\Projects\Flote\Flote_MVC\Flote_MVC.WebSite\Export\BillsDetailsReport_" + param.InvoiceId + ".pdf";
//            //List<DBParameter> args = new List<DBParameter>();
//            //args.Add(new DBParameter("@invoice_id", DbType.AnsiString, param.InvoiceId));

//            // var dtInvSumHeader = SQL.Execute(Connections.Flote, "usp_GetInvoiceSumHeader", args.ToArray());
//            //args.Add(new DBParameter("@sort", DbType.AnsiString, param.SortParam));
//            //args.Add(new DBParameter("@export", DbType.Int16, 1));
//            // var dtBillsDet = SQL.Execute(Connections.Flote, "usp_GetInvoiceDetail_TNew", args.ToArray());

//            //Document pdfDoc = new Document(PageSize.A4, 10, 10, 10, 10);
//            //try
//            //{
//            //    //PdfWriter writer = PdfWriter.GetInstance(pdfDoc, new FileStream(outPutPath, FileMode.Create));
//            //    //pdfDoc.Open();
//            //    PdfWriter.GetInstance(pdfDoc, System.Web.HttpContext.Current.Response.OutputStream);
//            //    pdfDoc.Open();
//            //    //Chunk c = new Chunk("" + System.Web.HttpContext.Current.Session["CompanyName"] + "", FontFactory.GetFont("Verdana", 11));
//            //    //Paragraph p = new Paragraph();
//            //    //p.Alignment = Element.ALIGN_CENTER;
//            //    //p.Add(c);
//            //    //pdfDoc.Add(p);
//            //    //string clientLogo = System.Web.HttpContext.Current.Session["CompanyName"].ToString();
//            //    //clientLogo = clientLogo.Replace(" ", "");
//            //    //string clogo = clientLogo + ".jpg";
//            //    //string imageFilePath = System.Web.HttpContext.Current.Server.MapPath("../ClientLogo/" + clogo + "");
//            //    //iTextSharp.text.Image jpg = iTextSharp.text.Image.GetInstance(imageFilePath);
//            //    ////Resize image depend upon your need   
//            //    //jpg.ScaleToFit(80f, 60f);
//            //    ////Give space before image   
//            //    //jpg.SpacingBefore = 0f;
//            //    ////Give some space after the image   
//            //    //jpg.SpacingAfter = 1f;
//            //    //jpg.Alignment = Element.HEADER;
//            //    //pdfDoc.Add(jpg);
//            //    Font font8 = FontFactory.GetFont("ARIAL", 7);
//            //    //iTextSharp.text.Font font = new iTextSharp.text.Font();
//            //    //DataTable dt = dtBillsDet;
//            //    if (dt != null)
//            //    {
//            //        //Craete instance of the pdf table and set the number of column in that table  
//            //        PdfPTable PdfTable = new PdfPTable(dt.Columns.Count);
//            //        PdfPCell PdfPCell = null;

//            //        for (int column = 0; column < dt.Columns.Count; column++)
//            //        {
//            //            PdfPCell = new PdfPCell(new Phrase(new Chunk(dt.Columns[column].ToString(), font8)));
//            //            PdfTable.AddCell(PdfPCell);
//            //        }
//            //        for (int rows = 0; rows < dt.Rows.Count; rows++)
//            //        {
//            //            for (int column = 0; column < dt.Columns.Count; column++)
//            //            {
//            //                PdfPCell = new PdfPCell(new Phrase(new Chunk(dt.Rows[rows][column].ToString(), font8)));
//            //                PdfTable.AddCell(PdfPCell);
//            //            }
//            //        }
//            //        //PdfTable.SpacingBefore = 15f; // Give some space after the text or it may overlap the table            
//            //        pdfDoc.Add(PdfTable); // add pdf table to the document   
//            //    }
//            //    pdfDoc.Close();
//            //    Response.ContentType = "application/pdf";
//            //    Response.AddHeader("content-disposition", "attachment; filename= SampleExport.pdf");
//            //    System.Web.HttpContext.Current.Response.Write(pdfDoc);
//            //    Response.Flush();
//            //    Response.End();
//            //    HttpContext.Current.ApplicationInstance.CompleteRequest();
//            //}
//            //catch (DocumentException de)
//            //{
//            //    System.Web.HttpContext.Current.Response.Write(de.Message);
//            //}
//            //catch (IOException ioEx)
//            //{
//            //    System.Web.HttpContext.Current.Response.Write(ioEx.Message);
//            //}
//            //catch (Exception ex)
//            //{
//            //    System.Web.HttpContext.Current.Response.Write(ex.Message);
//            //}
//            ////Document document = new Document();
//            ////PdfWriter writer = PdfWriter.GetInstance(document, new FileStream(outPutPath, FileMode.Create));
//            ////document.Open();
//            ////iTextSharp.text.Font font5 = iTextSharp.text.FontFactory.GetFont(FontFactory.HELVETICA, 5);

//            ////PdfPTable table = new PdfPTable(dtBillsDet.Columns.Count);
//            ////PdfPRow row = null;
//            ////float[] widths = new float[] { 4f, 4f, 4f, 4f };

//            ////table.SetWidths(widths);

//            ////table.WidthPercentage = 100;
//            ////int iCol = 0;
//            ////string colname = "";
//            ////PdfPCell cell = new PdfPCell(new Phrase("Products"));

//            ////cell.Colspan = dtBillsDet.Columns.Count;

//            ////foreach (DataColumn c in dtBillsDet.Columns)
//            ////{

//            ////    table.AddCell(new Phrase(c.ColumnName, font5));
//            ////}

//            ////foreach (DataRow r in dtBillsDet.Rows)
//            ////{
//            ////    if (dtBillsDet.Rows.Count > 0)
//            ////    {
//            ////        table.AddCell(new Phrase(r[0].ToString(), font5));
//            ////        table.AddCell(new Phrase(r[1].ToString(), font5));
//            ////        table.AddCell(new Phrase(r[2].ToString(), font5));
//            ////        table.AddCell(new Phrase(r[3].ToString(), font5));
//            ////    }
//            ////} document.Add(table);
//            ////document.Close();
//            //// return outPutPath;
//        }
//    }
//}