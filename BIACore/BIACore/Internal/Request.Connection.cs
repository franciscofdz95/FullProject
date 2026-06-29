using BIACore.Log;
using System;
using System.Collections.Generic;

namespace BIACore.Internal
{
    internal static partial class Request
    {
        internal static List<Model.Connection> ApplicationConnections()
        {
            List<Model.Connection> appConnections = null;

            DateTime start = DateTime.UtcNow;
            try
            {
                // this isn't something we should ever really cache.
                appConnections = Web.Client.Post<List<Model.Connection>>(API.URL(API.APPLICATION_CONNECTIONS),
                new { AppCode = Settings.Config.AppCode, Environment = Settings.Config.BIAEnvironment });
            }
            catch { }
            finally
            {
                LogFactory.Performance("Request ApplicationConnections", DateTime.UtcNow.Subtract(start).TotalSeconds);
            }

            return appConnections;
        }
    }
}
