using System.Configuration;

namespace BIACore.Configuration
{

    public class SecurityElement : ConfigurationElement
    {
        private const string ENABLED = "enabled";
        private const string AZURE = "azure";
        private const string ANONYMOUS = "anonymous";
        private const string ANONYMOUS_URI = "anonymousUri";
        private const string LOGIN = "loginUri";
        private const string LOGOUT = "logoutUri";
        private const string EXCLUDE = "exclude";
        private const string INCLUDE = "include";
        private const string LOGIN_ALT_APPCODE = "loginAltAppcode";

        private static string[] GLOBALEXCLUSION = new string[] {
            ".png",
            ".gif",
            ".jpg",
            ".jpeg",
            ".js",
            ".css",
            ".ico",
            ".woff2",
            ".ttf",
            ".svg",
            ".otf",
            ".eot"
        };

        [ConfigurationProperty(ENABLED, DefaultValue = false, IsRequired = false)]
        public bool Enabled { get { return (bool)this[ENABLED]; } }

        [ConfigurationProperty(AZURE, DefaultValue = false, IsRequired = false)]
        public bool AzureApp { get { return (bool)this[AZURE]; } }

        [ConfigurationProperty(ANONYMOUS, DefaultValue = false, IsRequired = false)]
        public bool Anonymous { get { return (bool)this[ANONYMOUS]; } }

        [ConfigurationProperty(ANONYMOUS_URI, IsRequired = false)]
        public ListElement Anonymous_Uri { get { return (ListElement)this[ANONYMOUS_URI]; } }

        //[ConfigurationProperty(LOGIN, DefaultValue = "/bia/apps/BIASecurity/unsecure/index.cfm", IsRequired = false)]
        [ConfigurationProperty(LOGIN, DefaultValue = "/common/biacore/2.0/Login.aspx", IsRequired = false)]
        public string LoginUri
        {
            get
            {
#if LocalTest
                return "/Login.aspx";
#else
                return (string)this[LOGIN];
#endif
            }
        }

        [ConfigurationProperty(LOGIN_ALT_APPCODE, IsRequired = false)]
        public string LoginAltAppCode { get { return (string)this[LOGIN_ALT_APPCODE]; } }
        //[ConfigurationProperty(LOGOUT, DefaultValue = "/bia/CustomTag/BIA_Logout.cfm", IsRequired = false)]
        [ConfigurationProperty(LOGOUT, DefaultValue = "https://biasecurity.biaalpha.inside.ups.com/Logout.aspx", IsRequired = false)]
        public string LogoutUri
        {
            get
            {
#if LocalTest
                return "/Logout.aspx";
#else
                return (string)this[LOGOUT];
#endif
            }
        }

        [ConfigurationProperty(EXCLUDE, IsRequired = false)]
        public ListElement Exclude { get { return (ListElement)this[EXCLUDE]; } }

        [ConfigurationProperty(INCLUDE, IsRequired = false)]
        public ListElement Include { get { return (ListElement)this[INCLUDE]; } }

        internal string[] GlobalExclusionList { get { return GLOBALEXCLUSION; } }
    }
}
