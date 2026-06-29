using System.Configuration;

namespace BIACore.Configuration
{
    public class ActivityElement : ConfigurationElement
    {
        private const string ENABLED = "enabled";

        private const string COOKIES = "cookies";
        private const string QUERY = "query";
        private const string FORM = "form";
        private const string CONTENT = "content";

        [ConfigurationProperty(ENABLED, DefaultValue = true, IsRequired = false)]
        public bool Enabled { get { return (bool)this[ENABLED]; } }

        [ConfigurationProperty(COOKIES, IsRequired = false)]
        public ListElement Cookies { get { return (ListElement)this[COOKIES]; } }

        [ConfigurationProperty(QUERY, IsRequired = false)]
        public ListElement Query { get { return (ListElement)this[QUERY]; } }

        [ConfigurationProperty(FORM, IsRequired = false)]
        public ListElement Form { get { return (ListElement)this[FORM]; } }

        // Content is unstructured data, no way to exclude section(s)
        [ConfigurationProperty(CONTENT, DefaultValue = true, IsRequired = false)]
        public bool Content { get { return (bool)this[CONTENT]; } }
    }
}
