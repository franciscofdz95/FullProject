using BIACore.Model;
using BIACore.Web.Controller;
using BIACore.Web.Model;
using BIASecurity.WebAPI.Model;
using System.Data;
using System.Data.SqlClient;
using System.Web.Http;

namespace BIASecurity.WebAPI.Controller
{
    public partial class BIASecurityController : BIACore.Web.Controller.BaseController
    {
        //public override string Connection
        //{
        //    //get { return Connections.ACIP; }
        //} 

        [HttpPost]
        [ActionName("EATableRead")]
        public ClientResult EATableRead([FromBody] EAModel request)
        {
            switch (request.TableName)
            {
                case "CVBAT": { request.TableName = "BIASecurity_EA_CVBAT"; } break;
                case "BRIEF": { request.TableName = "BIASecurity_EA_BRIEF"; } break;
                case "ACIP": { request.TableName = "BIASecurity_EA_ACIP"; } break;
                case "RegulatedGoods": { request.TableName = "BIASecurity_EA_RegulatedGoods"; } break;
                case "WVAR": { request.TableName = "BIASecurity_EA_WVAR"; } break;
                case "Svc_Mapping": { request.TableName = "BIASecurity_EA_Svc_Mapping"; } break;
                case "OCM": { request.TableName = "BIASecurity_EA_OCM"; } break;
                //case "RevRec": { request.TableName = "BIASecurity_EA_RevRec"; } break;
                //case "FDB": { request.TableName = "BIASecurity_EA_FDB_PL"; } break;
                case "FLG": { request.TableName = "BIASecurity_EA_FLG"; } break;
                default: { request.TableName = request.TableName; } break;
            }
            return LoadClientResult("dynAppObject.BIASecurity_EA_TableRead", request.ToDBParameter());
        } 
        
        [HttpPost]
        [ActionName("EAVisExclusions")]
        public ClientResult EAVisExclusions([FromBody] EAModel request)
        {           
            return LoadClientResult("appObject.BIA_BIASecurity_Parent_Exclusions_Read_BRIEF");
        }
        [HttpPost]
        [ActionName("EAVerifyColumnExists")]
        public ClientResult EAVerifyColumnExists([FromBody] dynamic request)
        {           
            return LoadClientResult("appObject.BIA_BIASecurity_EA_BRIEF_Read_Count", new DBParameter("@EGN_Num", DbType.AnsiString, request.EGN_Num.Value));
        }
        [HttpPost]
        [ActionName("EASetDefault")]
        public ClientResult EASetDefault([FromBody] dynamic request)
        {                       
            return LoadClientResult("dynAppObject.BIA_BIASecurity_EA_BRIEF_Update_Dynamic", new DBParameter("@EGN_Num", DbType.AnsiString, request.EGN_Num.Value));
        }
       

        [HttpPost]
        [ActionName("EAWVARUserAccessLevel")]
        public ClientResult EAWVARUserAccessLevel([FromBody] EAModel request)
        {           
            return LoadClientResult("appObject.BIA_BIASecurity_Applicationuser_WVAR_Read", request.ToDBParameter());
        }
        
        [HttpPost]
        [ActionName("EAGetMyReportsInfo")]
        public ClientResult EAGetMyReportsInfo([FromBody] EAModel request)
        {           
            return LoadClientResult("appObject.BIA_BiaSecurity_EA_MyReports_Read", request.ToDBParameter());
        }

        [HttpPost]
        [ActionName("EAGetCTPInfo")]
        public ClientResult EAGetCTPInfo([FromBody] EAModel request)
        {
            return LoadClientResult("appObject.BIA_BiaSecurity_EA_CTP_sysm_Read", request.ToDBParameter());
        }

        [HttpPost]
        [ActionName("EAGetFLGInfo")]
        public ClientResult EAGetFLGInfo([FromBody] EAModel request)
        {
            return LoadClientResult("appObject.BIA_BiaSecurity_EA_FLG_Read", request.ToDBParameter());
        }


        [HttpPost]
        [ActionName("GetCTPInfoEditor")]
        public ClientResult GetCTPInfoEditor([FromBody] EAModel request)
        {           
            return LoadClientResult("appObject.BIA_BiaSecurity_EA_CTP_BIAID_Read", request.ToDBParameter());
        }                 
        

    }
}
