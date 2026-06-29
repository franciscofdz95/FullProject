using System;
using System.Collections.Generic;
using System.Data;

using System.Web.Http;
using BIACore.Model;

using BIACore.Server;

namespace BIACore.MyReports.Controller
{
    public partial class MyReportsAgentController
    {
        [HttpPost]
        [ActionName("Update")]
        public void Update([FromBody] MyReport[] request)
        {
            int errors = 0;
            foreach (MyReport report in request)
            {
                if (null == report.ReportId) continue;

                try
                {
                    //"myreports.
                    Execute("appObject.Report_Update",
                        new DBParameter("@ReportId", DbType.Int32, report.ReportId.Value),
                        new DBParameter("@Status", DbType.AnsiString, report.Status),
                        new DBParameter("@Comments", DbType.AnsiString, report.Comments));
                }
                catch (Exception ex)
                {
                    LogFactory.Exception(ex);
                    ++errors;
                }
            }

            if (errors > 0)
                throw new Exception(string.Format("Failed to update {0} of {1} reports", errors, request.Length));
        }
    }
}