using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Http;
using System.Web.Routing;

namespace BIACore.Server
{
    public class RouteConfig
    {
        public static void RegisterRoutes(RouteCollection routes)
        {
            routes.MapHttpRoute(
                name: "BIA Webservices",
                routeTemplate: "api/{controller}/{action}/{id}",
                defaults: new
                {
                    action = "DefaultAction",
                    controller = "DefaultController",
                    id = RouteParameter.Optional
                }
            );
        }
    }
}