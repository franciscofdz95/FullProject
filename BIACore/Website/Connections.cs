using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Configuration;

namespace BIACore
{
    internal class Connections
    {
        private static string getConnectionString(string connection)
        {
            if (BIACore.Provider.ConnectionStrings.ConnectionStringExists(connection)) return connection;
            ConnectionStringSettings cs = ConfigurationManager.ConnectionStrings[connection];
            if (cs == null) throw new Exception(string.Format("Unable to find '{0}' in connection strings from app/web config.", connection));
            return cs.ConnectionString;
        }

        internal static string Log
        {
            get { return getConnectionString("Log"); }
        }

        internal static string Security
        {
            get { return getConnectionString("Security"); }
        }

        internal static string NewSecurity
        {
            get { return getConnectionString("NewSecurity"); }
        }

        internal static string MyReports
        {
            get { return getConnectionString("MyReports"); }
        }

        internal static string Notify
        {
            get { return getConnectionString("Notify"); }
        }
    }
}