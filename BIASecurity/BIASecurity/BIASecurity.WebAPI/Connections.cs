using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Configuration;

namespace BIASecurity.WebAPI
{
    public class Connections
    {

        private static string getConnectionString(string connection)
        {
            if (BIACore.Provider.ConnectionStrings.ConnectionStringExists(connection)) return connection;
            ConnectionStringSettings cs = ConfigurationManager.ConnectionStrings[connection];
            if (cs == null) throw new Exception(string.Format("Unable to find '{0}' in connection strings from app/web config.", connection));
            return cs.ConnectionString;
        }
        public static string getConnectionStringRaw(string connection)
        {
            if (String.IsNullOrEmpty(BIACore.Provider.ConnectionStrings.GetConnectionStringRaw(connection)))
            {
                throw new Exception(string.Format("Unable to find '{0}' in connection strings from app/web config.", connection));                
            }
            else
                return BIACore.Provider.ConnectionStrings.GetConnectionStringRaw(connection);            
        }

        public static string BIASecurity
        {
            get { return getConnectionString("BIASecurity"); }
        }

        //public static string ORACLEDB
        //{
        //    get { return BIACore.Provider.ConnectionStrings.GetConnectionStringRaw("ORACLEDB"); }
        //}

        public static string BIALogs
        {
            get { return getConnectionString("Log"); }
        }

        public static string OldSecurity
        {
            get { return getConnectionString("Security"); }
        }
         public static string ACIP
        {
            get { return getConnectionString("ACIP"); }
        }
        public static string CTP
        {
            get { return getConnectionString("CTP"); }
        }

    }
}
