using BIACore.Log;
using BIACore.Model;
using BIACore.Web;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Security.Claims;
using System.Web;
using System.Web.Script.Serialization;
using System.Web.Security;

namespace BIACore.Internal
{
    internal static partial class Request
    {
        private static object userLock = new object();
        private static object userByIdLock = new object();
        private static object userAzureLock = new object();
        private static object aprsRolesLock = new object();

        internal static Model.User User(string TokenLocal)
        {
            string key = string.Format("User_S{0}{2}_A{1}", TokenLocal, Settings.Config.AppCode, CurrentContext.GetSessionCookieValue());
            Model.User user = (Model.User)Cache.Get(key);
            if (user == null && (!string.IsNullOrWhiteSpace(TokenLocal) || !string.IsNullOrWhiteSpace(Web.CurrentContext.GetSessionCookieValue())))
            {
                lock (userLock)
                {
                    // double-check: another thread may have populated the cache while we waited
                    user = (Model.User)Cache.Get(key);
                    if (user != null)
                        return user;

                    DateTime start = DateTime.UtcNow;
                    try
                    {
#if LocalTest
                        string sessionId = HttpContext.Current.Request.Cookies[API.SESSION_COOKIE] != null 
                            ? HttpContext.Current.Request.Cookies[API.SESSION_COOKIE].Value 
                            : BIACore.Utility.Token.GetTokenValue(TokenLocal).Reverse();
                        user = LocalRequest.User(sessionId, null, Settings.Config.AppCode);
#else
                        user = Web.Client.Post<Model.User>(API.URL(API.USER),
                            new { TokenLocal = TokenLocal, AppCode = Settings.Config.AppCode });
#endif
                        if (user != null)
                            Cache.Set(key, user, DateTime.UtcNow.AddSeconds(Cache.DEFAULT_CACHE_DURATION)); // cache the user for the same duration as the session?
                    }
                    catch (Exception e)
                    {
                        LogFactory.Error("Request User - Error requesting user: {0}", e.Message);
                        LogFactory.Exception(e);
                    }
                    finally
                    {
                        LogFactory.Performance("Request User", DateTime.UtcNow.Subtract(start).TotalSeconds);
                    }
                }
            }
            return user;
        }

        internal static Model.User UserById(string UserId)
        {
            string key = string.Format("S{0}{2}_U{1}", CurrentContext.GetLocalHostTokenCookieValue(), Settings.Config.AppCode, CurrentContext.GetSessionCookieValue());
            Model.User user = (Model.User)Cache.Get(key);
            if (user == null)
            {
                lock (userByIdLock)
                {
                    // double-check: another thread may have populated the cache while we waited
                    user = (Model.User)Cache.Get(key);
                    if (user != null)
                        return user;

                    DateTime start = DateTime.UtcNow;
                    try
                    {
                        JavaScriptSerializer jss = new JavaScriptSerializer() { MaxJsonLength = 2147483647 };
                        FingerprintValue fv = BIACore.Utility.Fingerprint.AddWhiteboardValue(jss.Serialize(new { UserId = UserId, AppCode = Settings.Config.AppCode + "_Service" }));
#if LocalTest
                        return LocalRequest.User(null, UserId, Settings.Config.AppCode);
#else
                        user = Web.Client.Post<Model.User>(API.URL(API.USER_BYID), new { ParamCode = fv.FingerprintId });

                        if (user != null)
                            Cache.Set(key, user, DateTime.UtcNow.AddSeconds(Cache.DEFAULT_CACHE_DURATION));
#endif
                    }
                    catch (Exception e)
                    {
                        LogFactory.Error("Request UserById - Error requesting user by ID: {0}", e.Message);
                        LogFactory.Exception(e);
                        return null;
                    }
                    finally
                    {
                        LogFactory.Performance("Request UserById", DateTime.UtcNow.Subtract(start).TotalSeconds);
                    }
                }
            }
            return user;
        }

        internal static Model.UserBase UserAzure(string AzureId)
        {
            string key = string.Format("AzureUser_A{0}", AzureId);
            Model.UserBase user = (Model.UserBase)Cache.Get(key);
            if (user == null && (!string.IsNullOrWhiteSpace(AzureId)))
            {
                lock (userAzureLock)
                {
                    // double-check: another thread may have populated the cache while we waited
                    user = (Model.UserBase)Cache.Get(key);
                    if (user != null)
                        return user;

                    DateTime start = DateTime.UtcNow;
                    try
                    {
#if LocalTest
                        string sessionId = HttpContext.Current.Request.Cookies[API.SESSION_COOKIE] != null 
                            ? HttpContext.Current.Request.Cookies[API.SESSION_COOKIE].Value 
                            : BIACore.Utility.Token.GetTokenValue(TokenLocal).Reverse();
                        user = LocalRequest.User(sessionId, null, Settings.Config.AppCode);
#else
                        user = Web.Client.Post<Model.UserBase>(API.URL(API.USER_BYAZUREID),
                            new { AzureId = AzureId });
#endif
                        if (null != user)
                            Cache.Set(key, user, DateTime.UtcNow.AddMinutes(Cache.LONG_CACHE_DURATION_MIN)); // cache the user for the same duration as the session?
                    }
                    catch (Exception e)
                    {
                        LogFactory.Error("Request UserAzure - Error requesting UserAzure for AzureId={0}: {1}", AzureId, e.Message);
                        LogFactory.Exception(e);
                        return null;
                    }
                    finally
                    {
                        LogFactory.Performance("Request UserAzure", DateTime.UtcNow.Subtract(start).TotalSeconds);
                    }
                }
            }
            return user;
        }


        private static List<string> GetRolesFromToken(ClaimsPrincipal user, string appCode = null)
        {
            DateTime start = DateTime.UtcNow;
            LogFactory.Performance("GetRolesFromToken", DateTime.UtcNow.Subtract(start).TotalSeconds);

            if (user == null)
                return new List<string>();

            LogFactory.Performance("GetRolesFromToken - User valid", DateTime.UtcNow.Subtract(start).TotalSeconds);

            try
            {
                // Flatten all roles, splitting by comma if a claim contains multiple roles
                var allRoles = user.Claims
                    .Where(c => c.Type == "roles" || c.Type == "role" || c.Type == ClaimTypes.Role)
                    .SelectMany(c => c.Value.Split(new[] { ',' }, StringSplitOptions.RemoveEmptyEntries))
                    .Select(r => r.Trim())
                    .Distinct();

                LogFactory.Performance("GetRolesFromToken - Extracted roles" + string.Join(", ", allRoles), DateTime.UtcNow.Subtract(start).TotalSeconds);

                //Drew 2026-03-17: Just return the roles (they are already filtered in Azure Entra)
                return allRoles.ToList();
            }
            catch(Exception ex)
            {
                LogFactory.Error("GetRolesFromToken - Error extracting roles from token: {0}", ex.Message);
                LogFactory.Exception(ex);
                return new List<string>();
            }
        }

        internal static APRSRoles APRSRoles(string userId, string appCode)
        {
            string key = string.Format("APRSRoles_U{0}_A{1}", userId, appCode);
            APRSRoles item = (APRSRoles)Cache.Get(key);
            if (item == null)
            {
                lock (aprsRolesLock)
                {
                    // double-check: another thread may have populated the cache while we waited
                    item = (APRSRoles)Cache.Get(key);
                    if (item != null)
                        return item;

                    DateTime start = DateTime.UtcNow;

                    try
                    {
                        item = Web.Client.Post<APRSRoles>(API.URL(API.APRS_ROLES), new
                        {
                            UserId = userId,
                            AppCode = appCode
                        });

                        if (item != null)
                        {
                            //get the roles from the app client side, not the server
                            if (item.isSecured)
                            {
                                var principal = HttpContext.Current?.User as ClaimsPrincipal;
                                item.roles = GetRolesFromToken(principal, appCode);
                            }

                            Cache.Set(key, item, DateTime.UtcNow.AddSeconds(Cache.DEFAULT_CACHE_DURATION)); // cache the user for the same duration as the session?
                        }
                    }
                    catch (Exception ex)
                    {
                        LogFactory.Error("Request APRSRoles - Error extracting roles from token: {0}", ex.Message);
                        LogFactory.Exception(ex);
                    }
                    finally
                    {
                        LogFactory.Performance("Request APRSRoles - Complete", DateTime.UtcNow.Subtract(start).TotalSeconds);
                    }
                }

                //log whatever we found for role (after releasing the lock)
                if (!item.isSecured)
                {
                    LogFactory.Debug("Nonsecure app retrieved (and cached) for UserId={0} | AppCode={1} | Roles={2}", userId, appCode, item != null && item.roles != null ? string.Join(",", item.roles) : "NULL");
                }
                else if (item.roles.Any())
                {
                    LogFactory.Debug("APRSRoles retrieved (and cached) for secured app: UserId={0} | AppCode={1} | Roles={2}", userId, appCode, item != null && item.roles != null ? string.Join(",", item.roles) : "NULL");
                }
                else
                {
                    LogFactory.Debug("No APRSRoles found for secured app: UserId={0} | AppCode={1}", userId, appCode);
                }
            }

            return item;
        }
    }
}
