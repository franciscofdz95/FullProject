using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;

using System.Data;
using System.Data.SqlClient;

using BIACore.Model;
using BIACore.Server;
using BIACore.Utility;
using BIACore.Extensions;
using DocumentFormat.OpenXml.Drawing;
using System.Web.Script.Serialization;
using BIACore.Server.Controller;
using System.Dynamic;
using System.Reflection;
using BIACore.Server.Model;
using System.Net.Configuration;
using System.Text;
using System.Text.RegularExpressions;
using System.Security.Policy;
using System.CodeDom;

namespace BIACore.Website
{
    public partial class Login : System.Web.UI.Page
    {
#if LocalTest
        private string DEFAULT_REDIRECT_URI = "/Loop.aspx";
#else
        private string DEFAULT_REDIRECT_URI = string.Format("https://{0}/home", BIACore.Settings.Config.Server);
#endif
        private string DEFAULT_APPCODE = "BIASecurity";
        private const string URI_REDIRECT_SYSM_QP = "sysm";
        private const string URI_REDIRECT_APP_QP = "AppName";
        public const string EAM_HEADER = "SM_USER";

        private string redirectTokenKey = "rt";
        private bool isMIR = false;
        private string redirectUrl;
        private string appCode;
        private string appCodeAlt;
        private bool isLocalHost = false;
        private string sessionId;
        private dynamic authResult;
        private LoginController LoginController = new LoginController();
        private string AuthPostbackEventKey;
        private int AuthPostbackEventIncrementor = -1;

        private void AsyncPostBackError(object sender, AsyncPostBackErrorEventArgs e)
        {
            LogFactory.Exception(e.Exception);
            ScriptManager1.AsyncPostBackErrorMessage = string.Format("Code ({0})",e.Exception.GetBIAErrorCode());
        }

        protected void Page_Load(object sender, EventArgs e)
        {
            //isMIR = Environment.MachineName.ToUpper() == "SVRP000346ED" && HttpContext.Current.Request.Url.Host.ToLower().IndexOf("biamirror") > -1;

            if (ViewState["AuthPostbackEventKey"] != null) AuthPostbackEventKey = ViewState["AuthPostbackEventKey"].ToString();
            if (ViewState["AuthPostbackEventIncrementor"] != null) AuthPostbackEventIncrementor = (int)ViewState["AuthPostbackEventIncrementor"];

            ScriptManager1.AsyncPostBackError += new EventHandler<AsyncPostBackErrorEventArgs>(AsyncPostBackError);

            if (!IsPostBack) PageInitLoad();
            else if (IsPostBack) PagePostBack();

            ViewState["AuthPostbackEventKey"] = AuthPostbackEventKey;
            ViewState["AuthPostbackEventIncrementor"] = AuthPostbackEventIncrementor;
            if (!IsPostBack && 1 == 2)
            {
                Response.Cookies.Add(new HttpCookie(API.SESSION_COOKIE, string.Empty) { Expires = DateTime.Now.AddDays(-1), Domain = string.Empty });
                Response.Cookies.Add(new HttpCookie(API.SESSION_COOKIE, string.Empty) { Expires = DateTime.Now.AddDays(-1), Domain = "." + Settings.Config.Server });
                Response.Cookies.Add(new HttpCookie(API.SESSION_COOKIE, string.Empty) { Expires = DateTime.Now.AddDays(-1), Domain = Settings.Config.Server });
                Response.Cookies.Add(new HttpCookie(API.LOCALHOST_TOKEN_COOKIE, string.Empty) { Expires = DateTime.Now.AddDays(-1), Domain = string.Empty });
            }

        }

        private void PageInitLoad()
        {
            AuthPostbackEventKey = DateTime.Now.ToString("yyyyyMMdd_HHmmssfffff");

            try
            {
                //if (Properties.Settings.Default.ExternalSecurity && Request.QueryString.Get("Debug") != "true")
                //{
                //    // redirect them to an external security system
                //    // This way we have BIACore.dll always point here,
                //    // and use this to determine where to actually 
                //    // send the security request to.
                //    Response.Redirect(string.Format("{0}{1}{2}{3}{4}",
                //        Uri.UriSchemeHttp,
                //        Uri.SchemeDelimiter,
                //        Request.Url.Authority,
                //        Properties.Settings.Default.ExternalSecurityLogin,
                //        Request.Url.Query
                //        ));
                //}

                // ensure we're running as a secured site. Not really required as the servers are set to enforce SSL now.. M.Erdmann 2/9/2022
                if (!Request.IsSecureConnection
                    && !Request.IsLocal // only used for login page testing
                                        //Allowing BIAMirror to be on unsecured always
                    )
                {
                    Response.Redirect(string.Format("{0}{1}{2}{3}",
                        Uri.UriSchemeHttps,
                        Uri.SchemeDelimiter,
                        Request.Url.Authority,
                        Request.Url.PathAndQuery
                        ));
                }

                //temp fix for MIR not having HTTPS certificate - SGH 7/5/2018
                /*if (Request.IsSecureConnection && isMIR)
                {
                    Response.Redirect(string.Format("{0}{1}{2}{3}",
                        Uri.UriSchemeHttp,
                        Uri.SchemeDelimiter,
                        Request.Url.Authority,
                        Request.Url.PathAndQuery
                        ));
                }*/

                GetRTValue();

                GetLoginSessionAppInfo();

                CheckAPRSRoles();

                if (redirectUrl.IndexOf("localhost") < 0)
                {
                    //if not login from localhost, hide the login page elements
                    loginWindow.Visible = false;
                }

                if (fld_sstatus.Value == "-2")
                {
                    fld_NewUser.Value = "1";
                }

                if (fld_sstatus.Value == "1" && fld_apponline.Value == "1")
                {
                    if (redirectUrl.IndexOf("localhost") > -1
                        && (redirectUrl.IndexOf("?" + API.LOCALHOST_TOKEN_QP) == -1 || redirectUrl.IndexOf("&" + API.LOCALHOST_TOKEN_QP) == -1)
                        && Request.Cookies[API.SESSION_COOKIE] != null && Request.Cookies[API.SESSION_COOKIE].Value != null)
                    {
                        string sessionToken = BIACore.Server.Token.GetToken(Request.Cookies[API.SESSION_COOKIE].Value.Reverse());

                        redirectUrl += (redirectUrl.IndexOf("?") > 4 ? "&" : "?") + API.LOCALHOST_TOKEN_QP + "=" + HttpUtility.UrlEncode(sessionToken);
                    }

                    if (fld_includeRedirectInfo.Value == "1")
                    {
                        redirectUrl += (redirectUrl.IndexOf("?") > 4 ? "&" : "?") + URI_REDIRECT_SYSM_QP + "=" + fld_User.Value + "&" + URI_REDIRECT_APP_QP + "=" + fld_appcode.Value;
                    }

                    //if (BIACore.Settings.Config.BIAEnvironment == "MIR") redirectUrl = redirectUrl.Replace("https://", "http://");

                    Response.Redirect(redirectUrl);
                }
                
                if (ConsiderBroken())
                {
                    AuthEvent.Log(Auth.Broken, "Login loop detected, redirecting to Loop.aspx");
                    Response.Redirect("Loop.aspx");
                }

                BuildClientAuthPostbackEvent();

                /*
                if (Request.Cookies[API.SESSION_COOKIE] != null && Request.Cookies[API.SESSION_COOKIE].Value != null)
                {
                    BIACore.Server.Cache.ClearSessionCache();

                    HttpContext.Current.Response.SetCookie(new HttpCookie(API.SESSION_COOKIE, null)
                    {
                        HttpOnly = true,
                        Domain = BIACore.Settings.Config.Server,
                        Expires = DateTime.Now.AddHours(-1)
                    }
                    );
                }
                */

                /*
                 MessageType = Status, Info, Attention, Warning, Critical
                 */
                //List<BIAMessage> BIAMessages = LoginController.BIAMessages(null);
                //foreach (BIAMessage msg in BIAMessages)
                //{
                //    if (msg.MessageTypeString == "Status") msg.MessageDateDisplay = DateTime.Now.ToString("MM/dd/yyyy");
                //}
                //rpt_BIAMessages.DataSource = BIAMessages;
                //rpt_BIAMessages.DataBind();
            }
            catch (System.Threading.ThreadAbortException ex) { }
            catch (Exception ex)
            {
                LogFactory.Exception(ex);
            }
        }

        private void PagePostBack()
        {
            if (!string.IsNullOrWhiteSpace(ViewState["AuthPostbackEventArg"].ToString()) &&
                BIACore.Server.Token.GetToken(AuthPostbackEventKey + AuthPostbackEventIncrementor.ToString()) == ViewState["AuthPostbackEventArg"].ToString())
                Authorize();
            else ResetAuthResponseFields();

            BuildClientAuthPostbackEvent();
        }

        private void Authorize()
        {
            GetRTValue();
            LoginAuthentication();

            if (BIACore.Utility.ObjectAccessors.CheckPropExists(authResult, "Token") && authResult.Token != null)
            {
                sessionId = GetTokenSessionValue();
                if (!String.IsNullOrWhiteSpace(sessionId))
                {
                    GetLoginSessionAppInfo(false);

                    HttpContext.Current.Response.SetCookie(new HttpCookie(API.SESSION_COOKIE, sessionId)
                    {
                        HttpOnly = true,
                        Secure = fld_usessl.Value == "1",
                        SameSite = SameSiteMode.Lax,
                        Domain = BIACore.Settings.Config.Server,
                        Expires = DateTime.Now.AddHours(12)
                    }
                    );

                }
            }

            if (BIACore.Utility.ObjectAccessors.CheckPropExists(authResult, "SecHash") && authResult.SecHash != null)
            {

                HttpContext.Current.Response.SetCookie(new HttpCookie(API.SECHASH_COOKIE, authResult.SecHash)
                {
                    HttpOnly = true,
                    Secure = fld_usessl.Value == "1",
                    SameSite = SameSiteMode.Lax,
                    Domain = BIACore.Settings.Config.Server,
                    Expires = DateTime.Now.AddHours(84)
                }
                );

            }

            if (BIACore.Utility.ObjectAccessors.CheckPropExists(authResult, "Success") && authResult.Success)
            {
                string uri = String.IsNullOrWhiteSpace(redirectUrl) ? fld_appRedirectURI.Value.Trim() : redirectUrl;

                if (uri.IndexOf("http") == 0 || uri.IndexOf("//") == 0)
                {
                    //Do nothing, this should be correct format
                }
                else if (uri.IndexOf("/") == 0)
                {
                    uri = String.Format("http://{0}{1}", BIACore.Settings.Config.Server, uri);
                }
                else
                {
                    uri = String.Format("http://{0}/bia/apps/{1}", BIACore.Settings.Config.Server, uri);
                }

                if (fld_islh.Value == "1" && (uri.IndexOf(".inside.ups.com") > -1 || uri.IndexOf(".inside.ams1907.com") > -1 || uri.IndexOf("localhost") > -1))
                {
                    string sessionToken = BIACore.Server.Token.GetToken(sessionId.Reverse());

                    uri += (uri.IndexOf("?") > 4 ? "&" : "?") + API.LOCALHOST_TOKEN_QP + "=" + HttpUtility.UrlEncode(sessionToken);// + "&" + API.LOCALHOST_TOKENREMOVE_QP + "=1";
                }

                if (uri.IndexOf("localhost") > -1)
                {
                    if (uri.IndexOf("https:") > -1) uri = uri.Replace("https://", "http://");
                }
                else if (fld_usessl.Value == "1")
                {
                    if (uri.IndexOf("http") < 0) uri = "https://" + uri;
                    else uri = uri.Replace("http://", "https://");
                }

                try
                {
                    Uri redirectUri = new Uri(uri);
                    string path = redirectUri.GetLeftPart(UriPartial.Path);
                    var query = HttpUtility.ParseQueryString(redirectUri.Query);
                    query.Remove(URI_REDIRECT_SYSM_QP);
                    query.Remove(URI_REDIRECT_APP_QP);

                    if (fld_includeRedirectInfo.Value == "1")
                    {
                        string sysm = fld_User.Value;
                        if (String.IsNullOrWhiteSpace(sysm))
                        {
                            sysm = fld_un.Value;
                            if (sysm.IndexOf("=") > -1) sysm = sysm.Split("=")[0];
                        }
                        query.Add(URI_REDIRECT_SYSM_QP, sysm);
                        query.Add(URI_REDIRECT_APP_QP, appCode);
                    }

                    uri = (query.Count > 0) ? string.Format("{0}?{1}", path, query) : path;
                }
                catch (Exception ex) { LogFactory.Exception(ex); }

                Response.Redirect(uri);
            }
                
            
        }

        private void GetRTValue()
        {
            JavaScriptSerializer jss = new JavaScriptSerializer() { MaxJsonLength = 2147483647 };
            if (Request.QueryString[redirectTokenKey] != null)
            {
                string rtValue = Request.QueryString[redirectTokenKey];
                if (rtValue.IndexOf("?") > -1) rtValue = rtValue.Substring(0,rtValue.IndexOf("?"));

                fld_rt.Value = rtValue + "-" + HttpUtility.UrlDecode(rtValue);
                int redirectTokenRetry = 0;
                FingerprintValue fingerprint = null;
                do
                {
                    redirectTokenRetry++;
                    fingerprint = BIACore.Utility.Fingerprint.GetFingerprintById(HttpUtility.UrlDecode(rtValue));
                }
                while (redirectTokenRetry <= 10 && fingerprint == null);
                                
                string redirectTokenString;
                dynamic redirectToken = null;
                if (fingerprint != null && fingerprint.Value != null)
                {
                    redirectTokenString = fingerprint.Value;
                    redirectToken = jss.Deserialize<dynamic>(redirectTokenString);

                    redirectUrl = BIACore.Utility.ObjectAccessors.CheckPropExists(redirectToken, "ReturnURI") ? redirectToken["ReturnURI"] : "";
                    appCode = BIACore.Utility.ObjectAccessors.CheckPropExists(redirectToken, "AppCode") ? redirectToken["AppCode"] : "";
                    appCodeAlt = BIACore.Utility.ObjectAccessors.CheckPropExists(redirectToken, "AltAppCode") ? redirectToken["AltAppCode"] : "";
                }
                else
                {
                    redirectUrl = DEFAULT_REDIRECT_URI;
                    appCode = DEFAULT_APPCODE;
                }

                fld_appcode.Value = appCode;
                if (!string.IsNullOrWhiteSpace(appCodeAlt)) fld_appcodealt.Value = appCodeAlt;
                if (redirectUrl.IndexOf("localhost:") > -1) isLocalHost = true;
            }
            else
            {
                string queryParams = "";
                FingerprintValue fingerprint = Fingerprint.GetFingerprintByValue(jss.Serialize(new { AppCode = DEFAULT_APPCODE, ReturnURI = DEFAULT_REDIRECT_URI }));
                if (fingerprint != null)
                {
                    queryParams = string.Format("?{0}={1}", redirectTokenKey, fingerprint.FingerprintId);
                }
                Response.Redirect(string.Format("https://{0}{1}/Login.aspx{2}", Settings.Config.Server, Settings.Config.BaseURL, queryParams));
            }

            redirectUrl = redirectUrl.ToLower().IndexOf("undefined") == 0 ? redirectUrl.Replace("undefined", "https://" + BIACore.Settings.Config.Server) : redirectUrl;
        }

        private void GetLoginSessionAppInfo(bool updateUser = true)
        {
            dynamic SessionAppInfo = LoginController.SessionAppInfo_Post(new { AppCode = new { Value = appCode } });

            //if (BIACore.Utility.ObjectAccessors.CheckPropExists(SessionAppInfo, "useSSL")) fld_usessl.Value = BIACore.Utility.ObjectAccessors.GetPropValueString(SessionAppInfo.useSSL);
            fld_usessl.Value = "1";
            if (BIACore.Utility.ObjectAccessors.CheckPropExists(SessionAppInfo, "status")) fld_sstatus.Value = BIACore.Utility.ObjectAccessors.GetPropValueString(SessionAppInfo.status);
            if (BIACore.Utility.ObjectAccessors.CheckPropExists(SessionAppInfo, "appOnline")) fld_apponline.Value = BIACore.Utility.ObjectAccessors.GetPropValueString(SessionAppInfo.appOnline);
            if (BIACore.Utility.ObjectAccessors.CheckPropExists(SessionAppInfo, "includeRedirectInfo")) fld_includeRedirectInfo.Value = BIACore.Utility.ObjectAccessors.GetPropValueString(SessionAppInfo.includeRedirectInfo);
            if (BIACore.Utility.ObjectAccessors.CheckPropExists(SessionAppInfo, "appRedirectURI")) fld_appRedirectURI.Value = BIACore.Utility.ObjectAccessors.GetPropValueString(SessionAppInfo.appRedirectURI);
            if (BIACore.Utility.ObjectAccessors.CheckPropExists(SessionAppInfo, "userId") && updateUser) fld_User.Value = BIACore.Utility.ObjectAccessors.GetPropValueString(SessionAppInfo.userId);
            if (BIACore.Utility.ObjectAccessors.CheckPropExists(SessionAppInfo, "AD_ID") && updateUser) fld_adid.Value = BIACore.Utility.ObjectAccessors.GetPropValueString(SessionAppInfo.AD_ID);


            fld_islh.Value = redirectUrl.IndexOf("localhost:") > -1 ? "1" : "0";
        }

        private string GetTokenSessionValue()
        {
            string TokenValue = null;
            dynamic TokenValueReturn = LoginController.TokenValue_Post(new { Token = authResult.Token, AppCode = appCode });

            if (BIACore.Utility.ObjectAccessors.CheckPropExists(TokenValueReturn, "SessionId")) TokenValue = BIACore.Utility.ObjectAccessors.GetPropValueString(TokenValueReturn.SessionId);

            return TokenValue;
        }

        private void LoginAuthentication()
        {
            AuthenticationController authCnt = new AuthenticationController();
            authResult = authCnt.Authenticate_Post(new { AppCode = new { Value = appCode }, User = new { Value = fld_un.Value }, Pass = new { Value = fld_ac.Value }, Source = new { Value = fld_source.Value }, isLocalHost = new { Value = isLocalHost } });

            ResetAuthResponseFields();
            /*
            Success [T/F],Lockout [T/F],Error [string],Timeout [int],Fail [T/F],Unknown [T/F],BadAccount [T/F],LoginAs [T/F],Token [AES256],LocalHostTOken [AES256],AppUrl [string],
            NoAccess [T/F],Pending [T/F],AppCode [string],User [string],FirstName [string],LastName [string],Offline [T/F],AppOfflineMsg [string],NewUser [T/F]

            Error, Lockout, Timeout, LoginAs, NoAccess, FirstName, LastName, User, Pending, Offline, AppOfflineMsg, NewUser
            */
            if (BIACore.Utility.ObjectAccessors.CheckPropExists(authResult, "Error")) fld_Error.Value = BIACore.Utility.ObjectAccessors.GetPropValueString(authResult.Error);
            if (BIACore.Utility.ObjectAccessors.CheckPropExists(authResult, "Lockout")) fld_Lockout.Value = BIACore.Utility.ObjectAccessors.GetPropValueString(authResult.Lockout);
            if (BIACore.Utility.ObjectAccessors.CheckPropExists(authResult, "Timeout")) fld_Timeout.Value = BIACore.Utility.ObjectAccessors.GetPropValueString(authResult.Timeout);
            if (BIACore.Utility.ObjectAccessors.CheckPropExists(authResult, "LoginAs")) fld_LoginAs.Value = BIACore.Utility.ObjectAccessors.GetPropValueString(authResult.LoginAs);
            if (BIACore.Utility.ObjectAccessors.CheckPropExists(authResult, "NoAccess")) fld_NoAccess.Value = BIACore.Utility.ObjectAccessors.GetPropValueString(authResult.NoAccess);
            if (BIACore.Utility.ObjectAccessors.CheckPropExists(authResult, "FirstName")) fld_FirstName.Value = BIACore.Utility.ObjectAccessors.GetPropValueString(authResult.FirstName);
            if (BIACore.Utility.ObjectAccessors.CheckPropExists(authResult, "LastName")) fld_LastName.Value = BIACore.Utility.ObjectAccessors.GetPropValueString(authResult.LastName);
            if (BIACore.Utility.ObjectAccessors.CheckPropExists(authResult, "User")) fld_User.Value = BIACore.Utility.ObjectAccessors.GetPropValueString(authResult.User);
            if (BIACore.Utility.ObjectAccessors.CheckPropExists(authResult, "Pending")) fld_Pending.Value = BIACore.Utility.ObjectAccessors.GetPropValueString(authResult.Pending);
            if (BIACore.Utility.ObjectAccessors.CheckPropExists(authResult, "Offline")) fld_Offline.Value = BIACore.Utility.ObjectAccessors.GetPropValueString(authResult.Offline);
            if (BIACore.Utility.ObjectAccessors.CheckPropExists(authResult, "AppOfflineMsg")) fld_AppOfflineMsg.Value = BIACore.Utility.ObjectAccessors.GetPropValueString(authResult.AppOfflineMsg);
            if (BIACore.Utility.ObjectAccessors.CheckPropExists(authResult, "NewUser")) fld_NewUser.Value = BIACore.Utility.ObjectAccessors.GetPropValueString(authResult.NewUser);
        }

        private void BuildClientAuthPostbackEvent()
        {
            AuthPostbackEventIncrementor++;
            ViewState["AuthPostbackEventArg"] = BIACore.Server.Token.GetToken(AuthPostbackEventKey + AuthPostbackEventIncrementor.ToString());
            //lnk_FormSubmit.OnClientClick = "javascript:" + Page.ClientScript.GetPostBackEventReference(this, BIACore.Server.Token.GetToken(AuthPostbackEventKey + AuthPostbackEventIncrementor.ToString()));
        }

        private void ResetAuthResponseFields()
        {
            //fld_un.Value = "";
            //fld_ac.Value = "";
            fld_source.Value = "";
            fld_Error.Value = "";
            fld_Lockout.Value = "";
            fld_Timeout.Value = "";
            fld_LoginAs.Value = "";
            fld_NoAccess.Value = "";
            fld_FirstName.Value = "";
            fld_LastName.Value = "";
            fld_User.Value = "";
            fld_Pending.Value = "";
            fld_Offline.Value = "";
            fld_AppOfflineMsg.Value = "";
            fld_NewUser.Value = "";
            fld_adid.Value = "";
        }

        private bool ConsiderBroken()
        {
            HttpCookie cookie = HttpContext.Current.Request.Cookies[API.SESSION_COOKIE];
            HttpCookie token = HttpContext.Current.Request.Cookies[API.LOCALHOST_TOKEN_COOKIE];

            string sessionId = Web.CurrentContext.IsLocalHost()
                ? (token != null && token.Value != null ? BIACore.Server.Token.GetTokenValue(HttpUtility.UrlDecode(token.Value)) : null)
                : (null != cookie ? HttpUtility.UrlDecode(cookie.Value) : null);

            // we consider any rows to be a 'broken' state.
            int returnValue = (int)BIACore.Provider.SQL.ExecuteSQLRaw(Connections.Security, "secObject.LoginBroken", CommandType.StoredProcedure, true, new DBParameter[] {
                                    new DBParameter("@sessionId",DbType.AnsiString,sessionId),
                                    new DBParameter("@ip",DbType.AnsiString,HttpContext.Current.Request.UserHostAddress),
                                    new DBParameter("@env",DbType.AnsiString,Settings.Config.BIAEnvironment)
                                });
            if (returnValue >= 3)
            {
                LogFactory.Message("{0} @sessionId = {1}, @ip = {2}, @env = {3}", "secObject.LoginBroken", sessionId, HttpContext.Current.Request.UserHostAddress, Settings.Config.BIAEnvironment);
            }
            return (returnValue > 0);
        }

        protected void lnk_FormSubmit_Click(object sender, EventArgs e)
        {

        }

        private void CheckAPRSRoles()
        {
            if (!string.IsNullOrWhiteSpace(fld_adid.Value) && !string.IsNullOrWhiteSpace(fld_appcode.Value))
            {
                APRSRoles aprsRoles = Cached.APRSRoles(fld_adid.Value, fld_appcode.Value);
                if (aprsRoles.isSecured && aprsRoles.roles.Count == 0)
                {
                    // redirect to aprs instructions
                    HttpContext.Current.Response.Redirect(string.Format("https://{0}{1}/RequestAccess.aspx?AppCode={2}",
                        Settings.Config.Server,
                        Settings.Config.BaseURL,
                        appCode
                    ), true);
                }
            }
        }
    }
}