/* ====================================================================================================
NAME:				[Web API Routning]
BEHAVIOR:		Establish web API connection for selected function.
_______________________________________________________________________________________________________
REVISION HISTORY
-------------------------------------------------------------------------------------------------------
Date			    Modified By			  Modifications
-------------------------------------------------------------------------------------------------------
07/26/2016        Sudhir Dandale		 Created.
 ======================================================================================================*/
using System.Web.Http;
using System.Web.Routing;

namespace Flote.WebAPI.WebAPI
{
    public class RouteConfig
    {
        public static void RegisterRoutes(RouteCollection routes)
        {

            routes.MapHttpRoute(
               name: "api/Flote.WebAPI",
               routeTemplate: "api/{controller}/{action}/{id}",
               defaults: new
               {
                   action = RouteParameter.Optional,
                   id = RouteParameter.Optional,
                   namespaces = new string[] { "Flote.WebAPI.WebAPI.Controller" }
               }
           );

        }
    }
}
