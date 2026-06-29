using BIACore.Extensions;
using BIACore.Model;
using BIACore.Provider;
using BIACore.Server.Model;
using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using System.IO;
using System.Linq;
using System.Reflection.Emit;
using System.Security.Claims;
using System.Web;

namespace BIACore.Server
{
    internal static class Uncached
    {
        #region Application
        internal static Application Application(string SessionId, string AppCode)
        {
            if (!String.IsNullOrWhiteSpace(AppCode))
            {
                Application result = LoadSingle<Application>("secObject.getApplication",
                    new DBParameter("@appCode", DbType.AnsiString, AppCode));

                try
                {
                    if (!string.IsNullOrWhiteSpace(SessionId))
                    {
                        //Guid session = Guid.Parse(SessionId);
                        // get the session user
                        User user = Cached.User(SessionId, null, null);
                        result.authenticatedId = user.userId;

                        // get the application user
                        user = Cached.User(SessionId, null, AppCode);
                        result.lastName = user.lastName;
                        result.firstName = user.firstName;
                        result.userId = user.userId;

                        dynamic pending = LoadSingle<object>("appObject.usp_GetApplicationUserGeoRequestTotal",
                            new DBParameter("@sysm", DbType.AnsiString, user.userId));
                        result.pendingRequests = pending.TotalRequests;

                        //dynamic notification = LoadSingle<object>("usp_GetNotificationCount",
                        //    new DBParameter("@sysm", DbType.AnsiString, user.userId));
                        //result.notificationCount = notification.NotificationCount;
                        result.notificationCount = 0;

                        // how many minutes are remaining in the current session.
                        dynamic status = LoadSingle<object>("secObject.SessionStatusGet",
                            new DBParameter("@SessionId", DbType.AnsiString, SessionId),
                            new DBParameter("@AppCode", DbType.AnsiString, AppCode));
                        result.minutesRemaining = (status.minutesRemaining > 0) ? status.minutesRemaining : 0;
                    }
                }
                catch { }

                return result;
            }

            return null;
        }

        internal static ApplicationBase ApplicationBase(string SessionId, string AppCode)
        {
            if (string.IsNullOrWhiteSpace(AppCode)) return null;
            return LoadSingle<ApplicationBase>("secObject.getApplication", new DBParameter("@appCode", DbType.AnsiString, AppCode));
        }

        internal static List<object> ApplicationUserAccess(string UserId, string AppCode)
        {
            return LoadResult<object>("secObject.getApplicationUserAccess",
                new DBParameter[] {
                    new DBParameter("@userId",DbType.AnsiString, UserId),
                    new DBParameter("@appCode",DbType.AnsiString,AppCode)
                });
        }

        internal static List<object> ApplicationUserList(string UserId)
        {
            return LoadResult<object>("appObject.BIA_Security_UserApplicationList",
                new DBParameter[] {
                    new DBParameter("@sysm",DbType.AnsiString, UserId)
                });
        }

        internal static List<BIACore.Model.Connection> GetApplicationConnections(string AppCode, string Environment, bool logSql)
        {
            var connection = Connections.NewSecurity;
            return LoadResult<BIACore.Model.Connection>(connection, "conObject.GetApplicationConnections", logSql, new DBParameter[] {
                new DBParameter("@appCode",DbType.AnsiString, AppCode),
                new DBParameter("@environment",DbType.AnsiString, Environment)
            });
        }

        internal static dynamic GetApplicationAzure(string AppCode, string Environment)
        {
            var connection = Connections.NewSecurity;
            return LoadSingle<dynamic>(connection, "appObject.GetApplicationAzure", new DBParameter[] {
                new DBParameter("@appCode",DbType.AnsiString, AppCode),
                new DBParameter("@env",DbType.AnsiString, Environment)
            });
        }
        internal static List<UserApp> Userlist(string AppCode, string Level, string Search)
        {
            List<DBParameter> args = new List<DBParameter>();

            if (!string.IsNullOrWhiteSpace(AppCode)) args.Add(new DBParameter("@AppCode", DbType.AnsiString, AppCode));
            if (!string.IsNullOrWhiteSpace(Level)) args.Add(new DBParameter("@Level", DbType.AnsiString, Level));
            if (!string.IsNullOrWhiteSpace(Search)) args.Add(new DBParameter("@Search", DbType.AnsiString, Search));

            return LoadResult<UserApp>("secObject.getUserList", args.ToArray());
        }
        #endregion

        #region Session
        internal static Session Session(string SessionId, string AppCode, string IpAddress, bool Anonymous)
        {
            
            if (!string.IsNullOrWhiteSpace(SessionId))
            {
                //BIACore.Log.LogFactory.Error("SessionUpdate_Proc");
                return LoadSingle<Session>("secObject.SessionApplicationUpdate",
                    new DBParameter("@sessionId", DbType.AnsiString, SessionId),
                    new DBParameter("@appCode", DbType.AnsiString, AppCode),
                    new DBParameter("@ip", DbType.AnsiString, IpAddress),
                    new DBParameter("@server", DbType.AnsiString, Settings.Config.Server),
                    new DBParameter("@env", DbType.AnsiString, Settings.Config.BIAEnvironment),
                    new DBParameter("@anonymous", DbType.Boolean, Anonymous));
            }
            else
            {
                //BIACore.Log.LogFactory.Error("SessionUpdate_Model");
                return new BIACore.Model.Session();
            }
        }
        internal static List<SessionApps> SessionApps(string SessionId)
        {
            if (!string.IsNullOrWhiteSpace(SessionId))
            {
                return LoadResult<SessionApps>("secObject.SessionApplicationGetAll", new DBParameter("@sessionId", DbType.AnsiString, SessionId));
            }
            else
            {
                return new List<SessionApps>();
            }
        }

        internal static object sessionStatus(string SessionId, string AppCode)
        {
            if (!string.IsNullOrWhiteSpace(SessionId))
            {
                return LoadSingle<object>("secObject.SessionStatusGet",
                    new DBParameter("@sessionId", DbType.AnsiString, SessionId),
                    new DBParameter("@appCode", DbType.AnsiString, AppCode));
            }
            else
            {
                return new BIACore.Model.Session();
            }
        }

        internal static void sessionClient(string SecHashId, string UserId, string IpAddress)
        {
            if (!string.IsNullOrWhiteSpace(SecHashId) || (!string.IsNullOrWhiteSpace(UserId) && !string.IsNullOrWhiteSpace(IpAddress)))
            {
                try
                {
                    string _BIACID = "";
                    LoadSingle<object>("secObject.SessionClientUpsert",
                        new DBParameter("@BIACID", DbType.AnsiString, SecHashId),
                        new DBParameter("@sysm", DbType.AnsiString, UserId),
                        new DBParameter("@ipAddress", DbType.AnsiString, IpAddress),
                        new DBParameter("@_BIACID", DbType.AnsiString, _BIACID));
                }
                catch (Exception ex)
                {

                }
            }
        }
        #endregion

        #region Login
        internal static dynamic SessionAppInfo(string SessionId, string AppCode)
        {
            return LoadSingle<object>("secObject.SessionStatusApplicationInfo",
                new DBParameter("@sessionId", DbType.AnsiString, SessionId),
                new DBParameter("@appCode", DbType.AnsiString, AppCode));
        }
        internal static dynamic TokenValue(string Token)
        {
            if (!string.IsNullOrWhiteSpace(Token))
            {
                return LoadSingle<object>("secObject.SessionTokenValue",
                    new DBParameter("@token", DbType.AnsiString, Token));
            }
            else
            {
                return null;
            }

        }
        internal static List<BIAMessage> BIAMessages()
        {
            return LoadResult<BIAMessage>("appObject.BIA_News_GetMessages");
        }
        #endregion

        #region User
        internal static User User(string SessionId, string UserId, string AppCode)
        {
            BIACore.Log.LogFactory.Error("Uncached.cs User");

            List<DBParameter> args = new List<DBParameter>();

            if (!string.IsNullOrWhiteSpace(SessionId)) args.Add(new DBParameter("@SessionId", DbType.AnsiString, SessionId));
            //if (!string.IsNullOrWhiteSpace(UserId)) args.Add(new DBParameter("@UserId", DbType.AnsiString, UserId));
            if (!string.IsNullOrWhiteSpace(AppCode)) args.Add(new DBParameter("@AppCode", DbType.AnsiString, AppCode));

            User user = LoadSingle<User>("secObject.SessionUserGet", args.ToArray());
            if (null != user && !string.IsNullOrWhiteSpace(AppCode))
            {
                user.permissions = LoadResult<Permission>("secObject.GetPermissionsEA",
                    new DBParameter("@userId", DbType.AnsiString, user.userId),
                    new DBParameter("@appCode", DbType.AnsiString, AppCode)).ToList<dynamic>();

                user.aprsRoles = Cached.APRSRoles(user.adId, AppCode);
            }

            return user;
        }
        internal static UserBase UserAzure(string AzureId)
        {
            List<DBParameter> args = new List<DBParameter>();

            if (!string.IsNullOrWhiteSpace(AzureId)) args.Add(new DBParameter("@AzureId", DbType.AnsiString, AzureId));

            UserBase user = LoadSingle<UserBase>("secObject.UserAzureGet", args.ToArray());

            return user;
        }
        internal static User StandaloneUser(string UserId, string AppCode)
        {
            List<DBParameter> args = new List<DBParameter>();

            if (!string.IsNullOrWhiteSpace(UserId)) args.Add(new DBParameter("@UserId", DbType.AnsiString, UserId));
            if (!string.IsNullOrWhiteSpace(AppCode)) args.Add(new DBParameter("@AppCode", DbType.AnsiString, AppCode));

            User user = LoadSingle<User>("secObject.StandaloneUserGet", args.ToArray());
            if (null != user && !string.IsNullOrWhiteSpace(AppCode))
            {
                user.permissions = LoadResult<Permission>("secObject.GetPermissionsEA",
                    new DBParameter("@userId", DbType.AnsiString, user.userId),
                    new DBParameter("@appCode", DbType.AnsiString, AppCode)).ToList<dynamic>();
            }

            return user;
        }

        internal static List<object> UserSearch(string UserId, string ADID, string Email, string AppCode)
        {
            return LoadResult<object>("secObject.UserSearch", new DBParameter[] {
                new DBParameter("@userId",DbType.AnsiString,UserId),
                new DBParameter("@adId",DbType.AnsiString,ADID),
                new DBParameter("@email",DbType.AnsiString,Email),
                new DBParameter("@appCode",DbType.AnsiString,AppCode)
            });
        }

        internal static List<object> AdminHeaderLinks()
        {
            return LoadResult<object>("appObject.GetHeaderAdminLinks");
        }

        internal static APRSApplication APRSApplication(string AppCode)
        {
            return LoadSingle<APRSApplication>(Connections.NewSecurity, "appObject.GetAPRSApplication", new DBParameter("@AppCode", DbType.AnsiString, AppCode));
        }

        
        internal static APRSRoles APRSRoles(string userId, string appCode)
        {
            try
            {
                //isSecured should be determined by whether the app should check MS Entra / ERD / APRS, not whether roles are found, because an app might be secured but the user just doesn't have any roles.
                //The presence of roles is a separate concern from whether the app is considered secured or not.
                APRSApplication aprsApplication = Cached.APRSApplication(appCode);
                bool isSecured = false;

                if (aprsApplication != null && aprsApplication.Active)
                {
                    isSecured = true;
                }

                return new APRSRoles()
                {
                    isSecured = isSecured,
                    roles = new List<string>()
                };
            }
            catch (Exception ex)
            {
                LogFactory.Error("Uncached APRSRoles - Error extracting roles from token: {0}", ex.Message);
                LogFactory.Exception(ex);
                return new APRSRoles()
                {
                    isSecured = true,
                    roles = new List<string>()
                };
            }
        }



        #endregion

        #region Username
        internal static Username Username(string UserId)
        {
            List<DBParameter> args = new List<DBParameter>();

            if (!string.IsNullOrWhiteSpace(UserId)) args.Add(new DBParameter("@userId", DbType.AnsiString, UserId));

            Username username = LoadSingle<Username>("secObject.LoginUsernameValidate", args.ToArray());

            return username;
        }
        #endregion

        #region FingerprintValue
        internal static FingerprintValue FingerprintValueById(string fingerprintId)
        {
            return LoadSingle<FingerprintValue>(Connections.NewSecurity, "cmpObject.getFingerprintFromFingerprintId", new DBParameter("@fingerprintId", DbType.AnsiString, fingerprintId));
        }
        internal static FingerprintValue FingerprintValueByValue(string value)
        {
            return LoadSingle<FingerprintValue>(Connections.NewSecurity, "cmpObject.getFingerprintFromValue", new DBParameter("@value", DbType.AnsiString, value));
        }
        internal static FingerprintValue FingerprintUsageLog(string FingerprintId, string AppCode, string UserId)
        {
            FingerprintValue fingerprint = LoadSingle<FingerprintValue>(Connections.NewSecurity, "cmpObject.FingerprintUsageUpsert", new DBParameter[] {
                new DBParameter("@fingerprintId", DbType.AnsiString, FingerprintId),
                new DBParameter("@appCode", DbType.AnsiString, AppCode),
                new DBParameter("@userId", DbType.AnsiString, UserId)});

            if (fingerprint != null)
            {
                string key = string.Format("{0}", fingerprint.FingerprintId);
                Cache.Set(key, fingerprint, DateTime.UtcNow.AddMinutes(5));
            }

            return fingerprint;
        }
        internal static FingerprintValue WhiteboardAddValue(string value)
        {
            return LoadSingle<FingerprintValue>(Connections.NewSecurity, "cmpObject.insertWhiteboardValue", new DBParameter("@value", DbType.AnsiString, value));
        }
        internal static FingerprintValue WhiteboardGetById(string fingerprintId)
        {
            return LoadSingle<FingerprintValue>(Connections.NewSecurity, "cmpObject.getWhiteboardValue", new DBParameter("@fingerprintId", DbType.AnsiString, fingerprintId));
        }
        #endregion

        #region SmartFilter
        internal static object ApplicationDimensionConfig(string appCode)
        {
            return LoadResult<object>(Connections.NewSecurity, "dimObject.GetAppDimConfig", new DBParameter("@appCode", DbType.String, appCode));
        }
        #endregion

        #region CodeReview
        internal static object CodeReviewTests()
        {
            return LoadResult<object>(Connections.NewSecurity, "crObject.GetCodeReviewTests");
        }
        internal static object LogCodeReview(string ProjectName, string UserId, string CodeReviewDT, string CRCode, string Description, string FileName, string LineNumber)
        {
            return LoadResult<object>(Connections.NewSecurity, "crObject.upsertProjectCodeReview", new DBParameter[] {
                new DBParameter("@ProjectName",DbType.AnsiString,ProjectName),
                new DBParameter("@UserId",DbType.AnsiString,UserId),
                new DBParameter("@CodeReviewDT",DbType.AnsiString,CodeReviewDT),
                new DBParameter("@CRCode",DbType.AnsiString,CRCode),
                new DBParameter("@Description",DbType.AnsiString,Description),
                new DBParameter("@FileName",DbType.AnsiString,FileName),
                new DBParameter("@LineNumber",DbType.AnsiString,LineNumber)
            });

        }
        #endregion

        #region Upload
        internal static object UploadExtension(string extension)
        {
            return LoadResult<object>(Connections.NewSecurity, "intObject.usp_GetUploadExtension",
                new DBParameter("@Extension", DbType.String, extension));
        }
        #endregion

        #region CodeName
        internal static dynamic CodeName(string sourceString)
        {
            return LoadSingle<dynamic>(Connections.NewSecurity, "dimObject.CodeNameGenerator",
                new DBParameter("@SourceString", DbType.String, sourceString));
        }
        #endregion

        #region CodeReview
        internal static object CodeReviewReferences()
        {
            return LoadResult<object>(Connections.NewSecurity, "crObject.GetCodeReviewReferences");
        }
        #endregion

        private static T LoadSingle<T>(string sp, params DBParameter[] args) where T : new()
        {
            return LoadSingle<T>(Connections.Security, sp, args);
        }

        private static T LoadSingle<T>(string connection, string sp, params DBParameter[] args) where T : new()
        {
            try
            {
                List<T> list = SQL.Execute<T>(connection, sp, args);
                return (list.Count == 1) ? list[0] : default(T);
            }
            catch (Exception e)
            {
                LogFactory.Exception(e);
                throw;
            }
        }

        private static List<T> LoadResult<T>(string sp, params DBParameter[] args) where T : new()
        {
            return LoadResult<T>(Connections.Security, sp, BIACore.Settings.Log.Sql, args);
        }

        private static List<T> LoadResult<T>(string sp, bool logSQL, params DBParameter[] args) where T : new()
        {
            return LoadResult<T>(Connections.Security, sp, logSQL, args);
        }

        private static List<T> LoadResult<T>(string connection, string sp, params DBParameter[] args) where T : new()
        {
            return LoadResult<T>(connection, sp, BIACore.Settings.Log.Sql, args);
        }

        private static List<T> LoadResult<T>(string connection, string sp, bool logSQL, params DBParameter[] args) where T : new()
        {
            try
            {
                return SQL.Execute<T>(connection, sp, logSQL, args);
            }
            catch (Exception e)
            {
                LogFactory.Exception(e);
                throw;
            }
        }
    }
}