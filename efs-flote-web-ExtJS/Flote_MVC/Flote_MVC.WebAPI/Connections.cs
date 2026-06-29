/* ====================================================================================================
NAME:				[Database Connection]
BEHAVIOR:		Execute database connection for respective database.
_______________________________________________________________________________________________________
REVISION HISTORY
-------------------------------------------------------------------------------------------------------
Date			    Modified By			  Modifications
-------------------------------------------------------------------------------------------------------
07/26/2016        Sudhir Dandale		 Created.
 ======================================================================================================*/
using System;
using System.Configuration;

namespace Flote.WebAPI.WebAPI
{
    static public class Connections
    {
        /// <summary>
        /// Get the connection string .
        /// </summary>
        /// <param name="connection"></param>
        /// <returns></returns>
        private static string getConnectionString(string connection)
        {
            if (BIACore.Provider.ConnectionStrings.ConnectionStringExists(connection)) return connection;
            ConnectionStringSettings cs = ConfigurationManager.ConnectionStrings[connection];
            if (cs == null)
            {
                Exception exception = new Exception(message: string.Format("Unable to find '{0}' in connection strings from app/web config.", connection));
                throw exception;
            }

            return cs.ConnectionString;
        }

        /// <summary>
        /// Get the Flote connection string.
        /// </summary>
        public static string Flote
        {
            get { return getConnectionString("Flote"); }
        }
               
        /// <summary>
        /// Get the E2k Image data string.
        /// </summary>
        public static string E2kImageData
        {
            get { return getConnectionString("Oracle"); }
        }

        /// <summary>
        /// Get Flote Raw Connection
        /// </summary>
        public static string Flote_Raw
        {
            get { return BIACore.Provider.ConnectionStrings.GetConnectionStringRaw("Flote"); }

        }

        /// <summary>
        /// Get E2kImageData Raw Connection
        /// </summary>
        public static string E2kImageData_Raw
        {
            get { return BIACore.Provider.ConnectionStrings.GetConnectionStringRaw("Oracle"); }

        }
        public static string BIASecurity
        {
            get { return getConnectionString("BIASecurity"); }
        }
    }
}
