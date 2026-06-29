using BIACore.Model;
using System.Collections.Generic;
using System.Data;
using System.Web.Http;
using biasec = BIACore.Security;


namespace BIACore.Web.Controller
{
    public abstract partial class MyReportsController
    {
        [HttpPost]
        [ActionName("Enqueue")]
        public bool Enqueue([FromBody] dynamic request)
        {
            List<DBParameter> args = new List<DBParameter>();

            if (ExportEnabled(request))
            {
                if (null != request.Parameters) args.Add(new DBParameter("@ParamValue", DbType.AnsiString, request.Parameters.Value));
                if (null != request.Type) args.Add(new DBParameter("@ROIName", DbType.AnsiString, request.Type.Value));
                if (null != request.Description) args.Add(new DBParameter("@Description", DbType.AnsiString, request.Description.Value));

                args.Add(new DBParameter("@ROXName", DbType.AnsiString, BIACore.Settings.Config.AppCode));
                args.Add(new DBParameter("@ReportGroup", DbType.AnsiString, BIACore.Settings.Config.AppCode));
                args.Add(new DBParameter("@UserID", DbType.AnsiString, biasec.User.userId));
                args.Add(new DBParameter("@Queue", DbType.Boolean, true));

                Execute("appObject.MyReportsInsertParameter", args.ToArray());
                return true;
            }
            return false;
        }
    }
}
