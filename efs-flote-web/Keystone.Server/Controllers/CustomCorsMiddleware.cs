

namespace Keystone.Server.Controllers
{
    public class CustomCorsMiddleware
    {
        private readonly RequestDelegate _next;

        public CustomCorsMiddleware(RequestDelegate next)
        {
            _next = next;
        }

        public async Task InvokeAsync(HttpContext context)
        {
            var current = context;
            string holdOrigin = "";

            if (current.Response.Headers.ContainsKey("Access-Control-Allow-Origin"))
            {
                holdOrigin = current.Request.Headers["Origin"];
                current.Response.Headers.Remove("Access-Control-Allow-Origin");
            }
            if (current.Response.Headers.ContainsKey("Access-Control-Allow-Credentials"))
            {
                current.Response.Headers.Remove("Access-Control-Allow-Credentials");
            }

            if (!string.IsNullOrEmpty(current.Request.Headers["Origin"]) &&
                (current.Request.Headers["Origin"].Contains("localhost:") ||
                 current.Request.Headers["Origin"].Contains(".biadev.inside.ams1907.") ||
                 current.Request.Headers["Origin"].Contains(".biaalpha.inside.ups.") ||
                 current.Request.Headers["Origin"].Contains(".bia.inside.ups.")))
            {
                string test = current.Request.Headers["Origin"];
                string[] splitHost = test.Split('.');
                if (splitHost.Length <= 5)
                {
                    current.Response.Headers.Append("Access-Control-Allow-Origin", current.Request.Headers["Origin"]);
                    current.Response.Headers.Append("Access-Control-Allow-Credentials", "true");
                }
            }
            else
            {
                current.Response.Headers.Append("Access-Control-Allow-Origin", holdOrigin);
            }

            if (current.Request.Method.ToUpper() == "OPTIONS")
            {
                current.Response.Headers.Append("Access-Control-Allow-Methods", "GET,POST");

                string requestHeaders = current.Request.Headers["Access-Control-Request-Headers"];
                if (!string.IsNullOrWhiteSpace(requestHeaders))
                {
                    current.Response.Headers.Append("Access-Control-Allow-Headers", requestHeaders);
                }

                current.Response.StatusCode = 204; // No Content
                return;
            }

            await _next(context);
        }
    }
}
