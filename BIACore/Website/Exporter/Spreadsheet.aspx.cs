using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Data;
using System.Linq;
using System.Web;
using System.Web.Script.Serialization;
using System.Web.UI;
using System.Web.UI.WebControls;
using Microsoft.CSharp.RuntimeBinder;
using BIACore.Web.Model.ExtJS;
using DocumentFormat.OpenXml;
using SpreadsheetLight;
using System.IO;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Text;
using BIACore.Web.Model;
using System.Security;
using System.Web.UI.HtmlControls;
using System.Text.RegularExpressions;

namespace BIACore.Website.Exporter
{
    public partial class Spreadsheet : System.Web.UI.Page
    {
        public string type = "";
        public string filename = "";
        public string sheetTitle = "";
        public string appUrlBase = "";
        public string filterDisplay = "";
        public string storeUrl = "";
        public string storeExtraParams = "";
        public string columns = "";
        public string dataTypeFormats = "";
        public string events = "";
        private const int TITLE_ROW_NUM = 1;
        private const int FILTER_ROW_NUM = 2;
        private const string spaceReplacePattern = @"[\t\n\r]+";
        private const string removalPattern = @"[^\x20-\x7E]";
        private Dictionary<string, string> MIMETypeMap = new Dictionary<string, string>() {
            {".doc",      "application/msword" },
            {".dot",      "application/msword" },
            {".docx",    "application/vnd.openxmlformats-officedocument.wordprocessingml.document" },
            {".dotx",    "application/vnd.openxmlformats-officedocument.wordprocessingml.template" },
            {".docm",    "application/vnd.ms-word.document.macroEnabled.12" },
            {".dotm",    "application/vnd.ms-word.template.macroEnabled.12" },
            {".xls",     "application/vnd.ms-excel" },
            {".xlt",     "application/vnd.ms-excel" },
            {".xla",     "application/vnd.ms-excel" },
            {".xlsx",    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" },
            {".xltx",    "application/vnd.openxmlformats-officedocument.spreadsheetml.template" },
            {".xlsm",    "application/vnd.ms-excel.sheet.macroEnabled.12" },
            {".xltm",    "application/vnd.ms-excel.template.macroEnabled.12" },
            {".xlam",    "application/vnd.ms-excel.addin.macroEnabled.12" },
            {".xlsb",    "application/vnd.ms-excel.sheet.binary.macroEnabled.12" },
            {".ppt",     "application/vnd.ms-powerpoint" },
            {".pot",     "application/vnd.ms-powerpoint" },
            {".pps",     "application/vnd.ms-powerpoint" },
            {".ppa",     "application/vnd.ms-powerpoint" },
            {".pptx",    "application/vnd.openxmlformats-officedocument.presentationml.presentation" },
            {".potx",    "application/vnd.openxmlformats-officedocument.presentationml.template" },
            {".ppsx",    "application/vnd.openxmlformats-officedocument.presentationml.slideshow" },
            {".ppam",    "application/vnd.ms-powerpoint.addin.macroEnabled.12" },
            {".pptm",    "application/vnd.ms-powerpoint.presentation.macroEnabled.12" },
            {".potm",    "application/vnd.ms-powerpoint.template.macroEnabled.12" },
            {".ppsm",    "application/vnd.ms-powerpoint.slideshow.macroEnabled.12" },
            {".mdb",     "application/vnd.ms-access" }
        };

        protected void Page_Load(object sender, EventArgs e)
        {
            Response.Clear();

            JavaScriptSerializer jss = new JavaScriptSerializer();
            jss.MaxJsonLength = 2147483647;
            if (!IsPostBack)
            {
                try
                {
                    if (HttpContext.Current.Request.RequestType == "POST")
                    {
                        fld_type.Value = HttpContext.Current.Request.Form["type"];
                        fld_filename.Value = HttpContext.Current.Request.Form["filename"];
                        fld_sheetTitle.Value = HttpContext.Current.Request.Form["sheetTitle"];
                        fld_appUrlBase.Value = HttpContext.Current.Request.Form["appUrlBase"];
                        fld_filterDisplay.Value = HttpContext.Current.Request.Form["filterDisplay"];
                        fld_storeUrl.Value = HttpContext.Current.Request.Form["storeUrl"];
                        fld_storeExtraParams.Value = HttpContext.Current.Request.Form["storeExtraParams"];
                        fld_columns.Value = HttpContext.Current.Request.Form["columns"];
                        fld_dataTypeFormats.Value = HttpContext.Current.Request.Form["dataTypeFormats"];
                    }
                    else if (HttpContext.Current.Request.RequestType == "GET")
                    {
                        fld_type.Value = HttpContext.Current.Request.QueryString["type"];
                        fld_filename.Value = HttpContext.Current.Request.QueryString["filename"];
                        fld_sheetTitle.Value = HttpContext.Current.Request.Form["sheetTitle"];
                        fld_appUrlBase.Value = HttpContext.Current.Request.QueryString["appUrlBase"];
                        fld_filterDisplay.Value = HttpContext.Current.Request.Form["filterDisplay"];
                        fld_storeUrl.Value = HttpContext.Current.Request.QueryString["storeUrl"];
                        fld_storeExtraParams.Value = HttpContext.Current.Request.QueryString["storeExtraParams"];
                        fld_columns.Value = HttpContext.Current.Request.QueryString["columns"];
                        fld_dataTypeFormats.Value = HttpContext.Current.Request.QueryString["dataTypeFormats"];
                    }

                    fld_downloadId.Value = (new Random()).Next().ToString();

                    type = fld_type.Value;
                    filename = fld_filename.Value;
                    sheetTitle = fld_sheetTitle.Value;
                    appUrlBase = fld_appUrlBase.Value;
                    filterDisplay = fld_filterDisplay.Value;
                    storeUrl = fld_storeUrl.Value;
                    storeExtraParams = fld_storeExtraParams.Value;
                    columns = fld_columns.Value;
                    dataTypeFormats = fld_dataTypeFormats.Value;

                    Log.LogFactory.Message("Exporter Spreadsheet passed data:{0}type={1},{0}filename={2},{0}appUrlBase={3},{0}storeUrl={4},{0}storeExtraParams={5},{0}columns={6},{0}dataTypeFormats={7},{0}sheetTitle={8},{0}filterDisplay={9}",
                        new object[] { Environment.NewLine, type, filename, appUrlBase, storeUrl, storeExtraParams, columns, dataTypeFormats, sheetTitle, filterDisplay });

                    events += "Consumed passed param values";
                }
                catch (System.Threading.ThreadAbortException taex) { }
                catch (Exception ex)
                {
                    Log.LogFactory.Exception(ex);
                }
            }

            if (IsPostBack)
            {
                fld_downloadAttempt.Value = null;
                type = fld_type.Value;
                filename = fld_filename.Value;
                sheetTitle = fld_sheetTitle.Value;
                appUrlBase = fld_appUrlBase.Value;
                filterDisplay = fld_filterDisplay.Value;
                storeUrl = fld_storeUrl.Value;
                storeExtraParams = fld_storeExtraParams.Value;
                columns = fld_columns.Value;
                dataTypeFormats = fld_dataTypeFormats.Value;

                Log.LogFactory.Message("Exporter Spreadsheet IsPostBack: {8}{0}passed data:{0}type={1},{0}filename={2},{0}appUrlBase={3},{0}storeUrl={4},{0}storeExtraParams={5},{0}columns={6},{0}dataTypeFormats={7},{0}sheetTitle={8}",
                    new object[] { Environment.NewLine, type, filename, appUrlBase, storeUrl, storeExtraParams, columns, dataTypeFormats, IsPostBack.ToString(), sheetTitle });
                try
                {
                    Dictionary<string, object> extraParams = null;
                    List<Dictionary<string, object>> columnArray = null;
                    Dictionary<string, object> dataTypeFormatsArray = null;

                    if (storeExtraParams.IndexOf("{") == 0)
                    {
                        extraParams = jss.Deserialize<Dictionary<string, object>>(storeExtraParams);
                    }
                    events += Environment.NewLine + "Deserialized storeExtraParams";
                    if (columns.IndexOf("[") == 0)
                    {
                        columnArray = jss.Deserialize<List<Dictionary<string, object>>>(columns);
                    }
                    events += Environment.NewLine + "Deserialized columns";
                    if (dataTypeFormats.IndexOf("{") == 0)
                    {
                        dataTypeFormatsArray = jss.Deserialize<Dictionary<string, object>>(dataTypeFormats);
                    }
                    events += Environment.NewLine + "Deserialized dataTypeFormats";


                    events += Environment.NewLine + "Store call to store " + appUrlBase + storeUrl + " initializing.";
                    string storeReturn = null;
                    string appWebAPIUrl = appUrlBase + storeUrl + "?" + API.EXPORTER_COOKIE + "=" + System.Web.HttpUtility.UrlEncode(Security.Session.sessionId.ToString());
                    try
                    {
                        storeReturn = Web.Client.Post(appWebAPIUrl, extraParams, false);
                    }
                    catch (Exception ex)
                    {
                        Log.LogFactory.Error("Exporter Spreadsheet StoreCallError: {0}url: {1}{0}" + storeReturn, new object[] { Environment.NewLine, appWebAPIUrl });
                        throw;
                    }
                    List<object> data = new List<object>();
                    events += Environment.NewLine + "Store call made";


                    try
                    {
                        Dictionary<string, object> storeData = jss.Deserialize<Dictionary<string, object>>(storeReturn);

                        data = (List<object>)(new StoreResult<object>()
                        {
                            MetaData = storeData.ContainsKey("metadata") ? (MetaData)storeData["metadata"] : null,
                            Data = storeData.ContainsKey("data") ? ((System.Collections.ArrayList)storeData["data"]).Cast<object>().ToList<object>() : null,
                            Total = storeData.ContainsKey("total") ? (int?)storeData["total"] : null,
                            DataTotal = storeData.ContainsKey("dataTotal") ? (object)storeData["dataTotal"] : null,
                            Success = storeData.ContainsKey("success") ? (bool)storeData["success"] : true,
                            Debug = storeData.ContainsKey("debug") ? DebugData.LoadFromDictionary((Dictionary<string, object>)storeData["debug"]) : null
                        }).GetData();
                    }
                    catch (RuntimeBinderException rbex)
                    {

                        dynamic storeData = jss.Deserialize<dynamic>(storeReturn);
                        throw rbex;
                    }

                    //Log.LogFactory.Message("Exporter Spreadsheet storeData Records:{0}, Record Type:{1}", new object[] { data.Count.ToString(), data[0] });
                    events += Environment.NewLine + "Retrieved Store Data";


                    DataTable spreadsheetData = Newtonsoft.Json.JsonConvert.DeserializeObject<DataSet>("{'Table1':" + jss.Serialize(data) + "}").Tables["Table1"];
                    DataTable orderedViewableData = new DataTable();

                    if (spreadsheetData.Columns.Count == 0) throw new Exception("Store Return Data not formatted correctly to convert to DataTable");

                    string columnNames = "";
                    /*
                    foreach (DataColumn col in spreadsheetData.Columns)
                    {
                        columnNames += col.ColumnName + ",";
                    }
                    Log.LogFactory.Message("Exporter Spreadsheet store return data converted to DataTable. Columns = [{0}], Records = {1},{2}Sample Record: {3}", new object[] {
                        columnNames,
                        spreadsheetData.Rows.Count.ToString(),
                        Environment.NewLine,
                        jss.Serialize(spreadsheetData.Rows[0].ItemArray)
                    });
                    */
                    //Add columns from WebAPI return data that match view configured columns
                    for (int i = 0; i < columnArray.Count; i++)
                    {
                        DataColumn column = FindDataColumnByColumnName(spreadsheetData.Columns, columnArray[i]["dataIndex"].ToString());
                        if (column != null)
                        {
                            //TODO: Add code to see if ColumnName already exists in columns and if so change to Column[i]_[text] for column and columnArray
                            column.ColumnName = columnArray[i]["text"].ToString();
                            orderedViewableData.Columns.Add(column);
                        }
                        else
                        {
                            //Add no matching column handler
                        }
                    }
                    events += Environment.NewLine + "Added columns from store return matching passed column list";


                    //Add data from WebAPI return data with reordered columns
                    foreach (DataRow currentRow in spreadsheetData.Rows)
                    {
                        List<object> rowData = new List<object>();
                        var numericTypes = new[] { typeof(Byte), typeof(Decimal), typeof(Double), typeof(Int16), typeof(Int32), typeof(Int64),
                                                                typeof(SByte), typeof(Single), typeof(UInt16), typeof(UInt32), typeof(UInt64)};
                        foreach (DataColumn newColumn in orderedViewableData.Columns)
                        {
                            //if (spreadsheetData.Rows.IndexOf(currentRow) == 1)
                            //{
                            //    Log.LogFactory.Message("Exporter Spreadsheet Column {0} DataType = {1}", new object[] { newColumn.ColumnName, newColumn.DataType.Name });
                            //}
                            /*
                            if (spreadsheetData.Rows.IndexOf(currentRow) == 0)
                            {
                                Log.LogFactory.Message("Exporter Spreadsheet Reorderd Columns info. Column Name: {0},{1}columnArray: {2}",
                                new object[] {
                                    newColumn.ColumnName,
                                    Environment.NewLine,
                                    jss.Serialize(columnArray)
                                });
                            }
                            */
                            Dictionary<string, object> columnData = FindColumnByColumnName(columnArray, newColumn.ColumnName);
                            if (columnData != null)
                            {
                                //if (spreadsheetData.Rows.IndexOf(currentRow) == 0)
                                //{
                                //    Log.LogFactory.Message("Exporter Spreadsheet current ColumnData = {0}", new object[] { jss.Serialize(columnData) });
                                //}
                                DataColumn originalColumn = FindDataColumnByColumnName(spreadsheetData.Columns, columnData["dataIndex"].ToString());
                                if (originalColumn != null)
                                {
                                    if (originalColumn.DataType.Name == "DateTime")
                                    {
                                        //if (spreadsheetData.Rows.IndexOf(currentRow) == 1)
                                        //{
                                        //    Log.LogFactory.Message("Exporter Spreadsheet DateTime Field", new object[] { newColumn.ColumnName, newColumn.DataType.Name });
                                        //}

                                        if (newColumn.DataType.Name != "String") newColumn.DataType = typeof(string);
                                        DateTime dt = new DateTime();
                                        bool conversionSuccessful = false;
                                        if (currentRow[originalColumn.ColumnName].GetType().Name == "DateTime")
                                        {
                                            //if (spreadsheetData.Rows.IndexOf(currentRow) == 1)
                                            //{
                                            //    Log.LogFactory.Message("Exporter Spreadsheet DateTime Field Value already DateTime", new object[] { newColumn.ColumnName, newColumn.DataType.Name });
                                            //}
                                            dt = (DateTime)currentRow[originalColumn.ColumnName];
                                            conversionSuccessful = true;
                                        }
                                        else
                                        {
                                            //if (spreadsheetData.Rows.IndexOf(currentRow) == 1)
                                            //{
                                            //    Log.LogFactory.Message("Exporter Spreadsheet DateTime Field need conversion from {1} string to DateTime", new object[] { newColumn.ColumnName, currentRow[originalColumn.ColumnName].ToString() });
                                            //}

                                            conversionSuccessful = DateTime.TryParse(ToValidString(currentRow[originalColumn.ColumnName]).ToString(), out dt);
                                        }

                                        if (conversionSuccessful)
                                        {
                                            object columnDataType = columnData["dataType"] != null ? columnData["dataType"].ToString().ToLower() : null;
                                            if (columnDataType != null)
                                            {
                                                object dataTypeFormat = dataTypeFormatsArray.Keys.Contains(columnData["dataType"].ToString().ToLower()) ? dataTypeFormatsArray[columnData["dataType"].ToString().ToLower()] : null;
                                                if (dataTypeFormat != null)
                                                {
                                                    string value = dt.ToString(dataTypeFormat.ToString());
                                                    if (value.ToLower() == "null") value = null;
                                                    rowData.Add(value);
                                                }
                                                else
                                                {
                                                    string value = dt.ToString();
                                                    if (value.ToLower() == "null") value = null;
                                                    rowData.Add(value);
                                                }
                                            }
                                            else
                                            {
                                                string value = dt.ToString();
                                                if (value.ToLower() == "null") value = null;
                                                rowData.Add(value);
                                            }
                                        }
                                    }
                                    //else if (newColumn.DataType.Name == "Double")
                                    //{
                                    //    double value;
                                    //    if (Double.TryParse(currentRow[originalColumn.ColumnName].ToString(), out value))
                                    //    {
                                    //        rowData.Add(value);
                                    //    }
                                    //    else
                                    //    {
                                    //        
                                    //    }
                                    //}
                                    else if (numericTypes.Contains(newColumn.DataType))
                                    {
                                        string value = ToValidString(currentRow[originalColumn.ColumnName]).ToString();
                                        if (value.ToString().ToLower() == "null") value = "0";
                                        Type t = newColumn.DataType;
                                        var converter = TypeDescriptor.GetConverter(t);
                                        rowData.Add(converter.ConvertFromInvariantString(value));
                                    }
                                    else
                                    {
                                        string value = ToValidString(currentRow[originalColumn.ColumnName]).ToString();
                                        if (value.ToLower() == "null") value = null;
                                        rowData.Add(value.Replace(((char)0).ToString(), ""));
                                        //rowData.Add(value.Replace(((char)0).ToString(), "").Replace("&","&amp;").Replace("<","$lt;"));
                                    }
                                }
                                else
                                {
                                    if (numericTypes.Contains(newColumn.DataType)) rowData.Add("0");
                                    else rowData.Add(null);
                                }
                            }
                            else
                            {
                                if (numericTypes.Contains(newColumn.DataType)) rowData.Add("0");
                                else rowData.Add(null);
                            }
                        }
                        //columnNames = "";
                        //foreach (DataColumn col in orderedViewableData.Columns)
                        //{
                        //    columnNames += col.ColumnName + ",";
                        //}
                        //Log.LogFactory.Message("Exporter Spreadsheet rowData = {0}{1}for columns = {2}", new object[] { jss.Serialize(rowData), Environment.NewLine, columnNames });

                        try
                        {
                            orderedViewableData.LoadDataRow(rowData.ToArray<object>(), true);
                        }
                        catch (Exception ex)
                        {
                            Log.LogFactory.Exception(ex);
                            throw ex;
                        }
                    }
                    events += Environment.NewLine + "Add data to export datatable";

                    /*
                    columnNames = "";
                    foreach (DataColumn col in orderedViewableData.Columns)
                    {
                        columnNames += col.ColumnName + ",";
                    }
                    Log.LogFactory.Message("Exporter Spreadsheet export data converted to DataTable. Columns = [{0}], Records = {1},{2}Sample Record: {3}", new object[] {
                        columnNames,
                        orderedViewableData.Rows.Count.ToString(),
                        Environment.NewLine,
                        jss.Serialize(orderedViewableData.Rows[0].ItemArray)
                    });
                    */

                    Log.LogFactory.Export(type, storeUrl, storeExtraParams, orderedViewableData.Rows.Count, orderedViewableData.Columns.Count);
                    events += Environment.NewLine + "Export Logged";

                    if (type == "excel")
                    {
                        SLDocument excel = new SLDocument();
                        excel.DocumentProperties.Title = filename;
                        excel.RenameWorksheet(SLDocument.DefaultFirstSheetName, sheetTitle);
                        DataColumnCollection orderedViewableDataColumns = orderedViewableData.Columns;
                        excel.ImportDataTable(1, 1, orderedViewableData, true);
                        events += Environment.NewLine + "Imported data to SpreadsheetLite Excel Document";
                        //Log.LogFactory.Message("Exporter Spreadsheet dataTypeFormatsArray = {0}", new object[] { jss.Serialize(dataTypeFormatsArray) });

                        if (dataTypeFormatsArray != null && dataTypeFormatsArray.Keys.Count > 0)
                        {
                            Dictionary<string, SLStyle> styles = new Dictionary<string, SLStyle>();
                            events += Environment.NewLine + "Create SLStyle Dictionary";

                            //Add styles for each data type in the excel file
                            foreach (string dataType in dataTypeFormatsArray.Keys)
                            {
                                SLStyle columnFormat = excel.CreateStyle();

                                columnFormat.FormatCode = dataTypeFormatsArray[dataType].ToString();
                                styles.Add(dataType, columnFormat);
                            }

                            events += Environment.NewLine + "Added dataType Format Styles to SLStyle Dictionary";
                            //Log.LogFactory.Message("Exporter Spreadsheet styles = {0}", new object[] { jss.Serialize(styles) });

                            foreach (DataColumn col in orderedViewableDataColumns)
                            {
                                if (FindColumnByColumnName(columnArray, col.ColumnName) != null && FindColumnByColumnName(columnArray, col.ColumnName)["dataType"] != null && styles.Keys.Contains<string>(FindColumnByColumnName(columnArray, col.ColumnName)["dataType"].ToString().ToLower()))
                                {
                                    //Log.LogFactory.Message("Exporter Spreadsheet Applying style to column. ColumnName: {0},{2}Style: {1}.", new object[] { col.ColumnName, jss.Serialize(styles[FindColumnByColumnName(columnArray, col.ColumnName)["dataType"].ToString()]), Environment.NewLine });
                                    excel.SetColumnStyle(orderedViewableDataColumns.IndexOf(col) + 1, styles[FindColumnByColumnName(columnArray, col.ColumnName)["dataType"].ToString().ToLower()]);
                                }
                                else if (FindColumnByColumnName(columnArray, col.ColumnName) == null)
                                {
                                    Log.LogFactory.Message("Exporter Spreadsheet Missing matching column {0} to add style.", new object[] { col.ColumnName });
                                }
                                //else if (FindColumnByColumnName(columnArray, col.ColumnName)["dataType"] == null)
                                //{
                                //    Log.LogFactory.Message("Exporter Spreadsheet Missing column {0} dataType to add style.", new object[] { col.ColumnName });
                                //}
                            }
                            events += Environment.NewLine + "Added column styles to SpreadsheetLite Excel Document";
                        }
                        else
                        {
                            events += Environment.NewLine + "Skipped Style creation";
                        }

                        //Log.LogFactory.Message("Exporter Spreadsheet sheetTitle=" + sheetTitle + " test if sheetTitle is null or empty string = " + (sheetTitle != null || sheetTitle != "").ToString());
                        //Insert and style title row
                        excel.InsertRow(TITLE_ROW_NUM, 1);
                        excel.SetCellValue("A" + TITLE_ROW_NUM.ToString(), sheetTitle != null || sheetTitle != "" ? sheetTitle : "Worksheet");
                        excel.MergeWorksheetCells(TITLE_ROW_NUM, 1, TITLE_ROW_NUM, orderedViewableData.Columns.Count);
                        SLStyle titleRowFormat = excel.CreateStyle();
                        titleRowFormat.SetFontBold(true);
                        titleRowFormat.SetHorizontalAlignment(DocumentFormat.OpenXml.Spreadsheet.HorizontalAlignmentValues.Center);
                        titleRowFormat.SetVerticalAlignment(DocumentFormat.OpenXml.Spreadsheet.VerticalAlignmentValues.Center);
                        titleRowFormat.SetWrapText(true);
                        titleRowFormat.Font.FontSize = 15;
                        titleRowFormat.Font.Underline = DocumentFormat.OpenXml.Spreadsheet.UnderlineValues.Single;
                        excel.SetRowStyle(TITLE_ROW_NUM, titleRowFormat);

                        //Insert and style filterDisplay row
                        var headerRowIndex = 2;
                        if (filterDisplay != "" && filterDisplay != null)
                        {
                            excel.InsertRow(FILTER_ROW_NUM, 1);
                            excel.SetCellValue("A2", "Filtered by: " + filterDisplay);
                            excel.MergeWorksheetCells(FILTER_ROW_NUM, 1, FILTER_ROW_NUM, orderedViewableData.Columns.Count);
                            headerRowIndex = 3;

                            SLStyle filterDisplayRowFormat = excel.CreateStyle();
                            filterDisplayRowFormat.SetWrapText(true);
                            filterDisplayRowFormat.SetHorizontalAlignment(DocumentFormat.OpenXml.Spreadsheet.HorizontalAlignmentValues.Left);
                            filterDisplayRowFormat.SetVerticalAlignment(DocumentFormat.OpenXml.Spreadsheet.VerticalAlignmentValues.Center);
                            filterDisplayRowFormat.Font.FontSize = 10;
                            excel.SetRowStyle(FILTER_ROW_NUM, filterDisplayRowFormat);
                        }

                        //Style column header row
                        SLStyle headerRowFormat = excel.CreateStyle();
                        headerRowFormat.SetFontBold(true);
                        headerRowFormat.Font.FontSize = 10;
                        headerRowFormat.SetPatternFill(DocumentFormat.OpenXml.Spreadsheet.PatternValues.Solid, System.Drawing.Color.LightGray, System.Drawing.Color.Black);
                        headerRowFormat.SetHorizontalAlignment(DocumentFormat.OpenXml.Spreadsheet.HorizontalAlignmentValues.Center);
                        headerRowFormat.SetWrapText(true);
                        for (int i = 1; i <= orderedViewableData.Columns.Count; i++)
                        {
                            excel.SetCellStyle(headerRowIndex, i, headerRowFormat);
                        }
                        excel.AutoFitColumn(1, orderedViewableDataColumns.Count);

                        //Saving of file
                        MemoryStream ms = new MemoryStream();
                        excel.SaveAs(ms);
                        ms.Position = 0;

                        Response.ContentType = "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";
                        //if (MIMETypeMap.Keys.ToList().IndexOf(filename.Substring(filename.LastIndexOf("."))) < 0) filename += ".xls";
                        //Response.ContentType = MIMETypeMap[filename.Substring(filename.LastIndexOf("."))]; // "application/vnd.ms-excel";
                        Response.AddHeader("content-disposition", "attachment;  filename=" + filename);
                        ms.WriteTo(Response.OutputStream);
                        events += Environment.NewLine + "Wrote SpreadsheetLite Excel Document to Response";
                    }
                    else
                    {
                        StringBuilder sb = new StringBuilder();

                        IEnumerable<string> colNames = orderedViewableData.Columns.Cast<DataColumn>().
                                                          Select(column => column.ColumnName);
                        sb.AppendLine(string.Join(",", colNames));

                        foreach (DataRow row in orderedViewableData.Rows)
                        {
                            IEnumerable<string> fields = row.ItemArray.Select(field =>
                              string.Concat("\"", field.ToString().Replace("\"", "\"\""), "\""));
                            sb.AppendLine(string.Join(",", fields));
                        }
                        events += Environment.NewLine + "Created string of data for CSV file";

                        Response.ContentType = "text/csv";
                        Response.AddHeader("content-disposition", "filename=" + filename);
                        Response.Write(sb.ToString());
                    }
                    Response.SetCookie(new HttpCookie("Download_" + fld_downloadId.Value + "_Complete", "1"));
                    Response.Flush();
                    Response.End();
                    events += Environment.NewLine + "Ended Response";
                }
                catch (System.Threading.ThreadAbortException taex)
                {
                    //events += Environment.NewLine + "Error in code: " + taex.Message;
                    //fld_downloadAttempt.Value = "1";
                }
                catch (Exception ex)
                {
                    Log.LogFactory.Exception(ex);
                    events += Environment.NewLine + "Error in code: " + ex.Message + Environment.NewLine + ex.StackTrace;
                    fld_downloadAttempt.Value = "1";
                }
                finally
                {
                    Log.LogFactory.Message("Exporter Spreadsheet Events:" + Environment.NewLine + events);
                }
            }
        }

        public static DataColumn FindDataColumnByColumnName(DataColumnCollection columns, string columnName)
        {
            DataColumn matchingColumn = null;

            foreach (DataColumn col in columns)
            {
                if (col.ColumnName == columnName)
                {
                    matchingColumn = new DataColumn(col.ColumnName, col.DataType);
                    break;
                }
            }

            return matchingColumn;
        }

        public static Dictionary<string, object> FindColumnByDataIndex(List<Dictionary<string, object>> list, string dataIndex)
        {
            Dictionary<string, object> matchingColumn = null;

            foreach (Dictionary<string, object> col in list)
            {
                if (col["dataIndex"] == dataIndex)
                {
                    matchingColumn = col;
                    break;
                }
            }

            return matchingColumn;
        }

        public static Dictionary<string, object> FindColumnByColumnName(List<Dictionary<string, object>> list, string columnName)
        {
            Dictionary<string, object> matchingColumn = null;

            foreach (Dictionary<string, object> col in list)
            {
                if (col["text"].ToString() == columnName)
                {
                    matchingColumn = col;
                    break;
                }
            }

            return matchingColumn;
        }
        public static object ToValidString(object str)
        {
            return Regex.Replace(Regex.Replace(str.ToString(), spaceReplacePattern, "  "), removalPattern, "");
        }


    }
}