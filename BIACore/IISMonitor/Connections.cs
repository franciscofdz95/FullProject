using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Configuration;

namespace IISMonitor
{
    internal class Connections
    {
        private static string getConnectionString(string connection)
        {
            ConnectionStringSettings cs = ConfigurationManager.ConnectionStrings[connection];
            if (cs == null) throw new Exception(string.Format("Unable to find '{0}' in connection strings from app/web config.", connection));
            return cs.ConnectionString;
        }

        internal static string Security
        {
            get { return getConnectionString("Security"); }
        }

        internal static string OldSecurity
        {
            get { return getConnectionString("OldSecurity"); }
        }

        internal static string MyReports
        {
            get { return getConnectionString("MyReports"); }
        }
    }
}