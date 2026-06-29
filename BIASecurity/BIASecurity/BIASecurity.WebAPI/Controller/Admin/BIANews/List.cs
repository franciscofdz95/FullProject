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
        [ActionName("GetBIAMessageType")]
        public object GetBIAMessageType([FromBody] dynamic request)
        {
            if (BIACore.Security.User.isSA)
            {
                return LoadClientResult("appObject.BIA_News_GetMessageTypes");
            }
            else return null;
        }

        [HttpPost]
        [ActionName("GetBIAMessages")]
        public object GetBIAMessages([FromBody] dynamic request)
        {
            if (BIACore.Security.User.isSA)
            {
                return LoadPagedClientResult("dynAppObject.BIA_News_GetMessages_Paging");
            }
            else return null;
        }

        [HttpPost]
        [ActionName("GetBIAMessageInfo")]
        public object GetBIAMessageInfo([FromBody] dynamic request)
        {
            if (BIACore.Security.User.isSA && request != null && request.NewsId != null)
            {
                return LoadClientResult("appObject.BIA_News_GetMessageById", new DBParameter("@newsId", DbType.AnsiString, request.NewsId.Value));
            }
            else return null;
        }

        [HttpPost]
        [ActionName("UpsertBIAMessage")]
        public object UpsertBIAMessage([FromBody] NewsRecord request)
        {
            if (BIACore.Security.User.isSA && request != null)
            {
                return LoadClientResult("appObject.UpsertBIAMessage", request.ToDBParameter());
            }
            else return null;
        }

    }
}
