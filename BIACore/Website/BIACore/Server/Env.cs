using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Web;

namespace BIACore.Server
{
    internal static class Env
    {
        private const string ENVIRONMENT = "BIACore_Environment";
        private const string SERVER = "BIACore_Server";

        internal static string Current
        {
            get
            {
                if (HttpContext.Current.Items[ENVIRONMENT] == null)
                {
                    string env = string.Empty;
                    string current = HttpContext.Current.Request.Url.Host.ToLower();

                    if (current.Contains("biadev")) env = "dev";
                    else if (current.Contains("biaqa")) env = "qa";
                    else if (current.Contains("biamir")) env = "mir";
                    else if (current.Contains("biaalpha")) env = "dev";
                    else if (current.Contains("bia-") || current.Contains("bia")) env = "prod";

                    HttpContext.Current.Items[ENVIRONMENT] = env;
                }

                return (string)HttpContext.Current.Items[ENVIRONMENT];
            }
        }

        internal static string CurrentServer
        {
            get
            {
                string env = Current;

                if (HttpContext.Current.Items[SERVER] == null)
                {
                    string current = HttpContext.Current.Request.Url.Host.ToLower();

                    // We need to change this to be able to determine which of the farm servers it is running from!
                    // There is a file the bia/CustomTag directory called server.ini and server.txt, which has the actual server name (bia-a - bia-d)
                    string server = string.Empty;

                    if (current.Contains("biadev")) server = "dev";
                    else if (current.Contains("biaqa")) server = "qa";
                    else if (current.Contains("biamir")) server = "mir";
                    else if (current.Contains("biaalpha")) server = "dev";
                    else if ((current.Contains("bia-") || current.Contains("bia")) && Environment.MachineName == "SVRP000346C5") server = "bia-a";
                    else if ((current.Contains("bia-") || current.Contains("bia")) && Environment.MachineName == "SVRP000346E5") server = "bia-b";
                    else if ((current.Contains("bia-") || current.Contains("bia")) && Environment.MachineName == "SVRP000346E7") server = "bia-c";
                    else if ((current.Contains("bia-") || current.Contains("bia")) && Environment.MachineName == "SVRP000346EA") server = "bia-d";

                    HttpContext.Current.Items[SERVER] = server;
                }

                return (string)HttpContext.Current.Items[SERVER];
            }
        }
    }
}