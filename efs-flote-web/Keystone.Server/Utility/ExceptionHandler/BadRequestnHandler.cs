using Microsoft.AspNetCore.Diagnostics;
using Microsoft.AspNetCore.Mvc;
using ILogger = Serilog.ILogger;

namespace Keystone.Server.Utility.ExceptionHandler
{
    internal sealed class BadRequestnHandler : IExceptionHandler
    {
        private readonly ILogger<BadRequestnHandler> _logger;

        public BadRequestnHandler(ILogger<BadRequestnHandler> logger)
        {
            _logger = logger;
        } 

        public async ValueTask<bool> TryHandleAsync(
            HttpContext httpContext,
            Exception exception,
            CancellationToken cancellationToken)
        {
            var message = exception.Message;
            if (exception is BadHttpRequestException)
            {
                _logger.LogError(string.Format("Error occured : {0}", message), message);

                var problemDetails = new ProblemDetails
                {
                    Status = StatusCodes.Status400BadRequest,
                    Detail = exception.Message,
                    Title = "Request are not as per the actual request.."
                };

                httpContext.Response.StatusCode = problemDetails.Status.Value;

                await httpContext.Response
                    .WriteAsJsonAsync(problemDetails, cancellationToken);

                return true;
            }
            return false;
        }
    }
}
