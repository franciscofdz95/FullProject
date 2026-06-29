using BIACore.Model;
using BIACore.Web.Model;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Data;
using System.Web.Http;
using Newtonsoft.Json;
using BIACore.Provider;
using Flote.WebAPI.Model.BIAUserAccess;

namespace Flote.WebAPI.WebAPI.Controller
{
    public partial class BIASecurityFloteController : BIACore.Web.Controller.BaseController
    {

        public override string Connection
        {
            get { return Connections.BIASecurity; }
        }

        [HttpPost]
        [ActionName("GetUserList")]
        public ClientResult GetUserList([FromBody] dynamic request)
        {
            try
            {
                return LoadClientResult("appObject.BIASecurity_New_UserSearch",
                    new DBParameter("@searchParam", DbType.AnsiString, request.query.Value),
                    new DBParameter("@currentUser", DbType.AnsiString, BIACore.Security.User.userId));
            }
            catch (Exception ex)
            {
                BIACore.Log.LogFactory.Exception(ex);
                throw;
            }
        }

        [HttpPost]
        [ActionName("GetEAInfo")]
        public ClientResult GetEAInfo([FromBody] dynamic request)
        {
            try
            {
                return LoadClientResult("appObject.BIA_BIASecurity_EA_Flote_Profile_Read");
            }
            catch (Exception ex)
            {
                BIACore.Log.LogFactory.Exception(ex);
                throw;
            }

        }
        [HttpPost]
        [ActionName("ReadProfile")]
        public ClientResult ReadProfile([FromBody] dynamic request)
        {
            try
            {
                string tablename = "BIASecurity_EA_Flote_New";
                return LoadClientResult("dynAppObject.BIASecurity_EA_TableRead",
                 new DBParameter("@bia_id", DbType.AnsiString, request.User.Value),
                 new DBParameter("@TableName", DbType.AnsiString, tablename));
            }
            catch (Exception ex)
            {
                BIACore.Log.LogFactory.Exception(ex);
                throw;
            }

        }

        [HttpPost]
        [ActionName("SaveUserAccess")]
        public ClientResult SaveUserAccess([FromBody] dynamic request)
        {
            try
            {
                return LoadClientResult("AppObject.BIASecurity_EA_Flote_Save",
                     new DBParameter("@BIA_ID", DbType.AnsiString, request.User.Value),
                     new DBParameter("@EA_ProfileId", DbType.Int16, request.EA_ProfileId.Value),
                     new DBParameter("@EA_E2K_UserID", DbType.AnsiString, request.EA_E2K_UserID.Value));
            }
            catch (Exception ex)
            {
                BIACore.Log.LogFactory.Exception(ex);
                throw;
            }
        }



    }
}
