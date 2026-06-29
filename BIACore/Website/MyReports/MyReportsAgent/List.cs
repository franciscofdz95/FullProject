using System;
using System.Collections.Generic;
using System.Data;

using System.Net;
using System.Net.Http;
using System.Web;
using System.Web.Http;
using BIACore.Model;
using BIACore.Web.Model;
using extjs = BIACore.Web.Model.ExtJS;

using biasec = BIACore.Security;

using BIACore.Server;

namespace BIACore.MyReports.Controller
{
    public partial class MyReportsAgentController
    {
        [HttpPost]
        [ActionName("List")]
        public List<MyReport> List(string AppCode)
        {
            List<MyReport> result = new List<MyReport>();
            try
            {
                //"myreports.
                result = LoadResult<MyReport>("appObject.Report_List",
                    new DBParameter("@AppCode", DbType.AnsiString, AppCode),
                    new DBParameter("@Status", DbType.AnsiString, "N,Q"));

                foreach (MyReport report in result)
                {
                    report.Parameters = Provider.SQL.ExecuteToString(BIACore.Server.Connections.MyReports,
                        "appObject.Report_Param",
                        new DBParameter("@ReportId", DbType.Int32, report.ReportId.Value)).ToArray();
                }
            }
            catch (Exception ex)
            {
                LogFactory.Exception(ex);
            }
            return result;
        }
    }
}
