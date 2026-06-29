using System.Web;

namespace BIACore.Model
{
    public class BIACoreConfig
    {
        public class SecurityConfig
        {
            public bool enabled { get; set; }
            public bool anonymous { get; set; }
            public string[] anonymousUri { get; set; }
            public string loginUri { get; set; }
            public string logoutUri { get; set; }
            public string[] include { get; set; }
            public string[] exclude { get; set; }
            public string authType { get; set; }

            public SecurityConfig()
            {
                enabled = Settings.Security.Enabled;
                anonymous = Settings.Security.Anonymous;
                anonymousUri = Settings.Security.Anonymous_Uri.List;
                loginUri = Settings.Security.LoginUri;
                logoutUri = Settings.Security.LogoutUri;
                include = Settings.Security.Include.List;
                exclude = Settings.Security.Exclude.List;
                if (Settings.Security.AzureApp) authType = "azure";
                else authType = "eam";
            }
        }

        public class LoggerConfig
        {
            public bool enabled { get; set; }
            public bool debug { get; set; }
            public bool error { get; set; }
            // no reason to send this to the client
            //public bool sql { get; set; }
            public bool console { get; set; }

            public LoggerConfig()
            {
                enabled = Settings.Log.Enabled;
                debug = Settings.Log.Debug;
                error = Settings.Log.Error;
                console = Settings.Log.Console;
            }
        }

        public class BIAConfig
        {
            public bool debug { get; set; }
            public string appCode { get; set; }
            public string client { get; set; }
            //public string host { get; set; }
            public string baseUrl { get; set; }
            public int timeout { get; set; }
            public string biaServer { get; set; }
            public string biaServerInternal { get; set; }
            //public string biaServerRoot { get; set; }
            public BIAConfig()
            {
                debug = Settings.Config.Debug;
                appCode = Settings.Config.AppCode;
                baseUrl = Settings.Config.BaseURL;
                client = HttpContext.Current.Request.UserHostName;
                //host = Environment.MachineName;
                timeout = Settings.Sql.Timeout + 5;
                biaServer = Settings.Config.BIAServer;
                biaServerInternal = Settings.Config.ServerInternal;
                //biaServerRoot = Settings.Config.ServerRoot;
            }
        }

        // TODO:
        // these items are being moved over to Config.
        public bool debug { get; set; }
        public string appCode { get; set; }
        public string client { get; set; }
        //public string host { get; set; }
        public string baseUrl { get; set; }
        public int timeout { get; set; }
        public string biaServer { get; set; }
        public string biaServerInternal { get; set; }

        public SecurityConfig Security { get; set; }
        public LoggerConfig Logger { get; set; }
        public BIAConfig Config { get; set; }

        public BIACoreConfig()
        {
            debug = Settings.Config.Debug;
            appCode = Settings.Config.AppCode;
            baseUrl = Settings.Config.BaseURL;
            //host = Environment.MachineName;
            Security = new SecurityConfig();
            Logger = new LoggerConfig();
            timeout = Settings.Sql.Timeout + 5;
            biaServer = Settings.Config.BIAServer;
            biaServerInternal = Settings.Config.ServerInternal;
            Config = new BIAConfig();
        }
        
    }
}
