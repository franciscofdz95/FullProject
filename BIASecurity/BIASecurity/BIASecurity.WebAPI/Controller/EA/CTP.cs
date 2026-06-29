using BIACore.Model;
using BIACore.Provider;
using BIACore.Web.Controller;
using BIACore.Web.Model;
using BIASecurity.WebAPI.Model;
using System.Data;
using System.Data.SqlClient;
using System.Web.Http;

namespace BIASecurity.WebAPI.Controller
{
    public  class CTPController : BaseController
    {
        public string conn;
        public void setConnection(string connParam)
        {
            conn = connParam;
        }

        public override string Connection
        {
            get
            {
                string connectionString = Connections.CTP;
                return connectionString;
            }
        }

        public static SqlConnection SQLConnection(string sConnectionName)
        {
            SqlConnection sqlCon = new SqlConnection(sConnectionName);
            sqlCon.Open();
            return sqlCon;
        }

        [HttpPost]
        [ActionName("GetCTPSecurityTier")]
        public ClientResult GetCTPSecurityTier([FromBody] dynamic request)
        {
            setConnection("CTP");
            return LoadClientResult("appObject.BIA_tblAppGroup_ID_Read", new DBParameter("@GROUP_ID", DbType.String, request.GROUP_ID != null ? request.GROUP_ID.Value : null));
        }
        
        [HttpPost]
        [ActionName("GetCTPQryAllAppGroups")]
        public ClientResult GetCTPQryAllAppGroups([FromBody] dynamic request)
        {
            setConnection("CTP");
            return LoadClientResult("appObject.BIA_BiaSecurity_EA_QryAllAppGroups", new DBParameter("@app_user_tier", DbType.String, request.app_user_tier != null ? request.app_user_tier.Value : null));
        }
        

       
        
    }
}
