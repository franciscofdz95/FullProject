using Newtonsoft.Json.Linq;
using System;
using System.IO;
using System.Web;
using System.Web.Http.Controllers;
using System.Web.Http.Filters;

namespace BIACore.Web
{
    class GlobalActionFilter : ActionFilterAttribute
    {
        private readonly string JSON_DEBUG_MESSAGE = "Invalid request content.";

        public override void OnActionExecuting(HttpActionContext actionContext)
        {
            Exception validationException = null;

            try
            {
                HttpRequest request = HttpContext.Current.Request;
                string contentType = request.ContentType;
                string requestString = GetRequestContent(request);

                if (!string.IsNullOrWhiteSpace(requestString) && !string.IsNullOrWhiteSpace(contentType) &&
                    contentType.ToLowerInvariant().Contains("application/json") && !IsValidJson(requestString))
                {
                    //special case for a call from MyReports agents which send a string "null" to /common/biacore/2.0/api/MyReportsAgent/List
                    //should be fixed in Client and this case removed
                    //see: ExportReport.cs:41 and Client_Old.cs:24
                    if (Settings.Config.AppCode != "BIACore" || requestString.ToLower() != "null")
                        validationException = new HttpRequestValidationException(JSON_DEBUG_MESSAGE + " (" + request.Url.AbsolutePath + ")");
                }
            }
            catch (Exception e)
            {
                // exception in our validation code, just log it
                //BIACore.Log.LogFactory.Exception(e);
            }

            if (validationException != null)
            {
                throw validationException;
            }
        }

        private string GetRequestContent(HttpRequest request)
        {
            string requestString = null;

            if (request.InputStream != null && request.InputStream.Length > 0)
            {
                StreamReader streamReader = new StreamReader(request.InputStream);
                streamReader.BaseStream.Position = 0;
                requestString = streamReader.ReadToEnd().ToLowerInvariant();

                // rewind stream in case the app reads it later (eg reading multipart stream)
                streamReader.BaseStream.Position = 0;
            }

            return requestString;
        }

        private bool IsValidJson(string request)
        {
            try
            {
                // throws exception if request is not valid json
                JToken.Parse(request);

                return true;
            }
            catch (Exception e)
            {
                return false;
            }
        }
    }
}
