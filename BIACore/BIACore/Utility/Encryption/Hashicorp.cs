using System;
using System.Globalization;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Net;
using System.Net.Http;
using System.Threading;
using VaultSharp;
using VaultSharp.Core;
using VaultSharp.V1;
using VaultSharp.V1.Commons;
using VaultSharp.V1.AuthMethods;
using VaultSharp.V1.AuthMethods.Cert;
using VaultSharp.V1.AuthMethods.Token;
using VaultSharp.V1.SecretsEngines.KeyValue;
using VaultSharp.V1.AuthMethods.Token.Models;
using System.Security.Cryptography.X509Certificates;
using BIACore.Utility;
using BIACore.Log;

namespace BIACore.Utility.Encryption
{
    /// <summary>
    /// Hashicorp class used within Encryption project
    /// </summary>
    public class Hashicorp
    {

        private static IVaultClient _authenticatedVaultClient;
        private static Int32 LeaseDuration;
        private static DateTime LeaseExpires;

        /// <summary>
        /// Hashicorp Constructor
        /// </summary>
        /// <returns></returns>
        public Hashicorp()
        {
            //LogFactory.Error("HashiCorp Constructor");
            //TLSLogin();
        }

        /// <summary>
        /// Public Encyrpt with Hashicorp Vault
        /// </summary>
        /// <param name="authKey"></param>
        /// <returns></returns>
        public static string Encrypt(string authKey)
        {
            return Internal.Request.Encrypt(authKey);
        }

        /// <summary>
        /// Public Encyrpt with Hashicorp Vault
        /// </summary>
        /// <param name="encryptString"></param>
        /// <returns></returns>
        public static string Decrypt(string encryptString)
        {
            return Internal.Request.Decrypt(encryptString);
        }

        /// <summary>
        /// Authenticates to Hashicorp Vault
        /// </summary>
        /// <returns></returns>
        public static void TLSLogin()
        {

            LogFactory.Error("HashiCorp TLSLogin Auth/Token");
            var currentPath = AppDomain.CurrentDomain.BaseDirectory.ToString();
            ServicePointManager.SecurityProtocol = SecurityProtocolType.Tls12;

            string URL = "https://vault.ww.inside.ups.com:8200"; // production
            string CertPath = currentPath + "certificates\\bia.vault.ups.com.p12"; // production
            string CertCode = "certblue";
            if (BIACore.Settings.Config.Testnet)
            {
                CertPath = currentPath + "certificates\\bia.vault.ams1907.com.p12";  // TestNet
                URL = "https://vault.ww.inside.ams1907.com:8200";  // TestNet
                //CertCode = "certgreen";
            }

            byte[] certBytes = File.ReadAllBytes(CertPath);
            var certificate = new X509Certificate2(certBytes, "Package?04+", X509KeyStorageFlags.MachineKeySet); //, X509KeyStorageFlags.MachineKeySet
            //IMPORTANT, the MountPoint below "cert" will change during certificate changes to HashiCorp ANNUALLY!! M.Erdmann 1/26/2023
            // odd numbered years are certblue and even numbered years are certgreen !!
            IAuthMethodInfo authMethod = new CertAuthMethodInfo(CertCode, certificate);
            var vaultClientSettings = new VaultClientSettings(URL, authMethod);
            vaultClientSettings.Namespace = "ups";
            _authenticatedVaultClient = new VaultClient(vaultClientSettings);

            _authenticatedVaultClient.V1.Auth.PerformImmediateLogin();

            vaultClientSettings.Namespace = "ups/bia/";
            _authenticatedVaultClient.Settings.Namespace = "ups/bia/";

            RefreshToken(1);
          
            Task.Factory.StartNew(() =>
            {
                //Resets the Hashicorp Vault Client every 1410 minutes (23 hours 30 minutes to leave some room for the 24 hour hard TTL of HashiCorp)
                Thread.Sleep(TimeSpan.FromHours(18));
                LogFactory.Error("HashiCorp TLSLogin Reset Vault Client");
                _authenticatedVaultClient.Settings.Namespace = "ups";
                _authenticatedVaultClient.V1.Auth.Token.RevokeSelfAsync().ConfigureAwait(false);
                TLSLogin();
            });

        }

        /// <summary>
        /// Refresh Token Method
        /// </summary>
        /// <param name="Skip"></param>
        /// <returns></returns>
        private static void RefreshToken(Int16 Skip)
        {

            if (Skip != 1)
            { 
                //LogFactory.Error("Hashicorp RefreshToken Task Refresh Token");
                _authenticatedVaultClient.Settings.Namespace = "ups";
                _authenticatedVaultClient.V1.Auth.ResetVaultToken();
                _authenticatedVaultClient.V1.Auth.Token.LookupSelfAsync();
                _authenticatedVaultClient.Settings.Namespace = "ups/bia/";
            }
            Task.Factory.StartNew(() =>
            {
                //Resets the Hashicorp Vault Token every 55 minutes
                Thread.Sleep(TimeSpan.FromMinutes(55));
                RefreshToken(0);
            });
        }

        /// <summary>
        /// Crypt for encrypt and decrypt
        /// </summary>
        /// <param name="crypttext"></param>
        /// <returns></returns>
        public static async Task<string> EncryptInternal(string crypttext)
        {
            try {


                if (_authenticatedVaultClient == null)
                {
                    TLSLogin();
                }

                var secretPath = BIACore.Utility.Randomizer.GetRandomID();
                var value = new Dictionary<string, object> { { "password", crypttext } };
                var secretResult = await _authenticatedVaultClient.V1.Secrets.KeyValue.V2.WriteSecretAsync(secretPath, value, null, "/kv/data/").ConfigureAwait(false);

                return secretPath;
            }
            catch (Exception ex)
            {
                //LogFactory.Exception(ex);
                throw (ex);
            }
        }

        /// <summary>
        /// Decrypt
        /// </summary>
        /// <param name="secretPath"></param>
        /// <returns></returns>
        public static async Task<string> DecryptInternal(string secretPath)
        {

            try
            {

                if (_authenticatedVaultClient == null)
                {
                     TLSLogin();
                }

                Secret<SecretData> kv2Secret = await _authenticatedVaultClient.V1.Secrets.KeyValue.V2.ReadSecretAsync(path: secretPath, mountPoint: "/kv/data/").ConfigureAwait(false);

                SecretData dataDictionary = kv2Secret.Data;

                object value = null;

                var test = new Dictionary<string, object>(dataDictionary.Data);

                test.TryGetValue("password", out value);

                return value.ToString();
            }
            catch (Exception ex)
            {
                LogFactory.Error("Hashicorp ReadSecretAsync - Retry TLSLogin!");
                TLSLogin();
                //LogFactory.Exception(ex);
                throw;
            }
}

    }
}
