using Microsoft.AspNetCore.Authorization;
using Microsoft.Extensions.Configuration;
using System;
using System.IO;
using System.Linq;

namespace Keystone.DAL.Utility 
{
    //[Authorize] 
    public static class ConfigurationHelper 
    {
        private static IConfigurationRoot _config;
        private static string _environment;
        private static bool _initialized = false;

        public static bool IsInitialized => _initialized;
        public static IConfigurationRoot Configuration => _config;

        public static void Initialize(string environment)
        {
            if (_initialized) return;

            _environment = environment;

            var basePath = Directory.GetCurrentDirectory();
            Console.WriteLine($"[ConfigurationHelper] Initializing configuration. BasePath={basePath} Environment={_environment}");

            var builder = new ConfigurationBuilder()
                .SetBasePath(basePath)
                .AddJsonFile("appsettings.json", optional: false, reloadOnChange: true)
                .AddJsonFile($"appsettings.{_environment}.json", optional: true, reloadOnChange:true)
                .AddEnvironmentVariables();

            _config = builder.Build();

            // Log presence of critical sections/keys
            LogKey("AzureAd:ClientId");
            LogKey("AzureAd:Audience");
            LogKey("Connection:Key");
            LogKey("ApiSettings:BaseUrl");
            LogKey("ApiSettings:SfabraUrl"); // Log the new key

            _initialized = true;
            Console.WriteLine("[ConfigurationHelper] Configuration initialized.");
        }

        private static void LogKey(string key)
        {
            var value = _config[key];
            Console.WriteLine(value is null
                ? $"[ConfigurationHelper] MISSING key: {key}"
                : $"[ConfigurationHelper] Loaded {key} = {value}");
        }

        // Get HashiCorp Vault Auth Key (secret) set in enviromental appsettings.json file
        public static string GetAuthKey() 
        {
            return _config["Connection:Key"] ?? throw new Exception("Missing Connection:Key in config.");
        }

        public static string GetEnvironment() => _environment;

        public static string GetApiBaseUrl() 
        {
            return _config["ApiSettings:BaseUrl"] ?? throw new Exception("Missing ApiSettings:BaseUrl in config.");
        }

        public static string GetFloteUrl()
        {
            return _config["ApiSettings:floteUrl"] ?? throw new Exception("Missing ApiSettings:SfabraUrl in config.");
        }

        //FLOTE SPECIFIC - DO NO COPY BELOW
        public static string GetUploadPath(string pathType)
        {
            string[] validKeys = { };
            string key = $"UploadSettings:{pathType}";

            if (validKeys.Contains(pathType))
            {
                return _config[key] ?? throw new Exception($"Missing configuration for: {key}");
            }

            throw new ArgumentException($"Invalid pathType: {pathType}. Valid options are: {string.Join(", ", validKeys)}");
        }
    }
}
