using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

using System.Data;

using BIACore.Model;
using extjs = BIACore.Web.Model.ExtJS;

namespace BIASecurity.WebAPI.Model
{
    public class ServerRecord : extjs.Parameter
    {
        public int? ServerId { get; set; }
        public string ServerName { get; set; }
        public string ServerAlias { get; set; }
        public string InstanceName { get; set; }
        public string Port { get; set; }
        public int ServerTypeId { get; set; }
        public int EnvironmentId { get; set; }
        public int ClusterId { get; set; }
        public int PrimaryNodeId { get; set; }
        public bool Active { get; set; }
        public ServerRecord() { }

        public override DBParameter[] ToDBParameter()
        {
            List<DBParameter> args = new List<DBParameter>();

            if (ServerId != null) args.Add(new DBParameter("@serverId", DbType.AnsiString, ServerId));

            if (!string.IsNullOrEmpty(ServerName)) args.Add(new DBParameter("@serverName", DbType.AnsiString, ServerName));
            if (!string.IsNullOrEmpty(ServerAlias)) args.Add(new DBParameter("@serverAlias", DbType.AnsiString, ServerAlias));
            if (!string.IsNullOrEmpty(InstanceName)) args.Add(new DBParameter("@instanceName", DbType.AnsiString, InstanceName));
            if (!string.IsNullOrEmpty(Port)) args.Add(new DBParameter("@port", DbType.AnsiString, Port));

            args.Add(new DBParameter("@serverTypeId", DbType.AnsiString, ServerTypeId));
            args.Add(new DBParameter("@environmentId", DbType.AnsiString, EnvironmentId));
            args.Add(new DBParameter("@clusterId", DbType.AnsiString, ClusterId));
            args.Add(new DBParameter("@primaryNodeId", DbType.AnsiString, PrimaryNodeId));
            args.Add(new DBParameter("@active", DbType.AnsiString, Active));

            return args.ToArray();
        }
    }
}
