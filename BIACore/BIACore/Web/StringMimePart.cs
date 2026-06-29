using System.Collections.Specialized;
using System.IO;
using System.Text;

namespace BIACore.Web
{
    public class StringMimePart : MimePart
    {
        public StringMimePart(string key, string value)
        {
            Headers = new NameValueCollection();
            Headers["Content-Disposition"] = string.Format("form-data; name=\"{0}\"", key);
            Data = new MemoryStream(Encoding.UTF8.GetBytes(value));
        }
    }
}