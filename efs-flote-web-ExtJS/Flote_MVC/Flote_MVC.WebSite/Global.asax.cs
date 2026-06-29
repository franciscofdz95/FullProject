/* ====================================================================================================
NAME:			[Global File]
BEHAVIOR:		Registered all local files for Flote Application.
_______________________________________________________________________________________________________
REVISION HISTORY
-------------------------------------------------------------------------------------------------------
Date			    Modified By			  Modifications
-------------------------------------------------------------------------------------------------------
07/26/2016        Sudhir Dandale		 Created.
 ======================================================================================================*/
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

using Flote.WebAPI;
using Flote.WebAPI.WebAPI;

namespace Flote.WebSite.Website
{
    public class Global : System.Web.HttpApplication
    {

        protected void Application_Start(object sender, EventArgs e)
        {
            BIACore.Web.WebAPI.Init();

            // local registration
            RouteConfig.RegisterRoutes(RouteTable.Routes);
            BundleConfig.RegisterBundles(BundleTable.Bundles);

            //GemBox config
            GemBoxConfig.SetLicense();
        }

        protected void Session_Start(object sender, EventArgs e)
        {
            // Do nothing just empty function.
        }

        protected void Application_BeginRequest(object sender, EventArgs e)
        {
            // Do nothing just empty function.
        }

        protected void Application_AuthenticateRequest(object sender, EventArgs e)
        {
            // Do nothing just empty function.
        }

        protected void Application_Error(object sender, EventArgs e)
        {
            // Do nothing just empty function.
        }

        protected void Session_End(object sender, EventArgs e)
        {
            // Do nothing just empty function.
        }

        protected void Application_End(object sender, EventArgs e)
        {
            // Do nothing just empty function.
        }
    }
}