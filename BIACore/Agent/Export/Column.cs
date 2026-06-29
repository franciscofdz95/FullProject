using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace BIACore.Agent.Export
{
    public class Column
    {
        #region Properties
        public string DataIndex { get; set; }
        public string Header { get; set; }
        public List<Column> Columns { get; set; }

        public bool Hide { get; set; }

        private int _depth = -1;
        public int Depth
        {
            get
            {
                if (_depth < 0) dimension();
                return _depth;
            }
        }

        private int _width = -1;
        public int Width
        {
            get
            {
                if (_width < 0) dimension();
                return _width;
            }
        }
        #endregion

        #region Function Pointers
        public CellFormatter Format;
        #endregion

        public Column(string header, string dataIndex)
            : this(header, dataIndex, CellFormatters.Default)
        { }

        public Column(string header, string dataIndex, CellFormatter format)
        {
            DataIndex = dataIndex;
            Header = header;
            Hide = false;

            Format = format;
        }

        public Column(string header, List<Column> columns)
        {
            Header = header;
            Hide = false;
            Columns = columns;
        }

        /// <summary>
        /// At the point this is called, all show/hide operations should
        /// be completed. Honor them.
        /// </summary>
        private void dimension()
        {
            // no children, go with base dimensions, honor Hide flag.
            if (null == Columns || Columns.Count == 0 || Hide)
            {
                // honor hide flag.
                _depth = (Hide) ? 0 : 1;
                _width = (Hide) ? 0 : 1;
            }
            else // children
            {
                _depth = _width = 0;
                foreach (Column col in Columns)
                {
                    _depth = Math.Max(_depth, col.Depth + 1);
                    _width += col.Width;
                }
            }
        }

        public List<Column> FindColumns(string header = null, string dataIndex = null)
        {
            List<Column> results = new List<Column>();

            if ((string.IsNullOrEmpty(header) || string.Compare(Header, header, true) == 0) &&
                (string.IsNullOrEmpty(dataIndex) || string.Compare(DataIndex, dataIndex, true) == 0))
            {
                results.Add(this);
            }

            if (Columns != null && Columns.Count > 0)
            {
                // recurse
                foreach (Column column in Columns)
                {
                    results.AddRange(column.FindColumns(header, dataIndex));
                }
            }
            return results;
        }
    }
}
