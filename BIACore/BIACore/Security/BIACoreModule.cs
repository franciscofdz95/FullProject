using BIACore.Extensions;
using BIACore.Log;
using BIACore.Model;
using Microsoft.Owin.Security;
using Microsoft.Owin.Security.OpenIdConnect;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Collections.Specialized;
using System.Linq;
using System.Text.RegularExpressions;
using System.Threading;
using System.Web;
using System.Web.Script.Serialization;

namespace BIACore
{
    /// <summary>
    /// Another part of the BIACoreModule
    /// See also BIACoreModule.cs
    /// See also Log\BIACoreModule.cs
    /// In this section, we are concerned with
    /// 1) Handling security
    /// 2) Setting up c# user/session objects prior to application execution
    /// </summary>
    public partial class BIACoreModule
    {
        public enum RedirectReason
        {
            MissingSessionCookie,
            InvalidSession,
            InvalidUser,
            MissingLocalHostTokenCookie
        }

        private bool redirectToLogin = false;
        public void SecureBegin(object sender, EventArgs e)
        {
            HttpApplication application = (HttpApplication)sender;
            HttpRequest request = application.Request;

            // The SecurePath checks to make sure this is a path and/or file that we need to secure, otherwise skips..
            if (!SecurePath(request)) return;

            string eamUser = "";
            bool isEAM = false;
            bool isAzure = BIACore.Settings.Security.AzureApp;


            //Microsoft.Owin.IOwinContext temp = HttpContext.Current.GetOwinContext();

            //TODO


            if (isAzure)
            {
                if (!HttpContext.Current.Request.IsAuthenticated)
                {
                    // Guard: OWIN environment is not guaranteed to be present on all
                    // request types (static files, certain API routes, warm-up requests).
                    // Calling GetOwinContext() without this check throws
                    // "No owin.Environment item was found in the context."
                    var owinEnv = HttpContext.Current.Items["owin.Environment"];
                    if (owinEnv == null)
                    {
                        // OWIN not available for this request — cannot challenge.
                        // SecurePath already filtered static files; this handles
                        // edge cases (API warm-up, IIS internal requests).
                        LogFactory.Debug("SecureBegin: OWIN environment not present, skipping Azure challenge for {0}",
                            HttpContext.Current.Request.Path);
                        return;
                    }

                    try
                    {
                        HttpContext.Current.GetOwinContext().Authentication.Challenge(
                            new AuthenticationProperties { RedirectUri = request.Url.AbsolutePath },
                            OpenIdConnectAuthenticationDefaults.AuthenticationType);
                    }
                    catch (Exception zz)
                    {
                        LogFactory.Exception(zz);
                    }

                    return;
                }
                else
                {
                    string preferred_username = System.Security.Claims.ClaimsPrincipal.Current.FindFirst("preferred_username").Value;
                    request.Headers.Add("NW_USER", preferred_username.Split("@")[0]);

                    Model.UserBase User = BIACore.Internal.Request.UserAzure(preferred_username);

                    if (User != null)
                    {
                        isEAM = true;
                        eamUser = User.adId;
                    }
                    else
                    {
                        try { LoginRedirect(application, RedirectReason.InvalidUser); }
                        catch { throw; }
                    }
                }
            }

            DateTime start = DateTime.UtcNow;
            try
            {
                bool isLocalHost = HttpContext.Current.Request.Url.Host.ToLower() == "localhost";
                //if (BIACore.Settings.Security.AzureApp) isLocalHost = false;
                bool isIE = Regex.IsMatch(HttpContext.Current.Request.Browser.Browser, @"InternetExplorer"); //Needed any longer?
                bool lhTokenQPExists = !string.IsNullOrWhiteSpace(request.QueryString[API.LOCALHOST_TOKEN_QP]);
                bool exporterCookieQPExists = !string.IsNullOrWhiteSpace(request.QueryString[API.EXPORTER_COOKIE]);
                bool requestHasExporterProfile = (string.IsNullOrWhiteSpace(request.UserAgent) || request.Headers["X-Requested-With"] == "XMLHttpRequest");
                //if (!string.IsNullOrWhiteSpace(HttpContext.Current.Request.Headers[API.EAM_HEADER])) eamUser = HttpContext.Current.Request.Headers[API.EAM_HEADER]; //API.EAM_HEADER = AD ID (ex. 'adm1mme')
                isEAM = !string.IsNullOrWhiteSpace(eamUser);

                //Used for the BIA Application App (aka BIA Reports Page)
                bool anonymous = Settings.Security.Anonymous || Settings.Security.Anonymous_Uri.List.Any(x => request.Path.ToLower().Contains(x.ToLower()));

                //Removed check for sessionId in url and set to cookie. 
                //Expecting apps to be in domain with Login.aspx so cookie is set there and not needed to be set here or passed in url EXCEPT LocalHost

                //if session cookie is in query params it must be localhost
                if (lhTokenQPExists && isLocalHost)
                {
                    var currentCookieValue = request.Cookies[API.LOCALHOST_TOKEN_COOKIE] != null ? request.Cookies[API.LOCALHOST_TOKEN_COOKIE].Value : "null";
                    HttpCookie c = new HttpCookie(API.LOCALHOST_TOKEN_COOKIE, request.QueryString[API.LOCALHOST_TOKEN_QP])
                    { HttpOnly = false, Secure = false, Expires = DateTime.Now.AddHours(8) };//SecureCookieSetting
                    //if (isLocalHost && !isIE) c.Domain = "localhost";
                    request.Cookies.Set(c);
                    HttpContext.Current.Response.SetCookie(c);
                    BIACore.Log.LogFactory.Message("SecureBegin CreateLocalHostTokenCookieFromURLQueryString{0}url = {1}{0}host = {3}{0}old token = {2}",
                        new object[] {
                            Environment.NewLine,
                            HttpContext.Current.Request.RawUrl,
                            currentCookieValue,
                            HttpContext.Current.Request.Url.Host
                        });
                }

                //if exporter cookie is in query params it must be ajax call
                if (exporterCookieQPExists && requestHasExporterProfile)
                {
                    var currentCookieValue = request.Cookies[API.EXPORTER_COOKIE] != null ? request.Cookies[API.EXPORTER_COOKIE].Value : "null";
                    HttpCookie c = new HttpCookie(API.SESSION_COOKIE, HttpUtility.UrlDecode(request.QueryString[API.EXPORTER_COOKIE]))
                    { HttpOnly = true, Secure = request.IsSecureConnection && Settings.Config.BIAEnvironment != "MIR", Expires = DateTime.Now.AddHours(12), SameSite=SameSiteMode.Lax };//SecureCookieSetting
                    if (isLocalHost && !isIE) c.Domain = "localhost";
                    request.Cookies.Set(c);
                    HttpContext.Current.Response.SetCookie(c);
                    BIACore.Log.LogFactory.Message("SecureBegin CreateSessionCookieFromURLQueryString{0}url = {1}{0}host = {3}{0}old session = {2}",
                        new object[] {
                            Environment.NewLine,
                            HttpContext.Current.Request.RawUrl,
                            currentCookieValue,
                            HttpContext.Current.Request.Url.Host
                        });
                }

                bool sessionCookieIsNullOrEmpty = (request.Cookies[API.SESSION_COOKIE] == null || string.IsNullOrWhiteSpace(request.Cookies[API.SESSION_COOKIE].Value));
                bool lhTokenCookieIsNullOrEmpty = (request.Cookies[API.LOCALHOST_TOKEN_COOKIE] == null || string.IsNullOrWhiteSpace(request.Cookies[API.LOCALHOST_TOKEN_COOKIE].Value));

                //"Real Beginning" Secure Begin
                //if the cookie doesn't exist or if the cookie value is empty
                if ((sessionCookieIsNullOrEmpty ||
                        !Security.Session.isValid ||
                        (isEAM && !string.Equals(eamUser, BIACore.Security.Session.authenticated_ad_id, StringComparison.InvariantCultureIgnoreCase))
                    ) && !isLocalHost)
                {
                    // Create the session
                    if (isEAM)
                    {
                        Dictionary<string, object> sessionParams = new Dictionary<string, object>()
                            {
                               { "UserId", eamUser },
                                { "AppCode", Settings.Config.AppCode },
                                { "Source", "Azure" },
                                { "Anonymous", anonymous }
                            };

                        // Start Session
                        dynamic sessionResult = Internal.Request.SessionSecureStart(sessionParams);

                        //LogFactory.Error("BIACore Session Start: " + sessionResult.Sysm.Value);

                        // Get SessionId from sessionResult.Token
                        HttpContext.Current.Response.SetCookie(new HttpCookie(API.SESSION_COOKIE, sessionResult.SessionId.Value)
                        {
                            HttpOnly = true,
                            Secure = true,
                            SameSite = SameSiteMode.Lax,
                            Domain = BIACore.Settings.Config.Server,
                            Expires = DateTime.Now.AddHours(12)
                        });

                        //Creates/Updates the BIACID Cookie 
                        if (request.Path.EndsWith(".aspx", StringComparison.InvariantCultureIgnoreCase)
                            || (request.AppRelativeCurrentExecutionFilePath == "~/" && request.CurrentExecutionFilePathExtension == ""))
                        {
                            HttpCookie secHashCookie = request.Cookies[API.SECHASH_COOKIE];
                            if (secHashCookie == null && !String.IsNullOrWhiteSpace(sessionResult.SechashId.Value))
                            {
                                HttpContext.Current.Response.SetCookie(new HttpCookie(API.SECHASH_COOKIE, sessionResult.SechashId.Value)
                                {
                                    HttpOnly = true,
                                    Secure = true,
                                    SameSite = SameSiteMode.Lax,
                                    Domain = BIACore.Settings.Config.Server,
                                    Expires = DateTime.Now.AddHours(84)
                                });

                                Dictionary<string, object> sessionClientParams = new Dictionary<string, object>()
                                {
                                    { "SecHashId", sessionResult.SechashId.ToString() },
                                    { "UserId", BIACore.Security.Session.userId != null ? BIACore.Security.Session.userId : eamUser }, //this logic was added to support new users without a BIA Profile M.Erdmann 2/26/2020
                                    { "IpAddress", HttpContext.Current.Request.UserHostAddress }
                                };

                                System.Threading.Tasks.Task.Factory.StartNew((l) =>
                                {
                                    Internal.Request.SessionClientUpdate((Dictionary<string, object>)l);
                                }, sessionClientParams);
                            }
                        }

                        if (!anonymous && !APRSIsValid(eamUser, Settings.Config.AppCode))
                            APRSRedirect();

                        if (sessionResult.Success.Value)
                        {
                            HttpContext.Current.Response.Redirect(HttpContext.Current.Request.Url.ToString(), true);
                        }
                        else
                        {
                            BIACore.Log.LogFactory.Message("SecureBegin LoginRedirect due to Invalid Session");
                            try { LoginRedirect(application, RedirectReason.InvalidSession); } catch { throw; }
                        }
                    }
                    else if (!anonymous)
                    {
                        BIACore.Log.LogFactory.Message("SecureBegin LoginRedirect due to Missing Session Cookie");
                        try { LoginRedirect(application, RedirectReason.MissingSessionCookie); } catch { throw; }
                    }
                }
                else //Localhost Section
                {

                    //if the cookie doesn't exist or if the cookie value is empty
                    if (lhTokenCookieIsNullOrEmpty && isLocalHost && !Security.Session.isValid)
                    {
                        BIACore.Log.LogFactory.Message("SecureBegin LoginRedirect due to Missing LocalHost Token Cookie - LocalHost");
                        try { LoginRedirect(application, RedirectReason.MissingLocalHostTokenCookie); } catch { throw; }
                    }

                    //Decode session cookie value.  Fix for converting old cold fusion set-cookie value being URL Encoded
                    //if(request.Cookies[API.SESSION_COOKIE] != null && request.Cookies[API.SESSION_COOKIE].Value != null)
                    //    request.Cookies[API.SESSION_COOKIE].Value = HttpUtility.UrlDecode(request.Cookies[API.SESSION_COOKIE].Value);

                    if (!anonymous && !APRSIsValid(Security.Session.ad_id, Settings.Config.AppCode))
                        APRSRedirect();

                    // check that Session is valid.
                    if (!Security.Session.isValid)
                    {
                        BIACore.Log.LogFactory.Message("SecureBegin LoginRedirect due to Invalid Session - LocalHost");
                        try { LoginRedirect(application, RedirectReason.InvalidSession); } catch { throw; }
                    }

                    // IF EAM AD ID and Session is not valid, user does not exist in BIA, so redirect to New User Profile in
                    // BIA_UserMaint _OR_ eventually BIASecurity.

                    // check that User is valid.
                    // Adding new "Anonomous" config update to skip Security.User.IsValid if the app allows verified but anon users.
                    if (!anonymous && !Security.User.isValid)
                    {
                        BIACore.Log.LogFactory.Message("SecureBegin LoginRedirect due to Invalid User - LocalHost");
                        try { LoginRedirect(application, RedirectReason.InvalidUser); } catch { throw; }
                    }

                    if (lhTokenQPExists && !lhTokenCookieIsNullOrEmpty)
                    {
                        string url = HttpContext.Current.Request.RawUrl
                            .Replace((request.QueryString.Count == 1 ? "?" : "") + API.LOCALHOST_TOKEN_QP + "=" + HttpUtility.UrlEncode(request.QueryString[API.LOCALHOST_TOKEN_QP]), "")
                            .Replace("?&", "?").Replace("&&", "&").Replace("https", "http");  //Not sure if this is needed https to http, added as test.  M.Erdmann
                        HttpContext.Current.Response.Redirect(url, true);
                    }
                }
            }
            finally
            {
                LogFactory.Performance("Secured", DateTime.UtcNow.Subtract(start).TotalSeconds);

                if (!string.IsNullOrWhiteSpace(HttpContext.Current.Response.RedirectLocation)) HttpContext.Current.Response.End();
                else
                {
                    HttpCookie sessionCookie = request.Cookies[API.SESSION_COOKIE];

                    HttpCookie tokenCookie = request.Cookies[API.LOCALHOST_TOKEN_COOKIE];
                    if (tokenCookie != null)
                    {
                        tokenCookie.Expires = DateTime.Now.AddHours(4);
                        //sessionCookie.HttpOnly = true;
                        //sessionCookie.Secure = true; //SecureCookieSetting
                        //tokenCookie.Domain = "localhost";  // Test for subdomain
                        HttpContext.Current.Response.SetCookie(tokenCookie);
                    }
                    //if (request.Path.EndsWith(".aspx", StringComparison.InvariantCultureIgnoreCase)
                    //|| (request.AppRelativeCurrentExecutionFilePath == "~/" && request.CurrentExecutionFilePathExtension == ""))
                    //{
                    //    HttpCookie secHashCookie = request.Cookies[API.SECHASH_COOKIE];
                    //    if (secHashCookie != null && sessionCookie != null)
                    //    {
                    //        secHashCookie.Expires = DateTime.Now.AddHours(84);
                    //        secHashCookie.HttpOnly = true;
                    //        secHashCookie.SameSite = SameSiteMode.Lax; //What InfoSec really wants is SameSiteMode.Strict
                    //        secHashCookie.Secure = true; //SecureCookieSetting
                    //        sessionCookie.Domain = Settings.Config.Server;  // Test for subdomain
                    //        sessionCookie.Value = secHashCookie.Value;
                    //        HttpContext.Current.Response.SetCookie(secHashCookie);

                    //        Dictionary<string, object> sessionClientParams = new Dictionary<string, object>()
                    //        {
                    //            { "SecHashId", secHashCookie.Value.ToString() },
                    //            { "UserId", BIACore.Security.Session.userId },
                    //            { "IpAddress", HttpContext.Current.Request.UserHostAddress }
                    //        };

                    //        System.Threading.Tasks.Task.Factory.StartNew((l) =>
                    //        {
                    //            Internal.Request.SessionClientUpdate((Dictionary<string, object>)l);
                    //        }, sessionClientParams);
                    //    }

                    //    //TODO: need to hard-refresh/set the Session cookie to prevent tampering. M.Erdmann
                    //}
                }
            }
        }

        public static bool APRSIsValid(string userId, string appCode)
        {
            APRSRoles aprsRoles = Internal.Request.APRSRoles(userId, appCode);
            //if the app should not check roles, allow through
            //if it should check for roles, then make sure user has at least 1
            return !aprsRoles.isSecured || aprsRoles.roles.Count > 0;
        }

        public static void APRSRedirect()
        {
            // redirect to aprs instructions
            BIACore.Log.LogFactory.Message("SecureBegin redirect due to APRS roles");
            HttpContext.Current.Response.Redirect(string.Format("https://{0}{1}/RequestAccess.aspx?AppCode={2}",
                Settings.Config.Server,
                Settings.Config.BaseURL,
                Settings.Config.AppCode
            ), true);
        }

        public static void LoginRedirect(HttpApplication application, RedirectReason reason)
        {
            string userId = "";
            string reasonString;
            try
            {
                reasonString = reason.ToString();
            }
            catch (Exception e) { throw new Exception("Line 234", e); }
            try
            {
                if ((new string[] { RedirectReason.MissingSessionCookie.ToString(), RedirectReason.MissingLocalHostTokenCookie.ToString() }).IndexOf(s => s == reason.ToString()) == 0
                    && Security.Session.isValid)
                {
                    try
                    {
                        userId = Security.Session.userId;
                    }
                    catch (Exception e) { throw new Exception("Line 242", e); }
                    try
                    {
                        reasonString += "-" + Security.Session.Obj.detail;
                    }
                    catch (Exception e) { throw new Exception("Line 248", e); }
                }
            }
            catch (Exception e) { throw new Exception("Line 238", e); }

            try
            {
                BIACore.Activity.ActivityFactory.Log(
                    HttpContext.Current.Request,
                    Settings.Config.AppCode,
                    userId,
                    "LoginRedirect",
                    reasonString
                );
            }
            catch (Exception e) { throw new Exception("Line 254", e); }

            HttpRequest request = application.Request;
            HttpResponse response = application.Response;
            bool isAjax = Web.CurrentContext.RequestIsAjax();

            if (isAjax)
            {
                response.Clear();
                response.ClearContent();
                response.ClearHeaders();
                response.ContentType = "application/json";
                response.StatusCode = 403;
                response.Write(JsonConvert.SerializeObject(new { BIACode = (new BIACore.Internal.SessionNotAuthorizedException()).GetBIAErrorCode() }));
                response.End();
            }
            else
            {
                JavaScriptSerializer jss = new JavaScriptSerializer() { MaxJsonLength = 2147483647 };

                bool isLocal = false;

                // remove any instance of BIA_SESSION from the current query string
                NameValueCollection query = HttpUtility.ParseQueryString(request.Url.Query);
                if (query.Get(API.LOCALHOST_TOKEN_QP) != null) { isLocal = true; }

                query.Remove(API.SESSION_COOKIE);
                query.Remove(API.LOCALHOST_TOKEN_QP);
                string source = request.Url.GetLeftPart(UriPartial.Path);

                //if (request.IsLocal) source = source.Replace(request.Url.Host, Settings.Config.Localhost);
                if (!request.Url.Segments.Last().Contains(".") && !source.EndsWith("/")) source += "/"; // target is probably a directory, go ahead and make it one.

                if (request.QueryString.Count > 0)
                {
                    source = string.Format("{0}?{1}", source,
                        string.Join("&", query.AllKeys.Select(key => string.Format("{0}={1}", HttpUtility.UrlEncode(key), HttpUtility.UrlEncode(query[key]))))
                    );
                }

                object rt = null;

                //// This logic needs comments, what is LoginAltAppCode?! M.Erdmann 5/30/2019
                //if (!String.IsNullOrWhiteSpace(BIACore.Settings.Security.LoginAltAppCode))
                //{
                //    string loginAltAppcode = BIACore.Settings.Security.LoginAltAppCode;
                //    if (BIACore.Settings.Security.LoginAltAppCode.IndexOf("query:") == 0)
                //    {
                //        loginAltAppcode = request.QueryString[BIACore.Settings.Security.LoginAltAppCode.Replace("query:", "")];
                //    }
                //    else if (BIACore.Settings.Security.LoginAltAppCode.IndexOf("form:") == 0)
                //    {
                //        loginAltAppcode = request.Form[BIACore.Settings.Security.LoginAltAppCode.Replace("form:", "")];
                //    }

                //    if (!String.IsNullOrWhiteSpace(loginAltAppcode))
                //        rt = new { AppCode = Settings.Config.AppCode, ReturnURI = source, AltAppCode = loginAltAppcode };
                //}

                if (rt == null) rt = new { AppCode = Settings.Config.AppCode, ReturnURI = source };

                FingerprintValue rc = BIACore.Utility.Fingerprint.GetFingerprintByValue(jss.Serialize(rt));

                try
                {

                    if (!request.Path.Contains("NewUser.aspx"))
                    {
                        if ((reason == RedirectReason.InvalidUser ))  //|| reason == RedirectReason.InvalidSession
                        {
                            response.Redirect(string.Format("{0}{1}",
                                "https://biasecurity." + Settings.Config.Server,
                                "/NewUser.aspx"
                            ), true);
                        }
                        else
                        {
                            if (isLocal || request.IsLocal || reason == RedirectReason.InvalidSession)
                            {
                                response.Redirect(string.Format("{0}{1}?rt={2}",
                                    //(request.IsLocal) ? "https://" + Settings.Config.Server : "",
                                    "https://" + Settings.Config.Server,
                                    Settings.Security.LoginUri,
                                    HttpUtility.UrlEncode(rc.FingerprintId)
                                ), true);
                            }
                            else { 
                                throw new ArgumentException(string.Format("Authentication Failed - {0}", Enum.GetName(typeof(RedirectReason), reason)));
                            }
                        }
                    }
                }
                catch (ThreadAbortException taex)
                {
                    //throw new Exception(string.Format("{0}{1}",
                    //(request.IsLocal) ? "https://" + Settings.Config.Server : "",
                    //Settings.Security.LoginUri), taex);
                    //Do nothing here, error silently..
                }
                catch (Exception ex)
                {
                    throw new Exception(string.Format("Line 313 - "), ex);

                    LogFactory.Exception(ex);
                    //response.Redirect(string.Format("{0}?code={1}",BIACoreModule.GetErrorURL(),ex.GetBIAErrorCode()));
                }
            }
        }

        public void SecureEnd(object sender, EventArgs e)
        {
            // clear the session/user object out of the HttpContext.Cache post-request.
            // this should fix any bleed-over when using the same HttpContext and switching user identities...
            Security.Session.Obj = null;
            Security.User.Obj = null;
        }

        private static bool SecurePath(HttpRequest request)
        {
            if (null == request) return false;
            string path = request.Path.ToLower();

            foreach (string test in Settings.Security.GlobalExclusionList)
            {
                if (path.EndsWith(test)) return false;
            }

            //TODO: exclude api calls, why is this excluded from security!? MME
            if (path.Contains("api/application/azure")) return false;

            if (path.Contains("api/biacore/")) return false;

            if (path.Contains("api/utility/")) return false;

            // check request against:
            // exclusion
            bool exclude = (Settings.Security.Exclude.List.Length > 0);
            if (exclude)
            {
                foreach (string value in Settings.Security.Exclude.List)
                {
                    // if path is in the exlusion list, don't secure it.
                    if (path.Contains(value.ToLower())) return false;
                }
            }
            // inclusion
            bool include = (Settings.Security.Include.List.Length > 0);
            if (include)
            {
                foreach (string value in Settings.Security.Include.List)
                {
                    // if path is in the inclusion list, do secure it.
                    if (path.Contains(value.ToLower())) return true;
                }
            }

            // path wasn't in exclusion or inclusion lists.
            // if exclusion is empty and inclusion isn't empty, return false
            // if exclusion isn't empty and inclusion is empty, return true
            // if exclusion is empty and inclusion is empty, return true(?)
            // if exclusion isn't empty and inclusion isn't empty, return true(?)

            // basically i'm taking the approach that if the security module is engaged,
            // it's default action is to secure everything.

            return exclude || !include;
        }
    }
}
