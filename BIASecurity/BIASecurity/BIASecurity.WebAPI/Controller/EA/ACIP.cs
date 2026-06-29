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
    //public partial class BIASecurityController : BaseController
    public  class ACIPController : BaseController
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
                string connectionString = Connections.ACIP;
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
        [ActionName("GetCSCCountryCodes")]
        public ClientResult GetCSCCountryCodes([FromBody] dynamic request)
        {
            setConnection("ACIP");
            return LoadClientResult("ACIPObject.get_CSCCountryCodes");
        }

        [HttpPost]
        [ActionName("GetCSCTypeCountryCode")]
        public ClientResult GetCSCTypeCountryCode([FromBody] dynamic request)
        {
            setConnection("ACIP");
            return LoadClientResult("ACIPObject.get_CSCTypeCountryCode", new DBParameter("@CSC_Type", DbType.String, request.CSC_Type != null ? request.CSC_Type.Value : null));
        }

        [HttpPost]
        [ActionName("GetCSCAccessLevels")]
        public ClientResult GetCSCAccessLevels([FromBody] dynamic request)
        {
            setConnection("ACIP");
            return LoadClientResult("ACIPObject.get_CSCAccessLevels", new DBParameter("@CSC_Type_Country_Code", DbType.String, request.CSC_Type_Country_Code != null ? request.CSC_Type_Country_Code.Value : null));
        }

        
    }
}
