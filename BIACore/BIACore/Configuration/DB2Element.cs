using System.Configuration;

namespace BIACore.Configuration
{
    public class DB2Element : ConfigurationElement
    {
        private const string TIMEOUT = "timeout";
        private const string ROWNUMBER = "rownumber";

        [ConfigurationProperty(TIMEOUT, DefaultValue = 30, IsRequired = false)]
        public int Timeout { get { return (int)this[TIMEOUT]; } }

        [ConfigurationProperty(ROWNUMBER, DefaultValue = "RowNumber", IsRequired = false)]
        public string RowNumber { get { return (string)this[ROWNUMBER]; } }
    }
}
