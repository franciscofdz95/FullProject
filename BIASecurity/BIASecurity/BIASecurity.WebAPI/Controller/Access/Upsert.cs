using System.Data;
using System.Web.Http;
using BIACore.Model;
using BIACore.Web.Model;

namespace BIASecurity.WebAPI.Controller
{
    /// <summary>
    /// Initialize Controller : BIASecurity
    /// </summary>
    public partial class BIASecurityController
    {
        #region ROLE
        /// <summary>
        /// API : Upsert Role
        /// </summary>
        /// <param name="request"></param>
        /// <returns></returns>
        [HttpPost]
        [ActionName("UpsertRole")]
        public ClientResult UpsertRole([FromBody] dynamic request)
        {
            return ExecuteRole(request, "role.UpsertRole");
        }
        
        /// <summary>
        /// API : Upsert User Role
        /// </summary>
        /// <param name="request"></param>
        /// <returns></returns>
        [HttpPost]
        [ActionName("UpsertUserRole")]
        public ClientResult UpsertUserRole([FromBody] dynamic request)
        {
            return ExecuteUserRole(request, "role.UpsertUserRole");
        }

        /// <summary>
        ///API : Upsert Application Role
        /// </summary>
        /// <param name="request"></param>
        /// <returns></returns>
        [HttpPost]
        [ActionName("UpsertApplicationRole")]
        public ClientResult UpsertApplicationRole([FromBody] dynamic request)
        {
            return ExecuteApplicationRole(request, "role.UpsertApplicationRole");
        }

        #endregion

        #region Private Methods
        /// <summary>
        /// Common Execute Role
        /// </summary>
        /// <param name="request"></param>
        /// <param name="spName"></param>
        /// <returns></returns>
        private ClientResult ExecuteRole(dynamic request, string spName)
        {
            return LoadClientResult(spName, new DBParameter[] {
                new DBParameter("@roleId", DbType.Int32, request.RoleId != null ? request.RoleId.Value : null),
                new DBParameter("@parentRoleId", DbType.Int32, request.ParentRoleId != null ? request.ParentRoleId.Value : null),
                new DBParameter("@roleName", DbType.AnsiString, request.Name != null ? request.roleName.Value : null),
                new DBParameter("@roleCode", DbType.AnsiString, request.Code != null ? request.roleCode.Value : null),
                new DBParameter("@roleDescription", DbType.AnsiString, request.RoleDescription != null ? request.RoleDescription.Value : null),
                new DBParameter("@active", DbType.Boolean, request.Active != null ? request.Active.Value : null),
            });
        }

        /// <summary>
        /// Common Execute User Role
        /// </summary>
        /// <param name="request"></param>
        /// <param name="spName"></param>
        /// <returns></returns>
        private ClientResult ExecuteUserRole(dynamic request, string spName)
        {
            return LoadClientResult(spName, new DBParameter[] {
                new DBParameter("@userId", DbType.Int32, request.UserId != null ? request.UserId.Value : null),
                new DBParameter("@roleId", DbType.Int32, request.RoleId != null ? request.RoleId.Value : null),
                new DBParameter("@creationTypeId", DbType.Int32, request.CreationTypeId != null ? request.CreationTypeId.Value : null),
            });
        }
        /// <summary>
        /// Common Execute Application Role
        /// </summary>
        /// <param name="request"></param>
        /// <param name="spName"></param>
        /// <returns></returns>
        private ClientResult ExecuteApplicationRole(dynamic request, string spName)
        {
            return LoadClientResult(spName, new DBParameter[] {
                new DBParameter("@applicationId  ", DbType.Int64, request.ApplicationId != null ? request.ApplicationId.Value : null),
                new DBParameter("@RoleId", DbType.Int32, request.RoleId != null ? request.RoleId.Value : null),
                new DBParameter("@assignTypeId ", DbType.Int32, request.AssignTypeId != null ? request.AssignTypeId.Value : null),
            });
        }
        #endregion
    }
}
