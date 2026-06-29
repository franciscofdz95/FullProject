using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Http;
using System.Web.Routing;

namespace BIASecurity.WebAPI
{
    public class RouteConfig
    {
        public static void RegisterRoutes(RouteCollection routes)
        {

            routes.MapHttpRoute(
               name: "api/BIASecurity",
               routeTemplate: "api/{controller}/{action}/{id}",
               defaults: new
               {
                   //action = RouteParameter.Optional,
                   action = "DefaultAction",
                   controller = "DefaultController",
                   id = RouteParameter.Optional,
                   namespaces = new string[] { "BIASecurity.WebAPI.Controller" }
               }
           );

        }
    }
}
