using BIACore.Log;
using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.IO;
using System.Linq;
using System.Reflection;
using System.Web;

namespace BIACore.Security
{
    /// <summary>
    /// This static class is for accessing the current User object.
    /// Internally, it contains an Obj property which is a reference to
    /// the current user object; if none exists, nulls will (usually)
    /// be returned.
    /// There are 2 modes of operation; inside of a web application,
    /// this will automatically be provided assuming you're using the
    /// BIA security system.
    /// If you're in a standalone mode (e.g. running as a window service)
    /// you can manually set the User by calling User.StandAlone(UserId)
    /// - the appropriate user (and their permissions) will be loaded 
    /// automatically.
    /// </summary>
    public static class User
    {
        private const string USER = "BIACore.User";

        public const string DEFAULT_USERID = "Unknown";

        /// <summary>
        /// The userId for the current user.
        /// </summary>
        [Obsolete("Use userId instead")]
        public static string UserId { get { return Obj.userId; } }
        /// <summary>
        /// The userId for the current user.
        /// </summary>
        public static string userId { get { return Obj.userId; } }

        // for LogEntry - only return the userId if it is already known. Otherwise, send back 'Unknown'.
        internal static string _userId
        {
            get
            {
                try
                {
                    bool isValid = false;
                    if (!_userGetTry) isValid = User.isValid;
                    if (HttpContext.Current != null && HttpContext.Current.Items[USER] != null)
                    {
                        //Log.LogFactory.Error("_userId - HttpContextUser " + ((Model.User)HttpContext.Current.Items[USER]).userId);
                        return ((Model.User)HttpContext.Current.Items[USER]).userId;
                    }
                    else if (_user != null)
                    {
                        //Log.LogFactory.Error("_userId - _user.userId " + _user.userId);
                        return _user.userId;
                    }
                    else if (Session.Exists && Session.userId != null)
                    {
                        //Log.LogFactory.Error("_userId - Session " + Session.userId);
                        return Session.userId;
                    }
                }
                catch (Exception ex) { 
                    //Log.LogFactory.Exception(ex);
                }
                //Log.LogFactory.Error("_userId - Unknown",null);
                return DEFAULT_USERID;
            }
        }

        /// <summary>
        /// The adId for the current user.
        /// </summary>
        [Obsolete("Use adId instead")]
        public static string AdId { get { return Obj.adId; } }
        /// <summary>
        /// The adId for the current user.
        /// </summary>
        public static string adId { get { return Obj.adId; } }

        /// <summary>
        /// The employeeId for the current user.
        /// </summary>
        [Obsolete("Use employeeId instead")]
        public static string EmployeeId { get { return Obj.employeeId; } }
        /// <summary>
        /// The employeeId for the current user.
        /// </summary>
        // adding retarded hackaraound thanks to Nick's ingenuity in ensuring null strings are string.empty instead of null.
        // (*#@&%^)_&#@$ remove this asap.
        public static string employeeId { get { return string.IsNullOrWhiteSpace(Obj.employeeId) ? string.Empty : Obj.employeeId; } }

        /// <summary>
        /// The firstName of the current user.
        /// </summary>
        [Obsolete("Use firstName instead")]
        public static string FirstName { get { return Obj.firstName; } }
        /// <summary>
        /// The firstName of the current user.
        /// </summary>
        public static string firstName { get { return Obj.firstName; } }

        /// <summary>
        /// The lastName of the current user.
        /// </summary>
        [Obsolete("Use lastName instead")]
        public static string LastName { get { return Obj.lastName; } }
        /// <summary>
        /// The lastName of the current user.
        /// </summary>
        public static string lastName { get { return Obj.lastName; } }

        /// <summary>
        /// The permissions list of the current user.
        /// </summary>
        [Obsolete("Use permissions instead")]
        public static List<Model.Permission> GeoPermissions { get { return Obj.permissions.Select(item => (Model.Permission)(item.ToObject<Model.Permission>())).ToList<Model.Permission>(); } }
        /// <summary>
        /// The permissions list of the current user.
        /// </summary>
        public static List<Model.Permission> permissions { get { return Obj.permissions.Select(item => (Model.Permission)(item.ToObject<Model.Permission>())).ToList<Model.Permission>(); } }
        /// <summary>
        /// The permissions list of the current user.
        /// </summary>
        public static List<dynamic> permissionsEA { get { return Obj.permissions; } }
        /// <summary>
        /// List of roles assigned in APRS
        /// </summary>
        public static List<string> aprsRoles {
            // get { return Obj.aprsRoles.roles; } 
            get
            {
                try
                {
                    LogFactory.Performance($"Fetching APRS roles for UserId={userId} | AppCode={Settings.Config.AppCode}", 0);
                    // Assumes appCode is available via Settings.Config.AppCode
                    return Internal.Request.APRSRoles(userId, Settings.Config.AppCode)?.roles ?? new List<string>();
                }
                catch (Exception ex)
                {
                    LogFactory.Error("Fetching APRSRoles - {0}", ex.Message);
                    LogFactory.Exception(ex);
                    return new List<string>();
                }
            }
        }

        /// <summary>
        /// Gets the list of roles from the token
        /// </summary>
        public static List<string> msEntraRoles
        {
            get
            {
                try
                {
                    LogFactory.Performance($"Fetching MS Entra roles for UserId={userId} | AppCode={Settings.Config.AppCode}", 0);
                    // Assumes appCode is available via Settings.Config.AppCode
                    return Internal.Request.APRSRoles(userId, Settings.Config.AppCode)?.roles ?? new List<string>();
                }
                catch (Exception ex)
                {
                    LogFactory.Error("Fetching msEntraRoles - {0}", ex.Message);
                    LogFactory.Exception(ex);
                    return new List<string>();
                }
            }
        }


        #region Nick's BIACore items
        /// <summary>
        /// The email address of the current user.
        /// </summary>
        public static string email { get { return Obj.email; } }
        /// <summary>
        /// The phone number of the current user.
        /// </summary>
        public static string phone { get { return Obj.phone; } }
        /// <summary>
        /// The regionType of the current user.
        /// </summary>
        public static string regionType { get { return Obj.regionType; } }
        /// <summary>
        /// The region of the current user.
        /// </summary>
        public static string region { get { return Obj.region; } }
        /// <summary>
        /// The district of the current user.
        /// </summary>
        public static string district { get { return Obj.district; } }
        /// <summary>
        /// The authenticated user's id (can be different from current user thanks to superimpose)
        /// </summary>
        [Obsolete("This value shouldn't be relied upon in the current security model")]
        public static string authenticatedId { get { return Obj.authenticatedId; } }
        /// <summary>
        /// The authenticated user's first name (can be different from current user thanks to superimpose)
        /// </summary>
        [Obsolete("This value shouldn't be relied upon in the current security model")]
        public static string authenticatedFirstName { get { return Obj.authenticatedFirstName; } }
        /// <summary>
        /// The authenticated user's last name (can be different from current user thanks to superimpose)
        /// </summary>
        [Obsolete("This value shouldn't be relied upon in the current security model")]
        public static string authenticatedLastName { get { return Obj.authenticatedLastName; } }
        #endregion

        public static string department { get { return Obj.department; } }
        public static string jobLevel { get { return Obj.jobLevel; } }
        public static string businessUnitId { get { return Obj.businessUnitId; } }


        [ThreadStatic]
        private static Model.User _user;
        [ThreadStatic]
        private static bool _userGet = false;
        [ThreadStatic]
        private static bool _userGetTry = false;
        internal static Model.User Obj
        {
            get
            {
                _userGetTry = true;
                if (HttpContext.Current != null)
                {
                    if (HttpContext.Current.Items[USER] == null)
                    {
                        Model.User item = null;
                        try
                        {
                            //string session = HttpUtility.UrlDecode(HttpContext.Current.Request.Cookies[API.SESSION_COOKIE].Value);
                            string token = HttpContext.Current.Request.Cookies[API.LOCALHOST_TOKEN_COOKIE] != null && HttpContext.Current.Request.Cookies[API.LOCALHOST_TOKEN_COOKIE].Value != null ? HttpContext.Current.Request.Cookies[API.LOCALHOST_TOKEN_COOKIE].Value : null;
                            item = Internal.Request.User(token);
                            // technically this is an invalid session.
                            if (item == null) item = new Model.User();
                            _userGet = true;
                        }
                        catch
                        {
                            item = new Model.User();
                        }
                        HttpContext.Current.Items[USER] = item;
                    }
                }
                else if (_user == null)
                {
                    _user = new Model.User();
                    _userGet = true;
                }
                return (HttpContext.Current != null) ? (Model.User)HttpContext.Current.Items[USER] : _user;
            }
            set
            {
                if (HttpContext.Current != null)
                    HttpContext.Current.Items[USER] = value;
                else
                    _user = value;
            }
        }

        internal static bool isValid
        {
            get { return (null != Obj); }
        }

        /// <summary>
        /// returns true if the user is considered "corporate"
        /// </summary>
        public static bool isCorporate
        {
            get
            {
                return Rules.User.isCorporate(Obj);
            }
        }

        /// <summary>
        /// Returns true if the current user is considered at least an application Super Admin
        /// </summary>
        public static bool isSA
        {
            get
            {
                return Rules.User.isSA(Obj);
            }
        }

        /// <summary>
        /// Returns true if the current user is considered at least an application Admin
        /// </summary>
        public static bool isAdmin
        {
            get
            {
                return Rules.User.isAdmin(Obj);
            }
        }

        /// <summary>
        /// Manually log out the current user.
        /// </summary>
        public static void logout()
        {
            throw new NotImplementedException();
        }

        /// <summary>
        /// Pretend to be a different user in the current application.
        /// </summary>
        /// <param name="impersonateId">userId of the target to pretend to be</param>
        public static void impersonateUser(string impersonateId)
        {
            throw new NotImplementedException();
        }

        /// <summary>
        /// Meant for use in non Http-Environment apps, e.g. Windows Services
        /// </summary>
        /// <param name="UserId">The user id to load</param>
        public static void StandAlone(string UserId)
        {
            int upMethods = 1;
            MethodBase caller = new StackTrace().GetFrame(upMethods).GetMethod();
            if (caller.DeclaringType.ToString() == "BIACore.Agent.Task.ExportReport" && caller.Name == "Run")
            {
                // null/empty string = erase current user object.
                Obj = string.IsNullOrWhiteSpace(UserId) ?
                new Model.User() :
                Internal.Request.UserById(UserId);
            }
            else throw new Exception("Functionality Not Available from this source");
        }

        /// <summary>
        /// Look up the given user by the provided UserId.
        /// Requires at least application Admin permissions; if the current user is not, an exception will be thrown.
        /// </summary>
        /// <param name="UserId">The UserId to look up</param>
        /// <returns>Null if no user is found, or the given user</returns>
        public static Model.User Lookup(string UserId)
        {
            if (!isAdmin)
                throw new UnauthorizedAccessException("Lookup requires at least Admin permissions.");

            return Internal.Request.UserById(UserId);
        }
    }
}
