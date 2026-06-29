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
        [ActionName("SearchHistoryInsert")]
        public ClientResult SearchHistoryInsert([FromBody] dynamic request)
        {
            return LoadClientResult("dimObject.SearchHistoryInsert", new DBParameter[] {
                new DBParameter("@userId",DbType.AnsiString, CurrentUser.UserId),
                new DBParameter("@id",DbType.AnsiString, request.id != null ? request.id.Value : null),
                new DBParameter("@group",DbType.AnsiString, request.group != null ? request.group.Value : null),
                new DBParameter("@eventType",DbType.AnsiString, request.eventType != null ? request.eventType.Value : null)
            });
        }

        [HttpPost]
        [ActionName("SearchPinResults")]
        public ClientResult SearchPinResults([FromBody] dynamic request)
        {
            return LoadClientResult("dimObject.GetSearchPinResults", new DBParameter[] {
                new DBParameter("@searchValue",DbType.AnsiString, request.query != null ? request.query.Value : null),
                new DBParameter("@searchType",DbType.AnsiString, request.searchType != null ? request.searchType.Value : null),
                new DBParameter("@userId",DbType.AnsiString, CurrentUser.UserId)
            });
        }
    }
}
