using Keystone.DAL.Model;
using Keystone.DAL.Provider;
using Microsoft.Extensions.Configuration;
using System.Data;
using System.Net.Http;
using System.Text.Json;
using System.Text.Json.Serialization;

namespace Keystone.Services.Services.Session
{
    // ── DTOs matching the real BIASecurity api/user/User response ────────────

    /// <summary>
    /// One element of BIACore.Security.User.permissions[].
    /// Field names match the exact JSON keys from the BIASecurity endpoint.
    /// </summary>
    public class UserPermission
    {
        [JsonPropertyName("geoCode")]       public string GeoCode        { get; set; } = "";
        [JsonPropertyName("geoId")]         public string GeoId          { get; set; } = "";
        [JsonPropertyName("userId")]        public string UserId         { get; set; } = "";
        [JsonPropertyName("securityLevel")] public string SecurityLevel  { get; set; } = "";
        [JsonPropertyName("businessUnitId")]public string BusinessUnitId { get; set; } = "";
        [JsonPropertyName("RoleId")]        public string RoleId         { get; set; } = "";
        [JsonPropertyName("LevelId")]       public string LevelId        { get; set; } = "";
        [JsonPropertyName("BIA_ID")]        public string BiaId          { get; set; } = "";
        [JsonPropertyName("EA_ProfileId")]  public int    EaProfileId    { get; set; }
        [JsonPropertyName("EA_ProfileName")]public string EaProfileName  { get; set; } = "";
        [JsonPropertyName("EA_Invoice_View")]                  public int EaInvoiceView                  { get; set; }
        [JsonPropertyName("EA_Invoice_Verify")]                public int EaInvoiceVerify                { get; set; }
        [JsonPropertyName("EA_Invoice_ApproveUnApproveDelete")]public int EaInvoiceApproveUnApproveDelete { get; set; }
        [JsonPropertyName("EA_Invoice_DeleteUnapproveOnly")]   public int EaInvoiceDeleteUnapproveOnly    { get; set; }
        [JsonPropertyName("EA_Invoice_LogProcess")]            public int EaInvoiceLogProcess             { get; set; }
        [JsonPropertyName("EA_APUT_Rejection")]                public int EaAputRejection                 { get; set; }
        [JsonPropertyName("EA_APUT_RejectionScanned")]         public int EaAputRejectionScanned          { get; set; }
        [JsonPropertyName("EA_APUT_ViewNSubmitApproval")]      public int EaAputViewNSubmitApproval        { get; set; }
        [JsonPropertyName("EA_CreateModifyUsersAccess")]       public int EaCreateModifyUsersAccess        { get; set; }
        [JsonPropertyName("appCode")]       public string AppCode        { get; set; } = "";
        [JsonPropertyName("active")]        public int    Active         { get; set; }
    }

    /// <summary>
    /// Top-level BIASecurity api/user/User response shape.
    /// Only the fields the new app cares about are mapped; the rest are ignored.
    /// </summary>
    internal class BiaUserResponse
    {
        [JsonPropertyName("userId")]      public string? UserId      { get; set; }
        [JsonPropertyName("adId")]        public string? AdId        { get; set; }
        [JsonPropertyName("permissions")] public List<UserPermission>? Permissions { get; set; }
    }

    // ─────────────────────────────────────────────────────────────────────────

    public class SessionService : ISessionService
    {
        private readonly IDataProvider   _dataProvider;
        private readonly IHttpClientFactory _httpFactory;
        private readonly IConfiguration  _config;

        private static readonly JsonSerializerOptions _jsonOpts = new()
        {
            PropertyNameCaseInsensitive = true
        };

        public SessionService(
            IDataProvider dataProvider,
            IHttpClientFactory httpFactory,
            IConfiguration config)
        {
            _dataProvider = dataProvider;
            _httpFactory  = httpFactory;
            _config       = config;
        }

        // ── GetActiveADID (unchanged) ──────────────────────────────────────
        public async Task<int> GetActiveADID(string userName)
        {
            var parameters = new DBParameter[] {
                new DBParameter("@userName", DbType.String, userName)
            };
            var result = await _dataProvider.ExecuteScalarAsync(
                "AppObject.usp_GetUserID_ByUsername", CommandType.StoredProcedure, parameters);
            int tempid = 0;
            if (result != null) int.TryParse(result.ToString(), out tempid);
            return tempid;
        }

        // ── GetUserPermissions ────────────────────────────────────────────
        /// <summary>
        /// Returns ALL geo-permission rows for the user.
        ///
        /// PRIMARY path  : calls BIASecurity api/user/User (server-to-server),
        ///                 exactly as BIACore.WebAPI.dll did for the ExtJS app.
        ///                 Request: POST { AppCode, UserId }  (TokenLocal is null
        ///                 for server-side calls — BIASecurity falls back to UserId).
        ///
        /// FALLBACK path : if BIASecurity is unreachable, queries
        ///                 appObject.usp_Get_User_Profile_FV2 directly.
        /// </summary>
        public async Task<IEnumerable<UserPermission>> GetUserPermissions(string userName)
        {
            var shortLogin = userName.Contains('@') ? userName.Split('@')[0] : userName;

            // ── Primary: BIASecurity api/user/User ────────────────────────
            try
            {
                var baseUrl = _config["ApiSettings:BIASecurityUrl"]?.TrimEnd('/');
                var appCode = _config["ApiSettings:BIAAppCode"] ?? "Flote_v2";

                if (!string.IsNullOrEmpty(baseUrl))
                {
                    var client = _httpFactory.CreateClient("BIASecurity");
                    var payload = new { AppCode = appCode, UserId = shortLogin, TokenLocal = (string?)null };
                    var json    = JsonSerializer.Serialize(payload);
                    var content = new StringContent(json, System.Text.Encoding.UTF8, "application/json");

                    var response = await client.PostAsync($"{baseUrl}/api/user/User", content);
                    if (response.IsSuccessStatusCode)
                    {
                        var body = await response.Content.ReadAsStringAsync();
                        var parsed = JsonSerializer.Deserialize<BiaUserResponse>(body, _jsonOpts);
                        if (parsed?.Permissions != null && parsed.Permissions.Count > 0)
                            return parsed.Permissions;
                    }
                }
            }
            catch { /* BIASecurity unreachable — fall through to DB */ }

            // ── Fallback: Flote DB SP ─────────────────────────────────────
            return await GetUserPermissionsFromDb(shortLogin, userName);
        }

        private async Task<IEnumerable<UserPermission>> GetUserPermissionsFromDb(
            string shortLogin, string fullUserName)
        {
            foreach (var sysmValue in new[] { shortLogin, fullUserName })
            {
                try
                {
                    var p    = new DBParameter[] { new DBParameter("@sysm", DbType.String, sysmValue) };
                    var rows = await _dataProvider.ExecuteAsyncGeneric(
                        DBConstants.GetUserProfile, CommandType.StoredProcedure, p);

                    var list = rows?.ToList();
                    if (list != null && list.Count > 0)
                    {
                        return list.Select(r => new UserPermission
                        {
                            GeoCode        = GetStr(r, "geoCode", "geo_code",  "GeoCode"),
                            GeoId          = GetStr(r, "geoId",   "geo_id",    "GeoId"),
                            UserId         = GetStr(r, "userId",  "user_id",   "UserId", "sysm"),
                            SecurityLevel  = GetStr(r, "securityLevel",  "security_level"),
                            BusinessUnitId = GetStr(r, "businessUnitId", "business_unit_id"),
                        });
                    }
                }
                catch { /* try next */ }
            }

            // Last resort: demo.Filter_UserId
            try
            {
                var p3   = new DBParameter[] { new DBParameter("@search", DbType.String, shortLogin) };
                var rows3 = await _dataProvider.ExecuteAsyncGeneric(
                    DBConstants.FilterUserId, CommandType.StoredProcedure, p3);
                var list3 = rows3?.ToList();
                if (list3 != null && list3.Count > 0)
                    return list3.Select(r => new UserPermission
                    {
                        GeoCode = GetStr(r, "geoCode", "geo_code", "GeoCode"),
                        GeoId   = GetStr(r, "geoId",   "geo_id",   "GeoId"),
                        UserId  = GetStr(r, "userId",  "user_id",  "UserId", "sysm"),
                    });
            }
            catch { /* ignore */ }

            return Enumerable.Empty<UserPermission>();
        }

        // ── GetUserGeoContext (convenience — first row only, kept for compat) ──
        /// <summary>
        /// Returns geoCode/geoId from the first permission row.
        /// Prefer GetUserPermissions() for the full list.
        /// </summary>
        public async Task<(string GeoCode, string GeoId, Dictionary<string, object>? AllColumns)>
            GetUserGeoContext(string userName)
        {
            var perms = (await GetUserPermissions(userName)).ToList();
            if (perms.Count == 0)
                return (string.Empty, string.Empty, null);

            var first = perms[0];
            return (first.GeoCode, first.GeoId, null);
        }

        // ── Helpers ───────────────────────────────────────────────────────
        private static string GetStr(Dictionary<string, object> row, params string[] keys)
        {
            foreach (var key in keys)
                if (row.TryGetValue(key, out var val) && val != null)
                    return val.ToString() ?? string.Empty;
            return string.Empty;
        }
    }
}
