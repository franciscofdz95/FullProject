using System.Configuration;

namespace BIACore.Configuration
{
    public class AgentElement : ConfigurationElement
    {
        private const string FTP_USER = "ftpUser";
        private const string FTP_PASS = "ftpPass";
        private const string FTP_PATH = "ftpPath";
        private const string SERVICE_NAME = "serviceName";
        private const string DISPLAY_NAME = "displayName";
        private const string DESCRIPTION = "description";
        private const string ENVIRONMENT = "environment";
        private const string RESTART_INTERVAL = "restartDays";

        [ConfigurationProperty(FTP_USER, IsRequired = false)]
        public string FtpUser { get { return (string)this[FTP_USER]; } }

        [ConfigurationProperty(FTP_PASS, IsRequired = false)]
        public string FtpPass { get { return (string)this[FTP_PASS]; } }

        [ConfigurationProperty(FTP_PATH, IsRequired = false)]
        public string FtpPath { get { return (string)this[FTP_PATH]; } }

        [ConfigurationProperty(SERVICE_NAME, IsRequired = false)]
        public string ServiceName { get { return (string)this[SERVICE_NAME]; } }

        [ConfigurationProperty(DISPLAY_NAME, IsRequired = false)]
        public string DisplayName { get { return (string)(this[DISPLAY_NAME] ?? this[SERVICE_NAME]); } }

        [ConfigurationProperty(DESCRIPTION, DefaultValue = "", IsRequired = false)]
        public string Description { get { return (string)this[DESCRIPTION]; } }

        [ConfigurationProperty(ENVIRONMENT, DefaultValue = "", IsRequired = false)]
        public string Environment { get { return (string)this[ENVIRONMENT]; } }

        [ConfigurationProperty(RESTART_INTERVAL, DefaultValue = 1, IsRequired = false)]
        public int RestartInterval { get { return (int)this[RESTART_INTERVAL]; } }
    }
}
