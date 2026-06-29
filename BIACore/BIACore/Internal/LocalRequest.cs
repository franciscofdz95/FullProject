namespace BIACore.Internal
{
    internal static class LocalRequest
    {
#if LocalTest
        private static dynamic Connections = new {
            NewSecurity = "Data Source=CSVP000585C7\\WWBIAC03E018;Initial Catalog=BIASecurity;Persist Security Info=True;User ID=app_security;Password=Yawn-ice$2977;",
            Security = "Data Source=CSVP000585C7\\WWBIAC03E018;Initial Catalog=BIASecurity;Persist Security Info=True;User ID=app_security;Password=Yawn-ice$2977;",
            Log = "Data Source=CSVP000585C7\\WWBIAC03E018;Initial Catalog=BIASecurity;Persist Security Info=True;User ID=app_security;Password=Yawn-ice$2977;"
        };
        #region Application
        //internal static Application Application(string SessionId, string AppCode)
        //{
        //    Application result = LoadSingle<Application>("secObject.getApplication",
        //        new DBParameter("@appCode", DbType.AnsiString, AppCode));

        //    try
        //    {
        //        if (!string.IsNullOrWhiteSpace(SessionId))
        //        {
        //            // get the session user
        //            User user = Cached.User(SessionId, null, null);
        //            result.authenticatedId = user.userId;

        //            // get the application user
        //            user = Cached.User(SessionId, null, AppCode);
        //            result.lastName = user.lastName;
        //            result.firstName = user.firstName;
        //            result.userId = user.userId;

        //            dynamic pending = LoadSingle<object>("appObject.usp_GetApplicationUserGeoRequestTotal",
        //                new DBParameter("@sysm", DbType.AnsiString, user.userId));
        //            result.pendingRequests = pending.TotalRequests;

        //            //dynamic notification = LoadSingle<object>("appObject.usp_GetNotificationCount",
        //            //    new DBParameter("@sysm", DbType.AnsiString, user.userId));
        //            //result.notificationCount = notification.NotificationCount;
        //            result.notificationCount = 0;

        //            // how many minutes are remaining in the current session.
        //            dynamic status = LoadSingle<object>("secObject.SessionStatusGet",
        //                new DBParameter("@SessionId", DbType.AnsiString, SessionId),
        //                new DBParameter("@AppCode", DbType.AnsiString, AppCode));
        //            result.minutesRemaining = (status.minutesRemaining > 0) ? status.minutesRemaining : 0;
        //        }
        //    }
        //    catch { }

        //    return result;
        //}

        internal static ApplicationBase ApplicationBase(string SessionId, string AppCode)
        {
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
        internal static Session Session(string SessionId, string AppCode, string IpAddress)
        {
            if (!string.IsNullOrWhiteSpace(SessionId))
            {
                return LoadSingle<Session>("secObject.SessionApplicationUpdate",
                    new DBParameter("@sessionId", DbType.AnsiString, SessionId),
                    new DBParameter("@appCode", DbType.AnsiString, AppCode),
                    new DBParameter("@ip", DbType.AnsiString, IpAddress),
                    new DBParameter("@server", DbType.AnsiString, Settings.Config.BIAServer),
                    new DBParameter("@env", DbType.AnsiString, Settings.Config.BIAEnvironment));
            }
            else
            {
                return new BIACore.Model.Session();
            }
        }
        internal static List<SessionApps> SessionApps(string SessionId)
        {
            if (!string.IsNullOrWhiteSpace(SessionId))
            {
                return LoadResult<SessionApps>("secObject.SessionApplicationGetAll",new DBParameter("@sessionId", DbType.AnsiString, SessionId));
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
        #endregion

        #region Login
        internal static dynamic SessionAppInfo(string SessionId, string AppCode)
        {
            if (!string.IsNullOrWhiteSpace(SessionId) && !string.IsNullOrWhiteSpace(AppCode))
            {
                return LoadSingle<object>("secObject.SessionStatusApplicationInfo",
                    new DBParameter("@sessionId", DbType.AnsiString, SessionId),
                    new DBParameter("@appCode", DbType.AnsiString, AppCode));
            }
            else
            {
                return new { status = 0, useSSL = 1 };
            }

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
        #endregion

        #region User
        internal static User User(string SessionId, string UserId, string AppCode)
        {
            List<DBParameter> args = new List<DBParameter>();

            if (!string.IsNullOrWhiteSpace(SessionId)) args.Add(new DBParameter("@SessionId", DbType.AnsiString, SessionId));
            if (!string.IsNullOrWhiteSpace(UserId)) args.Add(new DBParameter("@UserId", DbType.AnsiString, UserId));
            if (!string.IsNullOrWhiteSpace(AppCode)) args.Add(new DBParameter("@AppCode", DbType.AnsiString, AppCode));

            User user = LoadSingle<User>("secObject.SessionUserGet", args.ToArray());
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
            return LoadResult<object>("biacoreObject.GetHeaderAdminLinks");
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
            return LoadSingle<FingerprintValue>(Connections.NewSecurity, "cmpObject.getFingerprintFromFingerprintId", new DBParameter("@fingerprintId", DbType.Int32, fingerprintId));
        }
        internal static FingerprintValue FingerprintValueByValue(string value)
        {
            return LoadSingle<FingerprintValue>(Connections.NewSecurity, "cmpObject.getFingerprintFromValue", new DBParameter("@value", DbType.AnsiString, value));
        }
        internal static FingerprintValue FingerprintUsageLog(string FingerprintId, string AppCode, string UserId)
        {
            FingerprintValue fingerprint = LoadSingle<FingerprintValue>("cmpObject.FingerprintUsageUpsert", new DBParameter[] {
                new DBParameter("@fingerprintId", DbType.AnsiString, FingerprintId),
                new DBParameter("@appCode", DbType.AnsiString, AppCode),
                new DBParameter("@userId", DbType.AnsiString, UserId)});

            if (fingerprint != null)
            {
                string key = string.Format("{0}", fingerprint.FingerprintId);
                //Cache.Set(key, fingerprint, DateTime.UtcNow.AddMinutes(5));
            }

            return fingerprint;
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

        #region Logs
        internal static void ActivityLog_InsertSQL(object log) {}

        internal static void LoginLog_InsertSQL(Dictionary<string, object> log)
        {
            using (SqlConnection con = new SqlConnection(Connections.Security))
            {
                using (SqlCommand cmd = new SqlCommand("logObject.LogInsert", con))
                {
                    cmd.CommandType = CommandType.StoredProcedure;
                    cmd.Parameters.AddWithValue("@appCode", log.Keys.ToList().IndexOf("AppCode") > -1 ? log["AppCode"] : null);
                    cmd.Parameters.AddWithValue("@biaUserID", log.Keys.ToList().IndexOf("UserId") > -1 ? log["UserId"] : null);
                    cmd.Parameters.AddWithValue("@ipAddress", log.Keys.ToList().IndexOf("IpAddress") > -1 ? log["IpAddress"] : null);
                    cmd.Parameters.AddWithValue("@browser", log.Keys.ToList().IndexOf("Browser") > -1 ? log["Browser"] : null);
                    cmd.Parameters.AddWithValue("@pageName", log.Keys.ToList().IndexOf("Page") > -1 ? log["Page"] : null);
                    cmd.Parameters.AddWithValue("@params", log.Keys.ToList().IndexOf("Params") > -1 ? log["Params"] : null);
                    cmd.Parameters.AddWithValue("@groupName", log.Keys.ToList().IndexOf("Group") > -1 ? log["Group"] : null);
                    cmd.Parameters.AddWithValue("@objectName", log.Keys.ToList().IndexOf("Object") > -1 ? log["Object"] : null);

                    con.Open();
                    cmd.ExecuteNonQuery();
                }
            }
        }
        internal static void VersionLog_InsertSQL(dynamic log)
        {
            using (SqlConnection con = new SqlConnection(Connections.Log))
            {
                using (SqlCommand cmd = new SqlCommand("biacoreObject.Version_ISP", con))
                {
                    cmd.CommandType = CommandType.StoredProcedure;
                    cmd.Parameters.AddWithValue("@appCode", log.AppCode);
                    cmd.Parameters.AddWithValue("@server", log.Server);
                    cmd.Parameters.AddWithValue("@version", log.Version);

                    con.Open();
                    cmd.ExecuteNonQuery();
                }
            }
        }
        internal static void ConnectionLog_InsertSQL(dynamic log)
        {
            using (SqlConnection con = new SqlConnection(Connections.NewSecurity))
            {
                using (SqlCommand cmd = new SqlCommand("appObject.UpsertAppWebConfigConnectionString", con))
                {
                    cmd.CommandType = CommandType.StoredProcedure;
                    cmd.Parameters.AddWithValue("@appCode", log.AppCode);
                    cmd.Parameters.AddWithValue("@server", log.Server);
                    cmd.Parameters.AddWithValue("@configName", log.ConfigName);
                    cmd.Parameters.AddWithValue("@connectionString", log.ConnectionString);
                    cmd.Parameters.AddWithValue("@provider", log.Provider);

                    con.Open();
                    cmd.ExecuteNonQuery();
                }
            }

        }
        internal static void ExportLog_InsertSQL(dynamic log)
        {
            using (SqlConnection con = new SqlConnection(Connections.Log))
            {
                using (SqlCommand cmd = new SqlCommand("biacoreObject.ExportLogInsert", con))
                {
                    cmd.CommandType = CommandType.StoredProcedure;
                    cmd.Parameters.AddWithValue("@ExportDate", log.ExportDate);
                    cmd.Parameters.AddWithValue("@ExportType", log.ExportType.ToString().ToUpper());
                    cmd.Parameters.AddWithValue("@AppCode", log.AppCode);
                    cmd.Parameters.AddWithValue("@UserSysm", log.ExportUserSysm);
                    cmd.Parameters.AddWithValue("@Route", log.Route);
                    cmd.Parameters.AddWithValue("@Params", log.Params);
                    cmd.Parameters.AddWithValue("@RowCnt", log.RowCnt);
                    cmd.Parameters.AddWithValue("@ColumnCnt", log.ColumnCnt);

                    con.Open();
                    cmd.ExecuteNonQuery();
                }
            }
        }
        internal static void ApplicationLog_InsertSQL(LogEntryRemote log)
        {
            using (SqlConnection con = new SqlConnection(Connections.Log))
            {
                using (SqlCommand cmd = new SqlCommand("biacoreObject.Log_ISP", con))
                {
                    cmd.CommandType = CommandType.StoredProcedure;
                    cmd.Parameters.AddWithValue("@TransactionId", log.TransactionId);
                    cmd.Parameters.AddWithValue("@Date", log.Date);
                    cmd.Parameters.AddWithValue("@Server", log.Server);
                    cmd.Parameters.AddWithValue("@UserId", string.IsNullOrWhiteSpace(log.UserId) ? BIACore.Security.User.DEFAULT_USERID : log.UserId);
                    cmd.Parameters.AddWithValue("@AppCode", log.AppCode);
                    cmd.Parameters.AddWithValue("@Level", log.Level.ToString());
                    cmd.Parameters.AddWithValue("@Event", log.Event);
                    cmd.Parameters.AddWithValue("@Detail", log.Detail);

                    con.Open();
                    cmd.ExecuteNonQuery();
                }
            }
        }
        #endregion

        private static T LoadSingle<T>(string sp, params DBParameter[] args) where T : new()
        {
            try
            {
                DataTable result = SQL.Execute(Connections.Security, sp, args);
                List<T> list = (result == null) ? new List<T>() : result.ToList<T>();
                return (list.Count == 1) ? list[0] : default(T);
            }
            catch (Exception e)
            {
                LogFactory.Exception(e);
                throw;
            }
        }

        private static T LoadSingle<T>(string connection, string sp, params DBParameter[] args) where T : new()
        {
            try
            {
                DataTable result = SQL.Execute(connection, sp, args);
                List<T> list = (result == null) ? new List<T>() : result.ToList<T>();
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
            try
            {
                DataTable result = SQL.Execute(Connections.Security, sp, args);
                return (result == null) ? new List<T>() : result.ToList<T>();
            }
            catch (Exception e)
            {
                LogFactory.Exception(e);
                throw;
            }
        }

        private static List<T> LoadResult<T>(string connection, string sp, params DBParameter[] args) where T : new()
        {
            try
            {
                DataTable result = SQL.Execute(connection, sp, args);
                return (result == null) ? new List<T>() : result.ToList<T>();
            }
            catch (Exception e)
            {
                LogFactory.Exception(e);
                throw;
            }
        }
#endif
    }
}
