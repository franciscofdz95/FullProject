using System;
using System.Collections.Generic;
using System.Data;
using System.Web.Http;

using BIACore.Model;
using BIACore.Web.Model;

using BIASecurity.WebAPI;

namespace BIASecurity.WebAPI.Controller
{
    //public partial class OracleController : BIACore.Web.Controller.BaseController
    //{

    //    public override string Connection
    //    {
    //        get { return Connections.ORACLEDB; }
    //    }

    //    [HttpPost]
    //    [HttpGet]
    //    [ActionName("GetSearchResults")]
    //    public ClientResult GetSearchResults([FromBody] dynamic request)
    //    {
    //        return LoadClientResult("dimObject.SearchResults ", new DBParameter[] {
    //            new DBParameter("@searchText", DbType.AnsiString, request.searchText != null ? request.searchText.Value : null),
    //            new DBParameter("@shortcutFilter", DbType.AnsiString, request.shortcutFilter != null ? request.shortcutFilter.Value : null),
    //            new DBParameter("@sessionId", DbType.AnsiString, BIACore.Security.Session.sessionId),
    //            new DBParameter("@appCode", DbType.AnsiString, BIACore.Security.Session.appCode),
    //        });
    //    }
    //}
}
