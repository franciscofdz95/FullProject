using BIACore.Extensions;
using BIACore.Model;
using System;
using System.Collections.Generic;
using System.Collections.Concurrent;
using System.Linq;

namespace BIACore.Provider
{
    public static class ConnectionStrings
    {
        //private readonly static object lockObj = new object();
        private static ConcurrentDictionary<string, string> _connections = new ConcurrentDictionary<string, string>();
        private static ConcurrentDictionary<string, string> _connectionsRaw = new ConcurrentDictionary<string, string>();
        public static Dictionary<string, string> ConnectionStringTemplates = new Dictionary<string, string>()
        {
            { "SQL", "Data Source={ServerNameInstanceName};Initial Catalog={DatabaseName};User ID={Username};Password={DecryptedAuthKey};" },
            { "Oracle", "Data Source=(DESCRIPTION =(ADDRESS_LIST = (ADDRESS = (PROTOCOL = TCP) (HOST = {ServerName}) (PORT = {Port})))(CONNECT_DATA = (SERVICE_NAME = {DatabaseName}.{GlobalName}) (GLOBAL_NAME = {DatabaseName}.{GlobalName})));User Id={Username};Password={DecryptedAuthKey};" }
        };

        internal static void AddConnectionString(Connection connection)
        {
            string connectionTemplate = ConnectionStringTemplates.ContainsKey(connection.ServerType) ? ConnectionStringTemplates[connection.ServerType] : throw new Exception("Missing ServerType ConnectionStringTemplate");

            //This needs to have a 5 attempt retry with a small delay.. (aka 5 seconds between retry)
            string connectionString = connectionTemplate.Replace("{ServerName}", connection.ServerName).Replace("{DatabaseName}", connection.DatabaseName)
                .Replace("{ServerNameInstanceName}", (connection.ServerType=="SQL" && !String.IsNullOrWhiteSpace(connection.Port)) ? @"{ServerNameInstanceName}," + connection.Port : @"{ServerNameInstanceName}")
                .Replace("{InstanceName}", connection.InstanceName).Replace("{Port}", connection.Port).Replace("{GlobalName}", connection.GlobalName).Replace("{Username}", connection.Username)
                .Replace("{ServerNameInstanceName}", connection.ServerName + (!String.IsNullOrWhiteSpace(connection.InstanceName) ? @"\" + connection.InstanceName : ""))
                .Replace("{DecryptedAuthKey}", ConnectionUser.DecryptAuthKey(connection.AuthKey));

            //ConnectionUser.DecryptAuthKey(connection.AuthKey) != connection.AuthKey

            if (connection.Raw) _connectionsRaw.AddOrUpdate(connection.ConnectionName, connectionString, (key, oldValue) => connectionString);

            _connections.AddOrUpdate(connection.ConnectionName, connectionString, (key, oldValue) => connectionString);
        }

        internal static string GetConnectionString(string ConnectionName)
        {
            string connectionString = ConnectionName;
            try
            {
                if (_connections.ContainsKey(ConnectionName))
                {
                    connectionString = _connections[ConnectionName];
                }
            }
            catch (Exception ex)
            {
                Log.LogFactory.Exception(new Exception("BIACore GetConnectionString failed.", ex));
                throw;
            }

            return connectionString;
        }

        // We are switching GetConnectionString over to Public to resolve issues where applications need a access to the raw connection string to support non-BIACore Provider data calls.
        // However, this should reviewed periodically to see if BIACore "should" support additional provider options to applications.
        // OTHER OPTION is to add a flag to the connections or apps that prevent "public" access to restricted raw connection details..
        public static string GetConnectionStringRaw(string ConnectionName)
        {
            string connectionString = ConnectionName;
            try
            {
                if (_connectionsRaw.ContainsKey(ConnectionName))
                {
                    connectionString = _connectionsRaw[ConnectionName];
                }
            }
            catch (Exception ex)
            {
                Log.LogFactory.Exception(new Exception("BIACore GetConnectionStringRaw failed.", ex));
                throw;
            }

            return connectionString;
        }

        public static void GetApplicationConnections()
        {
            if (BIACore.Settings.Config.AppCode != "BIACore")
            {
                List<BIACore.Model.Connection> applicationConnections = BIACore.Internal.Request.ApplicationConnections();
                if (applicationConnections != null)
                {
                    //ConnectionStrings.ClearConnectionStrings(); // We are doing add or update in the AddConnections method.
                    foreach (BIACore.Model.Connection con in applicationConnections)
                        BIACore.Provider.ConnectionStrings.AddConnection(con);
                }

            }
        }

        internal static void ClearConnectionStrings()
        {
            if (Settings.Config.AppCode != "BIACore")
            {
                _connections = new ConcurrentDictionary<string, string>();
                _connectionsRaw = new ConcurrentDictionary<string, string>();
            }
        }
        public static bool ConnectionStringExists(string ConnectionName)
        {
            return _connections.ContainsKey(ConnectionName);
        }
        public static void AddConnection(Model.Connection con)
        {
            ConnectionStrings.AddConnectionString(con);
        }
    }
}
