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
        [ActionName("UserBaseInfo")]
        public ClientResult UserBaseInfo([FromBody] dynamic request)
        {
            return LoadClientResult("[userObject].GetUserBasic", new DBParameter[] {
                new DBParameter("@userId",DbType.AnsiString, request.userId != null ? request.userId.Value : null),
                new DBParameter("@formType",DbType.AnsiString, request.formType != null ? request.formType.Value : null)
            });
        }
        [HttpPost]
        [ActionName("UserProfile")]
        public ClientResult UserProfile([FromBody] dynamic request)
        {
            return LoadClientResult("[userObject].GetUserProfile", new DBParameter[] {
                new DBParameter("@userId",DbType.AnsiString, request.userId != null ? request.userId.Value : null)
            });
        }
        [HttpPost]
        [ActionName("UserProfileEmailList")]
        public ClientResult UserProfileEmailList([FromBody] dynamic request)
        {
            return LoadPagedClientResult("[dynUserObject].GetUserEmailList", new DBParameter[] {
                new DBParameter("@userId",DbType.AnsiString, request.userId != null ? request.userId.Value : null)
            });
        }
        [HttpPost]
        [ActionName("UserProfileLocationList")]
        public ClientResult UserProfileLocationList([FromBody] dynamic request)
        {
            return LoadPagedClientResult("[dynUserObject].GetUserLocationList", new DBParameter[] {
                new DBParameter("@userId",DbType.AnsiString, request.userId != null ? request.userId.Value : null)
            });
        }
        [HttpPost]
        [ActionName("UserProfilePhoneList")]
        public ClientResult UserProfilePhoneList([FromBody] dynamic request)
        {
            return LoadPagedClientResult("[dynUserObject].GetUserPhoneList", new DBParameter[] {
                new DBParameter("@userId",DbType.AnsiString, request.userId != null ? request.userId.Value : null)
            });
        }
        [HttpPost]
        [ActionName("UserProfileRoleAccessSummary")]
        public ClientResult UserProfileRoleAccessSummary([FromBody] dynamic request)
        {
            return LoadPagedClientResult("[dynUserObject].GetUserRolesSummaryAccess", new DBParameter[] {
                new DBParameter("@userId",DbType.AnsiString, request.userId != null ? request.userId.Value : null),
                new DBParameter("@start",DbType.AnsiString, request.start != null ? request.start.Value : null),
                new DBParameter("@limit",DbType.AnsiString, request.limit != null ? request.limit.Value : null)
            });
        }
        [HttpPost]
        [ActionName("UserAddEdit")]
        public ClientResult UserAddEdit([FromBody] dynamic request)
        {
            return LoadClientResult("[userObject].UpsertUser", new DBParameter[] {
                new DBParameter("@adid", DbType.AnsiString, request.User_ADID != null ? request.User_ADID.Value : null),
                new DBParameter("@loginId", DbType.AnsiString, request.User_LoginId != null && request.User_LoginId != "N/A" ? request.User_LoginId.Value: null),
                new DBParameter("@EmployeeId", DbType.AnsiString, request.User_EmployeeId != null ? request.User_EmployeeId.Value : null),
                new DBParameter("@srId", DbType.AnsiString, request.User_SRID != null && request.User_SRID.Value != "N/A" ? request.User_SRID.Value: null),
                new DBParameter("@UserFirstName", DbType.AnsiString, request.User_FirstName != null ? request.User_FirstName.Value : null),
                new DBParameter("@UserLastName", DbType.AnsiString, request.User_LastName != null ? request.User_LastName.Value : null),
                new DBParameter("@preferredName", DbType.AnsiString, request.User_PreferredName != null ? request.User_PreferredName.Value : null),
                new DBParameter("@department", DbType.AnsiString, request.User_Department != null ? request.User_Department.Value : null),
                new DBParameter("@jobLevel", DbType.AnsiString, request.User_JobLevel != null ? request.User_JobLevel.Value : null),
                new DBParameter("@BusinessUnitId", DbType.AnsiString, request.User_BusinessUnitId != null ? request.User_BusinessUnitId.Value : null),
                new DBParameter("@active", DbType.Boolean, request.User_Active != null ? request.User_Active.Value : null)

            });
        }
        [HttpPost]
        [ActionName("UserDelegates")]
        public ClientResult UserDelegates([FromBody] dynamic request)
        {
            return LoadClientResult("[userObject].GetUserDelegates", new DBParameter[] {
                new DBParameter("@userId",DbType.AnsiString, request.userId.Value)
            });
        }
        [HttpPost]
        [ActionName("UserDelegators")]
        public ClientResult UserDelegators([FromBody] dynamic request)
        {
            return LoadClientResult("[userObject].GetUserDelegator", new DBParameter[] {
                new DBParameter("@userId",DbType.AnsiString, request.userId.Value)
            });
        }
        [HttpPost]
        [ActionName("InsertDelegate")]
        public ClientResult InsertDelegate([FromBody] dynamic request)
        {
            return LoadClientResult("[userObject].[UpsertUserDelegate]", new DBParameter[] {
                new DBParameter("@delegateId",DbType.Int32, -1), //for update, the existing delegateId, else -1
                new DBParameter("@userId",DbType.AnsiString, request.userId.Value),  //main user (LoginId/Sysm)
                new DBParameter("@delegateUserId",DbType.AnsiString, request.delegateUserId.Value),  //person you are delegating to (LoginId/sysm)
                new DBParameter("@applicationCode",DbType.AnsiString, request.applicationCode.Value),  //CVBAT
                //new DBParameter("@accessLevel",DbType.AnsiString, request.accessLevel.Value), // User/Admin/SA
                new DBParameter("@expirationDate",DbType.Date, request.expirationDate.Value), // DateTime
                new DBParameter("@active",DbType.Boolean, true) // true/false
            });
        }
        [HttpPost]
        [ActionName("UpdateDelegateExpiration")]
        public ClientResult UpdateDelegateExpiration([FromBody] dynamic request)
        {
            return LoadClientResult("[userObject].[UpsertUserDelegate]", new DBParameter[] {
                new DBParameter("@delegateId",DbType.Int32, request.delegateId.Value), //for update, the existing delegateId, else -1
                new DBParameter("@expirationDate",DbType.Date, request.expirationDate.Value) // DateTime
            });
        }
        [HttpPost]
        [ActionName("DeleteDelegate")]
        public ClientResult DeleteDelegate([FromBody] dynamic request)
        {
            return LoadClientResult("[userObject].[UpsertUserDelegate]", new DBParameter[] {
                new DBParameter("@delegateId",DbType.Int32, request.delegateId.Value), //for update, the existing delegateId, else -1
                new DBParameter("@active",DbType.Boolean, false) // true/false
            });
        }
    }
}
