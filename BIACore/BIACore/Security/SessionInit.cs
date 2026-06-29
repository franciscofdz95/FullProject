using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
//using Owin;
//using Microsoft.Owin;
//using Microsoft.Owin.Extensions;
//using Microsoft.IdentityModel.Protocols.OpenIdConnect;
//using Microsoft.IdentityModel.Tokens;
//using Microsoft.Owin.Security;
//using Microsoft.Owin.Security.Cookies;
//using Microsoft.Owin.Security.OpenIdConnect;
//using Microsoft.Owin.Security.Notifications;
using System.Web;

namespace BIACore.Security
{
    public static class SessionInit
    {

        public static void SessionCreate(string adId, bool anonymous)
        {
            HttpRequest request = HttpContext.Current.Request;
            HttpResponse response = HttpContext.Current.Response;

            Dictionary<string, object> sessionParams = new Dictionary<string, object>()
                            {
                                //{ "UserId", BIACore.Utility.Encryption.EncryptRIGHT.Encrypt(adId) },
                                { "UserId", adId },
                                { "AppCode", Settings.Config.AppCode },
                                { "Source", "Azure" },
                                { "Anonymous", anonymous }
                            };

            // Start Session
            dynamic sessionResult = Internal.Request.SessionSecureStart(sessionParams);

            // Get SessionId from sessionResult.Token
            response.SetCookie(new HttpCookie(API.SESSION_COOKIE, sessionResult.SessionId.Value)
            {
                HttpOnly = true,
                Secure = true,
                SameSite = SameSiteMode.Lax,
                Domain = BIACore.Settings.Config.Server,
                Expires = DateTime.Now.AddHours(12)
            });

            //Creates/Updates the BIACID Cookie 
            HttpCookie secHashCookie = request.Cookies[API.SECHASH_COOKIE];
            if (secHashCookie == null && !String.IsNullOrWhiteSpace(sessionResult.SechashId.Value))
            {
                response.SetCookie(new HttpCookie(API.SECHASH_COOKIE, sessionResult.SechashId.Value)
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
                                { "UserId", BIACore.Security.Session.userId != null ? BIACore.Security.Session.userId : adId }, //this logic was added to support new users without a BIA Profile M.Erdmann 2/26/2020
                                { "IpAddress", request.UserHostAddress }
                            };

                System.Threading.Tasks.Task.Factory.StartNew((l) =>
                {
                    Internal.Request.SessionClientUpdate((Dictionary<string, object>)l);
                }, sessionClientParams);
            }

        }

    }
}
