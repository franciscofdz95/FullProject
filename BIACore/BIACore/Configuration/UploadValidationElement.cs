using System.Configuration;

namespace BIACore.Configuration
{
    public class UploadValidationElement : ConfigurationElement
    {
        private const string MAXFILEBYTES = "maxfilebytes";
        private const string VALIDEXTENSIONS = "validextensions";

        [ConfigurationProperty(MAXFILEBYTES, DefaultValue = 10000000, IsRequired = false)]
        public int MaxFileBytes { get { return (int)this[MAXFILEBYTES]; } }

        [ConfigurationProperty(VALIDEXTENSIONS, DefaultValue = "xls,xlsx,doc,txt,csv", IsRequired = false)]
        public string ValidExtensions { get { return (string)this[VALIDEXTENSIONS]; } }
    }
}
