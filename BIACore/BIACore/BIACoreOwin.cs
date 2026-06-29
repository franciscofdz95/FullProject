using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Text.RegularExpressions;
using System.Threading.Tasks;
using System.Collections.Specialized;
using Microsoft.Owin;
using Microsoft.Owin.Extensions;
using Owin;
using Microsoft.IdentityModel.Protocols.OpenIdConnect;
using Microsoft.IdentityModel.Tokens;
using Microsoft.Owin.Security;
using Microsoft.Owin.Security.Cookies;
using Microsoft.Owin.Security.OpenIdConnect;
using Microsoft.Owin.Security.Notifications;
using System.Web;


namespace BIACore
{
    public class BIACoreOwin
    {
        //// The Client ID is used by the application to uniquely identify itself to Azure AD.
        //string clientId = "dfa208b0-df3a-40c1-b620-539056701f15";

        //// Tenant is the tenant ID (e.g. contoso.onmicrosoft.com, or 'common' for multi-tenant)
        //string tenant = "e7520e4d-d5a0-488d-9e9f-949faae7dce8";

        //// RedirectUri is the URL where the user will be redirected to after they sign in.
        //string redirectUri = "https://localhost:44375/";

        // Authority is the URL for authority, composed by Microsoft identity platform endpoint and the tenant name (e.g. https://login.microsoftonline.com/contoso.onmicrosoft.com/v2.0)
        private static string authority = "https://login.microsoftonline.com/e7520e4d-d5a0-488d-9e9f-949faae7dce8/v2.0";

        public static void InitOwin(IAppBuilder app)
        {
            if (BIACore.Settings.Security.AzureApp)
            {
                dynamic applicationAzure = BIACore.Internal.Request.ApplicationAzure();

                //Need a catch here if an no token info is returned!! M.Erdmann 11/3/2021
                
                var ctx = new OwinContext();
                
                if (applicationAzure == null)
                {
                    
                    ctx.Response.Redirect(string.Format("https://{0}/Error.aspx?code=getapplicationazure", Settings.Config.Server + Settings.Config.BaseURL));
                    BIACore.Log.LogFactory.Error("OWIN Azure Missing Token Info", null);
                    return;
                }

                string appUri = applicationAzure.RedirectURI.Value;

                app.UseStageMarker(PipelineStage.Authenticate);

                app.SetDefaultSignInAsAuthenticationType(CookieAuthenticationDefaults.AuthenticationType);

                app.UseCookieAuthentication(new CookieAuthenticationOptions
                {
                    CookieSameSite = Microsoft.Owin.SameSiteMode.Lax
                });

                authority = "https://login.microsoftonline.com/e7520e4d-d5a0-488d-9e9f-949faae7dce8/v2.0";

                app.UseOpenIdConnectAuthentication(
                    new OpenIdConnectAuthenticationOptions
                    {
                        // Sets the client ID, authority, and redirect URI as obtained from Web.config
                        ClientId = applicationAzure.ClientId.Value,
                        Authority = authority,
                        //CookieManager = SameSiteMode.Lax,
                        RedirectUri = applicationAzure.RedirectURI.Value,
                        // PostLogoutRedirectUri is the page that users will be redirected to after sign-out. In this case, it's using the home page
                        PostLogoutRedirectUri = appUri,
                        Scope = OpenIdConnectScope.OpenIdProfile,
                        // ResponseType is set to request the code id_token, which contains basic information about the signed-in user
                        ResponseType = OpenIdConnectResponseType.CodeIdToken,
                        // ValidateIssuer set to false to allow personal and work accounts from any organization to sign in to your application
                        // To only allow users from a single organization, set ValidateIssuer to true and the 'tenant' setting in Web.config to the tenant name
                        // To allow users from only a list of specific organizations, set ValidateIssuer to true and use the ValidIssuers parameter
                        TokenValidationParameters = new TokenValidationParameters()
                        {
                            ValidateIssuer = true, // Simplification (see note below)
                            ValidateAudience = false
                        },
                        // OpenIdConnectAuthenticationNotifications configures OWIN to send notification of failed authentications to the OnAuthenticationFailed method
                        Notifications = new OpenIdConnectAuthenticationNotifications
                        {
                            AuthenticationFailed = OnAuthenticationFailed,
                            RedirectToIdentityProvider = OnRedirectToIdentityProvider,
                            MessageReceived = OnMessageReceived
                            //SecurityTokenValidated = OnTokenValid

                        }
                    }
                );
            }
        }

        private static Task OnRedirectToIdentityProvider(RedirectToIdentityProviderNotification<OpenIdConnectMessage, OpenIdConnectAuthenticationOptions> notification)
        {
            var stateQueryString = notification.ProtocolMessage.State.Split('=');
            var protectedState = stateQueryString[1];
            var state = notification.Options.StateDataFormat.Unprotect(protectedState);

            var ctx = notification.OwinContext;

            bool isAjaxRequest = (ctx.Request.Headers != null && ctx.Request.Headers["X-Requested-With"] == "XMLHttpRequest");

            if (isAjaxRequest)
            {
                ctx.Response.Headers.Remove("Set-Cookie");
                notification.State = NotificationResultState.HandledResponse;
                return Task.FromResult(0);
            }

            state.RedirectUri = notification.Request.Uri.ToString();

            notification.ProtocolMessage.State = stateQueryString[0] + "=" + notification.Options.StateDataFormat.Protect(state);
            return Task.FromResult(0);
        }

        private static Task OnMessageReceived(MessageReceivedNotification<OpenIdConnectMessage, OpenIdConnectAuthenticationOptions> notification)
        {
            var protectedState = notification.ProtocolMessage.State.Split('=')[1];
            var state = notification.Options.StateDataFormat.Unprotect(protectedState);

            if (Uri.IsWellFormedUriString(state.RedirectUri, UriKind.RelativeOrAbsolute)) notification.Response.Redirect(state.RedirectUri);

            return Task.FromResult(0);
        }

        private static Task OnAuthenticationFailed(AuthenticationFailedNotification<OpenIdConnectMessage, OpenIdConnectAuthenticationOptions> context)
        {
            context.HandleResponse();
            context.Response.Redirect("LoginError.aspx?errormessage=" + context.Exception.Message);

            return Task.FromResult(0);
        }

        public static void SignOut()
        {
            // Guard against calling GetOwinContext() when OWIN environment is absent.
            if (HttpContext.Current?.Items["owin.Environment"] == null)
            {
                HttpContext.Current?.Response.Redirect(
                    "https://login.microsoftonline.com/common/wsfederation?wa=wsignout1.0");
                return;
            }

            HttpContext.Current.Request.GetOwinContext().Authentication.SignOut();
            HttpContext.Current.GetOwinContext()
                       .Authentication
                       .SignOut(CookieAuthenticationDefaults.AuthenticationType);
            HttpContext.Current.Response.Redirect(
                "https://login.microsoftonline.com/common/wsfederation?wa=wsignout1.0");
        }
    }
}
