using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

using System.Data;
using BIACore.Model;
using BIACore.Server.Model;
using System.Diagnostics;

namespace BIACore.Server
{
    internal static class Cached
    {
        #region Application
        internal static Application Application(string SessionId, string AppCode)
        {
            string key = string.Format("Application_S{0}A{1}", SessionId, AppCode);
            Application item = null;
            if ((item = Cache.Get<Application>(key)) == null)
            {
                item = Uncached.Application(SessionId, AppCode);
                if (null != item)
                    Cache.Set(key, item, DateTime.UtcNow.AddSeconds(Cache.DEFAULT_CACHE_DURATION));
            }
            return item;
        }
        internal static ApplicationBase ApplicationBase(string SessionId, string AppCode)
        {
            string key = string.Format("ApplicationBase_S{0}AB{1}", SessionId, AppCode);
            ApplicationBase item = null;
            if ((item = Cache.Get<ApplicationBase>(key)) == null)
            {
                item = Uncached.ApplicationBase(SessionId, AppCode);
                if (null != item)
                    Cache.Set(key, item, DateTime.UtcNow.AddSeconds(Cache.DEFAULT_CACHE_DURATION));
            }
            return item;
        }
        internal static List<object> ApplicationUserAccess(string UserId, string AppCode)
        {
            string key = string.Format("ApplicationUserAccess_U{0}A{1}", UserId, AppCode);
            List<object> item = null;
            if ((item = Cache.Get<List<object>>(key)) == null)
            {
                item = Uncached.ApplicationUserAccess(UserId, AppCode);
                if (null != item)
                    Cache.Set(key, item, DateTime.UtcNow.AddSeconds(Cache.DEFAULT_CACHE_DURATION));
            }
            return item;
        }
        internal static List<object> ApplicationUserList(string UserId)
        {
            string key = string.Format("ApplicationUserList_U{0}", UserId);
            List<object> item = null;
            if ((item = Cache.Get<List<object>>(key)) == null)
            {
                item = Uncached.ApplicationUserList(UserId);
                if (null != item)
                    Cache.Set(key, item, DateTime.UtcNow.AddSeconds(Cache.DEFAULT_CACHE_DURATION));
            }
            return item;
        }
        #endregion

        #region Session
        internal static Session Session(string SessionId, string AppCode, string IpAddress, bool Anonymous = false)
        {
            string key = string.Format("Session_S{0}A{1}_{2}", SessionId, AppCode, Anonymous);
            Session item = null;
            if ((item = Cache.Get<Session>(key)) == null)
            {
                item = Uncached.Session(SessionId, AppCode, IpAddress, Anonymous);

                if (Security.Session.IsCachable(item))
                    Cache.Set(key, item, DateTime.UtcNow.AddSeconds(Cache.DEFAULT_CACHE_DURATION));

                BIACore.Activity.ActivityFactory.SetActivityUserId(item.userId, SessionId);

                Security.Session.LogSessionStatus(item);
            }
            return item;
        }
        internal static List<SessionApps> SessionApps(string SessionId)
        {
            string key = string.Format("SessionApps_S{0}", SessionId);
            List<SessionApps> item = null;
            if ((item = Cache.Get<List<SessionApps>>(key)) == null)
            {
                item = Uncached.SessionApps(SessionId);

                //foreach(Dictionary<string, string> apps in item) {
                //    appList += (appList.Length > 0 ? "," : "") + apps[apps.Keys.ElementAt(0)].ToString();
                //}
            }
            return item;
        }
        #endregion

        #region Login
        internal static dynamic SessionAppInfo(string SessionId, string AppCode)
        {
            string key = string.Format("SessionAppInfo_S{0}A{1}", SessionId, AppCode);
            dynamic item = null;
            if ((item = Cache.Get<dynamic>(key)) == null)
            {
                item = Uncached.SessionAppInfo(SessionId, AppCode);
            }
            return item;
        }
        internal static dynamic TokenValue(string Token)
        {
            string key = string.Format("TokenValue_{0}", Token);
            dynamic item = null;
            if ((item = Cache.Get<dynamic>(key)) == null)
            {
                item = Uncached.TokenValue(Token);
            }
            return item;
        }
        #endregion

        #region User
        internal static User User(string SessionId, string UserId, string AppCode)
        {
            string key = string.Format("User_S{0}U{1}A{2}", SessionId, UserId, AppCode);
            User item = null;
            if ((item = Cache.Get<User>(key)) == null)
            {
                item = Uncached.User(SessionId, UserId, AppCode);
                if (null != item)
                    Cache.Set(key, item, DateTime.UtcNow.AddSeconds(Cache.DEFAULT_CACHE_DURATION));
            }
            return item;
        }
        internal static UserBase UserAzure(string AzureId)
        {
            string key = string.Format("UserAzure_A{0}", AzureId);
            UserBase item = null;
            if ((item = Cache.Get<UserBase>(key)) == null)
            {
                item = Uncached.UserAzure(AzureId);
                if (null != item)
                    Cache.Set(key, item, DateTime.UtcNow.AddSeconds(Cache.DEFAULT_CACHE_DURATION));
            }
            return item;
        }

        internal static User StandaloneUser(string UserId, string AppCode)
        {
            string key = string.Format("StandaloneUser_U{0}A{1}", UserId, AppCode);
            User item = null;
            if ((item = Cache.Get<User>(key)) == null)
            {
                item = Uncached.StandaloneUser(UserId, AppCode);
                if (null != item)
                    Cache.Set(key, item, DateTime.UtcNow.AddSeconds(Cache.DEFAULT_CACHE_DURATION));
            }
            return item;
        }

        internal static List<Dictionary<string, object>> WS4IDUserList(string key)
        {
            return Cache.Get<List<Dictionary<string, object>>>(key);
        }

        internal static List<object> UserSearch(string UserId, string ADID, string Email, string AppCode)
        {
            string key = string.Format("UserSearch_U{0}AD{1}E{2}A{3}", UserId, ADID, Email, AppCode);
            List<object> item = null;
            if ((item = Cache.Get<List<object>>(key)) == null)
            {
                item = Uncached.UserSearch(UserId, ADID, Email, AppCode);
                if (null != item)
                    Cache.Set(key, item, DateTime.UtcNow.AddSeconds(Cache.DEFAULT_CACHE_DURATION));
            }
            return item;
        }
        internal static List<object> AdminHeaderLinks()
        {
            string key = string.Format("AdminHeaderLinks_A{0}U{1}", Security.Session.appCode, Security.Session.userId);
            List<object> item = null;
            if ((item = Cache.Get<List<object>>(key)) == null)
            {
                item = Uncached.AdminHeaderLinks();
                if (null != item)
                    Cache.Set(key, item, DateTime.UtcNow.AddSeconds(Cache.DEFAULT_CACHE_DURATION));
            }
            return item;
        }

        internal static APRSApplication APRSApplication(string AppCode)
        {
            string key = string.Format("APRSApplication_A{0}", AppCode);
            APRSApplication item = null;
            if ((item = Cache.Get<APRSApplication>(key)) == null)
            {
                item = Uncached.APRSApplication(AppCode);
                if (null != item)
                    Cache.Set(key, item, DateTime.UtcNow.AddSeconds(Cache.DEFAULT_CACHE_DURATION));
            }
            return item;
        }

        internal static APRSRoles APRSRoles(string UserId, string AppCode)
        {
            string key = string.Format("APRSRoles_U{0}A{1}", UserId, AppCode);
            APRSRoles item = null;
            if ((item = Cache.Get<APRSRoles>(key)) == null)
            {
                item = Uncached.APRSRoles(UserId, AppCode);
                if (null != item)
                    Cache.Set(key, item, DateTime.UtcNow.AddSeconds(Cache.EXTERNAL_CACHE_DURATION));
            }
            return item;
        }
        #endregion

        #region UserName
        internal static Username Username(string UserId)
        {
            string key = string.Format("Username_{0}", UserId);
            Username item = null;
            if ((item = Cache.Get<Username>(key)) == null)
            {
                item = Uncached.Username(UserId);
                if (null != item)
                    Cache.Set(key, item, DateTime.UtcNow.AddSeconds(Cache.DEFAULT_CACHE_DURATION));
            }
            return item;
        }
        #endregion

        #region FingerprintValue
        internal static FingerprintValue FingerprintValueById(string fingerprintId)
        {
            //LogFactory.Message("FingerprintValueById fingerprintId = {0}", new object[] { fingerprintId });
            string key = string.Format("FPID_F{0}", fingerprintId);
            FingerprintValue item = null;
            if ((item = Cache.Get<FingerprintValue>(key)) == null)
            {
                item = Uncached.FingerprintValueById(fingerprintId);
                if (null != item)
                    Cache.Set(key, item, DateTime.UtcNow.AddMinutes(5));
            }
            return item;
        }

        internal static FingerprintValue FingerprintValueByValue(string value)
        {
            //LogFactory.Message("FingerprintValueByValue value = {0}", new object[] { value });
            string key = string.Format("FPV_V{0}", value);
            FingerprintValue item = null;
            if ((item = Cache.Get<FingerprintValue>(key)) == null)
            {
                item = Uncached.FingerprintValueByValue(value);
                if (null != item)
                    Cache.Set(key, item, DateTime.UtcNow.AddMinutes(5));
            }
            return item;
        }
        #endregion

        #region SmartFilter
        internal static object ApplicationDimensionConfig(string appCode)
        {
            string key = string.Format("AppDimConfig_A{0}", appCode);
            object item = null;
            if ((item = Cache.Get<object>(key)) == null)
            {
                item = Uncached.ApplicationDimensionConfig(appCode);
                if (null != item)
                    Cache.Set(key, item, DateTime.UtcNow.AddMinutes(5));
            }
            return item;
        }
        #endregion

        #region CodeName
        internal static object CodeName(string sourceString)
        {
            string key = string.Format("CodeName_{0}", sourceString);
            object item = null;
            if ((item = Cache.Get<object>(key)) == null)
            {
                item = Uncached.CodeName(sourceString);
                if (null != item)
                    Cache.Set(key, item, DateTime.UtcNow.AddHours(4));
            }
            return item;
        }
        #endregion
    }
}