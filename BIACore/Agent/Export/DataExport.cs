using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

using System.Data;

namespace BIACore.Agent.Export
{
    public abstract class DataExport : BaseExport
    {
        public abstract string Connection { get; }
        public string ReportSQL { get; set; }

        public List<Column> Columns { get; set; }

        private DataTable _Data = null;
        public DataTable Data
        {
            get
            {
                if (_Data == null) _Data = LoadData();
                return _Data;
            }
            set { _Data = value; }
        }

        public abstract DataTable LoadData();

        #region Columns
        public void HideMissingColumns(Column column)
        {
            // know we're hidden, don't bother
            if (column == null || column.Hide) return;

            if (column.Columns == null || column.Columns.Count == 0)
            {
                if (!Data.Columns.Contains(column.DataIndex))
                    column.Hide = true;
            }
            else
            {
                // changed this from hide to show
                // if any 1 child is visible, we need to also be visible.
                bool show = false;
                foreach (Column col in column.Columns)
                {
                    HideMissingColumns(col);
                    show = show || !col.Hide;
                }
                column.Hide = !show;
            }
        }

        public List<Column> FindColumns(string header = null, string dataIndex = null)
        {
            List<Column> results = new List<Column>();
            foreach (Column column in Columns)
            {
                results.AddRange(column.FindColumns(header, dataIndex));
            }
            return results;
        }
        #endregion
    }
}
