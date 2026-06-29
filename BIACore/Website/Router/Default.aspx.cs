using System;
using System.Collections.Generic;
using System.Data;
using System.Diagnostics;
using System.IO;
using System.Linq;
using System.Reflection;
using System.Security.Cryptography;
using System.Security.Cryptography.X509Certificates;
using System.Text;
using System.Threading;
using System.Web;
using System.Web.Script.Serialization;
using System.Web.UI;
using System.Web.UI.WebControls;
using BIACore.Extensions;
using BIACore.Log;
using BIACore.Model;
using BIACore.Provider;
using BIACore.Server;
using BIACore.Server.Controller;
using BIACore.Server.Model;
using BIACore.Utility;

namespace BIACore.Website.Router
{
    //class AuthResult
    //{
    //    /*
    //     Success (bool)
    //     LoginAs (int)
    //     Error (string)
    //     Token (string)
    //     LocalHostToken (string)
    //     AppUrl (string)
    //     User (string) [sysm]
    //     NoAccess (int)
    //     Pending (int)
    //     FirstName (string)
    //     LastName (string)
    //     Offline (int)
    //     AppOfflineMsg (string)
    //     NewUser (int)
    //     Unknown (int)
    //     * */
    //    bool Success { get; set; }
    //    int? LoginAs { get; set; }
    //    string Error { get; set; }
    //    string Token { get; set; }
    //    string LocalHostToken { get; set; }
    //    string AppUrl { get; set; }
    //    string User { get; set; }
    //    int? NoAccess { get; set; }
    //    int? Pending { get; set; }
    //    string FirstName { get; set; }
    //    string LastName { get; set; }
    //    int? Offline { get; set; }
    //    string AppOfflineMsg { get; set; }
    //    int? NewUser { get; set; }
    //    int? Unknown { get; set; }

    //}

    public partial class Default : System.Web.UI.Page
    {
        private string contextSignedEncodedJSONFromRequest = "";
        private string contextEncodedJSONFromRequest = "";
        private string sha256SignedEncodedContextEncodedJSONFromRequest = "";
        private string contextDecodedJSONFromRequest = "";
        private string displayDecodedJSONFromRequest = "";
        private string newLineDisplay = "</br></br>";
        private dynamic contextJSONObject;
        private string userId = "";
        private string loginPageRedirect = BIACore.Settings.Config.Server + Settings.Config.BaseURL + "Login.aspx";
        private string redirectURL = "";
        private const string SESSION_COOKIE = API.SESSION_COOKIE;
        private string sessionId = null;
        private const string ERROR_BASE_MSG = "The site you are using to link to a BIA Application is not configured properly. The following required parameter was not found: {PARAMETER}.";

        protected void Page_Load(object sender, EventArgs e)
        {
            /*
            1. MUST BE HTTPS
            2. Takes Post data to object
                HttpContext.Current.Request.Form["SignedRequest"] = '[Base-64 Encoded Certificate Signature].[Base-64 Encoded JSON Context object string]

                - Split on '.'
                - Confirm Certificate matches one supplied
                - IF MATCHES 
                    * Base-64 Decode array index 1 for JSON object string 
                        {
                            Target-URL,
                            UPS-ADID,
                            Application-Code,
                            URL-Scope [JSON object to build URL Query String]
                        }
                    * Create user session calling AuthenticationController.StartSession(username, null, appCode,null) 
                    * Build Url Query String from JSON Object [FUTURE: redirect to application path]
                    * Build Redirect URL
                - IF NOT MATCHES = Display message

            3. IF Test in url query params, pause page and display info.  Listen for any key press and when fired, open redirect in new window
            */
            if (!IsPostBack)
            {
                try
                {
                    string hmacRequest = null;

                    if (HttpContext.Current.Request.RequestType == "POST")
                        hmacRequest = HttpContext.Current.Request.Form["SignedRequest"];
                    else if (HttpContext.Current.Request.RequestType == "GET")
                        hmacRequest = HttpContext.Current.Request.QueryString["SignedRequest"];

                    try
                    {
                        contextSignedEncodedJSONFromRequest = hmacRequest.Split(new char[] { '.' })[0];
                        //var routerKey = Base64ToString(Properties.Settings.Default.RouterKey);
                    }
                    catch (Exception ex)
                    {
                        throw new Exception("SignedRequest", ex);
                    }
                    contextEncodedJSONFromRequest = hmacRequest.Split(new char[] { '.' })[1];
                    //sha256SignedEncodedContextEncodedJSONFromRequest = StringToSHA256String(contextEncodedJSONFromRequest, routerKey);

                    //Decode Context and convert to dynamic object
                    contextDecodedJSONFromRequest = Base64ToString(contextEncodedJSONFromRequest);

                    if (Request.Cookies.Get(SESSION_COOKIE) != null) sessionId = Request.Cookies.Get(SESSION_COOKIE).Value.ToString();

                    if (ValidateRequest() == false)
                    {
                        BIASecurityErrorText.InnerHtml = "The request was not validated.";
                        BIASecurityErrorContainer.Visible = true;
                        if(Settings.Log.Router) Log.LogFactory.Message("Salesforce Router Invalid Request. Decoded Request: " + contextDecodedJSONFromRequest);
                    }
                    else
                    {
                        if (Settings.Log.Router) Log.LogFactory.Message("Salesforce Router Decoded Request: " + contextDecodedJSONFromRequest);

                        var jss = new JavaScriptSerializer();

                        if (contextDecodedJSONFromRequest.IndexOf('{') == 0)
                        {
                            contextJSONObject = jss.Deserialize<dynamic>(contextDecodedJSONFromRequest);
                        }

                        //Get info from context to create session
                        string appCode = contextJSONObject["Application-Code"];
                        string url = "";
                        string adid = "";
                        try
                        {
                            url = contextJSONObject["Target-URL"];
                        }
                        catch (Exception ex)
                        {
                            throw new Exception("Target-URL", ex);
                        }
                        try
                        {
                            adid = contextJSONObject["UPS-ADID"];
                        }
                        catch (Exception ex)
                        {
                            throw new Exception("UPS-ADID", ex);
                        }

                        //TODO: add checks that url and adid are not null,empty string, or 'null'

                        if (Request.IsSecureConnection && url.IndexOf("https:") != 0) url = url.Replace("http:", "https:");

                        //Initiate Session
                        AuthResult session = null;
                        bool newSession = true;

                        if (SessionIsValid(appCode))
                        {
                            if (SessionUserMatch(adid, appCode))
                            {
                                session = jss.Deserialize<AuthResult>(
                                Newtonsoft.Json.JsonConvert.SerializeObject(
                                    new { Success = true, SessionId = sessionId },
                                    Newtonsoft.Json.Formatting.Indented
                                    )
                                );
                                newSession = false;
                            }
                        }

                        if (newSession)
                        {
                            if (Settings.Log.Router) Log.LogFactory.Message(string.Format("Salesforce Router StartSession Input:{0}ADID = {1}{0}AppCode = {2}", Environment.NewLine,adid,appCode));
                            //Initiate New Session
                            session = jss.Deserialize<AuthResult>(
                                Newtonsoft.Json.JsonConvert.SerializeObject(
                                    BIACore.Server.Controller.AuthenticationController.RemoteStartSession(adid, null, appCode, null),
                                    Newtonsoft.Json.Formatting.Indented
                                    )
                                );
                        }

                        if (Settings.Log.Router) Log.LogFactory.Message("Salesforce Router AuthResult: " + Environment.NewLine + jss.Serialize(session));

                        bool SessionSuccess = false;

                        try { SessionSuccess = session.Success; }
                        catch (Exception ex) { if (Settings.Log.Router) Log.LogFactory.Exception(new Exception("Error getting Success property of dynamic session object", ex)); }

                        if (SessionSuccess)
                        {

                            bool tokenExists = false;
                            bool sessionIdExists = false;

                            try { tokenExists = !string.IsNullOrWhiteSpace(session.Token); }
                            catch (Exception ex) {
                                if (Settings.Log.Router) Log.LogFactory.Exception(new Exception("Error getting Token property of dynamic session object. tokenExists", ex));
                            }

                            try { sessionIdExists = !string.IsNullOrWhiteSpace(session.SessionId); }
                            catch (Exception ex)
                            {
                                if (Settings.Log.Router) Log.LogFactory.Exception(new Exception("Error getting Token property of dynamic session object. tokenExists", ex));
                            }

                            if (tokenExists)
                            {
                                LoginController loginController = new LoginController();
                                dynamic TokenValueReturn = loginController.TokenValue_Post(new { Token = session.Token, AppCode = appCode });

                                if (BIACore.Utility.ObjectAccessors.CheckPropExists(TokenValueReturn, "SessionId"))
                                {
                                    sessionId = BIACore.Utility.ObjectAccessors.GetPropValueString(TokenValueReturn.SessionId);
                                }
                                else throw new Exception("TokenValue Missing SessionId");
                            }
                            else if (!tokenExists && !sessionIdExists)
                            {
                                throw new Exception("Session Missing Token");
                            }

                            //Get info from context to create URL query string
                            Dictionary<string, string> urlParams = jss.Deserialize<Dictionary<string, string>>(Newtonsoft.Json.JsonConvert.SerializeObject(contextJSONObject["URL-Scope"]));
                            string urlQueryString = "r_state=1";
                            foreach (var key in urlParams.Keys)
                            {
                                urlQueryString += (urlQueryString.Length > 0 ? "&" : "") + key + "=" + HttpUtility.UrlEncode(urlParams[key]);
                            }

                            //Get info from context to create form params
                            Dictionary<string, string> formParams = jss.Deserialize<Dictionary<string, string>>(Newtonsoft.Json.JsonConvert.SerializeObject(contextJSONObject["FORM-Scope"]));
                            LiteralControl dynamicFormFields = new LiteralControl();

                            foreach (string key in formParams.Keys)
                            {
                                dynamicFormFields.Text += String.Format("<input type='hidden' name='{0}' value='{1}' />", key, formParams[key]);
                            }
                            form2.Controls.Add(dynamicFormFields);

                            //Build redirect URL
                            redirectURL = url + (url.IndexOf("?") > -1 ? "&" : "?") + urlQueryString;

                            form2.Action = redirectURL;

                            if (string.IsNullOrWhiteSpace(sessionId))
                            {
                                throw new Exception("SESSIONID");
                            }

                            //Create session cookie in request
                            Response.Cookies.Add(new HttpCookie(SESSION_COOKIE, sessionId));

                            //IF test, display results and make redirect button visible
                            /*
                             - Full combined string
                             - Left Side to compare (SHA256 Byte String)
                             - Right Side to compare (SHA256 Byte String)
                             - Formatted Context object
                             - Session Information
                             - Redirect URL
                            */
                            Log.LogFactory.Message(string.Format("Salesforce Router Success: {0}SessionId = {1}redirectUrl = {2}", Environment.NewLine, sessionId, redirectURL));

                            if (Request.QueryString.Get("test") != null)
                            {
                                BIASecurityMessage.InnerHtml += StartCardDisplaySection();

                                BIASecurityMessage.InnerHtml += "Validated";

                                BIASecurityMessage.InnerHtml += newLineDisplay + "Extracted Values: " + newLineDisplay +
                                    MakeHTMLDisplayable(Newtonsoft.Json.JsonConvert.SerializeObject(
                                        new { appCode = appCode, url = url, adid = adid },
                                        Newtonsoft.Json.Formatting.Indented));

                                BIASecurityMessage.InnerHtml += newLineDisplay + "Context Object: " + newLineDisplay +
                                    MakeHTMLDisplayable(Newtonsoft.Json.JsonConvert.SerializeObject(contextJSONObject, Newtonsoft.Json.Formatting.Indented));

                                BIASecurityMessage.InnerHtml += newLineDisplay + "Session Object: " + newLineDisplay +
                                    MakeHTMLDisplayable(Newtonsoft.Json.JsonConvert.SerializeObject(session, Newtonsoft.Json.Formatting.Indented));

                                BIASecurityMessage.InnerHtml += newLineDisplay + "Redirect URL: " + redirectURL;

                                BIASecurityMessage.InnerHtml += EndCardDisplaySection();

                                btnRedirect.Visible = true;
                                BIASecurityMessage.Visible = true;
                                BIASecurityMessage.Style.Add("display", "block");
                            }
                            //IF NOT test, redirect to URL.
                            else
                            {
                                if (formParams.Count > 0)
                                {
                                    //add startup javascript to click the form button
                                    string myScript = "\n<script type=\"text/javascript\" language=\"Javascript\" id=\"EventScriptBlock\">\n";
                                    myScript += "document.getElementById('btnRedirect').click();";
                                    myScript += "\n\n </script>";
                                    Page.ClientScript.RegisterStartupScript(this.GetType(), "myKey", myScript, false);
                                }
                                else
                                {
                                    try { Response.Redirect(redirectURL); }
                                    catch (ThreadAbortException taex) {  }
                                }
                            }
                        }
                        else
                        {

                            BIASecurityMessage.InnerHtml += newLineDisplay + "Session Start Data: " + newLineDisplay +
                                MakeHTMLDisplayable(Newtonsoft.Json.JsonConvert.SerializeObject(
                                    new { ApplicationCode = appCode, TargetURL = url, UPSADID = adid },
                                    Newtonsoft.Json.Formatting.Indented));

                            BIASecurityMessage.InnerHtml += newLineDisplay + "Context Object: " + newLineDisplay +
                                MakeHTMLDisplayable(Newtonsoft.Json.JsonConvert.SerializeObject(contextJSONObject, Newtonsoft.Json.Formatting.Indented));

                            BIASecurityMessage.InnerHtml += newLineDisplay + "Session Object: " + newLineDisplay +
                                MakeHTMLDisplayable(Newtonsoft.Json.JsonConvert.SerializeObject(session, Newtonsoft.Json.Formatting.Indented));

                            bool errorExists = false;

                            try { errorExists = !string.IsNullOrWhiteSpace(session.Error); }
                            catch (Exception ex) { if (Settings.Log.Router) Log.LogFactory.Exception(new Exception("Error getting Error property of dynamic session object", ex)); }

                            if (errorExists)
                                BIASecurityErrorText.InnerHtml = "There was an issue logging into BIA:" + newLineDisplay + newLineDisplay + session.Error;

                            BIASecurityMessage.Visible = true;
                            BIASecurityErrorContainer.Visible = true;
                            BIASecurityErrorMoreDetails.Visible = true;
                        }
                    }
                }
                catch (Exception ex)
                {
                    bool unknownException = false;

                    if (ex.Message == "Target-URL")
                    {
                        BIASecurityErrorText.InnerHtml = ERROR_BASE_MSG.Replace("{PARAMETER}", "Target-URL");
                    }
                    else if (ex.Message == "UPS-ADID")
                    {
                        BIASecurityErrorText.InnerHtml = ERROR_BASE_MSG.Replace("{PARAMETER}", "UPS-ADID");
                    }
                    else if (ex.Message == "SignedRequest")
                    {
                        string replaceString = "The following required parameter was not found: {PARAMETER}";
                        if (HttpContext.Current.Request.RequestType == "POST")
                            BIASecurityErrorText.InnerHtml = ERROR_BASE_MSG.Replace(replaceString, "The request information was not included in the requst body.");
                        else if (HttpContext.Current.Request.RequestType == "GET")
                            BIASecurityErrorText.InnerHtml = ERROR_BASE_MSG.Replace(replaceString, "The request information was not included in the requst URL.");
                        else
                            BIASecurityErrorText.InnerHtml = ERROR_BASE_MSG.Replace(replaceString, "The request information was not included.");
                    }
                    else if (ex.Message == "SESSIONID")
                    {
                        BIASecurityErrorText.InnerHtml = "There was a problem instantiating or validating the BIA Session.";
                    }
                    
                    else
                    {
                        BIASecurityErrorText.InnerHtml = "An unexpected error occured while routing to the BIA Application (" + ex.Message + ").";
                        BIASecurityMessage.InnerHtml += newLineDisplay + MakeHTMLDisplayable(ex.StackTrace);
                        unknownException = true;
                        if(ex.GetType().Name != "ThreadAbortException") Log.LogFactory.Exception(ex);
                    }

                    if (Settings.Log.Router && !unknownException) Log.LogFactory.Exception(ex);

                    if (contextJSONObject != null)
                    {
                        BIASecurityMessage.InnerHtml += newLineDisplay + "Context Object: " + newLineDisplay +
                            MakeHTMLDisplayable(Newtonsoft.Json.JsonConvert.SerializeObject(contextJSONObject, Newtonsoft.Json.Formatting.Indented));
                    }

                    BIASecurityMessage.InnerHtml += newLineDisplay + "URL (Type = " + HttpContext.Current.Request.RequestType + "): " + newLineDisplay +
                        HttpContext.Current.Request.Url.PathAndQuery;

                    BIASecurityMessage.Visible = true;
                    BIASecurityErrorContainer.Visible = true;
                    BIASecurityErrorMoreDetails.Visible = true;
                }
            }
        }

        private void BtnRedirect_Click(object sender, EventArgs e)
        {
            try
            {
                Response.Redirect(redirectURL);
            }
            catch (ThreadAbortException taex) { }
            catch (Exception ex)
            {
                BIASecurityRedirectMessage.InnerHtml += newLineDisplay + newLineDisplay + ex.Message + newLineDisplay + MakeHTMLDisplayable(ex.StackTrace);
                BIASecurityRedirectMessage.Visible = true;
            }
        }

        public Boolean ValidateRequest()
        {
            string currentDirectoryPath = Path.GetDirectoryName(System.Reflection.Assembly.GetExecutingAssembly().CodeBase);
            string certFilePath = currentDirectoryPath.Replace("\\bin", "").Replace("file:\\", "") + "\\Router\\" +
                ((HttpContext.Current.Request.Url.Host.IndexOf("biadev") > -1 || HttpContext.Current.Request.Url.Host.IndexOf("biaqa") > -1)
                    ? "upsdrive_ams1907_com.cer"
                    : "upsdrive_ups_com_cert.cer");
            string certText = File.ReadAllText(certFilePath);
            //BIASecurityMessage.InnerHtml += newLineDisplay + "Certificate File Path: " + newLineDisplay + certFilePath;
            //BIASecurityMessage.InnerHtml += newLineDisplay + "Certificate File Text: " + newLineDisplay + certText;
            //string decodedCertText = Base64ToString(certText);

            X509Certificate2 certSalesForce = new X509Certificate2(certFilePath);
            RSACryptoServiceProvider csp = (RSACryptoServiceProvider)certSalesForce.PublicKey.Key;
            SHA1Managed sha = new SHA1Managed();

            return csp.VerifyData(Encoding.UTF8.GetBytes(contextDecodedJSONFromRequest), sha, Convert.FromBase64String(contextSignedEncodedJSONFromRequest));

            //return true;
        }

        public static string StringToBase64(string s) { return Convert.ToBase64String(Encoding.UTF8.GetBytes(s)); }

        public static string Base64ToString(string s) { return Encoding.UTF8.GetString(Convert.FromBase64String(s)); }

        public static string StringToSHA256String(string s, string key)
        {
            byte[] routerKeyByte = Encoding.UTF8.GetBytes(key);
            //byte[] messageBytes = Encoding.UTF8.GetBytes(s + key);
            byte[] messageBytes = Encoding.UTF8.GetBytes(s);
            using (var hmacsha256 = new HMACSHA256(routerKeyByte))
            {
                StringBuilder sb = new StringBuilder();
                byte[] hashmessage = hmacsha256.ComputeHash(messageBytes);
                foreach (byte b in hashmessage) sb.AppendFormat("{0:x2}", b);
                return sb.ToString();
            }
        }

        public static string MakeHTMLDisplayable(string s)
        {
            return "<pre style='white-space: pre-wrap; white-space: -moz-pre-wrap; white-space: -pre-wrap; white-space: -o-pre-wrap; word-wrap: break-word;'>" +
                s.Replace(Environment.NewLine, "</br>").Replace("\u0009", "&nbsp;&nbsp;") + "</pre>";
        }

        public static string ObjetcToJSONString(object o)
        {
            return Newtonsoft.Json.JsonConvert.SerializeObject(o, Newtonsoft.Json.Formatting.Indented);
        }

        private static string StartCardDisplaySection()
        {
            return "<div class='Card'>";
        }

        private static string EndCardDisplaySection()
        {
            return "</div>";
        }

        private bool SessionIsValid(string AppCode)
        {

            if (sessionId != null)
            {
                dynamic sessionStatus = LoadSingle<dynamic>("secObject.SessionStatusGet",
                    new DBParameter("@sessionId", DbType.AnsiString, BIACore.Server.CurrentContext.GetSessionId(new { })),
                    new DBParameter("@appCode", DbType.AnsiString, AppCode));

                bool sessionStatusExists = false;
                try
                {
                    sessionStatusExists = sessionStatus != null 
                        && BIACore.Utility.ObjectAccessors.CheckPropExists(sessionStatus, "status")
                        && sessionStatus.status != null;
                        //&& string.IsNullOrWhiteSpace(sessionStatus.status);
                }
                catch (Exception ex) { Log.LogFactory.Exception(new Exception("Error getting status property of dynamic sessionStatus object", ex)); }

                if (sessionStatusExists && sessionStatus.status == 1) return true;
            }

            return false;
        }

        private bool SessionUserMatch(string ADID, string AppCode)
        {
            User u = SessionUser(sessionId, null, AppCode);

            if (u.adId == ADID) return true;
            //TODO: Add sessionUser-SalesforceUser mismatch logging
            else return false;
        }

        internal static User SessionUser(string SessionId, string UserId, string AppCode)
        {
            List<DBParameter> args = new List<DBParameter>();

            if (!string.IsNullOrWhiteSpace(SessionId)) args.Add(new DBParameter("@SessionId", DbType.AnsiString, SessionId));
            if (!string.IsNullOrWhiteSpace(UserId)) args.Add(new DBParameter("@UserId", DbType.AnsiString, UserId));
            if (!string.IsNullOrWhiteSpace(AppCode)) args.Add(new DBParameter("@AppCode", DbType.AnsiString, AppCode));

            User user = LoadSingle<User>("secObject.SessionUserGet", args.ToArray());

            return user;
        }

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
                Log.LogFactory.Exception(e);
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
                Log.LogFactory.Exception(e);
                throw;
            }
        }

        private static string GetStackTrace()
        {
            int upMethods = 1;
            MethodBase caller = new StackTrace().GetFrame(upMethods).GetMethod();
            while (caller != null && caller.DeclaringType != null && caller.DeclaringType.ToString() == "BIACore.Utility.UploadValidation")
            {
                upMethods++;
                caller = new StackTrace().GetFrame(upMethods).GetMethod();
            }
            return (caller == null || caller.DeclaringType == null) ? string.Empty :
                 string.Format("{0}:{1}", caller.DeclaringType.ToString(), caller.Name);
        }
    }
}