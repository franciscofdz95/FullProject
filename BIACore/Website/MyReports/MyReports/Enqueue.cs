using System;
using System.Collections.Generic;
using System.Data;

using System.Net;
using System.Net.Http;
using System.Web.Http;

using BIACore.Model;
using BIACore.Server;


namespace BIACore.MyReports.Controller
{
    public partial class MyReportsController
    {
        [HttpPost]
        [ActionName("Enqueue")]
        public HttpResponseMessage Enqueue(string TokenLocal, string AppCode, [FromBody] MyReport request)
        {
            if (!ExportEnabled(AppCode))
                return Request.CreateResponse(HttpStatusCode.OK, new { Success = false, Message = "Report server is currently turned off." });

            User user = Cached.User(CurrentContext.GetSessionId(new { TokenLocal = TokenLocal }), null, AppCode);
            if (null == user) ErrorUnauthorized();

            List<DBParameter> args = new List<DBParameter>();

            args.Add(new DBParameter("@AppCode", DbType.AnsiString, AppCode));
            args.Add(new DBParameter("@UserId", DbType.AnsiString, user.userId));

            if (null != request.Parameters && request.Parameters.Length > 0)
                args.Add(new DBParameter("@Parameters", DbType.AnsiString, string.Join("||", request.Parameters)));


            if (null != request.Priority) args.Add(new DBParameter("@Priority", DbType.Int32, request.Priority.Value));
            if (!string.IsNullOrWhiteSpace(request.FileName)) args.Add(new DBParameter("@FileName", DbType.AnsiString, request.FileName));
            if (!string.IsNullOrWhiteSpace(request.FileType)) args.Add(new DBParameter("@FileType", DbType.AnsiString, request.FileType));
            if (!string.IsNullOrWhiteSpace(request.ReportType)) args.Add(new DBParameter("@ReportType", DbType.AnsiString, request.ReportType));
            if (!string.IsNullOrWhiteSpace(request.Status)) args.Add(new DBParameter("@Status", DbType.AnsiString, request.Status));
            if (!string.IsNullOrWhiteSpace(request.Comments)) args.Add(new DBParameter("@Comments", DbType.AnsiString, request.Comments));
            if (!string.IsNullOrWhiteSpace(request.Description)) args.Add(new DBParameter("@Description", DbType.AnsiString, request.Description));

            try
            {
                //"myreports.
                Execute("appObject.Report_Enqueue", args.ToArray());
            }
            catch
            {
                return Request.CreateResponse(HttpStatusCode.OK, new { Success = false, Message = "Report not enqueued." });
            }
            return Request.CreateResponse(HttpStatusCode.OK, new { Success = true, Message = "Report successfully enqueued." });
        }
    }
}
