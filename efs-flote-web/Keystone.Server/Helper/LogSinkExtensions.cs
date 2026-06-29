using Serilog.Configuration;
using Serilog;
using Keystone.DAL.Provider;

namespace Keystone.Server.Helper
{
    public static class LogSinkExtensions
    {
       public static LoggerConfiguration AddExceptionReportingSink(this LoggerSinkConfiguration loggerConfiguration,IConfiguration configuration, IFormatProvider? formatProvider = null)
        {
            return loggerConfiguration.Sink(new ExceptionReportingSink(formatProvider, configuration));
        }
    }
}
