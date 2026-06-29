using BIACore.Extensions;
using Newtonsoft.Json.Linq;
using System;
using System.Net;
using System.Net.Http;
using System.Web.Http.Filters;
using System.Web.Script.Serialization;

namespace BIACore.Web
{
    class GlobalExceptionFilter : ExceptionFilterAttribute
    {

        public GlobalExceptionFilter() : base() { }

        public override void OnException(HttpActionExecutedContext context)
        {
            try
            {
                JObject responseObj = new JObject();

                // exception occured in app code so it was not logged through BIA api controller methods
                if (context.Exception.Data["BIALogged"] == null)
                {
                    Log.LogFactory.Exception(context.Exception);
                }

                responseObj["BIACode"] = context.Exception.GetBIAErrorCode();

                if (Settings.Config.Debug)
                {
                    responseObj["Message"] = "An error has occured.";
                    responseObj["ExceptionMessage"] = context.Exception.Message;
                    responseObj["ExceptionType"] = context.Exception.GetType().ToString();
                    responseObj["StackTrace"] = context.Exception.StackTrace;
                }

                if (Settings.Config.SQLDebug && context.Exception.Data["Debug"] != null)
                {
                    var jss = new JavaScriptSerializer();
                    responseObj["debug"] = JToken.FromObject(jss.Deserialize<dynamic>((string)context.Exception.Data["Debug"]));
                }
                
                context.Response = context.Request.CreateResponse(HttpStatusCode.BadRequest, responseObj);
            } catch (Exception e)
            {
                Log.LogFactory.Exception(e);
            }
        }
    }
}
