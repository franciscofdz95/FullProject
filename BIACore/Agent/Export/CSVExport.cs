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
    public abstract class CSVExport : DataExport
    {
        #region BaseExport
        public override string ReportType { get { return "csv"; } }

        public override byte[] Generate()
        {
            using (MemoryStream stream = new MemoryStream())
            {
                ConvertToCSV(stream);
                return stream.ToArray();
            }
        }
        #endregion

        public virtual void ConvertToCSV(Stream stream)
        {
            using (StreamWriter result = new StreamWriter(stream))
            {
                LogFactory.Debug("Agent: starting CSV export {0}", ReportName);
                try
                {
                    foreach (Column column in Columns)
                    {
                        HideMissingColumns(column);
                    }

                    WriteFilter(result);
                    WriteHeader(result);

                    // write data
                    WriteData(result);

                    // write footer
                    WriteFooter(result);
                }
                catch (Exception e)
                {
                    LogFactory.Exception(e);
                    throw;
                }
                finally { LogFactory.Debug("Agent: completed Excel export {0}", ReportName); }
            }
        }

        #region Filter
        public virtual void WriteFilter(StreamWriter doc)
        {
            doc.Write(ReportTitle);

            int width = 0;
            foreach (Column column in Columns)
            {
                width += column.Width;
            }
            doc.WriteLine(new String(',', width));
        }
        #endregion

        #region Header
        public virtual void WriteHeader(StreamWriter doc)
        {
            // determine the number of rows we're going to write
            int depth = 0;
            foreach (Column column in Columns)
            {
                depth = Math.Max(depth, column.Depth);
            }

            // write each row
            int offset = 0;
            for (int i = 0; i < depth; ++i)
            {
            }

            StringBuilder sb = new StringBuilder();
            foreach (Column column in Columns)
            {
                sb.Append(WriteHeader(column));
            }
            sb.Remove(0, 1);
            doc.WriteLine(sb.ToString());
        }

        private string WriteHeader(Column column)
        {
            string result = string.Empty;
            if (column == null || column.Hide) return result;

            if (column.Columns == null || column.Columns.Count == 0)
            {
                // regular header - check if we exist before writing
                if (!Data.Columns.Contains(column.DataIndex)) return result;
            }
            else
            {
                // grouped header, recurse
                foreach (Column c in column.Columns)
                {
                    result += WriteHeader(c);
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
        public virtual int WriteData(SLDocument doc, int row_start)
        {
            for (int row = 0; row < Data.Rows.Count; ++row)
            {
                int offset = 1;
                DataRow data = Data.Rows[row];

                for (int col = 0; col < Columns.Count; ++col)
                {
                    offset += WriteData(doc, row_start + row, offset, Columns[col], data);
                }
            }
            return Data.Rows.Count;
        }

        private int WriteData(SLDocument doc, int row, int col, Column column, DataRow data)
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
                    offset += WriteData(doc, row, col + offset, column.Columns[i], data);
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
