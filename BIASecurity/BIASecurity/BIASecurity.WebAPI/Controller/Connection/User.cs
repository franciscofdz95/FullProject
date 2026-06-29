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
        [ActionName("AddEditConnectionUser")]
        public ClientResult AddEditConnectionUser([FromBody] dynamic request)
        {
            if (request != null && request.username != null && request.authString != null && BIASecurity.WebAPI.Controller.Connection.Security.IsBIAAppManager())
            {
                return LoadClientResult("conObject.UpsertConnectionUser", new DBParameter[] {
                    new DBParameter("@username",DbType.AnsiString, request.username.Value),
                    new DBParameter("@authKey",DbType.AnsiString, request.authString.Value == "" ? "" : BIACore.Provider.ConnectionUser.EncryptAuthKeyForSaving(request.authString.Value)),
                    new DBParameter("@editedBy",DbType.AnsiString, BIACore.Security.Session.userId),
                    new DBParameter("@active",DbType.Int16, request.active.Value)
                });
            }
            return null;
        }
        [HttpPost]
        [ActionName("ConnectionUserList")]
        public ClientResult ConnectionUserList([FromBody] ConnectionList request)
        {
            if (BIASecurity.WebAPI.Controller.Connection.Security.IsBIAAppManager())
            {
                return LoadPagedClientResult("dynConObject.GetConnectionUsers", request.ToDBParameter());
            }
            else return null;
        }
        [HttpPost]
        [ActionName("ConnectionUsernameList")]
        public object ConnectionUsernameList([FromBody] dynamic request)
        {
            if (BIASecurity.WebAPI.Controller.Connection.Security.IsBIAAppManager())
            {
                return LoadClientResult("conObject.GetConnectionUserList", new DBParameter[] {
                    new DBParameter("@userId", DbType.AnsiString, request != null && request.UserId != null ? request.UserId.Value : null),
                    new DBParameter("@search", DbType.AnsiString, request != null && request.search != null ? request.search.Value : null)
                });
            }
            else return null;
        }
        [HttpPost]
        [ActionName("ConnectionUserInfo")]
        public object ConnectionUserInfo([FromBody] dynamic request)
        {
            if (BIASecurity.WebAPI.Controller.Connection.Security.IsBIADeveloper() && request != null && request.userId != null)
            {
                return LoadClientResult("conObject.GetConnectionUserById", new DBParameter("@userId", DbType.AnsiString, request.userId.Value));
            }
            else return null;
        }
    }
}
