using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Text;

using System.IO;

namespace BIACore.Agent.Export
{
    public static partial class CellFormatters
    {
        // MM/dd/yyyy
        public static void Date(StreamWriter doc, object value, DataRow data)
        {
            CustomDateTime(doc, value, "MM/dd/yyyy");
        }

        // yyyy-MM-dd hh:mm:ss A
        public static void DateTime(StreamWriter doc, object value, DataRow data)
        {
            CustomDateTime(doc, value, "yyyy-MM-dd HH:mm:ss A");
        }

        public static void CustomDateTime(StreamWriter doc, object value, string format)
        {
            if (value is DateTime)
            {
                doc.Write(((DateTime)value).ToString(format));
            }
            else
            {
                Default(doc, value);
            }
        }

        //public static void ToCustomDateTime(SLDocument doc, int row, int col, object value, string sourceFormat, string destFormat)
        //{
        //    //cell.Style.DateFormat.Format = destFormat;
        //    //DateTime thing = System.DateTime.Parse(value, sourceFormat);
        //}

        // $ #,##0
        public static void Money_0(StreamWriter doc, object value, DataRow data)
        {
            CustomNumber(doc, value, "$ #,##0");
        }

        // $ #,##0.0
        public static void Money_1(StreamWriter doc, object value, DataRow data)
        {
            CustomNumber(doc, value, "$ #,##0.0");
        }

        // $ #,##0.00
        public static void Money_2(StreamWriter doc, object value, DataRow data)
        {
            CustomNumber(doc, value, "$ #,##0.00");
        }

        // #,##0
        public static void Number_0(StreamWriter doc, object value, DataRow data)
        {
            CustomNumber(doc, value, "#,##0");
        }

        // #,##0.0
        public static void Number_1(StreamWriter doc, object value, DataRow data)
        {
            CustomNumber(doc, value, "#,##0.0");
        }

        // #,##0.00
        public static void Number_2(StreamWriter doc, object value, DataRow data)
        {
            CustomNumber(doc, value, "#,##0.00");
        }

        // 0%
        public static void Percent_0(StreamWriter doc, object value, DataRow data)
        {
            CustomNumber(doc, value, "0%");
        }

        // 0.0%
        public static void Percent_1(StreamWriter doc, object value, DataRow data)
        {
            CustomNumber(doc, value, "0.0%");
        }

        // 0.00%
        public static void Percent_2(StreamWriter doc, object value, DataRow data)
        {
            CustomNumber(doc, value, "0.00%");
        }

        public static void CustomNumber(StreamWriter doc, object value, string format)
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

        public static void Default(StreamWriter doc, object value, DataRow data = null)
        {
            if (value is String || value is char)
            {
                string v = Convert.ToString(value);
                string format = (v.Contains(',')) ? "\"{0}\"" : "{0}";

                doc.Write(format, v);
            }
            else if (value is TimeSpan)
            {
                //doc.SetCellValue(row, col, (TimeSpan)value);
            }
            else if (value is DateTime)
            {
                doc.Write(Convert.ToDateTime(value).ToString("o"));
            }
            else if (value is sbyte || value is byte
                || value is short || value is ushort
                || value is int || value is uint
                || value is long || value is ulong)
            {
                doc.Write(Convert.ToInt64(value));
            }
            else if (value is float || value is double || value is decimal)
            {
                doc.Write(Convert.ToDecimal(value));
            }
            else if (value is Boolean)
            {
                doc.Write(Convert.ToBoolean(value));
            }
            else
            {
                doc.Write(Convert.ToString(value));
            }
        }
    }
}
