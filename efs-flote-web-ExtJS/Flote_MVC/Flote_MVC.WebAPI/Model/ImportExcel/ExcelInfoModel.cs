using System.Collections.Generic;


namespace Flote.WebAPI.WebAPI.Model
{
    /// <summary>
    /// Class the excel column map.
    /// </summary>
    public class ExcelInfoColumnMap
    {
        public string ColumnName { get; set; }
        public int ColumnNumber { get; set; }
    }
    /// <summary>
    /// Class excel info
    /// </summary>
    public class ExcelInfoModel
    {
        public string FileName { get; set; }
        public string TabName { get; set; }
        public string UserId { get; set; }

        public int HeaderRow { get; set; }
        public int DataRowStart { get; set; }
        public int DataRowEnd { get; set; }

        public string Origin { get; set; }
        public string Destination { get; set; }

        public int Invoice_ID { get; set; }
        public int PQRID { get; set; }
        public List<ExcelInfoColumnMap> ColumnMap { get; set; }

        public string[] MovementType { get; set; }
        public string[] Service { get; set; }
    }
}