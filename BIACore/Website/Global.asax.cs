using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Http;
using System.Web.Routing;
using System.Web.Security;
using System.Web.SessionState;

using System.Web.Optimization;

using BIACore.WebAPI;
using System.Configuration;

namespace BIACore.Website
{
    public class Global : System.Web.HttpApplication
    {

        protected void Application_Start(object sender, EventArgs e)
        {

            // resolves an issue with Accept: application/xml header mismatch (Invicti)
            GlobalConfiguration.Configuration.Formatters.JsonFormatter.SerializerSettings.ReferenceLoopHandling = Newtonsoft.Json.ReferenceLoopHandling.Ignore;
            GlobalConfiguration.Configuration.Formatters.Remove(GlobalConfiguration.Configuration.Formatters.XmlFormatter);

            // register our WebAPI routes
            // bia web services routes
            BIACore.Server.RouteConfig.RegisterRoutes(RouteTable.Routes);
            // my reports routes
            BIACore.MyReports.RouteConfig.RegisterRoutes(RouteTable.Routes);
            // bia tools routes
            BIACore.Website.RouteConfig.RegisterRoutes(RouteTable.Routes);

            BundleConfig.RegisterBundles(BundleTable.Bundles);

            BIACore.Web.WebAPI.Init();

            BIACore.WebAPI.ConnectionInit.InitializeConnections();
        }

        protected void Session_Start(object sender, EventArgs e)
        {

        }

        protected void Application_BeginRequest(object sender, EventArgs e)
        {
            HttpContext current = HttpContext.Current;
            String holdOrigin = "";

            if (current.Response.Headers.Get("Access-Control-Allow-Origin") != null)
            {
                holdOrigin = current.Request.Headers["Origin"];
                current.Response.Headers.Remove("Access-Control-Allow-Origin");
            }
            if (current.Response.Headers.Get("Access-Control-Allow-Credentials") != null) current.Response.Headers.Remove("Access-Control-Allow-Credentials");

            // This code is critical to support subdomain requests and makes changes to the Access-Control-Allow-Origin to prevent CORS errors. This is the recommended method per Microsoft
            if (current.Request.Headers["Origin"] != null && 
                    (
                        current.Request.Headers["Origin"].IndexOf("localhost:") > -1 ||
                        current.Request.Headers["Origin"].IndexOf(".biadev.inside.ams1907.") > -1 ||
                        current.Request.Headers["Origin"].IndexOf(".biaalpha.inside.ups.") > -1 ||
                        current.Request.Headers["Origin"].IndexOf(".bia.inside.ups.") > -1
                    )
                )
            {
                String test = current.Request.Headers["Origin"];
                string[] splitHost = test.Split('.');
                if (splitHost.Length <= 5)
                {
                    current.Response.AppendHeader("Access-Control-Allow-Origin", BIACore.Web.CurrentContext.GetRequestOrigin());
                    current.Response.AppendHeader("Access-Control-Allow-Credentials", "true");
                }

            }
            else
            {
                current.Response.AppendHeader("Access-Control-Allow-Origin", holdOrigin);
            }

            if (current.Request.HttpMethod.ToUpper() == "OPTIONS")
            {
                current.Response.AppendHeader("Access-Control-Allow-Methods", "GET,POST");

                string requestHeaders = current.Request.Headers["Access-Control-Request-Headers"];
                if (!String.IsNullOrWhiteSpace(requestHeaders))
                    current.Response.AppendHeader("Access-Control-Allow-Headers", requestHeaders);

                current.Response.End();
            }
        }

        protected void Application_AuthenticateRequest(object sender, EventArgs e)
        {

        }

        protected void Application_Error(object sender, EventArgs e)
        {

        }

        protected void Session_End(object sender, EventArgs e)
        {

        }

        protected void Application_End(object sender, EventArgs e)
        {

        }
    }
}