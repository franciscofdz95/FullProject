using Newtonsoft.Json.Converters;
using System.Web.Http;
using System.Web.Optimization;

namespace BIACore.Web
{
    public static class WebAPI
    {
        public static void Init()
        {
            // bundling is the opposite of debugging
            BundleTable.EnableOptimizations = Settings.Config.Bundle;

            // add jsonp formatter support. needs to go ahead of other json formatters!
            //GlobalConfiguration.Configuration.Formatters.Insert(0, new BIACore.Web.MediaFormatter.JsonpFormatter());

            //Ensure that a consistent format is returned for dates.  Without this the milliseconds will be cut off if they are 0.  This causes a problem for some clients.
            GlobalConfiguration.Configuration.Formatters.JsonFormatter.SerializerSettings.Converters.Add(new IsoDateTimeConverter { DateTimeFormat = "yyyy-MM-dd\\THH:mm:ss.fffK" });

            //NOTE: This ensures the full error detail is sent.  
            //Exception handling overlays on top to this to only show revlevant info to the user.
            //If this isn't set then exception handling may not have all the error detail when it logs errors.
            GlobalConfiguration.Configuration.IncludeErrorDetailPolicy = IncludeErrorDetailPolicy.Always;

            GlobalConfiguration.Configuration.Filters.Add(new GlobalExceptionFilter());
            GlobalConfiguration.Configuration.Filters.Add(new GlobalActionFilter());
        }
    }
}
