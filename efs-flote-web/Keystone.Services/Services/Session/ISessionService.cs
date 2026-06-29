using System.Collections.Generic;
using System.Threading.Tasks;

namespace Keystone.Services.Services.Session
{
    public interface ISessionService
    {
        Task<int> GetActiveADID(string userName);

        /// <summary>
        /// Returns ALL geo-permission rows for a user — equivalent to
        /// BIACore.Security.User.permissions[] in the old ExtJS app.
        /// Primary source: BIASecurity api/user/User (server-to-server).
        /// Fallback: appObject.usp_Get_User_Profile_FV2.
        /// </summary>
        Task<IEnumerable<UserPermission>> GetUserPermissions(string userName);

        /// <summary>
        /// Convenience helper — returns first row geoCode/geoId only.
        /// Prefer GetUserPermissions() for the full list.
        /// </summary>
        Task<(string GeoCode, string GeoId, Dictionary<string, object>? AllColumns)> GetUserGeoContext(string userName);
    }
}
