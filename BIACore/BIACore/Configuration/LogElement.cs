using System.Configuration;

namespace BIACore.Configuration
{
    public class LogElement : ConfigurationElement
    {
        private const string ENABLED = "enabled";

        private const string DEBUG = "debug";
        private const string ERROR = "error";
        private const string MESSAGE = "message";
        private const string PERFORMANCE = "performance";
        private const string SQL = "sql";
        private const string ORACLE = "oracle";
        private const string DB2 = "db2";
        private const string API = "api";
        private const string ROUTER = "router";

        private const string CONSOLE = "console";

        [ConfigurationProperty(ENABLED, DefaultValue = false, IsRequired = false)]
        public bool Enabled { get { return (bool)this[ENABLED]; } }

        #region Log Levels
        [ConfigurationProperty(DEBUG, DefaultValue = false, IsRequired = false)]
        public bool Debug { get { return (bool)this[DEBUG]; } }

        [ConfigurationProperty(MESSAGE, DefaultValue = false, IsRequired = false)]
        public bool Message { get { return (bool)this[MESSAGE]; } }

        [ConfigurationProperty(ERROR, DefaultValue = false, IsRequired = false)]
        public bool Error { get { return (bool)this[ERROR]; } }

        [ConfigurationProperty(PERFORMANCE, DefaultValue = false, IsRequired = false)]
        public bool Performance { get { return (bool)this[PERFORMANCE]; } }

        [ConfigurationProperty(SQL, DefaultValue = false, IsRequired = false)]
        public bool Sql { get { return (bool)this[SQL]; } }

        [ConfigurationProperty(ORACLE, DefaultValue = false, IsRequired = false)]
        public bool Oracle { get { return (bool)this[ORACLE]; } }

        [ConfigurationProperty(DB2, DefaultValue = false, IsRequired = false)]
        public bool Db2 { get { return (bool)this[DB2]; } }

        [ConfigurationProperty(API, DefaultValue = true, IsRequired = false)]
        public bool Api { get { return (bool)this[API]; } }

        [ConfigurationProperty(ROUTER, DefaultValue = true, IsRequired = false)]
        public bool Router { get { return (bool)this[ROUTER]; } }
        #endregion

        #region Locations
        // Javascript console
        [ConfigurationProperty(CONSOLE, DefaultValue = false, IsRequired = false)]
        public bool Console { get { return (bool)this[CONSOLE]; } }
        #endregion
    }
}
