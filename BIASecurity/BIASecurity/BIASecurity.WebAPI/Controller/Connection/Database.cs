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
        [ActionName("DatabaseList")]
        public object DatabaseList([FromBody] ConnectionList request)
        {
            if (BIASecurity.WebAPI.Controller.Connection.Security.IsConnectionAdmin())
            {
                return LoadPagedClientResult("dynConObject.GetDatabases", request.ToDBParameter());
            }
            else return null;
        }
        [HttpPost]
        [ActionName("DatabaseInfo")]
        public object DatabaseInfo([FromBody] dynamic request)
        {
            if (BIASecurity.WebAPI.Controller.Connection.Security.IsConnectionAdmin() && request != null && request.DatabaseId != null)
            {
                return LoadClientResult("conObject.GetDatabaseById", new DBParameter("@databaseId", DbType.AnsiString, request.DatabaseId.Value));
            }
            else return null;
        }
        [HttpPost]
        [ActionName("AddEditDatabase")]
        public object AddEditDatabase([FromBody] DatabaseRecord request)
        {
            if (BIASecurity.WebAPI.Controller.Connection.Security.IsConnectionAdmin())
            {
                return LoadClientResult("conObject.UpsertDatabase", request.ToDBParameter());
            }
            else return null;
        }
    }
}
