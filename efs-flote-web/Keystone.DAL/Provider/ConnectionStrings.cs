
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Configuration;
using System;
using System.Collections.Concurrent;
using System.Collections.Generic;
using System.Data.Common;
using System.Linq;
using static Keystone.DAL.Utility.Hashicorp;

namespace Keystone.DAL.Utility
{
    public static class ConnectionStrings
    {
        
        //private readonly static object lockObj = new object();
        private static readonly ConcurrentDictionary<string, string> _connections = new ConcurrentDictionary<string, string>();
        private static readonly ConcurrentDictionary<string, string> _connectionsRaw = new ConcurrentDictionary<string, string>();

        public static Dictionary<string, string> ConnectionStringTemplates = new Dictionary<string, string>()
        {
            { "SQL", "Data Source={ServerNameInstanceName};Initial Catalog={DatabaseName};User ID={Username};Password={DecryptedAuthKey};Connection Timeout=300;" },
            { "Oracle", "Data Source=(DESCRIPTION =(ADDRESS_LIST = (ADDRESS = (PROTOCOL = TCP) (HOST = {ServerName}) (PORT = {Port})))(CONNECT_DATA = (SERVICE_NAME = {DatabaseName}.{GlobalName}) (GLOBAL_NAME = {DatabaseName}.{GlobalName})));User Id={Username};Password={DecryptedAuthKey};Connection Timeout=300;" }
        };

        internal static void AddConnectionString(Connection connection)
        {
            string connectionTemplate = ConnectionStringTemplates.ContainsKey(connection.ServerType) ? ConnectionStringTemplates[connection.ServerType] : throw new Exception("Missing ServerType ConnectionStringTemplate");

            string connectionString = connectionTemplate.Replace("{ServerName}", connection.ServerName).Replace("{DatabaseName}", connection.DatabaseName)
                .Replace("{ServerNameInstanceName}", (connection.ServerType=="SQL" && !String.IsNullOrWhiteSpace(connection.Port)) ? @"{ServerNameInstanceName}," + connection.Port : @"{ServerNameInstanceName}")
                .Replace("{InstanceName}", connection.InstanceName).Replace("{Port}", connection.Port).Replace("{GlobalName}", connection.GlobalName).Replace("{Username}", connection.Username)
                .Replace("{ServerNameInstanceName}", connection.ServerName + (!String.IsNullOrWhiteSpace(connection.InstanceName) ? @"\" + connection.InstanceName : ""))
                .Replace("{DecryptedAuthKey}", connection.DecryptedAuthKey);

            if (connection.Raw) _connectionsRaw.AddOrUpdate(connection.ConnectionName, connectionString, (key, oldValue) => connectionString);

            _connections.AddOrUpdate(connection.ConnectionName, connectionString, (key, oldValue) => connectionString);
        }

        public static string GetConnectionString(string ConnectionName)
        {
            string connectionString = ConnectionName;
            try
            {
                if (_connections.ContainsKey(ConnectionName))
                {
                    connectionString = _connections[ConnectionName];
                }
                else 
                {
                    VaultCredentials vaultCredentials = ConnectionUser.DecryptAuthKey(ConnectionName);
                    Connection connection;
                    if (vaultCredentials != null)
                    {
                        connection = new Connection()
                        {
                            ConnectionName = ConnectionName,
                            ServerType = "SQL",
                            ServerName = vaultCredentials.Server.Trim(),
                            InstanceName = "",
                            Port = "",
                            DatabaseName = vaultCredentials.Database.Trim(),
                            GlobalName = "",
                            Username = vaultCredentials.User.Trim(),
                            DecryptedAuthKey = vaultCredentials.Password.Trim(),
                            Provider = "SQL",
                            IncludeProvider = true,
                            Raw = false
                        };
                    }
                    else
                    {
                        var connectionInfoList = ConnectionStrings.GetConnectionInfo(ConfigurationHelper.Configuration, ConnectionName);
                        connection = new Connection()
                        {
                            ConnectionName = ConnectionName,
                            ServerType = "SQL",
                            ServerName = connectionInfoList[0].Trim(),
                            InstanceName = "",
                            Port = "",
                            DatabaseName = connectionInfoList[1].Trim(),
                            GlobalName = "",
                            Username = connectionInfoList[2].Trim(),
                            DecryptedAuthKey = connectionInfoList[3].Trim(),
                            Provider = "SQL",
                            IncludeProvider = true,
                            Raw = false
                        };
                    }


                    AddConnectionString(connection);
                    connectionString = _connections[ConnectionName];
                }
            }
            catch (Exception ex)
            {
                throw;
            }

            return connectionString;
        }

        //Temp fix for azure key vault

        private static List<string> GetConnectionInfo(IConfiguration configuration, string connectionName)
        {
            var connectionString = configuration.GetConnectionString(connectionName);

            if (string.IsNullOrEmpty(connectionString))
                throw new Exception($"Connection string '{connectionName}' not found.");

            var builder = new DbConnectionStringBuilder
            {
                ConnectionString = connectionString
            };

            return new List<string>(){
                GetValue(builder, "Server", "Data Source"),
                GetValue(builder, "Database", "Initial Catalog"),
                GetValue(builder, "User Id", "UID"),
                GetValue(builder, "Password", "Pwd")
            };
        }

        private static string GetValue(DbConnectionStringBuilder builder, params string[] keys)
        {
            foreach (var key in keys)
            {
                if (builder.TryGetValue(key, out var value))
                {
                    return value?.ToString();
                }
            }
            return null;
        }

        //end temp fix
    }

    public class Connection
    {
        public string ConnectionName { get; set; }
        public string ServerType { get; set; }
        public string ServerVersion { get; set; }
        public string ServerName { get; set; }
        public string InstanceName { get; set; }
        public string Port { get; set; }
        public string DatabaseName { get; set; }
        public string GlobalName { get; set; }
        public string Username { get; set; }
        public string DecryptedAuthKey { get; set; }
        public string Provider { get; set; }
        public bool IncludeProvider { get; set; }
        public bool Raw { get; set; }
        public Connection()
        {

        }
    }

    public static class ConnectionUser
    {
        internal static VaultCredentials DecryptAuthKey(string encryptString)
        {
            try
            {
                return Hashicorp.DecryptInternal(encryptString).Result;
            }
            catch(Exception ex)
            {
                return null;
            }
            
        }
    }
}
