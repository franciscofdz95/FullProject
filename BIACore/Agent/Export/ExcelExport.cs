using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

using System.IO;
using System.Data;
using SpreadsheetLight;

using oxml = DocumentFormat.OpenXml.Spreadsheet;
using draw = System.Drawing;

using BIACore.Log;

namespace BIACore.Agent.Export
{
    public abstract class ExcelExport : DataExport
    {
        #region BaseExport
        public override string ReportType { get { return "xlsx"; } }

        public override Stream Generate()
        {
            MemoryStream result = new MemoryStream();
            ConvertToExcel().SaveAs(result);

            // reset the position to the start.
            result.Position = 0;

            return result;
        }
        #endregion

        public virtual SLDocument ConvertToExcel()
        {
            LogFactory.Debug("Agent: starting Excel export {0}", ReportName);
            try
            {
                int width = 0;
                foreach (Column column in Columns)
                {
                    HideMissingColumns(column);
                    width += column.Width;
                }

                SLDocument result = new SLDocument();
                int row = 1;

                // write header
                row += WriteFilter(result, row);
                row += WriteHeader(result, row);

                // freeze header
                result.FreezePanes(row - 1, 0);

                // write data
                row += WriteData(result, row);

                // write footer
                row += WriteFooter(result, row);

                // adjust column widths
                result.AutoFitColumn(1, width);

                StatusUpdate("Saving...");

                return result;
            }
            catch (Exception e)
            {
                LogFactory.Exception(e);
                throw;
            }
            finally { LogFactory.Debug("Agent: completed Excel export {0}", ReportName); }
        }

        #region Filter
        public virtual int WriteFilter(SLDocument doc, int row_start)
        {
            int width = 0;
            foreach (Column col in Columns)
            {
                width += col.Width;
            }

            doc.MergeWorksheetCells(row_start, 1, row_start, width);
            doc.SetCellValue(row_start, 1, ReportTitle);

            SLStyle style = doc.CreateStyle();
            style.SetFontBold(true);
            style.SetPatternFill(oxml.PatternValues.Solid, draw.Color.LightGray, draw.Color.Black);
            doc.SetRowStyle(row_start, style);
            return 1;
        }
        #endregion

        #region Header
        public virtual int WriteHeader(SLDocument doc, int row_start)
        {
            int depth = 0;
            int offset = 1;

            // find the maximum depth (we work upwards from this value)
            foreach (Column column in Columns)
            {
                depth = Math.Max(depth, column.Depth);
            }

            for (int i = 0; i < Columns.Count; ++i)
            {
                Column column = Columns[i];
                offset += WriteHeader(doc, row_start, offset, column);
            }

            // set the header style
            SLStyle style = doc.CreateStyle();
            style.SetPatternFill(oxml.PatternValues.Solid, draw.Color.PowderBlue, draw.Color.Black);
            style.SetFontBold(true);
            for (int i = 0; i < depth; ++i)
            {
                doc.SetRowStyle(row_start + i, style);
            }

            return depth;
        }

        private int WriteHeader(SLDocument doc, int row, int col, Column column)
        {
            int offset = 0;
            if (column == null || column.Hide) return offset;

            if (column.Columns == null || column.Columns.Count == 0)
            {
                // regular header - check if we exist before writing
                if (!Data.Columns.Contains(column.DataIndex)) return offset;
                ++offset;
            }
            else
            {
                // grouped header, recurse
                for (int i = 0; i < column.Columns.Count; ++i)
                {
                    offset += WriteHeader(doc, row + 1, col + offset, column.Columns[i]);
                }
            }

            // recursing is done, time to write our value
            if (offset > 0)
            {
                doc.MergeWorksheetCells(row, col, row, col + offset - 1);
                // write value
                doc.SetCellValue(row, col, column.Header);
            }
            return offset;
        }
        #endregion

        #region Data
        /// <summary>
        /// Primary point of input for Writing Data.
        /// </summary>
        /// <param name="doc"></param>
        /// <param name="row_start"></param>
        /// <returns></returns>
        public virtual int WriteData(SLDocument doc, int row_start)
        {
            for (int row = 0; row < Data.Rows.Count; ++row)
            {
                DataRow data = Data.Rows[row];
                int offset = 1;

                for (int col = 0; col < Columns.Count; ++col)
                {
                    offset += WriteRowData(doc, row_start + row, offset, Columns[col], data);
                }

                if (row % 1000 == 0)
                    StatusUpdate(string.Format("{0}% Complete", (row * 100) / Data.Rows.Count));
            }
            return Data.Rows.Count;
        }

        /// <summary>
        /// Moved from private to public in order to allow external applications to refer to this.
        /// </summary>
        /// <param name="doc"></param>
        /// <param name="row"></param>
        /// <param name="col"></param>
        /// <param name="column"></param>
        /// <param name="data"></param>
        /// <returns></returns>
        public int WriteRowData(SLDocument doc, int row, int col, Column column, DataRow data)
        {
            int offset = 0;

            if (column == null || column.Hide)
            {
                // 'hidden' column
            }
            else if (column.Columns != null && column.Columns.Count > 0)
            {
                // 'grouped' column
                for (int i = 0; i < column.Columns.Count; ++i)
                {
                    offset += WriteRowData(doc, row, col + offset, column.Columns[i], data);
                }
            }
            else if (data.Table.Columns.Contains(column.DataIndex))
            {
                // 'visible' column
                ++offset;
                column.Format(doc, row, col, data[column.DataIndex], data);
            }

            return offset;
        }
        #endregion

        #region Footer
        public virtual int WriteFooter(SLDocument doc, int row_start)
        {
            return 0;
        }
        #endregion
    }
}
