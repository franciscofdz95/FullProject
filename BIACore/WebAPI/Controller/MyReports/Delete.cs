using BIACore.Model;
using System.Data;
using System.Web.Http;


namespace BIACore.Web.Controller
{
    public abstract partial class MyReportsController
    {
        [HttpPost]
        [ActionName("Delete")]
        public void Delete([FromBody] dynamic[] request)
        {
            foreach (dynamic item in request)
            {
                if (item.MyReportsId == null) continue;

                Execute("appObject.MyReportsDeleteByID",
                    new DBParameter("@ReportID", DbType.Int32, item.MyReportsId.Value));
            }
        }
    }
}
