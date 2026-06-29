using System;
using System.Collections.Generic;
using System.Data;
using System.Web.Http;

using BIACore.Model;
using BIACore.Web.Model;

namespace BIASecurity.WebAPI.Controller
{
    public partial class BIASecurityController
    {
        [HttpPost]
        [HttpGet]
        [ActionName("TestSQL")]
        public ClientResult TestSQL([FromBody] dynamic request)
        {            
            
            return LoadClientResult("appObject.ApplicationGetFilteredList", DBType.SQL, new DBParameter[] {
                new DBParameter("@search", DbType.AnsiString, request.search != null ? request.search.Value : null),
                new DBParameter("@filter", DbType.AnsiString, request.filter != null ? request.filter.Value : null),
                new DBParameter("@sort", DbType.AnsiString, request.sort != null ? request.sort.Value : null),
                new DBParameter("@userId", DbType.AnsiString, BIACore.Security.User.adId),
            });
        }
    }
}
