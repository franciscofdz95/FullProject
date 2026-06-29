using Microsoft.AspNetCore.Diagnostics;
using Microsoft.AspNetCore.Mvc;
using ILogger = Serilog.ILogger;

namespace Keystone.Server.Utility.ExceptionHandler
{
    internal sealed class NotImplementedExceptionHandler : IExceptionHandler
    {
        private readonly ILogger<NotImplementedExceptionHandler> _logger;

        public NotImplementedExceptionHandler(ILogger<NotImplementedExceptionHandler> logger)
        {
            _logger = logger;
        }

        public async ValueTask<bool> TryHandleAsync(
            HttpContext httpContext,
            Exception exception,
            CancellationToken cancellationToken)
        {
            var message = exception.Message;
            if (exception is NotImplementedException)
            {
                _logger.LogError(string.Format("Error occured : {0}", message), message);

                var problemDetails = new ProblemDetails
                {
                    Status = StatusCodes.Status501NotImplemented,
                    Detail = exception.Message,
                    Title = "Something went wrong.."
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
