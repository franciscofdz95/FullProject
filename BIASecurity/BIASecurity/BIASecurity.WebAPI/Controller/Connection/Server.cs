using System;
using System.Collections.Generic;
using System.Data;
using System.Web.Http;

using BIACore.Model;
using BIACore.Web.Model;
using BIASecurity.WebAPI.Model;

namespace BIASecurity.WebAPI.Controller
{
    public partial class BIASecurityController
    {
        [HttpPost]
        [ActionName("ServerList")]
        public object ServerList([FromBody] ConnectionList request)
        {
            if (BIASecurity.WebAPI.Controller.Connection.Security.IsConnectionAdmin())
            {
                return LoadPagedClientResult("dynConObject.GetServers", request.ToDBParameter());
            }
            else return null;
        }
        [HttpPost]
        [ActionName("ServerInfo")]
        public object ServerInfo([FromBody] dynamic request)
        {
            if (BIASecurity.WebAPI.Controller.Connection.Security.IsConnectionAdmin() && request != null && request.ServerId != null)
            {
                return LoadClientResult("conObject.GetServerById", new DBParameter("@serverId", DbType.AnsiString, request.ServerId.Value));
            }
            else return null;
        }
        [HttpPost]
        [ActionName("AddEditServer")]
        public object AddEditServer([FromBody] ServerRecord request)
        {
            if (BIASecurity.WebAPI.Controller.Connection.Security.IsConnectionAdmin())
            {
                return LoadClientResult("conObject.UpsertServer", request.ToDBParameter());
            }
            else return null;
        }
        [HttpPost]
        [ActionName("GetServerCluster")]
        public object GetServerCluster([FromBody] ConnectionSelect request)
        {
            if (BIASecurity.WebAPI.Controller.Connection.Security.IsConnectionAdmin())
            {
                return LoadClientResult("conObject.GetServerClusterList", request.ToDBParameter());
            }
            else return null;
        }
        [HttpPost]
        [ActionName("GetServerPrimaryNode")]
        public object GetServerPrimaryNode([FromBody] ConnectionSelect request)
        {
            if (BIASecurity.WebAPI.Controller.Connection.Security.IsConnectionAdmin())
            {
                return LoadClientResult("conObject.GetServerPrimaryNodeList", request.ToDBParameter());
            }
            else return null;
        }
        [HttpPost]
        [ActionName("GetServerType")]
        public object GetServerType([FromBody] ConnectionSelect request)
        {
            if (BIASecurity.WebAPI.Controller.Connection.Security.IsConnectionAdmin())
            {
                return LoadClientResult("conObject.GetServerTypeList", request.ToDBParameter());
            }
            else return null;
        }
    }
}
