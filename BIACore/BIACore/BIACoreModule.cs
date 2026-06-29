using BIACore.Web;
using Newtonsoft.Json;
using System;
using System.Web;

namespace BIACore
{
    /// <summary>
    /// The core feature of BIACore.dll is the BIACoreModule.
    /// </summary>
    /// <remarks>
    /// This class is broken into chunks so that I can keep the appropriate parts
    /// in their respective areas.
    /// In this section, we are concerned with
    /// 1) application start - registering any controllers we may be providing
    /// 2) application init - ensuring we are run first if security is enabled.
    /// 3) manual routing - not sure this is necessary, but we can manually handle
    ///    webapi routes if we're stuck in a non-webapi project.
    /// </remarks>
    public partial class BIACoreModule : BIAHttpModule
    {
        /// <summary>
        /// Static reference to BIACoreModule object from startup
        /// </summary>
        public static BIACoreModule me = null;

        /// <summary>
        /// Do startup activities
        /// </summary>
        /// <param name="application"></param>
        // register any controller routes
        public override void onStart(HttpApplication application)
        {
            try
            {
                if (!String.IsNullOrWhiteSpace(Settings.Config.AppCode) || !String.IsNullOrWhiteSpace(Settings.Config.AppCode))
                {
                    System.Threading.Tasks.Task.Factory.StartNew((l) => {
                        Internal.Request.ApplicationVersionLog(l);
                    }, new {
                        Version = System.Reflection.Assembly.GetExecutingAssembly().GetName().Version.ToString(),
                        Server = Environment.MachineName,
                        AppCode = Settings.Config.AppCode
                    });
                }
            }
            catch { }

            me = this;

            RefreshApplicationConnections();
        }

        // http://msdn.microsoft.com/en-us/library/ms178473%28v=vs.85%29.aspx
        // event list:
        //  1: Validate the request, which examines the information sent by the browser and determines whether it contains potentially malicious markup. For more information, see ValidateRequest and Script Exploits Overview.
        //  2: Perform URL mapping, if any URLs have been configured in the UrlMappingsSection section of the Web.config file.
        //  3: Raise the BeginRequest event.
        //  4: Raise the AuthenticateRequest event.
        //  5: Raise the PostAuthenticateRequest event.
        //  6: Raise the AuthorizeRequest event.
        //  7: Raise the PostAuthorizeRequest event.
        //  8: Raise the ResolveRequestCache event.
        //  9: Raise the PostResolveRequestCache event.
        // 10: Based on the file name extension of the requested resource (mapped in the application's configuration file), select a class that implements IHttpHandler to process the request. If the request is for an object (page) derived from the Page class and the page needs to be compiled, ASP.NET compiles the page before creating an instance of it.
        // 11: Raise the PostMapRequestHandler event.
        // 12: Raise the AcquireRequestState event.
        // 13: Raise the PostAcquireRequestState event.
        // 14: Raise the PreRequestHandlerExecute event.
        // 15: Call the ProcessRequest method (or the asynchronous version BeginProcessRequest) of the appropriate IHttpHandler class for the request. For example, if the request is for a page, the current page instance handles the request.
        // 16: Raise the PostRequestHandlerExecute event.
        // 17: Raise the ReleaseRequestState event.
        // 18: Raise the PostReleaseRequestState event.
        // 19: Perform response filtering if the Filter property is defined.
        // 20: Raise the UpdateRequestCache event.
        // 21: Raise the PostUpdateRequestCache event.
        // 22: Raise the EndRequest event.
        public override void onInit(HttpApplication application)
        {
            // error handler logger
            application.Error += new EventHandler(Error);

            //application.PreSendRequestHeaders += new EventHandler(PreHeaders);

            try
            {
                //if (BIACore.Web.CurrentContext.IsLocalHost())
                //{
                //    //Add localhost logout route
                //    try { LocalHostLogoutRouteRegister(RouteTable.Routes); }
                //    catch { }
                //}

                //if (BIACore.Settings.Config.AppCode != "BIACore")
                //{
                //    //Add ConnectionManager Refresh route
                //    try { AddHeaderButtonRoute(RouteTable.Routes); }
                //    catch { }
                //}

                //Add BIACore Internal Routes
                //BIACoreRouteConfiguration(RouteTable.Routes);

                // Pre Request Initialization, used to set the debug start time for ajax calls
                // PreRequest can be found in BIACore\Web\BIACoreModule.cs
                application.BeginRequest += new EventHandler(PreRequest);

                // xss validation, designed to defeat/avoid most common xss attacks
                // XssRequestValidation & RequestEnd can be found in BIACore\Web\BIACoreModule.cs
                application.BeginRequest += new EventHandler(XssRequestValidation);
                application.EndRequest += new EventHandler(RequestEnd);

                // switched from PreRequestHandlerExecute to BeginRequest like I should have been using to begin with. - EAM Model
                // switched from BeginRequest to PostAuthenticateRequest. - Azure Model (OWIN)
                if (Settings.Security.Enabled)
                {
                    try
                    {
                        // SecureBegin and SecureEnd can be found in BIACore\Security\BIACoreModule.cs
                        application.PostAuthenticateRequest += new EventHandler(SecureBegin);
                        application.EndRequest += new EventHandler(SecureEnd);
                    }
                    catch {
                        //TODO: add logging/handling for overall error..
                        //To throw or not to throw, that is the question.
                    }
                }

                // forced webapi router (if webapi isn't working through normal methods)
                // Router can be found in /BIACore/BIACoreModule.cs (scroll down)
                try { application.PostAcquireRequestState += new EventHandler(Router); }
                catch { }

                // activity handler
                // moved this from EndRequest to BeginRequest so we can capture request.InputStream
                // before WebAPI or other items consume it.
                try { application.AuthorizeRequest += new EventHandler(Activity); }
                catch { }
            }
            catch { }
        }

        /// <summary>
        /// Manually implement WebAPI routing for this specific request.
        /// Really only necessary in some (older) apps that aren't working very well. M.Erdmann This line is incorrect, used everywhere!
        /// </summary>
        /// <param name="sender"></param>
        /// <param name="e"></param>
        public void Router(object sender, EventArgs e)
        {

            HttpRequest request = HttpContext.Current.Request;
            HttpResponse response = HttpContext.Current.Response;

            string url = request.Url.ToString().ToLowerInvariant();

            // moving the 'route' api/biacore/config over to the 'file' biacore.json.
            if (url.EndsWith("api/biacore/config/config") || url.EndsWith("biacore.json"))
            {
                response.ContentType = "application/json";
                response.Write(JsonConvert.SerializeObject(new Model.BIACoreConfig()
                {
                    client = HttpContext.Current.Request.UserHostName,
                    biaServer = Settings.Config.BIAServer,
                    biaServerInternal = Settings.Config.ServerInternal
                }));
                response.End();
            }
            else if (url.EndsWith("api/biacore/routes"))
            {
                // reflect our route table and all methods attached to it.
                response.ContentType = "text/plain";
                //response.Write(Reflection.Routes.Thing());
                response.End();
            }
            else if (url.EndsWith("api/application/application"))
            {
                //TODO: Verify that this is still used, I think this is deprecated. MME 1/4/2022
                HttpCookie sessionCookie = request.Cookies[API.SESSION_COOKIE];
                if (sessionCookie != null)
                {
                    HttpContext.Current.Response.Cookies.Add(new HttpCookie(API.SESSION_COOKIE, sessionCookie.Value) { Expires = DateTime.Now.AddHours(12), Domain = Settings.Config.Server, HttpOnly = true, Secure = true, SameSite = SameSiteMode.Lax});
                }
            }
            else if (url.EndsWith("api/bia/localhost/logout"))
            {
                HttpCookie lhTokenCookie = request.Cookies[API.LOCALHOST_TOKEN_COOKIE];
                if (lhTokenCookie != null)
                {
                    lhTokenCookie.Value = null;
                    lhTokenCookie.Expires = DateTime.Now.AddDays(-1);
                    //lhTokenCookie.Domain = "localhost";
                    HttpContext.Current.Response.SetCookie(lhTokenCookie);
                }
                response.ContentType = "text/plain";
                response.End();
            }
            else if (url.EndsWith("api/bia/connectionmanager/refreshconnections"))
            {
                BIACoreModule.me.RefreshApplicationConnections(true);
                response.StatusCode = 200;
                response.ContentType = "application/json";
                response.Write(JsonConvert.SerializeObject(new { refresh = true }));
                response.End();
            }
        }
    }
}
