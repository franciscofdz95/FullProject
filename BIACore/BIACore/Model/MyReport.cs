using System;

namespace BIACore.Model
{
    public class MyReport
    {
        public int? ReportId { get; set; }
        public DateTime? Date { get; set; }
        public int? Priority { get; set; }

        public string UserId { get; set; }
        public string ReportType { get; set; }
        public string Description { get; set; }
        public string Status { get; set; }
        public string Comments { get; set; }

        public string FileName { get; set; }
        public string FileType { get; set; }

        public string[] Parameters { get; set; }
    }
}
