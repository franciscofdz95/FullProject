using Newtonsoft.Json;
using SpreadsheetLight;
using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Data;
using System.IO;
using System.Linq;
using System.Reflection;
using System.Runtime.CompilerServices;
using System.Text;
using System.Text.RegularExpressions;
using System.Threading.Tasks;
using System.Web.Http;
using System.Web.Script.Serialization;

namespace BIACore.Export
{
    public static class EXTExport
    {
        private const int TITLE_ROW_NUM = 1;
        private const int FILTER_ROW_NUM = 2;
        private const string spaceReplacePattern = @"[\t\n\r]+";
        private const string removalPattern = @"[^\x20-\x7E]";

        public static MemoryStream CreateExport(string type, string filename, string sheetTitle, string appUrlBase, string filterDisplay,
            string storeUrl, string storeExtraParams, string columns, string dataTypeFormats, bool isPostBack, string assemblyName)
        {
            string events = "";

            JavaScriptSerializer jss = new JavaScriptSerializer();
            jss.MaxJsonLength = 2147483647;

            Log.LogFactory.Message("Exporter Spreadsheet IsPostBack: {8}{0}passed data:{0}type={1},{0}filename={2},{0}appUrlBase={3},{0}storeUrl={4},{0}storeExtraParams={5},{0}columns={6},{0}dataTypeFormats={7},{0}sheetTitle={9},{0}assemblyName={10}",
                new object[] { Environment.NewLine, type, filename, appUrlBase, storeUrl, storeExtraParams, columns, dataTypeFormats, isPostBack.ToString(), sheetTitle, assemblyName });

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


                events += Environment.NewLine + "Store call to store " + storeUrl + " initializing.";
                List<object> data;
                try
                {
                    data = GetDataFromRoute(assemblyName, storeUrl, storeExtraParams);
                }
                catch (Exception e)
                {
                    Log.LogFactory.Error("Exporter Spreadsheet StoreCallError: {0}url: {1}{0}" + e.Message, new object[] { Environment.NewLine, storeUrl });
                    throw;
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
                                    if (value != null) rowData.Add(value.Replace(((char)0).ToString(), ""));
                                    else rowData.Add(null);
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

                    events += Environment.NewLine + "Wrote SpreadsheetLite Excel Document to Response";

                    return ms;
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

                    MemoryStream ms = new MemoryStream();
                    StreamWriter writer = new StreamWriter(ms);
                    writer.Write(sb.ToString());
                    ms.Position = 0;

                    events += Environment.NewLine + "Wrote CSV Document to Response";

                    return ms;
                }
            }
            catch (Exception ex)
            {
                Log.LogFactory.Exception(ex);
                events += Environment.NewLine + "Error in code: " + ex.Message + Environment.NewLine + ex.StackTrace;
                throw;
            }
            finally
            {
                Log.LogFactory.Message("Exporter Spreadsheet Events:" + Environment.NewLine + events);
            }
        }

        private static List<object> GetDataFromRoute(string assemblyName, string apiRoute, string json)
        {
            MethodInfo apiMethod = FindApiMethod(assemblyName, apiRoute);

            if (apiMethod == null)
                throw new Exception("Could not find action from route: " + apiRoute);

            if (apiMethod.GetParameters().Length != 1)
                throw new Exception("Found action, but it must accept one parameter: " + apiRoute);

            try
            {
                ParameterInfo paramInfo = apiMethod.GetParameters()[0];
                bool isDynamic = paramInfo.GetCustomAttribute(typeof(DynamicAttribute), true) != null;
                object paramObj = JsonConvert.DeserializeObject(json, isDynamic ? typeof(object) : paramInfo.ParameterType);

                object controller = Activator.CreateInstance(apiMethod.DeclaringType);
                // This returns ClientResult from BIACore.WebAPI but we can't reference
                // it because that would be a circular dependency. So using dynamic instead
                dynamic data = apiMethod.Invoke(controller, new object[] { paramObj });

                return (List<object>)data.GetData();
            }
            catch (Exception e)
            {
                throw new Exception("Failed to get data from action: " + apiRoute, e);
            }
        }

        private static MethodInfo FindApiMethod(string assemblyName, string apiRoute)
        {
            Assembly assembly = Assembly.Load(assemblyName);

            if (assembly == null)
                throw new Exception("Could not find assembly: " + assemblyName);

            IEnumerable<Type> apiControllers = assembly.DefinedTypes.Where(a => HasBaseType(a, typeof(ApiController)));
            foreach (Type controller in apiControllers)
            {
                string controllerRoute = "api/" + controller.Name.Replace("Controller", "") + "/";
                MethodInfo[] methods = controller.GetMethods();

                foreach (MethodInfo method in methods)
                {
                    if (!method.IsPublic || method.IsSpecialName || !method.Module.Name.StartsWith(assemblyName, StringComparison.InvariantCultureIgnoreCase))
                        continue;

                    IEnumerable<ActionNameAttribute> actionNames = (IEnumerable<ActionNameAttribute>)method.GetCustomAttributes(typeof(ActionNameAttribute));
                    if (actionNames.Any(x => string.Equals(controllerRoute + x.Name, apiRoute, StringComparison.InvariantCultureIgnoreCase)))
                    {
                        return method;
                    }
                }
            }

            return null;
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

        private static bool HasBaseType(Type type, Type baseType)
        {
            if (type == null)
            {
                return false;
            }

            return type == baseType || HasBaseType(type.BaseType, baseType);
        }
    }
}
