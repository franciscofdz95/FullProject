using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;

using System.Data;
using System.Data.SqlClient;

using BIACore.Server;
using System.Collections.Specialized;
using Microsoft.Identity.Client;
using System.Globalization;

namespace BIACore.Website
{
    public partial class Logout : System.Web.UI.Page
    {
        private const string SESSION_COOKIE = API.SESSION_COOKIE;

        protected void Page_Load(object sender, EventArgs e)
        {

            if (!Request.IsSecureConnection)
            {
                string secureURI = Request.Url.AbsoluteUri.Replace("http://", "https://");
                if (secureURI.IndexOf("http") < 0) secureURI = "https://" + secureURI;
                Response.Redirect(secureURI);
            }

            if (Properties.Settings.Default.ExternalSecurity)
            {
                Response.Redirect(string.Format("{0}{1}{2}{3}{4}",
                    Uri.UriSchemeHttp,
                    Uri.SchemeDelimiter,
                    Request.Url.Authority,
                    Properties.Settings.Default.ExternalSecurityLogout,
                    Request.Url.Query
                    ));
            }

            HttpRequest request = HttpContext.Current.Request;
            HttpCookie cookie = request.Cookies[SESSION_COOKIE];

            string appCode = !String.IsNullOrWhiteSpace(HttpContext.Current.Request.QueryString["appCode"])
            ? HttpContext.Current.Request.QueryString["appCode"] : "BIASecurity";

            //dynamic applicationAzure = BIACore.Provider.SQL.Execute<dynamic>(
            //        Connections.NewSecurity,
            //        "appObject.GetApplicationAzure",
            //        new Model.DBParameter("@appCode", DbType.AnsiString, appCode),
            //        new Model.DBParameter("@env", DbType.AnsiString, Settings.Config.BIAEnvironment)
            //    );

            if (null != cookie && !string.IsNullOrWhiteSpace(cookie.Value))
            {
                AuthEvent.Log(Auth.Logout, "{0} ending session {1} {2}",
                    HttpContext.Current.Request.UserHostAddress, Settings.Config.Server, cookie.Value);

                List<Model.Session> session = BIACore.Provider.SQL.Execute<Model.Session>(
                    Connections.Security,
                    "secObject.SessionEnd",
                    new Model.DBParameter("@sessionId", DbType.String, cookie.Value),
                    new Model.DBParameter("@ip", DbType.String, HttpContext.Current.Request.UserHostAddress),
                    new Model.DBParameter("@env", DbType.String, Settings.Config.BIAEnvironment)
                );

                string userId = BIACore.Security.User.DEFAULT_USERID;

                if (session.Count > 0)
                    userId = session[0].userId;

                Activity.ActivityFactory.Log(request, appCode, userId, "AppLogin", "Logout");

                // mark the cookie "expired"
                cookie.Secure = true;
                cookie.HttpOnly = true;
                cookie.SameSite = SameSiteMode.Lax;
                cookie.Value = string.Empty;
                cookie.Expires = DateTime.Now.AddDays(-1);
                cookie.Domain = Settings.Config.Server;
                Response.SetCookie(cookie);

                BIACore.Server.Cache.ClearSessionCache();
            }

            Response.Cookies.Add(new HttpCookie(API.SESSION_COOKIE, string.Empty) { Expires = DateTime.Now.AddDays(-1), Domain = "." + Settings.Config.Server });
            Response.Cookies.Add(new HttpCookie(API.SESSION_COOKIE, string.Empty) { Expires = DateTime.Now.AddDays(-1), Domain = string.Empty });
            Response.Cookies.Add(new HttpCookie(API.LOCALHOST_TOKEN_COOKIE, string.Empty) { Expires = DateTime.Now.AddDays(-1), Domain = string.Empty });

            // Delete Asp Cookies
            Response.SetCookie(new HttpCookie("SMSESSION", string.Empty) { Expires = DateTime.Now.AddDays(-1), Domain = Settings.Config.Server });
            Response.SetCookie(new HttpCookie("SMSESSION", string.Empty) { Expires = DateTime.Now.AddDays(-1), Domain = string.Empty });
            Response.SetCookie(new HttpCookie("ASP.NET_SessionId", string.Empty) { Expires = DateTime.Now.AddDays(-1), Domain = Settings.Config.Server });
            Response.SetCookie(new HttpCookie("ASP.NET_SessionId", string.Empty) { Expires = DateTime.Now.AddDays(-1), Domain = string.Empty });
            Response.SetCookie(new HttpCookie(".AspNet.Cookies", string.Empty) { Expires = DateTime.Now.AddDays(-1), Domain = Settings.Config.Server });
            Response.SetCookie(new HttpCookie(".AspNet.Cookies", string.Empty) { Expires = DateTime.Now.AddDays(-1), Domain = string.Empty });


            // delete CF cookies.

            Response.SetCookie(new HttpCookie("CFID", string.Empty) { Expires = DateTime.Now.AddDays(-1), Domain = Settings.Config.Server });
            Response.SetCookie(new HttpCookie("CFTOKEN", string.Empty) { Expires = DateTime.Now.AddDays(-1), Domain = Settings.Config.Server });
            //Response.SetCookie(new HttpCookie("BIA_Session", string.Empty) { Expires = DateTime.Now.AddDays(-1), Domain = Settings.Config.Server });
            //This was a cleanup cookie set and should be done outside of BIACore. MME 2/7/2019

            //Response.Redirect("https://wineam2.inside.ups.com/pub/logout.jsp");
            //Read query string a look for ?t=azure or ?t=eam

            NameValueCollection query = HttpUtility.ParseQueryString(request.Url.Query);
            var logoutType = query.Get("t");

            //if (logoutType == null || logoutType != "azure")
            //{
                Response.Redirect("https://eamsso.inside.ups.com/pub/forms/logout.fcc");
            //}
            //else
            //{
            //    BIACoreOwin.SignOut();
            //    Response.Redirect("https://login.microsoftonline.com/common/wsfederation?wa=wsignout1.0");
            //}
        }

    }
}