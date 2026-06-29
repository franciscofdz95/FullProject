using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Http;
using System.Web.Optimization;
using System.Web.Routing;
using System.Web.Security;
using System.Web.SessionState;

using Newtonsoft.Json.Converters;

using BIASecurity.WebAPI;
using System.Reflection;
using System.IO;
using BIACore.Extensions;
using System.Configuration;
using System.Xml.Serialization.Configuration;
using WebGrease.Extensions;

namespace BIASecurity.WebSite
{
    public class Global : System.Web.HttpApplication
    {
        //Assembly Application_AssemblyResolve(object sender, ResolveEventArgs args)
        //{
        //    try
        //    {
        //        Assembly assembly = System.Reflection.Assembly.Load(args.Name);
        //        if (assembly != null) return assembly;
        //    }
        //    catch { /*ignore load error*/ }

        //    try
        //    {
        //        if (!String.IsNullOrWhiteSpace(ConfigurationManager.AppSettings["BIA_DLL_ValidationDirectories"])
        //            && !String.IsNullOrWhiteSpace(ConfigurationManager.AppSettings["BIA_DLL_ReferencesPath"]))
        //        {

        //            string path = Path.GetDirectoryName(Assembly.GetExecutingAssembly().Location);
        //            List<string> subDirectories;
        //            bool atRootPath = false;
        //            List<string> validationDirectories = ConfigurationManager.AppSettings["BIA_DLL_ValidationDirectories"].Split(",").ToList();
        //            do
        //            {
        //                path = Path.GetFullPath(Path.Combine(path, @"..\"));
        //                subDirectories = Directory.GetDirectories(path).ToList();
        //                bool directoriesValidated = true;
        //                for (var i = 0; i < validationDirectories.Count; i++)
        //                {
        //                    if (subDirectories.IndexOf(validationDirectories[i]) == -1)
        //                    {
        //                        directoriesValidated = false;
        //                        break;
        //                    }
        //                }

        //                if (directoriesValidated) atRootPath = true;

        //            } while (atRootPath == false && !String.IsNullOrWhiteSpace(path));

        //            if (atRootPath)
        //            {
        //                string[] Parts = args.Name.Split(',');
        //                string File = Path.GetDirectoryName(path) + ConfigurationManager.AppSettings["BIA_DLL_ReferencesPath"] + Parts[0].Trim() + ".dll";
        //                return System.Reflection.Assembly.Load(File);
        //            }
        //        }
        //    }
        //    catch { /*ignore error*/ }

        //    return null;
        //}
        protected void Application_Start(object sender, EventArgs e)
        {

            // resolves an issue with Accept: application/xml header mismatch (Invicti) 

            GlobalConfiguration.Configuration.Formatters.JsonFormatter.SerializerSettings.ReferenceLoopHandling = Newtonsoft.Json.ReferenceLoopHandling.Ignore;
            GlobalConfiguration.Configuration.Formatters.Remove(GlobalConfiguration.Configuration.Formatters.XmlFormatter);
            
            //AppDomain.CurrentDomain.AssemblyResolve += Application_AssemblyResolve;

            BIACore.Web.WebAPI.Init();

            // local registration
            RouteConfig.RegisterRoutes(RouteTable.Routes);
            BundleConfig.RegisterBundles(BundleTable.Bundles);
        }

        protected void Session_Start(object sender, EventArgs e)
        {
        }

        protected void Application_BeginRequest(object sender, EventArgs e)
        {
            if (HttpContext.Current.Request.Url.LocalPath.EndsWith(".woff") || HttpContext.Current.Request.Url.LocalPath.EndsWith(".woff2"))
            {
                HttpContext.Current.Response.AppendHeader("Access-Control-Allow-Origin", BIACore.Web.CurrentContext.GetRequestOrigin().Replace("http://","").Replace("https://",""));
            }

            HttpContext current = HttpContext.Current;
            String holdOrigin = "";

            //holdOrigin = current.Request.Headers["Origin"];

            if (current.Response.Headers.Get("Access-Control-Allow-Origin") != null)
            {
                holdOrigin = current.Request.Headers["Origin"];
                current.Response.Headers.Remove("Access-Control-Allow-Origin");
            }
            if (current.Response.Headers.Get("Access-Control-Allow-Credentials") != null) current.Response.Headers.Remove("Access-Control-Allow-Credentials");

            // This code is critical to support subdomain requests and makes changes to the Access-Control-Allow-Origin to prevent CORS errors. This is the recommended method per Microsoft
            if (current.Request.Headers["Origin"] != null &&
                    (
                        current.Request.Headers["Origin"].EndsWith("localhost:") ||
                        current.Request.Headers["Origin"].EndsWith(".biadev.inside.ams1907.com") ||
                        current.Request.Headers["Origin"].EndsWith(".biaalpha.inside.ups.com") ||
                        current.Request.Headers["Origin"].EndsWith(".bia.inside.ups.com") 
                    )
                )
            {
                String test = current.Request.Headers["Origin"];
                string[] splitHost = test.Split('.');
                if (splitHost.Length <= 5 )
                {
                    current.Response.AppendHeader("Access-Control-Allow-Origin", BIACore.Web.CurrentContext.GetRequestOrigin());
                    current.Response.AppendHeader("Access-Control-Allow-Credentials", "true");
                }
            }
            else
            {
                current.Response.AppendHeader("Access-Control-Allow-Origin", holdOrigin);
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