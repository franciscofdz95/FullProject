using System;
using System.Configuration;
using System.Linq;
using System.Web;
using System.Text.RegularExpressions;

namespace BIACore.Configuration
{
    public class CoreElement : ConfigurationElement
    {
        private const string DEBUG = "debug";
        private const string BUNDLE = "bundle";
        private const string SQLDEBUG = "sqldebug";
        private const string APPCODE = "appCode";
        private const string PROXY = "globalProxy";
        private const string SERVER = "server";
        //private const string SERVERROOT = "serverRoot";
        private const string SERVERINTERNAL = "serverInternal";
        private const string BASEURL = "baseurl";
        private const string LOGURL = "logurl";
        private const string LOCALHOST = "localhost";
        private const string LOCALPORT = "localPort";

        [ConfigurationProperty(DEBUG, IsRequired = false)]
        public bool Debug
        {
            get
            {
                if (this[DEBUG] == null || !this.Properties.Contains(DEBUG))
                {
                    if (BIAEnvironment == "DEV") return true;
                    else if (BIAEnvironment == "QA") return true;
                    else if (BIAEnvironment == "ALPHA") return true;
                    else return false;
                }
                else return (bool)this[DEBUG];
            }
        }

        public bool Bundle
        {
            get
            {
                if (_Bundle == null)
                {
                    if (BIAEnvironment == "DEV") return false;
                    else if (BIAEnvironment == "ALPHA") return false;
                    else return true;
                }
                else return (bool)_Bundle;
            }
        }

        [ConfigurationProperty(BUNDLE, IsRequired = false)]
        private bool? _Bundle
        {
            get
            {
                if (this[BUNDLE] == null || !this.Properties.Contains(BUNDLE))
                {
                    if (BIAEnvironment == "DEV") return false;
                    else if (BIAEnvironment == "ALPHA") return false;
                    else return true;
                }
                else return (bool)this[BUNDLE];
            }
        }

        public bool SQLDebug
        {
            get
            {
                if (_SQLDebug == null) return Debug;
                else return (bool)_SQLDebug;
            }
        }

        [ConfigurationProperty(SQLDEBUG, IsRequired = false, DefaultValue = null)]
        private bool? _SQLDebug
        {
            get
            {
                if (this[SQLDEBUG] == null || !this.Properties.Contains(SQLDEBUG)) return Debug;
                else return (bool?)this[SQLDEBUG];
            }
        }
        [ConfigurationProperty(APPCODE, DefaultValue = null, IsRequired = true)]
        public string AppCode { get { return (string)this[APPCODE]; } }

        [ConfigurationProperty(PROXY, DefaultValue = true, IsRequired = false)]
        public bool Proxy { get { return (bool)this[PROXY]; } }

        [ConfigurationProperty(LOCALPORT, DefaultValue = "", IsRequired = false)]
        public string LocalPort { get { return (string)this[LOCALPORT]; } }

        [ConfigurationProperty(SERVER, IsRequired = false)]
        public string Server
        {
            get
            {

                string server = Environment.MachineName.ToUpper();

#if LocalTest
                if (BIAEnvironment == "DEV" && !Environment.MachineName.ToUpper().StartsWith("SVRP000") && AppCode.ToLower() == "biacore" && !String.IsNullOrWhiteSpace(LocalPort))
                {
                    return (HttpContext.Current != null && HttpContext.Current.Request != null && !HttpContext.Current.Request.IsSecureConnection
                        ? Uri.UriSchemeHttp : Uri.UriSchemeHttps) + Uri.SchemeDelimiter + "localhost:" + LocalPort;
                    //return "";
                }
                else return String.Format("bia{0}.inside.ups.com", BIAEnvironment.ToLower().Replace("prod", ""));
#else

                // For all sub-domain sites, the Server will need to return back to bia.inside.ups.com (aka the parent domain)!!! MME 02/07/2019

                string domain = "ups";

                if (server.ToLower().Contains("svrt")) domain = "ams1907";

                //Need to add a RegEx test for all Url.Host incoming to validate they are on a BIA domain.
                // RegEx: ^bia[a-z0-9\-]*\.inside\.(ups|ams1907)\.com$

                if (HttpContext.Current != null && HttpContext.Current.Request != null && Environment.MachineName.ToUpper().StartsWith("SVR"))
                {

                    Regex rx = new Regex(@"^bia[a-z0-9\-]*\.inside\.(ups|ams1907)\.com$", RegexOptions.Compiled | RegexOptions.IgnoreCase);
                    
                    string tempHost = "";
                    //This needs to restrict to only subdomains!! Not any host..
                    try
                    {
                        tempHost = HttpContext.Current.Request.Url.Host;
                    }
                    catch (Exception ex)
                    {
                        //Log.LogFactory.Exception(ex);
                    }

                    //if (tempHost != "" && tempHost.ToLower().Contains("inside.ams1907.com") )
                    //   return "biadev.inside.ams1907.com";

                    //remove app subdomain if it exists (wvar.biaalpha.inside.ups.com)
                    string[] splitHost = tempHost.Split('.');
                    if (splitHost.Length == 5)
                        tempHost = tempHost.Substring(tempHost.IndexOf('.') + 1);

                    //May need to consider below logic to handle vulnerability scans
                    //if (splitHost.Length > 5)
                    //    tempHost = "URI_has_to_many_subdomain_levels";

                    // https://sneaky.biasecurity.biaalpha.inside.ups.com --BAD
                    // https://a.b.c.biaalpha.inside.ups.com --BAD
                    // https://biaalpha.inside.ups.com  --GOOD
                    // https://biasecurity.biaalpha.inside.ups.com --GOOD

                    if (rx.IsMatch(tempHost)) return tempHost;
                    else return String.Format("bia{0}.inside.{1}.com", BIAEnvironment.ToLower().Replace("prod", ""), domain);

                }
                else
                {
                    //Switching from specific server bia16 - 1.inside.ups.com to bia.inside.ups.com with BIAEnvironment / tempHost instead of _BIAEnvironment
                    return String.Format("bia{0}.inside.{1}.com", BIAEnvironment.ToLower().Replace("prod", ""), domain);
                }

#endif
            }
        }


        ///<Summary>
        /// ServerInternal represents the parent domain of the BIACore node, used to keep internal WebAPI calls running on the same node as the subdomain calls.
        ///</Summary>
        [ConfigurationProperty(SERVERINTERNAL, IsRequired = false)]
        public string ServerInternal
        {
            get
            {

                string server = Environment.MachineName.ToUpper();

                string domain = "ups";

                if (server.ToLower().Contains("svrt")) domain = "ams1907";

                //string tempHost = "";
                //This needs to restrict to only subdomains!! Not any host..
                //try
                //{
                //    tempHost = HttpContext.Current.Request.Url.Host;
                //}
                //catch (Exception ex)
                //{
                //    //Log.LogFactory.Exception(ex);
                //}
                //if (tempHost != "" && tempHost.ToLower().Contains("inside.ams1907.com") )
                //    return "biadev.inside.ams1907.com";
                
                //return String.Format("bia{0}.inside.{1}.com", _BIAEnvironment.ToLower().Replace("prod", ""), domain);
                // Switching from specific server bia16-1.inside.ups.com to bia.inside.ups.com with BIAEnvironment instead of _BIAEnvironment
                return String.Format("bia{0}.inside.{1}.com", _BIAEnvironment.ToLower().Replace("prod", ""), domain);

            }
        }

        [ConfigurationProperty(BASEURL, IsRequired = false)]
        public string BaseURL
        {
            get
            {
#if LocalTest
                if (BIAEnvironment == "DEV" && !Environment.MachineName.ToUpper().StartsWith("SVRP000") && AppCode.ToLower() == "biacore" && !String.IsNullOrWhiteSpace(LocalPort)) return "";
                else return "/common/biacore/2.0";
#else
                return "/common/biacore/2.0";
#endif
            }
        }

        [ConfigurationProperty(LOGURL, DefaultValue = "", IsRequired = false)]
        public string LogURL { get { return (string)this[LOGURL]; } }

        [ConfigurationProperty(LOCALHOST, DefaultValue = "localhost.biaalpha.inside.ups.com", IsRequired = false)]

        [Obsolete("Property \"localhost\" has been removed, please remove this from your app/web .config", true)]
        public string Localhost { get { return (string)this[LOCALHOST]; } }

        public string ServerHostOnly
        {
            get
            {
                return Server.ToLower().Replace("https", "").Replace("http", "").Replace("://", "").Split(':')[0];
            }
        }

        private string _BIAEnvironment
        {
            get
            {
                string server = Environment.MachineName.ToUpper();

                // This first check is to correctly assign Production Agents to logs as PROD not DEV, even though they run on the Dev server.
                if (server == "SVRP000BD785")
                {
                    if (AppDomain.CurrentDomain.BaseDirectory.ToUpper().Contains("\\PRODUCTION\\")) return "PROD";
                    else return "ALPHA";
                }
    
                //TestNet Dev and QA Server Info
                if (server == "SVRT0000E72B" || server == "SVRT000107DB") return "DEV1";
                if (server == "SVRT0000E72C" || server == "SVRT000107DC") return "DEV2";

                if (server.ToLower().Contains("SVRT")) return "DEV1";

                if (server == "SVRP000D9010") return "ALPHA1";
                if (server == "SVRP000D9012") return "ALPHA2";

                if (server == "SVRP000D9011") return "16-1";
                if (server == "SVRP000D9013") return "16-2";
                if (server == "SVRP000D9015") return "16-3";
                if (server == "SVRP000D9017") return "16-4";
                return "ALPHA1";
            }
        }

        /// <summary>
        /// This variable is used by App Logging, Enterprise Logging, Header and internal BIA Core calls to determine which "Environment" it is running on, 
        /// this is NOT the server/instance/subdomain
        /// </summary>
        public string BIAEnvironment
        {
            get
            {
                if (_BIAEnvironment == "ALPHA1" || _BIAEnvironment == "ALPHA2") return "ALPHA";
                else if (_BIAEnvironment == "PROD" || _BIAEnvironment == "16-1" || _BIAEnvironment == "16-2" || _BIAEnvironment == "16-3" || _BIAEnvironment == "16-4") return "PROD";
                else if (_BIAEnvironment == "DEV1" || _BIAEnvironment == "DEV2") return "DEV";
                else return "ALPHA";
            }
        }

        public string BIAServer
        {
            get
            {
                string server = Environment.MachineName.ToUpper();
                return server.Substring(server.Length - 3);
            }
        }

        // TODO: go back and switch everything using the manual check to use this function M.Erdmann 1/20/20
        public bool Testnet
        {
            get
            {
                return Environment.MachineName.IndexOf("svrt", StringComparison.InvariantCultureIgnoreCase) > -1;
            }
        }
        public bool IsLocalHost
        {
            get
            {
                return Environment.MachineName.IndexOf("wksp", StringComparison.InvariantCultureIgnoreCase) > -1;
            }
        }
    }
}
