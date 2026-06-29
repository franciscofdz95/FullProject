using Microsoft.Extensions.Hosting;
using Serilog;
using System;
using System.Collections.Concurrent;
using System.Collections.Generic;
using System.Diagnostics;
using System.Globalization;
using System.IO;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Reflection;
using System.Reflection;
using System.Security.Cryptography.X509Certificates;
using System.Text;
using System.Threading;
using System.Threading.Tasks;
using VaultSharp;
using VaultSharp.Core;
using VaultSharp.V1;
using VaultSharp.V1.AuthMethods;
using VaultSharp.V1.AuthMethods.Cert;
using VaultSharp.V1.AuthMethods.Token;
using VaultSharp.V1.AuthMethods.Token.Models;
using VaultSharp.V1.Commons;
using VaultSharp.V1.SecretsEngines.KeyValue;
using static Azure.Core.HttpHeader;


namespace Keystone.DAL.Utility
{
    public class Hashicorp
    {

        private static IVaultClient _authenticatedVaultClient;
        private static Int32 LeaseDuration;
        private static DateTime LeaseExpires;
        private static string _environment;
        private static string _appNameSpace = "ups/sfabra/";

        public class VaultCredentials
        {
            public string? Password { get; set; }
            public string? Server { get; set; }
            public string? Database { get; set; }
            public string? User { get; set; }
        }

        public Hashicorp()
        {
            //TLSLogin();
        }

        public static void TLSLogin(string environment)
        {
            _environment = environment;
            ServicePointManager.SecurityProtocol = SecurityProtocolType.Tls12;

            /*
                IMPORTANT - set Build Action of the certificate to "Embedded Resource" in Visual Studio -- 
                                Right click file --> properties

                MountPoint below "cert" will change during certificate changes to HashiCorp ANNUALLY!!
                odd numbered years are certblue and even numbered years are certgreen !!
            */

            string URL;
            string CertPath;
            string CertCode = "certblue";
            string CertPW = "SFABRA-Is-the-best!1";

            switch (environment.ToLower())
            {
                case "production":
                case "alpha":
                case "development":
                    URL = "https://vault.ww.inside.ups.com:8200";
                    CertPath = "Keystone.DAL.Certificates.sfabra.vault.ups.com.pfx";
                    break;
                case "testnet":
                    URL = "https://vault.ww.inside.ams1907.com:8200";
                    CertPath = "Keystone.DAL.Certificates.sfabra.vault.ams1907.com.pfx";
                    break;
                default:
                    throw new ArgumentException($"Unsupported environment: {environment}");
            }
            
            byte[] certBytes;
            Assembly assembly = Assembly.GetExecutingAssembly();

            using (Stream stream = assembly.GetManifestResourceStream(CertPath))
            {
                if (stream == null)
                {
                    throw new FileNotFoundException($"Embedded certificate resource '{CertPath}' not found. Make sure its 'Build Action' is set to 'Embedded Resource' and the path is correct.");
                }

                certBytes = new byte[stream.Length];
                stream.Read(certBytes, 0, (int)stream.Length);
            }

            var certificate = new X509Certificate2(certBytes, CertPW, X509KeyStorageFlags.MachineKeySet); //, X509KeyStorageFlags.MachineKeySet

            IAuthMethodInfo authMethod = new CertAuthMethodInfo(CertCode, certificate);
            var vaultClientSettings = new VaultClientSettings(URL, authMethod);
            vaultClientSettings.Namespace = "ups";
            _authenticatedVaultClient = new VaultClient(vaultClientSettings);

            _authenticatedVaultClient.V1.Auth.PerformImmediateLogin();

            vaultClientSettings.Namespace = _appNameSpace;
            _authenticatedVaultClient.Settings.Namespace = _appNameSpace;

            RefreshToken(1);

            Task.Factory.StartNew(() =>
            {
                //Resets the Hashicorp Vault Client every 1410 minutes (23 hours 30 minutes to leave some room for the 24 hour hard TTL of HashiCorp)
                Thread.Sleep(TimeSpan.FromHours(18));
                _authenticatedVaultClient.Settings.Namespace = "ups";
                _authenticatedVaultClient.V1.Auth.Token.RevokeSelfAsync().ConfigureAwait(false);
                TLSLogin(_environment);
            });

        }
        private static void RefreshToken(Int16 Skip)
        {

            if (Skip != 1)
            {
                _authenticatedVaultClient.Settings.Namespace = "ups"; //reset namespace to enable reset token - can't be done at app level
                _authenticatedVaultClient.V1.Auth.ResetVaultToken();
                _authenticatedVaultClient.V1.Auth.Token.LookupSelfAsync();
                _authenticatedVaultClient.Settings.Namespace = _appNameSpace; //assign back app namespace
            }
            Task.Factory.StartNew(() =>
            {
                //Resets the Hashicorp Vault Token every 55 minutes
                Thread.Sleep(TimeSpan.FromMinutes(55));
                RefreshToken(0);
            });
        }

        public static async Task<VaultCredentials> DecryptInternal(string secretPath)
        {
            try
            {
                if (_authenticatedVaultClient == null)
                {
                    TLSLogin(_environment);
                }

                Secret<SecretData> kv2Secret = await _authenticatedVaultClient.V1.Secrets.KeyValue.V2.ReadSecretAsync(path: secretPath, mountPoint: "/kv/data/").ConfigureAwait(false);

                SecretData dataDictionary = kv2Secret.Data;

                object passwordValue = null;
                object serverValue = null;
                object databaseValue = null;
                object userValue = null;

                dataDictionary.Data.TryGetValue("password", out passwordValue);
                dataDictionary.Data.TryGetValue("server", out serverValue);
                dataDictionary.Data.TryGetValue("database", out databaseValue);
                dataDictionary.Data.TryGetValue("user", out userValue);

                return new VaultCredentials
                {
                    Password = passwordValue?.ToString(),
                    Server = serverValue?.ToString(),
                    Database = databaseValue?.ToString(),
                    User = userValue?.ToString()
                };
            }
            catch (Exception ex)
            {
                TLSLogin(_environment);
                throw;
            }
        }
    }
}