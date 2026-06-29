using GemBox.Spreadsheet;
using Keystone.DAL.Model;
using Keystone.Server.Controllers;
using System.Globalization;
using System.Text;
using System.Text.RegularExpressions;

namespace Keystone.Server.Helper
{
    public class FileValidator
    {
        // UPDATED: Now accepts mappings as parameters
        public static ValidationResult DataTypeDocumentValidation(MemoryStream memoryStream, string fileName, Dictionary<string, (string attribute, bool isRequired, Type? ExpectedType)> cellMappings, Dictionary<string, string> displayNameMapping)
        {
            var validationResult = new ValidationResult();

            try
            {
                using var stream = memoryStream;
                var workbook = ExcelFile.Load(stream);
                var worksheet = workbook.Worksheets[0] ?? throw new Exception("First worksheet not found.");

                foreach (var mapping in cellMappings)
                {
                    string cell = mapping.Key;
                    var (attribute, isRequired, expectedType) = mapping.Value;

                    string cellValue = GetCellValue(worksheet, cell);
                    string friendlyName = displayNameMapping.ContainsKey(attribute) ? displayNameMapping[attribute] : attribute;

                    if (string.IsNullOrWhiteSpace(cellValue))
                    {
                        if (isRequired)
                        {
                            validationResult.Details.Add(new ValidationDetailsResult { Field = friendlyName, Message = $"Cell {cell} is required." });
                        }
                        continue;
                    }

                    if (expectedType == null)
                        continue;

                    if (!TryParseValue(cellValue, expectedType, out var parsedValue))
                    {
                        validationResult.Details.Add(new ValidationDetailsResult { Field = friendlyName, Message = $"Cell {cell} has an invalid type, expected: {GetFriendlyTypeName(expectedType)}." });
                    }
                }

                var oppDaysValidation = ValidationForOperationDays(worksheet, fileName, displayNameMapping);
                if (oppDaysValidation != null && oppDaysValidation.WithErrors)
                {
                    validationResult.Details.AddRange(oppDaysValidation.Details);
                }

                var flightDetailsValidations = ValidationForFlightDetails(worksheet, fileName, displayNameMapping);
                if (flightDetailsValidations != null && flightDetailsValidations.WithErrors)
                {
                    validationResult.Details.AddRange(flightDetailsValidations.Details);
                }

                var listShedule2Validations = ValidationForFlightSchedule2(worksheet, fileName, displayNameMapping);
                if (listShedule2Validations != null && listShedule2Validations.WithErrors)
                {
                    validationResult.Details.AddRange(listShedule2Validations.Details);
                }
            }
            catch (SpreadsheetException ex)
            {
                validationResult.Details.Add(new ValidationDetailsResult
                {
                    Field = "File",
                    Message = $"{fileName} {ex.Message}"
                });
            }

            return validationResult;
        }

        public static string GetCellValue(ExcelWorksheet worksheet, string cellAddress)
        {
            if (worksheet == null)
            {
                return string.Empty;
            }
            ExcelCell cell = worksheet.Cells[cellAddress];
            return cell?.Value?.ToString() ?? string.Empty;
        }

        public static string GetRepoCellValue(ExcelWorksheet worksheet, string cellAddress)
        {
            if (worksheet == null)
                return null;

            var cell = worksheet.Cells[cellAddress];
            var value = cell?.Value?.ToString().Trim();

            if (string.IsNullOrEmpty(value) || value.Equals("repo", StringComparison.OrdinalIgnoreCase))
                return null;

            return value;
        }

        private static bool TryParseValue(string input, Type type, out object result)
        {
            result = null!;

            if (string.IsNullOrWhiteSpace(input))
                return false;

            input = input.Trim();

            if (type == typeof(int) && int.TryParse(input, out var i)) { result = i; return true; }
            if (type == typeof(double) && double.TryParse(input, out var dou)) { result = dou; return true; }

            if (type == typeof(bool))
            {
                return TryParseBool(input, out result);
            }

            if (type == typeof(DateTime) && DateTime.TryParse(input, out var dt)) { result = dt; return true; }
            if (type == typeof(string)) { result = input; return true; }
            if (type == typeof(float) && float.TryParse(input, out var f)) { result = f; return true; }
            if (type == typeof(decimal) && decimal.TryParse(input, out var dec)) { result = dec; return true; }

            return false;
        }

        private static bool TryParseBool(string input, out object result)
        {
            result = null!;
            input = input.Trim().ToLowerInvariant();

            if (input is "yes" or "true" or "y" or "1")
            {
                result = true;
                return true;
            }

            if (input is "no" or "false" or "n" or "0")
            {
                result = false;
                return true;
            }

            if (bool.TryParse(input, out var b))
            {
                result = b;
                return true;
            }

            return false;
        }

        private static ValidationResult ValidationForFlightSchedule2(
            ExcelWorksheet worksheet,
            string fileName,
            Dictionary<string, string> displayNameMapping)
        {
            var validationResult = new ValidationResult();

            try
            {
                // Schedule 2
                bool hasAnySch2RowData = Schedule2DataPresent(worksheet);

                if (!hasAnySch2RowData)
                {
                    var mustBeEmptyOrZero = new Dictionary<string, (string attribute, bool isRequired, Type? ExpectedType)>
                    {
                        { "D47", ("stand_by_rate_sch2", false, typeof(string)) },
                        { "F47", ("pilot_assist_prog_rate_sch2", false, typeof(string)) },
                        { "H47", ("min_add_hour_rate_sch2", false, typeof(string)) },
                        { "K47", ("upsize_charge_sch2", false, typeof(string)) },
                        { "N47", ("addnl_desc_sch2", false, typeof(string)) },
                        { "B70", ("daily_aircraft_rate_sch2", false, typeof(float)) },
                        { "C70", ("daily_crew_rate_sch2", false, typeof(float)) },
                        { "D70", ("daily_maint_rate_sch2", false, typeof(float)) },
                        { "F70", ("daily_ins_rate_sch2", false, typeof(float)) },
                        { "G70", ("daily_fixed_oth_rate_sch2", false, typeof(float)) },
                        { "I70", ("daily_var_oth_rate_sch2", false, typeof(float)) },
                        { "K70", ("daily_profit_sch2", false, typeof(float)) },
                        { "M70", ("margin_perc_sch2", false, typeof(float)) }
                    };

                    foreach (var mapping in mustBeEmptyOrZero)
                    {
                        string rawValue = GetCellValue(worksheet, mapping.Key);

                        if (!string.IsNullOrWhiteSpace(rawValue) && rawValue != "0")
                        {
                            var (attribute, isRequired, expectedType) = mapping.Value;

                            string friendlyName = displayNameMapping.ContainsKey(attribute) ? displayNameMapping[attribute] : attribute;

                            validationResult.Details.Add(new ValidationDetailsResult
                            {
                                Field = friendlyName,
                                Message = $"Cell {mapping.Key} must be empty or 0 when there is no Flight Schedule 2 data."
                            });
                        }
                    }
                }

                return validationResult;
            }
            catch (SpreadsheetException ex)
            {
                validationResult.Details.Add(new ValidationDetailsResult
                {
                    Field = "File",
                    Message = $"{fileName} {ex.Message}"
                });
                return validationResult;
            }
        }

        private static bool Schedule2DataPresent(ExcelWorksheet worksheet)
        {

            var mappings = new Dictionary<string, (string attribute, bool isRequired, Type? ExpectedType)>();
            var scheduleDetailsColumns = new List<(string attribute, char column, Type attributeType)>
                {
                    ("flight_num", 'C', typeof(string))
                };

            // Schedule 2
            for (int row = 34; row <= 41; row++)
            {
                foreach (var (attribute, column, attributeType) in scheduleDetailsColumns)
                {
                    string cell = $"{column}{row}";
                    string fullAttribute = $"{attribute}_sch2_row{row}";
                    mappings.Add(cell, (fullAttribute, false, attributeType));
                }
            }

            bool hasAnySch2RowData = mappings.Any(cellAddr =>
            {
                string raw = GetCellValue(worksheet, cellAddr.Key);
                return !string.IsNullOrWhiteSpace(raw);
            });

            return hasAnySch2RowData;
        }

        private static ValidationResult ValidationForFlightDetails(
            ExcelWorksheet worksheet,
            string fileName,
            Dictionary<string, string> displayNameMapping)
        {
            var validationResult = new ValidationResult();
            try
            {
                // Process Schedule 1 details
                var validationsSdhedule1 = ProcessValidationScheduleDetails(worksheet, displayNameMapping, 1, 22, 29);
                if (validationsSdhedule1 != null && validationsSdhedule1.WithErrors)
                {
                    validationResult.Details.AddRange(validationsSdhedule1.Details);
                }

                bool hasAnySch2RowData = Schedule2DataPresent(worksheet);

                if (hasAnySch2RowData)
                {
                    // Process Schedule 2 details
                    var validationsSdhedule2 = ProcessValidationScheduleDetails(worksheet, displayNameMapping, 2, 34, 41);
                    if (validationsSdhedule2 != null && validationsSdhedule2.WithErrors)
                    {
                        validationResult.Details.AddRange(validationsSdhedule2.Details);
                    }
                }

                return validationResult;
            }
            catch (SpreadsheetException ex)
            {
                validationResult.Details.Add(new ValidationDetailsResult
                {
                    Field = "File",
                    Message = $"{fileName} {ex.Message}"
                });
                return validationResult;
            }
        }

        private static ValidationResult ProcessValidationScheduleDetails(
            ExcelWorksheet worksheet,
            Dictionary<string, string> displayNameMapping,
            int schNum,
            int startRow,
            int endRow)
        {
            var validationResult = new ValidationResult();

            for (int row = startRow, index = 1; row <= endRow; row++, index++)
            {
                if (string.IsNullOrEmpty(GetCellValue(worksheet, $"C{row}")))
                    break;

                var cellValue = GetCellValue(worksheet, $"A{row}");
                var isRepoFlight = TryParseBool(cellValue, out var boolResult) && (bool)boolResult;

                ValidateRequiredCell(validationResult, worksheet, row, "B", "segment", schNum, index, displayNameMapping);
                ValidateRequiredCell(validationResult, worksheet, row, "D", "origin", schNum, index, displayNameMapping);
                ValidateRequiredCell(validationResult, worksheet, row, "E", "dest", schNum, index, displayNameMapping);

                if (!isRepoFlight)
                {
                    ValidateRequiredCell(validationResult, worksheet, row, "F", "depart_time", schNum, index, displayNameMapping);
                    ValidateRequiredCell(validationResult, worksheet, row, "G", "arrive_time", schNum, index, displayNameMapping);

                    var deparTime = GetCellValue(worksheet, $"F{row}");
                    var arriveTime = GetCellValue(worksheet, $"G{row}");

                    var repo = deparTime.Equals("repo", StringComparison.OrdinalIgnoreCase)
                               || arriveTime.Equals("repo", StringComparison.OrdinalIgnoreCase);

                    if (!repo && Enumerable.Range('H', 7).All(c => string.IsNullOrWhiteSpace(GetCellValue(worksheet, $"{(char)c}{row}"))))
                    {
                        validationResult.Details.Add(new ValidationDetailsResult
                        {
                            Field = $"Days of Operation Segment #{index} (Flight Schedule {schNum})",
                            Message = $"Cells H{row} to N{row} one or more days are required."
                        });
                    }
                }
            }

            return validationResult;
        }

        private static void ValidateRequiredCell(
            ValidationResult validationResult,
            ExcelWorksheet worksheet,
            int row,
            string col,
            string fieldKey,
            int schNum,
            int index,
            Dictionary<string, string> displayNameMapping)
        {
            var cellValue = GetCellValue(worksheet, $"{col}{row}");
            if (string.IsNullOrEmpty(cellValue))
            {
                string friendlyName = displayNameMapping.ContainsKey(fieldKey) ? displayNameMapping[fieldKey] : fieldKey;
                validationResult.Details.Add(new ValidationDetailsResult
                {
                    Field = $"{friendlyName} Segment #{index} (Flight Schedule {schNum})",
                    Message = $"Cell {col}{row} is required."
                });
            }
        }

        private static ValidationResult ValidationForOperationDays(
            ExcelWorksheet worksheet,
            string fileName,
            Dictionary<string, string> displayNameMapping)
        {
            var validationResult = new ValidationResult();
            var rules = new[]
            {
                new { Cell = "G61", Key = "op_days_per_wk_sch1", Min = 0, Max = 7, Expected = "Operation Days per Week must be between 0 and 7." },
                new { Cell = "G67", Key = "op_days_per_wk_sch2", Min = 0, Max = 7, Expected = "Operation Days per Week must be between 0 and 7." },
                new { Cell = "H61", Key = "op_days_per_mon_sch1", Min = 0, Max = 31, Expected = "Operation Days per Month must be between 0 and 31." },
                new { Cell = "H67", Key = "op_days_per_mon_sch2", Min = 0, Max = 31, Expected = "Operation Days per Month must be between 0 and 31." }
            };

            foreach (var rule in rules)
            {
                var value = GetCellValue(worksheet, rule.Cell);
                if (!TryParseValue(value, typeof(float), out var parsedValue))
                {
                    AddValidationError(validationResult, displayNameMapping, rule.Key, rule.Cell, "Value is not numeric.");
                    continue;
                }

                var floatValue = float.Parse(value);
                if (floatValue < rule.Min || floatValue > rule.Max)
                {
                    AddValidationError(validationResult, displayNameMapping, rule.Key, rule.Cell, rule.Expected);
                }
            }

            return validationResult;
        }

        private static void AddValidationError(
            ValidationResult validationResult,
            Dictionary<string, string> displayNameMapping,
            string key,
            string cell,
            string message)
        {
            string friendlyName = displayNameMapping.ContainsKey(key) ? displayNameMapping[key] : key;
            validationResult.Details.Add(new ValidationDetailsResult
            {
                Field = friendlyName,
                Message = $"Cell {cell} has an invalid value. {message}"
            });
        }

        private static string GetFriendlyTypeName(Type type)
        {
            if (type == typeof(string))
                return "Text";
            if (type == typeof(int) || type == typeof(long) || type == typeof(short))
                return "Whole Number";
            if (type == typeof(decimal) || type == typeof(double) || type == typeof(float))
                return "Decimal Number";
            if (type == typeof(DateTime))
                return "Date";
            if (type == typeof(bool))
                return "Boolean Value (Yes/No | Y/N | 1/0)";
            if (type.IsEnum)
                return "List of Values";

            return type.Name;
        }

        public static string NormHeader(string? s)
        {
            if (string.IsNullOrWhiteSpace(s)) return "";

            s = s.Replace('\u00A0', ' ')
                 .Replace("\r", " ")
                 .Replace("\n", " ")
                 .Trim();

            s = s.Normalize(NormalizationForm.FormD);
            var sb = new StringBuilder(s.Length);
            foreach (var ch in s)
            {
                var uc = CharUnicodeInfo.GetUnicodeCategory(ch);
                if (uc != UnicodeCategory.NonSpacingMark)
                    sb.Append(ch);
            }
            s = sb.ToString().Normalize(NormalizationForm.FormC);

            s = s.ToLowerInvariant();

            s = Regex.Replace(s, @"[^a-z0-9]+", " ");
            s = Regex.Replace(s, @"\s+", " ").Trim();

            return s;
        }

        public static string FormatDecimal(string value)
        {
            if (string.IsNullOrWhiteSpace(value))
                return "0.00";

            if (decimal.TryParse(value, NumberStyles.Any, CultureInfo.InvariantCulture, out decimal result))
            {
                return result.ToString("0.00", CultureInfo.InvariantCulture);
            }

            return "0.00";
        }

    }
}