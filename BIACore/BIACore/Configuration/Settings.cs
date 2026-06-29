using System.Configuration;

namespace BIACore.Configuration
{
    public class Settings : ConfigurationSection
    {
        private const string CORE = "core";
        private const string LOG = "log";
        private const string SECURITY = "security";
        private const string ACTIVITY = "activity";
        private const string AGENT = "agent";
        private const string SQL = "sql";
        private const string ORACLE = "oracle";
        private const string DB2 = "db2";
        private const string UPLOADVALIDATION = "uploadvalidation";

        [ConfigurationProperty(CORE, IsRequired = true)]
        public CoreElement Config { get { return (CoreElement)this[CORE]; } }

        [ConfigurationProperty(LOG, IsRequired = false)]
        public LogElement Log { get { return (LogElement)this[LOG]; } }

        [ConfigurationProperty(SECURITY, IsRequired = false)]
        public SecurityElement Security { get { return (SecurityElement)this[SECURITY]; } }

        [ConfigurationProperty(ACTIVITY, IsRequired = false)]
        public ActivityElement Activity { get { return (ActivityElement)this[ACTIVITY]; } }

        [ConfigurationProperty(AGENT, IsRequired = false)]
        public AgentElement Agent { get { return (AgentElement)this[AGENT]; } }

        [ConfigurationProperty(SQL, IsRequired = false)]
        public SQLElement Sql { get { return (SQLElement)this[SQL]; } }

        [ConfigurationProperty(ORACLE, IsRequired = false)]
        public OracleElement Oracle { get { return (OracleElement)this[ORACLE]; } }

        [ConfigurationProperty(DB2, IsRequired = false)]
        public DB2Element Db2 { get { return (DB2Element)this[DB2]; } }

        [ConfigurationProperty(UPLOADVALIDATION, IsRequired = false)]
        public UploadValidationElement UploadValidation { get { return (UploadValidationElement)this[UPLOADVALIDATION]; } }
    }
}
