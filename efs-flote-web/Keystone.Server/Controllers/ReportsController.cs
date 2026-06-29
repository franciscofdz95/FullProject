using DocumentFormat.OpenXml.Packaging;
using DocumentFormat.OpenXml.Spreadsheet;
using GemBox.Spreadsheet;
using Keystone.DAL.Model;
using Keystone.DAL.Utility;
using Keystone.Server.Helper;
using Keystone.Server.Utility;
using Keystone.Services.Services.Reports;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
using Serilog;
using SaveOptions = GemBox.Spreadsheet.SaveOptions;

namespace Keystone.Server.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    //[Authorize]
    public class ReportsController : Controller
    {
        private readonly IReportService _reportService;
        private ReportFormatter _reportsFormatter;
        private readonly string _uploadSharePath;

        public ReportsController(IReportService reportService)
        {
            _reportService = reportService;
            _reportsFormatter = new ReportFormatter();
            _uploadSharePath = ConfigurationHelper.GetUploadPath("GatewayUploadPath");
        }

        [HttpGet("DownloadReport")]
        public async Task<IActionResult> DownloadReport([FromQuery] string procedure, [FromQuery] string paramsStr)
        {
            try
            {
                int spID = 0;
                int.TryParse(procedure, out spID);
                ReportModel _selectedReport = await _reportService.GetReportByID(spID);
                List<string> parameters = JsonConvert.DeserializeObject<List<string>>(paramsStr);
                var formattedparams = _reportsFormatter.GetParameters(parameters, _selectedReport.ParametersSchema);
                var result = await _reportService.GetReportResult(_selectedReport.Procedure, formattedparams);
                var headers = result.First().Keys.ToList();
                
                var objResult = _reportsFormatter.RowsFormatter(result, _selectedReport.Schema);
                //Excel Creation
                var workbook = new ExcelFile();
                var workSheet = workbook.Worksheets.Add($"Report {_selectedReport.Name}");
                AddExcelHeaders(workSheet, headers);
                SetheadersStyle(workSheet, headers.Count());
                FillWorkSheet(workSheet, objResult);
                //End Excel Creation
                using var stream = new MemoryStream();
                DateTime today = DateTime.Now;
                string formattedDate = today.ToString("MM-dd-yy");

                workbook.Save(stream, SaveOptions.XlsxDefault);
                return File(stream.ToArray(), "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
                    , _selectedReport.Name + "_" + formattedDate + ".xlsx");

            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }

        }

        [HttpGet("GetSelectedReport")]
        public async Task<IActionResult> GetSelectedReport([FromQuery] string procedure, [FromQuery] string paramsStr)
        {
            try
            {
                List<string> parameters = JsonConvert.DeserializeObject<List<string>>(paramsStr);
                int spID = 0;
                int.TryParse(procedure, out spID);
                ReportModel _selectedReport = await _reportService.GetReportByID(spID);
                var formattedparams = _reportsFormatter.GetParameters(parameters, _selectedReport.ParametersSchema);
                var result = await _reportService.GetReportResult(_selectedReport.Procedure, formattedparams);
                var values = result.Select(r => r.Values).ToList();
                List<string> _headers = result.First().Keys.ToList();
                var resObject = new { headers = _headers, data = values };

                return Ok(JsonConvert.SerializeObject(resObject));
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        private void AddExcelHeaders(ExcelWorksheet _workSheet, List<string> _headers)
        {
            for (int c = 0; c < _headers.Count(); c++)
            {
                _workSheet.Cells[0, c].Value = _headers[c];
            }
        }

        private void SetheadersStyle(ExcelWorksheet worksheet, int headerCount)
        {
            var headerRange = worksheet.Cells.GetSubrangeAbsolute(0, 0, 0, headerCount - 1);

            var customColor = SpreadsheetColor.FromArgb(155, 194, 230); // #9BC2E6

            headerRange.Style.FillPattern.SetPattern(
                FillPatternStyle.Solid,
                customColor,
                customColor
            );

            headerRange.Style.Font.Color = SpreadsheetColor.FromName(ColorName.White);
            headerRange.Style.Font.Weight = ExcelFont.BoldWeight;
        }

        private void FillWorkSheet(ExcelWorksheet workSheet, List<Dictionary<string, (object, string)>> _data)
        {
            for (int r = 0; r < _data.Count; r++)
            {
                for (int c = 0; c < _data[r].Count; c++)
                {
                    //string test = _data[r].ElementAt(c).Value.Item1.ToString();
                    switch (_data[r].ElementAt(c).Value.Item2)
                    {
                        case "date":
                            workSheet.Cells[r + 1, c].Value = ((DateTime)_data[r].ElementAt(c).Value.Item1).ToString("MM/dd/yyyy"); ;
                            break;

                        case "number":
                            workSheet.Cells[r + 1, c].Value = _data[r].ElementAt(c).Value.Item1;
                            workSheet.Cells[r + 1, c].Style.NumberFormat = "0";
                            break;

                        case "money":
                            workSheet.Cells[r + 1, c].Value = _data[r].ElementAt(c).Value.Item1;
                            workSheet.Cells[r + 1, c].Style.NumberFormat = "$#,##0.00;($#,##0.00)";
                            break;

                        case "percentage":
                            workSheet.Cells[r + 1, c].Value = _data[r].ElementAt(c).Value.Item1;
                            workSheet.Cells[r + 1, c].Style.NumberFormat = "0.0%";
                            break;

                        default:
                            workSheet.Cells[r + 1, c].Value = (_data[r].ElementAt(c).Value.Item1 != null ? _data[r].ElementAt(c).Value.Item1.ToString() : "");
                            break;

                    }
                    //workSheet.Cells[r+1, c].Value = _data[r].ElementAt(c).Value.Item1.ToString();
                    //workSheet.Cells[r, c].Value = _data[r].First().Value[c];
                }
            }
        }

        ///// <summary>
        ///// ESE-0126-1
        ///// </summary>
        ///// <returns></returns>
        //private List<WriteOffReportModel> ParseXLSToWriteOffModel(Stream _xlsStream)
        //{
        //    List<WriteOffReportModel> _writeoffList = new List<WriteOffReportModel>();
        //    using (var _doc = SpreadsheetDocument.Open(_xlsStream, false))
        //    {
        //        var _workbookPart = _doc.WorkbookPart;
        //        var _sheet = _workbookPart.Workbook.Sheets.Elements<Sheet>().FirstOrDefault();

        //        if (_sheet == null)
        //            throw new IOException("the file is empty");

        //        var _worksheetPart = (WorksheetPart)_workbookPart.GetPartById(_sheet.Id);
        //        var _sheetData = _worksheetPart.Worksheet.Elements<SheetData>().FirstOrDefault();

        //        if (_sheetData == null)
        //        {
        //            throw new IOException("the Excel Sheet is empty");
        //        }

        //        var _sharedStrTable = _workbookPart.SharedStringTablePart?.SharedStringTable;
        //        bool _headerParsed = false;
        //        foreach (Row row in _sheetData.Elements<Row>())
        //        {
        //            if (row.RowIndex > 1)
        //            {
        //                var values = new List<string>();
        //                foreach (Cell cell in row.Elements<Cell>())
        //                {
        //                    values.Add(GetCellStringValue(cell, _sharedStrTable));
        //                }

        //                int tempInt = 0;
        //                float tempFloat = 0.0f;
        //                DateTime tempDate;
        //                WriteOffReportModel _tempWriteOff = new WriteOffReportModel();
        //                _tempWriteOff.Region_Name = values[0];
        //                int.TryParse(values[1], out tempInt);
        //                _tempWriteOff.District_Num = tempInt;//values[1];
        //                _tempWriteOff.Gateway = values[2];
        //                _tempWriteOff.SFABRA_Num = values[3];

        //                int.TryParse(values[4], out tempInt);
        //                _tempWriteOff.Schedule_Num = tempInt;//values[4];
        //                _tempWriteOff.Route = values[5];
        //                DateTime.TryParse(values[6], out tempDate);
        //                _tempWriteOff.WE = tempDate;//values[6];
        //                int.TryParse(values[7], out tempInt);
        //                _tempWriteOff.Accrued = tempInt;//values[7];
        //                int.TryParse(values[8], out tempInt);
        //                _tempWriteOff.Paid = tempInt;//values[8];
        //                int.TryParse(values[9], out tempInt);
        //                _tempWriteOff.Outstand_Rot = tempInt;//values[9];
        //                float.TryParse(values[10], out tempFloat);
        //                _tempWriteOff.Avg_CostRot = tempFloat;//values[10];
        //                float.TryParse(values[11], out tempFloat);
        //                _tempWriteOff.Outstanding = tempFloat;//values[11];
        //                _tempWriteOff.Gateway_Comments = values[12];
        //                _tempWriteOff.AT_Comments = values[13];
        //                _tempWriteOff.WriteOff = values[14];
        //                _tempWriteOff.Team_Discuss = values[15];

        //                _writeoffList.Add(_tempWriteOff);
        //            }

        //        }
        //    }
        //    return _writeoffList;
        //}

        /// <summary>
        /// ESE-0126-1
        /// </summary>
        /// <param name="cell"></param>
        /// <param name="sst"></param>
        /// <returns></returns>
        private static string GetCellStringValue(Cell cell, SharedStringTable sst)
        {
            if (cell == null) return string.Empty;
            var val = cell.CellValue?.InnerText ?? string.Empty;

            if (cell.DataType != null && cell.DataType.Value == CellValues.SharedString && sst != null)
            {
                if (int.TryParse(val, out int idx) && idx >= 0 && idx < sst.Count())
                {
                    return sst.ElementAt(idx).InnerText ?? string.Empty;
                }
            }

            return val;
        }

    }
}
