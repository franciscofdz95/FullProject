using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;

using BIACore.Model;

namespace BIACore.Server.Controller
{
    public partial class ImpersonationController : BIACore.Web.Controller.BaseController
    {
        public override string Connection { get { return Connections.Security; } }

        private List<object> list(string SessionId, string AppCode)
        {
            List<DBParameter> args = new List<DBParameter>();
            if (!string.IsNullOrWhiteSpace(SessionId)) args.Add(new DBParameter("@SessionId", DbType.AnsiString, SessionId));
            if (!string.IsNullOrWhiteSpace(AppCode)) args.Add(new DBParameter("@AppCode", DbType.AnsiString, AppCode));

            return LoadResult("secObject.SessionImpersonateAsUserList", args.ToArray());
        }

        private List<object> search(string SessionId, string AppCode, string Query)
        {
            List<DBParameter> args = new List<DBParameter>();
            if (!string.IsNullOrWhiteSpace(SessionId)) args.Add(new DBParameter("@SessionId", DbType.AnsiString, SessionId));
            if (!string.IsNullOrWhiteSpace(AppCode)) args.Add(new DBParameter("@AppCode", DbType.AnsiString, AppCode));
            if (!string.IsNullOrWhiteSpace(Query)) args.Add(new DBParameter("@Query", DbType.AnsiString, Query));

            return LoadResult("secObject.SessionImpersonateAsUserSearch", args.ToArray());
        }

        private object impersonate(string SessionId, string AppCode, string ImpersonateId)
        {
            List<DBParameter> args = new List<DBParameter>();
            if (!string.IsNullOrWhiteSpace(SessionId)) args.Add(new DBParameter("@SessionId", DbType.AnsiString, SessionId));
            if (!string.IsNullOrWhiteSpace(AppCode)) args.Add(new DBParameter("@AppCode", DbType.AnsiString, AppCode));
            if (!string.IsNullOrWhiteSpace(ImpersonateId)) args.Add(new DBParameter("@ImpersonateId", DbType.AnsiString, ImpersonateId));

            return LoadSingle("secObject.SessionImpersonationSet", args.ToArray());
        }

    }
}
