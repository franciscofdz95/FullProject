using Newtonsoft.Json;
using System;

namespace BIACore.Web.Model.MyReports
{
    [NonExtendable]
    public class Report
    {
        [JsonIgnore]
        public int ReturnedRowCount { get; set; }

        // populated on create
        public int MyReportsId { get; set; }
        public DateTime DateEntry { get; set; }
        public string Description { get; set; }
        public string Status { get; set; }
        public string StatusComments { get; set; }
        [JsonIgnore]
        public string RACF { get; set; }
        [JsonIgnore]
        public string ROIName { get; set; }
        [JsonIgnore]
        public string BaseReportName { get; set; }
        [JsonIgnore]
        public string OutputFormat { get; set; }

        // My Changes to MyReports
        public string UserId { get { return RACF; } }
        public string FileName
        {
            get
            {
                return string.IsNullOrWhiteSpace(BaseReportName)
                    ? string.Format("{0}_{1}_{2}.{3}", Type, DateEntry.ToString("MMddhhmmss"), MyReportsId, FileType)
                    : BaseReportName.Replace("FileName: ", string.Empty);
            }
        }
        public string FileType
        {
            get { return OutputFormat; }
            set { OutputFormat = value; }
        }
        [JsonIgnore]
        public string Type { get { return ROIName.Replace(" ", ""); } }
        // End My Changes
    }
}
