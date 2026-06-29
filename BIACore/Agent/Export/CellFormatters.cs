using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Text;
using System.Text.RegularExpressions;

using draw = System.Drawing;

using SpreadsheetLight;
using DocumentFormat.OpenXml;

namespace BIACore.Agent.Export
{
    /// <summary>
    /// Function pointer definition for writing to a cell
    /// NOTES FOR WHEN YOU IMPLEMENT YOUR OWN (because you will)
    /// * doesn't have to be static.
    /// </summary>
    /// <param name="cell">The cell to be written</param>
    /// <param name="value">The object data to be written</param>
    public delegate void CellFormatter(SLDocument doc, int row, int col, object value, DataRow data);

    public static partial class CellFormatters
    {
        private static Regex CleanString = new Regex(@"[\x00-\x08\x0B\x0C\x0E-\x1F]", RegexOptions.Compiled);

        internal static Dictionary<string, SLStyle> Styles = new Dictionary<string, SLStyle>();

        // MM/dd/yyyy
        public static void Date(SLDocument doc, int row, int col, object value, DataRow data)
        {
            CustomDateTime(doc, row, col, value, "m/d/Y");
        }

        // yyyy-MM-dd hh:mm:ss A
        public static void DateTime(SLDocument doc, int row, int col, object value, DataRow data)
        {
            CustomDateTime(doc, row, col, value, "Y-m-d H:i:s A");
        }

        public static void CustomDateTime(SLDocument doc, int row, int col, object value, string format)
        {
            SLStyle style;
            if (!Styles.ContainsKey(format))
            {
                style = doc.CreateStyle();
                style.FormatCode = format;

                Styles.Add(format, style);
            }
            else
            {
                style = Styles[format];
            }
            doc.SetCellStyle(row, col, style);

            Default(doc, row, col, value);
        }

        //public static void ToCustomDateTime(SLDocument doc, int row, int col, object value, string sourceFormat, string destFormat)
        //{
        //    //cell.Style.DateFormat.Format = destFormat;
        //    //DateTime thing = System.DateTime.Parse(value, sourceFormat);
        //}

        // $ #,##0
        public static void Money_0(SLDocument doc, int row, int col, object value, DataRow data)
        {
            FormatNumber(doc, row, col, value, "$ #,##0");
        }

        // $ #,##0.0
        public static void Money_1(SLDocument doc, int row, int col, object value, DataRow data)
        {
            FormatNumber(doc, row, col, value, "$ #,##0.0");
        }

        // $ #,##0.00
        public static void Money_2(SLDocument doc, int row, int col, object value, DataRow data)
        {
            FormatNumber(doc, row, col, value, "$ #,##0.00");
        }

        // #,##0
        public static void Number_0(SLDocument doc, int row, int col, object value, DataRow data)
        {
            FormatNumber(doc, row, col, value, "#,##0");
        }

        // #,##0.0
        public static void Number_1(SLDocument doc, int row, int col, object value, DataRow data)
        {
            FormatNumber(doc, row, col, value, "#,##0.0");
        }

        // #,##0.00
        public static void Number_2(SLDocument doc, int row, int col, object value, DataRow data)
        {
            FormatNumber(doc, row, col, value, "#,##0.00");
        }

        // 0%
        public static void Percent_0(SLDocument doc, int row, int col, object value, DataRow data)
        {
            FormatNumber(doc, row, col, value, "0%");
        }

        // 0.0%
        public static void Percent_1(SLDocument doc, int row, int col, object value, DataRow data)
        {
            FormatNumber(doc, row, col, value, "0.0%");
        }

        // 0.00%
        public static void Percent_2(SLDocument doc, int row, int col, object value, DataRow data)
        {
            FormatNumber(doc, row, col, value, "0.00%");
        }

        public static void CustomNumber(SLDocument doc, int row, int col, object value, string format)
        {
            FormatNumber(doc, row, col, value, format);
        }

        private static void FormatNumber(SLDocument doc, int row, int col, object value, string format)
        {
            SLStyle style;
            if (!Styles.ContainsKey(format + "+"))
            {
                style = doc.CreateStyle();
                style.FormatCode = format;
                Styles.Add(format + "+", style);

                style = doc.CreateStyle();
                style.FormatCode = format;
                style.SetFontColor(draw.Color.Red);
                Styles.Add(format + "-", style);

                style = doc.CreateStyle();
                style.FormatCode = format;
                style.SetFontColor(draw.Color.Gray);
                Styles.Add(format + "_", style);
            }
            decimal val = 0;
            if (decimal.TryParse(value.ToString(), out val))
            {
                if (val < 0)
                {
                    style = Styles[format + "-"];
                }
                else if (val == 0)
                {
                    style = Styles[format + "_"];
                }
                else
                {
                    style = Styles[format + "+"];
                }
                doc.SetCellStyle(row, col, style);
            }

            // Style first, then set data
            Default(doc, row, col, value);
        }

        public static void Default(SLDocument doc, int row, int col, object value, DataRow data = null)
        {
            if (value is TimeSpan)
            {
                //doc.SetCellValue(row, col, (TimeSpan)value);
            }
            else if (value is DateTime)
            {
                doc.SetCellValue(row, col, Convert.ToDateTime(value));
            }
            else if (value is sbyte || value is byte
                || value is short || value is ushort
                || value is int || value is uint
                || value is long || value is ulong)
            {
                doc.SetCellValue(row, col, Convert.ToInt64(value));
            }
            else if (value is float || value is double || value is decimal)
            {
                doc.SetCellValue(row, col, Convert.ToDecimal(value));
            }
            else if (value is Boolean)
            {
                doc.SetCellValue(row, col, Convert.ToBoolean(value));
            }
            else // value is String || value is char
            {
                doc.SetCellValue(row, col, CleanString.Replace(Convert.ToString(value), string.Empty));
            }
        }
    }
}
