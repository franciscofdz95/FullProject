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
        #region APPLICATION
        /// <summary>
        /// API : Upsert Application
        /// </summary>
        /// <param name="request"></param>
        /// <returns></returns>
        [HttpPost]
        [ActionName("UpsertApplication")]
        public ClientResult UpsertApplication([FromBody] dynamic request)
        {
            return ExecuteApplication(request, "[app].UpsertApplication");
        }

        /// <summary>
        /// API : Upsert Application Connection
        /// </summary>
        /// <param name="request"></param>
        /// <returns></returns>
        [HttpPost]
        [ActionName("UpsertApplicationConnection")]
        public ClientResult UpsertApplicationConnection([FromBody] dynamic request)
        {
            return ExecuteApplicationConnection(request, "[app].UpsertApplicationConnection");
        }

        /// <summary>
        /// API : Upsert Application Property
        /// </summary>
        /// <param name="request"></param>
        /// <returns></returns>
        [HttpPost]
        [ActionName("UpsertApplicationProperty")]
        public ClientResult UpsertApplicationProperty([FromBody] dynamic request)
        {
            return ExecuteApplicationProperty(request, "[app].UpsertApplicationProperty");
        }

        #endregion
        #region Private Methods
        /// <summary>
        /// Common Execute Application
        /// </summary>
        /// <param name="request"></param>
        /// <param name="procedureName"></param>
        /// <returns></returns>
        private ClientResult ExecuteApplication(dynamic request, string procedureName)
        {
            return LoadClientResult(procedureName, new DBParameter[] {
                 new DBParameter("@applicationId", DbType.Int64, request.ApplicationId != null ? request.ApplicationId.Value : null),
                 new DBParameter("@applicationParentId", DbType.Int64, request.ApplicationParentId != null ? request.ApplicationParentId.Value : null),
                 new DBParameter("@applicationTypeId", DbType.Int32, request.ApplicationTypeId != null ? request.ApplicationTypeId.Value : null),
                 new DBParameter("@appCode", DbType.AnsiString, request.Code != null ? request.Code.Value : null),
                 new DBParameter("@appName", DbType.AnsiString, request.Name != null ? request.Name.Value : null),
                 new DBParameter("@active", DbType.Boolean, request.Active != null ? request.Active.Value : null),
                 new DBParameter("@appVisibility ", DbType.Boolean, request.Visibility != null ? request.Visibility.Value : null),
                 new DBParameter("@appRequestable ", DbType.Boolean, request.Requestable != null ? request.Requestable.Value : null),
                 new DBParameter("@icon", DbType.AnsiString, request.Iconn != null ? request.Icon.Value : null),
                 new DBParameter("@uri", DbType.AnsiString, request.URI != null ? request.URI.Value : null),
                 new DBParameter("@externalURI", DbType.Boolean, request.ExternalURI != null ? request.ExternalURI.Value : null),
                 new DBParameter("@enviourmentId", DbType.Int32, request.EnviourmentId != null ? request.EnviourmentId.Value : null),
                 new DBParameter("@offlineMessage", DbType.String, request.OfflineMessage != null ? request.OfflineMessage.Value : null),
            });
        }

        /// <summary>
        /// Common Execute Application Connection
        /// </summary>
        /// <param name="request"></param>
        /// <param name="procedureName"></param>
        /// <returns></returns>
        private ClientResult ExecuteApplicationConnection(dynamic request, string procedureName)
        {
            return LoadClientResult(procedureName, new DBParameter[] {
                 new DBParameter("@applicationId", DbType.Int32, request.ApplicationId != null ? request.ApplicationId.Value : null),
                 new DBParameter("@connectionId", DbType.Int32, request.ConnectionId != null ? request.ConnectionId.Value : null),
            });
        }
        /// <summary>
        /// Common Execute Application Property
        /// </summary>
        /// <param name="request"></param>
        /// <param name="procedureName"></param>
        /// <returns></returns>
        private ClientResult ExecuteApplicationProperty(dynamic request, string procedureName)
        {
            return LoadClientResult(procedureName, new DBParameter[] {
                 new DBParameter("@applicationId", DbType.Int64, request.ApplicationId != null ? request.ApplicationId.Value : null),
                 new DBParameter("@field", DbType.Int64, request.Field != null ? request.Field.Value : null),
                 new DBParameter("@propertyValue", DbType.String, request.PropertyValue != null ? request.PropertyValue.Value : null),
            });
        }

        #endregion
    }
}
