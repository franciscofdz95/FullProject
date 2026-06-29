using System;
using System.Collections.Generic;
using System.Linq;

using System.Net;
using System.Net.Http;
using System.Web;
using System.Web.Http;
using System.Data;
using System.Data.SqlClient;
using System.Globalization;
using System.Text;
using System.Security.Cryptography;

using System.Threading;
using System.Threading.Tasks;

using BIACore.Model;

using ITAuth = BIACore.Website.ITAuth;
using System.IO.Ports;
//using WebGrease.Extensions;
using DocumentFormat.OpenXml.Office.Word;
using BIACore.Extensions;
using System.IO;
//using Microsoft.Ajax.Utilities;
using System.Runtime.InteropServices;

namespace BIACore.Server.Controller
{
    public partial class AuthenticationController : ApiController
    {
        private static string MSG_DOMAIN_FAILURE = "Login Failed, please try again.";
        private static string MSG_BIA_FAILURE = "Login Failed, please try again.";
        private static string MSG_INVALID = "Login Failed, please try again.";
        private static string MSG_IMPERSONATE = "Login Failed, please try again.";
        private static string MSG_ERROR = "Authentication Error";
        private static string MSG_NOACCESS = "You do not have access to the specified app.";
        private static string MSG_OFFLINE = "This application is currently offline.";
        private static string MSG_NEWUSER = "You do not appear to exist.";

        private enum UserType
        {
            ADUser = 2,
            GenericUser = 1,
            NotFound = 0
        }

        private enum AuthResult
        {
            WS4IDError = -2,        // WS4ID error
            Error = -1,             // login service problem (timeout)
            Failure = 0,            // login failure
            Success = 1,            // login success
            NoData = 2,             // non-authoritative failure
            LockOut = 3,            // user in lockout period
            NoAccess = 4,           // user has no access to selected app
            Offline = 5,            // application is currently offline
            NewUser = 6,            // user does not exist in BIASecurity_Users
            NoAccessPending = 7,    // user does not have access, and has a pending access request
            BadAccount = 8          // invalid user id
        }

        private class UserLockout
        {
            public string Message;
            public int Timeout;
        }

        private dynamic Authenticator(string user, string pass, string target, string appCode, string source, bool isLocalHost = false)
        {
            try
            {
                // ensure a user/pass are available
                if (string.IsNullOrWhiteSpace(user) || string.IsNullOrWhiteSpace(pass))
                {
                    AuthEvent.Log(Auth.Invalid, "User or Pass not valid.");
                    return new { Success = false, Invalid = true, Error = MSG_INVALID };
                }
                // apparently ITAuth will 'ignore' leading/trailing spaces.
                user = user.Trim();

                AuthResult result;
                int lockout;
                string message;

                // get User type (AD,Generic,NotFound) for user and target
                UserType userType = GetUserType(user), targetType = GetUserType(target);
                UserLockout userTimeout = GetUserLockout(user);


                /*****************************************
                 * Remove AD Login Caching for Penetration Testing Results 6/28/2018
                 * Garrett Hogan & Matthew Erdmann
                 *****************************************/

                if (userTimeout.Timeout > 0)
                {
                    return new { Success = false, Lockout = true, Error = userTimeout.Message, Timeout = userTimeout.Timeout };
                }
                // validate GenericUser
                if (userType == UserType.GenericUser)
                {
                    for (int i = 0; i < RETRY_COUNT; ++i)
                    {
                        result = AuthenticateWithBIA(user, pass);

                        switch (result)
                        {
                            case AuthResult.Success:
                                AuthEvent.Log(Auth.BIAAuthSuccess, "Authenticated Generic");
                                return StartSession(user, target, appCode, source, (int)userType, (int)targetType, isLocalHost);
                            case AuthResult.Failure:
                                AuthEvent.Log(Auth.BIAAuthFail, "Authentication Failure");
                                message = LogFailure(user, out lockout);
                                if (lockout > 0)
                                    return new { Success = false, Lockout = true, Error = message, Timeout = lockout };
                                return new { Success = false, Fail = true, Error = message };
                            default: // handle timeouts with dignity
                                AuthEvent.Log(Auth.BIAAuthError, "Attempt #{0}: Error communicating with BIA", i);
                                if (i < RETRY_COUNT - 1)
                                {
                                    Thread.Sleep(RETRY_INTERVAL);
                                }
                                break;
                        }
                    }

                    AuthEvent.Log(Auth.Error, "Unable to authenticate generic user");
                    return new { Success = false, Unknown = true, Error = MSG_BIA_FAILURE };
                }

                // validate against IT
                else
                {
                    for (int i = 0; i < RETRY_COUNT; ++i)
                    {
                        result = AuthenticateWithIT(user, pass);
                        switch (result)
                        {
                            case AuthResult.Success:
                                AuthEvent.Log(Auth.ITAuthSuccess, "Authenticated AD");
                                /*****************************************
                                 * Remove AD Login Caching for Penetration Testint Results 6/28/2018
                                 * Garrett Hogan & Matthew Erdmann
                                 *****************************************/
                                //CacheAuthentication(user, hash);
                                return StartSession(user, target, appCode, source, (int)userType, (int)targetType, isLocalHost);
                            case AuthResult.Failure:
                                AuthEvent.Log(Auth.ITAuthFail, "Authentication Failure");
                                message = LogFailure(user, out lockout);
                                if (lockout > 0)
                                    return new { Success = false, Lockout = true, Error = message, Timeout = lockout };
                                return new { Success = false, Fail = true, Error = message };
                            case AuthResult.BadAccount:
                                AuthEvent.Log(Auth.ITAuthFail, "Invalid or Unknown User Id");
                                return new { Success = false, BadAccount = true, Error = "" };
                            case AuthResult.WS4IDError:
                                AuthEvent.Log(Auth.ITAuthFail, "Authentication Error");
                                return new { Success = false, Fail = true, Error = "AD Authentication Error. Please try again later." };
                            default: // handle timeouts with dignity
                                AuthEvent.Log(Auth.ITAuthError, "Attempt #{0}: Error communicating with IT", i);
                                if (i < RETRY_COUNT - 1)
                                {
                                    Thread.Sleep(RETRY_INTERVAL);
                                }
                                break;
                        }
                        AuthEvent.Log(Auth.Error, "External User Authentication Timeout Attempt " + i.ToString());
                    }

                    AuthEvent.Log(Auth.Error, "Unable to authenticate AD user");
                    return new { Success = false, Unknown = true, Error = MSG_DOMAIN_FAILURE };
                }
            }
            catch (Exception ex)
            {
                LogFactory.Exception(ex);
            }

            AuthEvent.Log(Auth.Exception, "Unknown Error");
            return new { Success = false, Unknown = true, Error = MSG_ERROR };
        }

        private static UserType GetUserType(string user)
        {
            UserType result = UserType.NotFound;
            try
            {
                Dictionary<string, object> dataObj = Provider.SQL.ExecuteSQLRaw(Connections.Security, "secObject.LoginUserCheck", new DBParameter("@userId", DbType.AnsiString, user));

                if (dataObj.Keys.Contains("UserType"))
                {
                    result = (UserType)Convert.ToInt32(dataObj["UserTypeId"]);
                }

                //using (SqlDataReader data = Provider.SQL.ExecuteSQLRaw(Connections.Security, "secObject.LoginUserCheck", new DBParameter("@userId", DbType.AnsiString, user)))
                //{
                //    if (!data.HasRows) { return result; }
                //    else
                //    {
                //        if (data.Read())
                //        {
                //            try
                //            {
                //                // not the prettiest way to do this, but it should result in fewer exception throws.
                //                // exceptions are expensive.
                //                List<string> columns = Enumerable.Range(0, data.FieldCount).Select(data.GetName).ToList();

                //                if (columns.Contains("UserType"))
                //                {
                //                    result = (UserType)Convert.ToInt32(data["UserTypeId"]);
                //                }
                //            }
                //            catch { }
                //        }
                //        return result;
                //    }
                //}
            }
            catch (Exception e)
            {
                LogFactory.Exception(e);
            }

            return result;
        }

        private static UserLockout GetUserLockout(string user)
        {
            UserLockout result = new UserLockout();
            result.Timeout = 0;

            try
            {
                Dictionary<string, object> dataObj = Provider.SQL.ExecuteSQLRaw(Connections.Security, "secObject.LoginFailedCheck", new DBParameter("@userId", DbType.AnsiString, user));

                if (dataObj != null)
                {
                    if (dataObj.Keys.Contains("Message"))
                    {
                        result.Message = dataObj["Message"].ToString();
                    }
                    if (dataObj.Keys.Contains("Timeout"))
                    {
                        result.Timeout = Convert.ToInt32(dataObj["Timeout"]);
                    }
                }
            }
            catch (Exception e)
            {
                LogFactory.Exception(e);
            }

            return result;
        }

        private AuthResult AuthenticateWithBIA(string user, string pass)
        {
            AuthResult result = AuthResult.NoData;
            try
            {
                Dictionary<string, object> dataObj = Provider.SQL.ExecuteSQLRaw(Connections.Security, "secObject.LoginGenericUserValidate", new DBParameter[]
                    { new DBParameter("@userId", DbType.AnsiString, user), new DBParameter("@authCode", DbType.AnsiString, pass) });

                if (dataObj.Keys.Contains("AuthResult"))
                {
                    result = (AuthResult)Convert.ToInt32(dataObj["AuthResult"]);
                }

                //using (SqlDataReader data = Provider.SQL.ExecuteSQLRaw(Connections.Security, "secObject.LoginGenericUserValidate", new DBParameter[] 
                //    { new DBParameter("@userId", DbType.AnsiString, user), new DBParameter("@authCode", DbType.AnsiString, pass) }))
                //{
                //    if (!data.HasRows) { return result; }
                //    else
                //    {
                //        if (data.Read())
                //        {
                //            try
                //            {
                //                // not the prettiest way to do this, but it should result in fewer exception throws.
                //                // exceptions are expensive.
                //                List<string> columns = Enumerable.Range(0, data.FieldCount).Select(data.GetName).ToList();

                //                if (columns.Contains("AuthResult"))
                //                    result = (AuthResult)Convert.ToInt32(data["AuthResult"]);
                //            }
                //            catch { }
                //        }
                //        return result;
                //    }
                //}
            }
            catch (Exception e)
            {
                LogFactory.Exception(e);
            }
            return result;
        }

        private AuthResult AuthenticateWithIT(string user, string pass)
        {
            ITAuth.getUserAuthenticationRequest request = new ITAuth.getUserAuthenticationRequest();
            request.UserAuthenticationRequest = new ITAuth.UserAuthenticationRequest();
            request.UserAuthenticationRequest.UserID = user;
            request.UserAuthenticationRequest.Password = pass;

            try
            {
                ITAuth.UserAuthenticationPort client = new ITAuth.UserAuthenticationPortClient();
                ITAuth.getUserAuthenticationResponse response = client.getUserAuthentication(request);

                if (response.result.source == "ewd")
                {
                    switch (response.result.status)
                    {
                        case 0: return AuthResult.Success;// valid
                                                          // Simple way to switch from BadAccount to Failure for WS4ID bad account report, HOWEVER there may be side effects.
                                                          //case 1: return AuthResult.BadAccount;// error on ws4id side and/or bad account
                        case 1:
                            AuthEvent.Log(Auth.WS4IDError, "version={1}{0}status={2}{0}message={3}{0}source={4}", new object[] { Environment.NewLine, response.result.version, response.result.status, response.result.message, response.result.source });
                            return AuthResult.WS4IDError;// error on ws4id side and/or bad account
                        case 2:
                            return AuthResult.BadAccount;// bad account
                        case 3:
                            {
                                /*
                                 * Removed password logging due to Penetration Testing Audit 6/28/2018
                                 * S. Garrett Hogan & Matthew Erdmann
                                 */
                                //AuthEvent.Log(Auth.BadPassword, "[" + pass + "].live");
                                AuthEvent.Log(Auth.BadPassword, "ADID live");
                                return AuthResult.Failure;// bad pass
                            }
                        default:
                            AuthEvent.Log(Auth.ITAuthUnkown, "Response Status = " + response.result.status.ToString() + " " + response.result.message);
                            return AuthResult.Error; // unknown?
                    }
                }
                else
                {
                    return AuthResult.BadAccount; // bad account, due to returning a Employee ID result (EPD) instead of AD result (EWD)
                }
            }
            catch (Exception e)
            {
                LogFactory.Exception(e);
                AuthEvent.Log(Auth.ITAuthCoreLog, "TransactionId = " + HttpContext.Current.Items["BIACore_TransactionId"].ToString());
                return AuthResult.Error;
            }
        }

        private string LogFailure(string user, out int lockout)
        {
            string message = string.Empty;
            lockout = 0;
            try
            {
                Dictionary<string, object> dataObj = Provider.SQL.ExecuteSQLRaw(Connections.Security, "secObject.LoginFail", new DBParameter[]
                    { new DBParameter("@userId", DbType.AnsiString, user), new DBParameter("@ip", DbType.AnsiString, HttpContext.Current.Request.UserHostAddress) });

                if (dataObj.Keys.Contains("Timeout")) lockout = Convert.ToInt32(dataObj["Timeout"]);
                if (dataObj.Keys.Contains("Message")) message = dataObj["Message"].ToString();

                //using (SqlDataReader data = Provider.SQL.ExecuteSQLRaw(Connections.Security, "secObject.LoginFail", new DBParameter[]
                //    { new DBParameter("@userId", DbType.AnsiString, user), new DBParameter("@ip", DbType.AnsiString, HttpContext.Current.Request.UserHostAddress) }))
                //{
                //    if (data.HasRows)
                //    {
                //        data.Read();
                //        List<string> columns = Enumerable.Range(0, data.FieldCount).Select(data.GetName).ToList();

                //        if (columns.Contains("Timeout"))
                //            lockout = Convert.ToInt32(data["Timeout"]);
                //        if (columns.Contains("Message"))
                //            message = Convert.ToString(data["Message"]);
                //    }
                //}
            }
            catch (Exception e)
            {
                LogFactory.Exception(e);
            }
            return message;
        }

        private static string GenerateSessionId(string user, string ip)
        {
            string hash;
            string paddingStart = Utility.Randomizer.GetAlphaNumericSymbol(31);
            string paddingMiddle = Utility.Randomizer.GetAlphaNumericSymbol(31);
            string paddingEnd = Utility.Randomizer.GetAlphaNumericSymbol(31);

            string encodingString = paddingStart + user + paddingMiddle + ip + paddingEnd;

            using (RijndaelManaged AES256 = new RijndaelManaged())
            {
                AES256.KeySize = 256;
                AES256.BlockSize = 256;
                AES256.Mode = CipherMode.CBC;

                string ivSecretString = "Session";
                double ivPaddingLength = ((AES256.BlockSize / 8) - ivSecretString.Length) / 2.0;
                string ivPaddingStart = Utility.Randomizer.GetAlphaNumericSymbol((int)Math.Floor(ivPaddingLength));
                string ivPaddingEnd = Utility.Randomizer.GetAlphaNumericSymbol((int)Math.Ceiling(ivPaddingLength));
                string ivString = ivPaddingStart.ToString() + ivSecretString + ivPaddingEnd.ToString();
                byte[] ivBytes = ivString.ToBytes();

                string keySecretString = DateTime.Now.ToString("o");
                keySecretString = keySecretString.Substring(0, keySecretString.Length - 6);
                double keyPaddingLength = ((AES256.KeySize / 8) - keySecretString.Length) / 2.0;
                string keyPaddingStart = Utility.Randomizer.GetAlphaNumericSymbol((int)Math.Floor(keyPaddingLength));
                string keyPaddingEnd = Utility.Randomizer.GetAlphaNumericSymbol((int)Math.Ceiling(keyPaddingLength));
                string keyString = keyPaddingStart + keySecretString + keyPaddingEnd;
                byte[] keyBytes = keyString.ToBytes();

                AES256.Key = keyBytes;
                AES256.IV = ivBytes;

                ICryptoTransform encryptor = AES256.CreateEncryptor(AES256.Key, AES256.IV);

                // Create the streams used for encryption.
                using (MemoryStream msEncrypt = new MemoryStream())
                {
                    using (CryptoStream csEncrypt = new CryptoStream(msEncrypt, encryptor, CryptoStreamMode.Write))
                    {
                        using (StreamWriter swEncrypt = new StreamWriter(csEncrypt))
                        {
                            swEncrypt.Write(encodingString);
                        }
                        hash = Convert.ToBase64String(msEncrypt.ToArray());
                    }
                }
            }

            return hash;
        }

        private static string GenerateSECHashId(string user, string ip)
        {
            string hash;
            HttpCookie secHashCookie = HttpContext.Current.Request.Cookies.Get(BIACore.API.SECHASH_COOKIE);
            if (secHashCookie == null)
            {
                hash = GenerateSessionId("SECHASH_" + user, ip);
            }
            else hash = secHashCookie.Value;

            return hash;
        }

        private dynamic StartSession(string user, string target, string appCode, string source, int userType, int targetType, bool isLocalHost)
        {
            return RemoteStartSession(user, target, appCode, source, userType, targetType, isLocalHost);
        }

        public static dynamic RemoteStartSession(string user, string target, string appCode, string source, int? userType = null,
            int? targetType = null, bool isLocalHost = false, bool anonymous = false)
        {
            AuthResult result = AuthResult.Error;
            string sessionId = GenerateSessionId(user, HttpContext.Current.Request.UserHostAddress);
            string sechashId = GenerateSECHashId(user, HttpContext.Current.Request.UserHostAddress);
            string url = null, fname = null, lname = null, appOfflineMsg = null, sysm = null, token = null;
            //GetUserType - Local PW, EAM PW
            if (targetType == null) targetType = String.IsNullOrWhiteSpace(target) ? 0 : (int)GetUserType(target);

            if (userType == null) userType = (int)GetUserType(user);

            try
            {
                List<DBParameter> args = new List<DBParameter> {
                        new DBParameter("@sessionId", DbType.AnsiString, sessionId),
                        new DBParameter("@sechashId", DbType.AnsiString, sechashId),
                        new DBParameter("@userType", DbType.AnsiString, userType),
                        new DBParameter("@userId", DbType.AnsiString, user),
                        new DBParameter("@ip", DbType.AnsiString, HttpContext.Current.Request.UserHostAddress),
                        new DBParameter("@server", DbType.AnsiString, Settings.Config.Server),
                        new DBParameter("@env", DbType.AnsiString, Settings.Config.BIAEnvironment),
                        new DBParameter("@anonymous", DbType.Boolean, anonymous)
                };
                if (!string.IsNullOrWhiteSpace(target))
                {
                    args.Add(new DBParameter("@targetId", DbType.AnsiString, target));
                    args.Add(new DBParameter("@targetType", DbType.AnsiString, targetType));
                }
                if (!string.IsNullOrWhiteSpace(appCode)) args.Add(new DBParameter("@appCode", DbType.AnsiString, appCode));
                if (!string.IsNullOrWhiteSpace(source)) args.Add(new DBParameter("@source", DbType.AnsiString, source));

                Dictionary<string, object> dataObj = Provider.SQL.ExecuteSQLRaw(Connections.Security, "secObject.SessionCreate", args.ToArray());

                if (dataObj.Keys.Contains("AuthResult")) result = (AuthResult)Convert.ToInt32(dataObj["AuthResult"]);
                if (dataObj.Keys.Contains("SessionId")) sessionId = Convert.ToString(dataObj["SessionId"]);
                if (dataObj.Keys.Contains("SecHashId")) sechashId = Convert.ToString(dataObj["SecHashId"]);
                if (dataObj.Keys.Contains("AppUrl")) url = Convert.ToString(dataObj["AppUrl"]);
                if (dataObj.Keys.Contains("F_Name")) fname = Convert.ToString(dataObj["F_Name"]); //Deprecated/not needed
                if (dataObj.Keys.Contains("L_Name")) lname = Convert.ToString(dataObj["L_Name"]); //Deprecated/not needed
                if (dataObj.Keys.Contains("AppOfflineMsg")) appOfflineMsg = Convert.ToString(dataObj["AppOfflineMsg"]);
                if (dataObj.Keys.Contains("Sysm")) sysm = Convert.ToString(dataObj["Sysm"]);

            }
            catch (Exception e)
            {
                LogFactory.Exception(e);
                AuthEvent.Log(Auth.Error, "Unable to start session: '{0}'", e.Message);
            }

            switch (result)
            {
                case AuthResult.Failure:
                    AuthEvent.Log(Auth.LoginAs, "Not allowed to impersonate.");
                    return new { Success = false, LoginAs = 1, SecHash = "", Error = MSG_IMPERSONATE };
                case AuthResult.Success:
                    AddLoginActivityEnterpriseLog(appCode, String.IsNullOrWhiteSpace(sysm) ? user : sysm, target);
                    AuthEvent.Log(Auth.Success, "SessionId: {0} Url: {1}", sessionId, url);
                    if (isLocalHost) return new { Success = true, Token = GetLoginSessionToken(sysm, sessionId), SecHash = sechashId, LocalHostToken = Token.GetToken(sessionId), AppUrl = url, User = sysm };
                    else return new { Success = true, Token = GetLoginSessionToken(sysm, sessionId), SecHash = sechashId, AppUrl = url, User = sysm };
                case AuthResult.NoAccess:
                    AuthEvent.Log(Auth.NoAccess, "Redirecting to Access Request for {0}", appCode);
                    //TODO: When access request is moved under our umbrella, drop first/last requirement.
                    return new { Success = false, NoAccess = 1, Token = GetLoginSessionToken(sysm, sessionId), SecHash = sechashId, Error = MSG_NOACCESS, AppCode = appCode, User = sysm, FirstName = fname, LastName = lname };
                case AuthResult.NoAccessPending:
                    AuthEvent.Log(Auth.NoAccess, "Access Request Pending for {0}", appCode);
                    //TODO: When access request is moved under our umbrella, drop first/last requirement.
                    return new { Success = false, NoAccess = 1, Pending = 1, Token = GetLoginSessionToken(sysm, sessionId), SecHash = sechashId, Error = MSG_NOACCESS, AppCode = appCode, User = sysm, FirstName = fname, LastName = lname };
                case AuthResult.Offline:
                    AuthEvent.Log(Auth.Offline, "{0} is currently offline", appCode);
                    return new { Success = false, Offline = 1, Token = GetLoginSessionToken(sysm, sessionId), SecHash = sechashId, Error = MSG_OFFLINE, AppOfflineMsg = appOfflineMsg };
                case AuthResult.NewUser:
                    AuthEvent.Log(Auth.NewUser, "Redirecting to New User for {0}", user);
                    return new { Success = false, NewUser = 1, Token = GetLoginSessionToken(sysm, sessionId), SecHash = sechashId, Error = MSG_NEWUSER };
                default: // sql error + any unhandled results.
                    AuthEvent.Log(Auth.Error, "Session not started");
                    return new { Success = false, Unknown = 1, SecHash = "", Error = MSG_ERROR };
            }
        }
        private static string GetLoginSessionToken(string sysm, string sessionId)
        {
            string token = Token.GetToken(sysm + "~" + HttpContext.Current.Request.UserHostAddress + "~" + DateTime.Now.ToString("o")+"~"+ Utility.Randomizer.GetAlphaNumericSymbol(21));

            BIACore.Provider.SQL.ExecuteSQLRaw(Connections.Security, "secObject.InsertSessionToken", CommandType.StoredProcedure, true, new DBParameter[] {
                new DBParameter("@token",DbType.AnsiString,token),
                new DBParameter("@sessionId",DbType.AnsiString,sessionId)
            });
            return token;
        }
        private static void AddLoginActivityEnterpriseLog(string appCode, string userId, string targetId)
        {
            try
            {
                //This logging is a duplicate, the commmented out log going to ApplicationLog and the other going to Enterprise Logging. Top one not needed!
                //BIACore.Log.LogFactory.CustomLog(!string.IsNullOrWhiteSpace(userId) ? userId : BIACore.Security.User.DEFAULT_USERID, "BIASecurity", BIACore.Log.LogLevel.Message, "AddLoginActivityEnterpriseLog",
                //    String.Format("Login Activity Log Trace Step 1.{0}appCode = {1}{0}userId = {2}{0} targetId = {3}{0}",
                //    new object[] { Environment.NewLine, appCode, userId, targetId }
                //    ));
                Activity.ActivityFactory.LoginLog(HttpContext.Current.Request, appCode, userId, targetId);
            }
            catch (Exception ex)
            {
                Log.LogFactory.CustomLog(!string.IsNullOrWhiteSpace(userId) ? userId : BIACore.Security.User.DEFAULT_USERID, "BIASecurity", Log.LogLevel.Exception, "AddLoginActivityEnterpriseLog",
                    String.Format("Error trying to log in enterprise logging.{0}appCode = {1}{0}userId = {2}{0} targetId = {3}{0}Error: {4}{0}{5}",
                    new object[] { Environment.NewLine, appCode, userId, targetId, "(" + ex.GetType().Name + ") " + ex.Message, ex.StackTrace })
                );
            }
        }
    }
}
