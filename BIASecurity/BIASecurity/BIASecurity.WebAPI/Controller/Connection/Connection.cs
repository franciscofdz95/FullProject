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
        [ActionName("ConnectionList")]
        public object ConnectionList([FromBody] ConnectionList request)
        {
            if (BIASecurity.WebAPI.Controller.Connection.Security.IsBIADeveloper())
            {
                return LoadPagedClientResult("dynConObject.GetConnections", request.ToDBParameter());
            }
            else return null;
        }
        [HttpPost]
        [ActionName("ConnectionInfo")]
        public object ConnectionInfo([FromBody] dynamic request)
        {
            if (BIASecurity.WebAPI.Controller.Connection.Security.IsBIADeveloper() && request != null && request.ConnectionId != null)
            {
                return LoadClientResult("conObject.GetConnectionById", new DBParameter("@connectionId", DbType.AnsiString, request.ConnectionId.Value));
            }
            else return null;
        }
        [HttpPost]
        [ActionName("ConnectionAppCodes")]
        public object ConnectionAppCodes([FromBody] ConnectionSelect request)
        {
            if (BIASecurity.WebAPI.Controller.Connection.Security.IsBIADeveloper())
            {
                return LoadClientResult("conObject.GetConnectionAppCodeList", request.ToDBParameter());
            }
            else return null;
        }
        [HttpPost]
        [ActionName("ConnectionServers")]
        public object ConnectionServers([FromBody] ConnectionSelect request)
        {
            if (BIASecurity.WebAPI.Controller.Connection.Security.IsBIADeveloper())
            {
                return LoadClientResult("conObject.GetConnectionServerList", request.ToDBParameter());
            }
            else return null;
        }
        [HttpPost]
        [ActionName("ConnectionDatabases")]
        public object ConnectionDatabases([FromBody] ConnectionSelect request)
        {
            if (BIASecurity.WebAPI.Controller.Connection.Security.IsBIADeveloper())
            {
                return LoadClientResult("conObject.GetConnectionDatabaseList", request.ToDBParameter());
            }
            else return null;
        }
        [HttpPost]
        [ActionName("ConnectionEnvironments")]
        public object ConnectionEnvironments([FromBody] ConnectionSelect request)
        {
            if (BIASecurity.WebAPI.Controller.Connection.Security.IsBIADeveloper())
            {
                return LoadClientResult("conObject.GetConnectionEnvironmentList", request.ToDBParameter());
            }
            else return null;
        }
        [HttpPost]
        [ActionName("ConnectionUsers")]
        public object ConnectionUsers([FromBody] ConnectionSelect request)
        {
            if (BIASecurity.WebAPI.Controller.Connection.Security.IsBIADeveloper())
            {
                return LoadClientResult("conObject.GetConnectionUserList", request.ToDBParameter());
            }
            else return null;
        }
        [HttpPost]
        [ActionName("ConnectionTechnology")]
        public object ConnectionTechnology([FromBody] ConnectionSelect request)
        {
            if (BIASecurity.WebAPI.Controller.Connection.Security.IsBIADeveloper())
            {
                return LoadClientResult("conObject.GetConnectionTechnologyList", request.ToDBParameter());
            }
            else return null;
        }
        [HttpPost]
        [ActionName("AddEditConnection")]
        public object AddEditConnection([FromBody] ConnectionRecord request)
        {
            if (BIASecurity.WebAPI.Controller.Connection.Security.IsBIADeveloper())
            {
                return LoadClientResult("conObject.UpsertConnection", request.ToDBParameter());
            }
            else return null;
        }
        [HttpPost]
        [ActionName("DeleteConnection")]
        public object DeleteConnection([FromBody] dynamic request)
        {
            
            if (BIASecurity.WebAPI.Controller.Connection.Security.IsBIADeveloper())
            {
                DBParameter[] param = new DBParameter[2];
                param[0] = new DBParameter("@connectionId", DbType.Int32, request.ConnectionId?.Value);
                param[1] = new DBParameter("@adid", DbType.Int32, BIACore.Security.User.adId);
                return LoadClientResult("conObject.DeleteConnection", param);
            }
            else return null;
        }
        [HttpPost]
        [ActionName("ConnectionEnvironmentFilter")]
        public object ConnectionEnvironmentFilter([FromBody] dynamic request)
        {
            if (BIASecurity.WebAPI.Controller.Connection.Security.IsBIADeveloper())
            {
                return LoadClientResult("conObject.GetEnvironmentFilter");
            }
            else return null;
        }

        [HttpPost]
        [ActionName("TestApplicationConnection")]
        public bool TestApplicationConnection([FromBody] dynamic request)
        {
            if (BIASecurity.WebAPI.Controller.Connection.Security.IsBIADeveloper() && request != null)
            {
                return TestConnection("conObject.GetDatabaseConnectionString", (DBType)Enum.Parse(typeof(DBType), request.ServerTypeId.Value), new DBParameter("@connectionID", DbType.AnsiString, request.ConnectionId.Value));
            }
            else return false;
        }
    }
}