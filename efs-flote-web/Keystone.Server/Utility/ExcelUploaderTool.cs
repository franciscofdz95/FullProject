using DocumentFormat.OpenXml.Packaging;
using DocumentFormat.OpenXml.Spreadsheet;
using GemBox.Spreadsheet;
using GemBox.Spreadsheet.Charts;
using Keystone.DAL.Model;
using Keystone.DAL.Utility;
using Keystone.Server.Helper;
using Serilog;

namespace Keystone.Server.Utility
{
    public class ExcelUploaderTool
    {
        private readonly string _uploadSharePath;
        public ExcelUploaderTool()
        {
            _uploadSharePath = ConfigurationHelper.GetUploadPath("GatewayUploadPath");
        }
        //public async Task<UploadGenXLSMessage> ExtractXLSData(IFormFileCollection files, string excelType, string header)
        //{
        //    UploadGenXLSMessage _messageResult = new UploadGenXLSMessage();
        //    string createdBy = "bcw8trg";

        //    var results = new List<UploadedFile>();

        //    if (files == null || files.Count == 0)
        //    {
        //        Log.Warning("No files received for upload.");
        //        results.Add(new UploadedFile { Name = "N/A", Status = "error", Message = "No files selected for upload." });
        //        //return bad request
        //        _messageResult.resultMessage = results;
        //        return _messageResult;
        //    }

        //    Log.Information($"Controller: Received {files.Count} files for Air Route Upload.");

        //    // Ensure the upload directory exists
        //    if (!Directory.Exists(_uploadSharePath))
        //    {
        //        try
        //        {
        //            Directory.CreateDirectory(_uploadSharePath);
        //            Log.Information($"Created upload directory: {_uploadSharePath}");
        //        }
        //        catch (Exception ex)
        //        {
        //            Log.Error(ex, $"Error creating shared directory {_uploadSharePath}");
        //            results.Add(new UploadedFile { Name = "N/A", Status = "error", Message = $"Failed to create upload directory: {ex.Message}" });
        //            //return errors
        //            _messageResult.resultMessage = results;
        //            return _messageResult;
        //        }
        //    }

        //    foreach (var file in files)
        //    {
        //        if (file.Length == 0)
        //        {
        //            results.Add(new UploadedFile { Name = file.FileName, Status = "error", Message = "File is empty." });
        //            Log.Warning($"Skipping empty file: {file.FileName}");
        //            continue;
        //        }

        //        var fileExtension = Path.GetExtension(file.FileName)?.ToLowerInvariant();
        //        if (fileExtension != ".xlsx" && fileExtension != ".xls")
        //        {
        //            results.Add(new UploadedFile { Name = file.FileName, Status = "error", Message = "Invalid file type. Only .xlsx and .xls files are allowed." });
        //            Log.Warning($"Invalid file type for {file.FileName}.");
        //            continue;
        //        }

        //        // ✅ VALIDATION: Still keep server-side validation as backup
        //        try
        //        {
        //            using (var validationStream = new MemoryStream())
        //            {
        //                await file.CopyToAsync(validationStream);
        //                validationStream.Position = 0;

        //                var workbook = ExcelFile.Load(validationStream);
        //                var worksheet = workbook.Worksheets[0];

        //                if (worksheet == null)
        //                {
        //                    results.Add(new UploadedFile { Name = file.FileName, Status = "error", Message = "First worksheet not found in file." });
        //                    Log.Warning($"First worksheet not found in {file.FileName}");
        //                    continue;
        //                }

        //                // ✅ GATEWAY VALIDATION: Check cell A1 for "Region"
        //                string cellA1Value = FileValidator.GetCellValue(worksheet, "A1");
        //                //Commented
        //                //if (cellA1Value?.Trim().Equals("Region", StringComparison.OrdinalIgnoreCase) != true)
        //                if (cellA1Value?.Trim().Contains(header, StringComparison.OrdinalIgnoreCase) != true)
        //                {
        //                    results.Add(new UploadedFile
        //                    {
        //                        Name = file.FileName,
        //                        Status = "error",
        //                        Message = ErrorsCatalog(excelType)
        //                    });
        //                    Log.Warning($"Air Route validation failed for {file.FileName}: Cell A1 contains '{cellA1Value}' instead of 'Region'");
        //                    continue;
        //                }
        //                else
        //                {
        //                    results.Add(new UploadedFile
        //                    {
        //                        Name = file.FileName,
        //                        Status = "success",
        //                        Message = "File and sheet processed successfully."
        //                    });
        //                    Log.Information($"Controller: Successfully processed and uploaded JRNL-853 data from {file.FileName}");
        //                }
        //            }
        //        }
        //        catch (Exception ex)
        //        {
        //            Log.Error(ex, $"Error validating Air Route file {file.FileName}");
        //            results.Add(new UploadedFile { Name = file.FileName, Status = "error", Message = $"File validation failed: {ex.Message}" });
        //            continue;
        //        }

        //        string originalFileNameWithoutExtension = Path.GetFileNameWithoutExtension(file.FileName);
        //        string newFileName = $"{originalFileNameWithoutExtension}_{DateTime.Now.ToString("yyyyMMdd_HHmmss")}{fileExtension}";
        //        string filePath = Path.Combine(_uploadSharePath, newFileName);

        //        try
        //        {
        //            // Save the file to the shared path
        //            using (var fileStream = new FileStream(filePath, FileMode.Create, FileAccess.Write))
        //            {
        //                await file.CopyToAsync(fileStream);
        //            }
        //            Log.Information($"File saved to shared path: {filePath}");

        //            using (var stream = new MemoryStream())
        //            {
        //                await file.CopyToAsync(stream); // Copy again to a new memory stream for processing
        //                stream.Position = 0; // Reset stream position to the beginning

        //                var excelFile = ExcelFile.Load(stream);

        //                //ESE-0326-1
        //                //Excel Types Catalog
        //                List<object> _read = new List<object>();
        //                object tempResult = ParseXLSToModel(stream, excelType);
        //                if(tempResult != null)
        //                {
        //                    _messageResult.resultMessage = results;
        //                    _messageResult.resultData = tempResult;
        //                    return _messageResult;
        //                }


        //            }
        //        }
        //        catch (Exception ex)
        //        {
        //            Log.Error(ex, $"Controller: Error processing file {file.FileName}");
        //            results.Add(new UploadedFile { Name = file.FileName, Status = "error", Message = $"Processing failed: {ex.Message}" });
        //        }
        //    }

        //    //return method result
        //    return _messageResult;
        //}

        /// <summary>
        /// ESE-0126-1
        /// </summary>
        /// <returns></returns>
        private object ParseXLSToModel(Stream _xlsStream, string _xlsType)
        {
            object _result;
            using (var _doc = SpreadsheetDocument.Open(_xlsStream, false))
            {
                var _workbookPart = _doc.WorkbookPart;
                var _sheet = _workbookPart.Workbook.Sheets.Elements<Sheet>().FirstOrDefault();

                if (_sheet == null)
                    throw new IOException("the file is empty");

                var _worksheetPart = (WorksheetPart)_workbookPart.GetPartById(_sheet.Id);
                var _sheetData = _worksheetPart.Worksheet.Elements<SheetData>().FirstOrDefault();

                if (_sheetData == null)
                {
                    throw new IOException("the Excel Sheet is empty");
                }

                var _sharedStrTable = _workbookPart.SharedStringTablePart?.SharedStringTable;

                switch (_xlsType)
                {
                    case "airlinecorporate":
                        _result = null;//_result = FillAirCorporateModel(_workbookPart, _sheetData);
                        break;
                    case "airroutecode":
                        _result = null;//_result = FillAirRouteCodeModel(_workbookPart, _sheetData);
                        break;
                    default:
                        _result = null;
                    break;
                }
            }
            return _result;
        }

        /// <summary>
        /// ESE-0326-1
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

        ///// <summary>
        ///// ESE-0326-1
        ///// </summary>
        ///// <returns></returns>
        //private List<AirlineCorporateModel> FillAirCorporateModel(WorkbookPart _workbookPart, SheetData _sheetData)
        //{
        //    var _sharedStrTable = _workbookPart.SharedStringTablePart?.SharedStringTable;
        //    List<AirlineCorporateModel> _airlineCorporateList = new List<AirlineCorporateModel>();
        //    foreach (Row row in _sheetData.Elements<Row>())
        //    {
        //        if (row.RowIndex > 1)
        //        {
        //            var values = new List<string>();
        //            foreach (Cell cell in row.Elements<Cell>())
        //            {
        //                values.Add(GetCellStringValue(cell, _sharedStrTable));
        //            }

        //            AirlineCorporateModel _airLineCorpTemp = new AirlineCorporateModel();
        //            _airLineCorpTemp.Airline = values[0];
        //            _airLineCorpTemp.Corporate = values[1];


        //            _airlineCorporateList.Add(_airLineCorpTemp);
        //        }

        //    }

        //    //return result
        //    return _airlineCorporateList;
        //}

        ///// <summary>
        ///// ESE-0326-1
        ///// </summary>
        ///// <returns></returns>
        //private List<AirRouteCodeModel> FillAirRouteCodeModel(WorkbookPart _workbookPart, SheetData _sheetData)
        //{
        //    var _sharedStrTable = _workbookPart.SharedStringTablePart?.SharedStringTable;
        //    List<AirRouteCodeModel> _airRouteCodeList = new List<AirRouteCodeModel>();
        //    foreach (Row row in _sheetData.Elements<Row>())
        //    {
        //        if (row.RowIndex > 1)
        //        {
        //            var values = new List<string>();
        //            foreach (Cell cell in row.Elements<Cell>())
        //            {
        //                values.Add(GetCellStringValue(cell, _sharedStrTable));
        //            }

        //            AirRouteCodeModel _temp = new AirRouteCodeModel();
        //            _temp.Gateway = values[0];
        //            _temp.RegionCenter = values[1];
        //            _temp.RRDD = values[2];
        //            _temp.AirRouteCode = values[0];
        //            _temp.CDType = values[3];
        //            _temp.CDDesc = values[4];

        //            _airRouteCodeList.Add(_temp);
        //        }

        //    }

        //    //return result
        //    return _airRouteCodeList;
        //}

        private string ErrorsCatalog(string _xlsType)
        {
            string errorMessage = "";
            switch (_xlsType)
            {
                case "airlinecorporate":
                    errorMessage = "File does not appear to be an Airline Corporate file.";
                    break;
                case "airroutecode":
                    errorMessage = "File does not appear to be an Air Route Code file.";
                    break;
                default:
                    errorMessage = "File does not appear to be a valid file.";
                    break;
            }
            return errorMessage;
        }
    }
}
