using BIACore.Model;
using System.Data;
using System.Web.Http;

namespace BIACore.Web.Controller
{
    public abstract partial class MyReportsController
    {
        [HttpPost]
        [ActionName("Retry")]
        public void Retry([FromBody] dynamic request)
        {
            if (request.MyReportsId == null) return;

            Execute("appObject.MyReportsUpdateStatusById",
                new DBParameter("@ReportId", DbType.Int32, request.MyReportsId.Value),
                new DBParameter("@Status", DbType.AnsiString, "R"),
                new DBParameter("@StatusComments", DbType.AnsiString, "User requested retry"));
        }
    }
}
