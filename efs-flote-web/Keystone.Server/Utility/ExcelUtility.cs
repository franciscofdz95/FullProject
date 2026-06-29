using System;
using System.Collections.Generic;
using System.Linq;
using System.IO;
using DocumentFormat.OpenXml.Packaging;
using DocumentFormat.OpenXml.Spreadsheet;
using DocumentFormat.OpenXml;

namespace Keystone.Server.Utility
{
    public class ExcelUtility
    { 
        public static SpreadsheetDocument CreateSpreadsheetDocument(Stream stream, bool addStyle)
        {
            SpreadsheetDocument document = SpreadsheetDocument.Create(stream, SpreadsheetDocumentType.Workbook);
            WorkbookPart workbookPart = document.AddWorkbookPart();
            workbookPart.Workbook = new Workbook();
            Sheets sheets = workbookPart.Workbook.AppendChild(new Sheets());
            if (addStyle)
            {
                WorkbookStylesPart stylesPart = document.WorkbookPart.AddNewPart<WorkbookStylesPart>();
                stylesPart.Stylesheet = new ExcelUtility().GenerateStyleSheet();
                stylesPart.Stylesheet.Save();
            }
            return document;
        }
        public static Row CreateRow(uint rowindex, string[] data)
        {
            Row row = new Row();
            row.RowIndex = rowindex;
            foreach (string val in data)
            {
                Cell cell;
                cell = new Cell();
                cell.DataType = CellValues.String;
                cell.CellValue = new CellValue(val);
                row.Append(cell);
            }
            return row;
        }
        public static Row CreateRowWithStyle(uint rowindex, string[] data, uint styleIndex)
        {
            Row row = new Row();
            row.RowIndex = rowindex;
            foreach (string val in data)
            {
                Cell cell;
                cell = new Cell();
                cell.DataType = CellValues.String;
                cell.StyleIndex = styleIndex;
                cell.CellValue = new CellValue(val);
                row.Append(cell);
            }
            return row;
        }
        public static Row AddRow(SheetData sheetData, uint rowindex, string[] data)
        {
            Row row = new Row();
            row.RowIndex = rowindex;
            foreach (string val in data)
            {
                Cell cell;
                cell = new Cell();
                cell.DataType = CellValues.String;
                cell.CellValue = new CellValue(val);
                row.Append(cell);
            }
            sheetData.AppendChild(row);
            return row;
        }
        public static Row AddRowWithStyle(SheetData sheetData, uint rowindex, string[] data, uint styleIndex)
        {
            Row row = new Row();
            row.RowIndex = rowindex;
            foreach (string val in data)
            {
                Cell cell;
                cell = new Cell();
                cell.DataType = CellValues.String;
                cell.StyleIndex = styleIndex;
                cell.CellValue = new CellValue(val);
                row.Append(cell);
            }
            sheetData.AppendChild(row);
            return row;
        }
        public static Row AddRowTypeWithStyle(SheetData sheetData, uint rowindex, string[] data, uint styleIndex, int? dataType = null)
        {
            Row row = new Row();
            row.RowIndex = rowindex;
            row.OutlineLevel = 1;
            row.Spans = new ListValue<StringValue>() { InnerText = "1:3" };
            row.Collapsed = false;
            double Num;
            foreach (string val in data)
            {
                Cell cell;
                cell = new Cell();

                if (dataType != null && dataType == 1)
                    cell.DataType = CellValues.String;
                else
                {
                    if (val != null)
                        cell.DataType = double.TryParse(val.ToString(), out Num) ? CellValues.Number : CellValues.String;
                    else
                        cell.DataType = CellValues.String;
                }
                cell.StyleIndex = styleIndex;
                cell.CellValue = new CellValue(val);
                row.Append(cell);
            }
            sheetData.AppendChild(row);
            return row;
        }
        public static void AddSheet(uint sheetId, string sheetName, SpreadsheetDocument document, SheetData sheetData, bool autoFit)
        {
            WorkbookPart workbookPart = document.WorkbookPart;
            WorksheetPart worksheetPart = workbookPart.AddNewPart<WorksheetPart>();
            Sheet sheet = new Sheet() { Id = workbookPart.GetIdOfPart(worksheetPart), SheetId = sheetId, Name = sheetName };
            workbookPart.Workbook.Sheets.Append(sheet);
            worksheetPart.Worksheet = new Worksheet();
            worksheetPart.Worksheet.SheetProperties = new SheetProperties();
            if (autoFit)
            {
                worksheetPart.Worksheet.SheetProperties.OutlineProperties = new OutlineProperties();
                worksheetPart.Worksheet.SheetProperties.OutlineProperties.SummaryBelow = false;
                //get your columns (where your width is set)
                Columns columns = AutoSize(sheetData);
                worksheetPart.Worksheet.Append(columns);
            }
            worksheetPart.Worksheet.Append(sheetData);
        }

        // Set style **************************
        private Stylesheet GenerateStyleSheet()
        {
            return new Stylesheet(
                new Fonts(
                    new Font(                                                               // Index 0 – The default font.
                        new FontSize() { Val = 11 },
                        new Color() { Rgb = new HexBinaryValue() { Value = "000000" } },
                        new FontName() { Val = "Calibri" }),
                    new Font(                                                               // Index 1 – The bold font.
                        new Bold(),
                        new FontSize() { Val = 11 },
                        new Color() { Rgb = new HexBinaryValue() { Value = "000000" } },
                        new FontName() { Val = "Calibri" }),
                    new Font(                                                               // Index 2 – The Italic font.
                        new Italic(),
                        new FontSize() { Val = 11 },
                        new Color() { Rgb = new HexBinaryValue() { Value = "000000" } },
                        new FontName() { Val = "Calibri" }),
                    new Font(                                                               // Index 2 – The Times Roman font. with 16 size
                        new FontSize() { Val = 16 },
                        new Color() { Rgb = new HexBinaryValue() { Value = "000000" } },
                        new FontName() { Val = "Times New Roman" })
                ),
                new Fills(
                    new Fill(                                                           // Index 0 – The default fill.
                        new PatternFill() { PatternType = PatternValues.None }),
                     new Fill(                                                           // Index 2 – The yellow fill.
                        new PatternFill() { PatternType = PatternValues.Gray125 }),
                    new Fill(                                                           // Index 2 – The yellow fill.
                        new PatternFill(
                            new ForegroundColor() { Rgb = new HexBinaryValue() { Value = "FFF79646" } }
                        )
                        { PatternType = PatternValues.Solid })
                ),
                new Borders(
                    new Border(                                                         // Index 0 – The default border.
                        new LeftBorder(),
                        new RightBorder(),
                        new TopBorder(),
                        new BottomBorder(),
                        new DiagonalBorder()),
                    new Border(                                                         // Index 1 – Applies a Left, Right, Top, Bottom border to a cell
                        new LeftBorder(
                            new Color() { Auto = true }
                        )
                        { Style = BorderStyleValues.Thin },
                        new RightBorder(
                            new Color() { Auto = true }
                        )
                        { Style = BorderStyleValues.Thin },
                        new TopBorder(
                            new Color() { Auto = true }
                        )
                        { Style = BorderStyleValues.Thin },
                        new BottomBorder(
                            new Color() { Auto = true }
                        )
                        { Style = BorderStyleValues.Thin },
                        new DiagonalBorder())
                ),
                new CellFormats(
                    new CellFormat() { FontId = 0, FillId = 0, BorderId = 1 },                          // Index 0 – The default cell style.  If a cell does not have a style index applied it will use this style combination instead
                    new CellFormat() { FontId = 1, FillId = 0, BorderId = 1, ApplyFont = true, ApplyFill = true },       // Index 1 – Bold
                    new CellFormat() { FontId = 1, FillId = 2, BorderId = 1, ApplyFill = true },       // Index 2 – Italic
                    new CellFormat(                                                                   // Index 5 – Alignment
                        new Alignment() { Horizontal = HorizontalAlignmentValues.Center, Vertical = VerticalAlignmentValues.Center }
                    )
                    { FontId = 0, FillId = 0, BorderId = 0, ApplyAlignment = true },
                    new CellFormat() { FontId = 0, FillId = 0, BorderId = 1, ApplyBorder = true }      // Index 6 – Border
                )
            ); // return
        }
        //***********************************************
        public static Columns AutoSize(SheetData sheetData)
        {
            var maxColWidth = GetMaxCharacterWidth(sheetData);

            Columns columns = new Columns();
            //this is the width of my font - yours may be different
            double maxWidth = 7;
            foreach (var item in maxColWidth)
            {
                //width = Truncate([{Number of Characters} * {Maximum Digit Width} + {5 pixel padding}]/{Maximum Digit Width}*256)/256
                double width = Math.Truncate((item.Value * maxWidth + 5) / maxWidth * 256) / 256;

                //pixels=Truncate(((256 * {width} + Truncate(128/{Maximum Digit Width}))/256)*{Maximum Digit Width})
                double pixels = Math.Truncate(((256 * width + Math.Truncate(128 / maxWidth)) / 256) * maxWidth);

                //character width=Truncate(({pixels}-5)/{Maximum Digit Width} * 100+0.5)/100
                double charWidth = Math.Truncate((pixels - 5) / maxWidth * 100 + 0.5) / 100;

                Column col = new Column() { BestFit = true, Min = (UInt32)(item.Key + 1), Max = (UInt32)(item.Key + 1), CustomWidth = true, Width = (DoubleValue)width };
                columns.Append(col);
            }
            return columns;
        }
        private static Dictionary<int, int> GetMaxCharacterWidth(SheetData sheetData)
        {
            //iterate over all cells getting a max char value for each column
            Dictionary<int, int> maxColWidth = new Dictionary<int, int>();
            var rows = sheetData.Elements<Row>();
            UInt32[] numberStyles = new UInt32[] { 5, 6, 7, 8 }; //styles that will add extra chars
            UInt32[] boldStyles = new UInt32[] { 1, 2, 3, 4, 6, 7, 8 }; //styles that will bold
            foreach (var r in rows)
            {
                var cells = r.Elements<Cell>().ToArray();

                //using cell index as my column
                for (int i = 0; i < cells.Length; i++)
                {
                    var cell = cells[i];
                    var cellValue = cell.CellValue == null ? string.Empty : cell.CellValue.InnerText;
                    var cellTextLength = cellValue.Length;
                    if (cell.StyleIndex != null && numberStyles.Contains(cell.StyleIndex))
                    {
                        int thousandCount = (int)Math.Truncate((double)cellTextLength / 4);
                        //add 3 for '.00'
                        cellTextLength += (3 + thousandCount);
                    }
                    if (cell.StyleIndex != null && boldStyles.Contains(cell.StyleIndex))
                    {
                        //add an extra char for bold - not 100% acurate but good enough for what i need.
                        cellTextLength += 1;
                    }
                    if (maxColWidth.ContainsKey(i))
                    {
                        var current = maxColWidth[i];
                        if (cellTextLength > current)
                        {
                            maxColWidth[i] = cellTextLength;
                        }
                    }
                    else
                    {
                        maxColWidth.Add(i, cellTextLength);
                    }
                }
            }
            return maxColWidth;
        }
    }
}

