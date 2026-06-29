using BIACore.Configuration;
using System.Configuration;

namespace BIACore
{
    /// <summary>
    /// Static class for accessing our Configuration object.
    /// e.g. Settings.Security.enabled == true
    /// </summary>
    public class Settings
    {
        // private to hide the top-level configuration element
        private static BIACore.Configuration.Settings BIACore
        {
            get
            {
                BIACore.Configuration.Settings config = ConfigurationManager.GetSection("biacore") as BIACore.Configuration.Settings;
                return (config != null) ? config : new BIACore.Configuration.Settings();
            }
        }

        public static CoreElement Config { get { return Settings.BIACore.Config; } }
        
        public static LogElement Log { get { return Settings.BIACore.Log; } }

        public static SecurityElement Security { get { return Settings.BIACore.Security; } }

        public static ActivityElement Activity { get { return Settings.BIACore.Activity; } }

        public static AgentElement Agent { get { return Settings.BIACore.Agent; } }

        public static SQLElement Sql { get { return Settings.BIACore.Sql; } }

        public static OracleElement Oracle { get { return Settings.BIACore.Oracle; } }

        public static DB2Element DB2 { get { return Settings.BIACore.Db2; } }

        public static UploadValidationElement UploadValidation { get { return Settings.BIACore.UploadValidation; } }
    }
}
