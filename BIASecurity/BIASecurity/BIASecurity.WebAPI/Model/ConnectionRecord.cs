using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

using System.Data;

using BIACore.Model;
using extjs = BIACore.Web.Model.ExtJS;

namespace BIASecurity.WebAPI.Model
{
    public class ConnectionRecord : extjs.Parameter
    {
        public int? ConnectionId { get; set; }
        public string AppCode { get; set; }
        public string ConnectionName { get; set; }
        public int EnvironmentId { get; set; }
        public int ServerId { get; set; }
        public int DatabaseId { get; set; }
        public int UserId { get; set; }
        public bool Active { get; set; }
        public bool Raw { get; set; }
        public bool IncludeProvider { get; set; }
        public string ProviderOverride { get; set; }
        public int TechnologyId { get; set; }
        public ConnectionRecord() { }

        public override DBParameter[] ToDBParameter()
        {
            List<DBParameter> args = new List<DBParameter>();

            if (!string.IsNullOrEmpty(AppCode)) args.Add(new DBParameter("@appCode", DbType.AnsiString, AppCode));
            if (!string.IsNullOrEmpty(ConnectionName)) args.Add(new DBParameter("@connectionName", DbType.AnsiString, ConnectionName));
            if (!string.IsNullOrEmpty(ProviderOverride)) args.Add(new DBParameter("@providerOverride", DbType.AnsiString, ProviderOverride));
            if (ConnectionId != null) args.Add(new DBParameter("@connectionId", DbType.AnsiString, ConnectionId));

            args.Add(new DBParameter("@environmentId", DbType.AnsiString, EnvironmentId));
            args.Add(new DBParameter("@serverId", DbType.AnsiString, ServerId));
            args.Add(new DBParameter("@databaseId", DbType.AnsiString, DatabaseId));
            args.Add(new DBParameter("@userId", DbType.AnsiString, UserId));
            args.Add(new DBParameter("@active", DbType.AnsiString, Active));
            args.Add(new DBParameter("@raw", DbType.AnsiString, Raw));
            args.Add(new DBParameter("@includeProvider", DbType.AnsiString, IncludeProvider));
            args.Add(new DBParameter("@technologyId", DbType.AnsiString, TechnologyId));
            args.Add(new DBParameter("@editedBy", DbType.AnsiString, BIACore.Security.Session.userId));


            return args.ToArray();
        }
    }
}
