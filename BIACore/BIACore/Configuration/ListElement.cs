using System.Configuration;
using System.Linq;
using System.Text.RegularExpressions;

namespace BIACore.Configuration
{
    public class ListElement : ConfigurationElement
    {
        private const string VALUE = "value";

        [ConfigurationProperty(VALUE, DefaultValue = "", IsRequired = false)]
        public string Value { get { return Regex.Replace(((string)this[VALUE]).ToLower(), ",+", ",").Trim(','); } }

        public string[] List
        {
            get
            {
                return IsEmpty ? new string[0] : Value.Split(',');
            }
        }

        internal bool ContainsWildCard
        {
            get
            {
                return Value.Contains('*');
            }
        }

        internal bool IsEmpty
        {
            get { return string.IsNullOrWhiteSpace(Value); }
        }
    }
}
