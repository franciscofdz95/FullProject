using System.Collections.Specialized;
using System.IO;

namespace BIACore.Web
{
    public class StreamMimePart : MimePart
    {
        public StreamMimePart(string formName, string fileName, Stream data, string contentType)
        {
            Headers = new NameValueCollection();
            Headers["Content-Disposition"] = string.Format("form-data; name=\"{0}\"; filename=\"{1}\"", formName, fileName);
            Headers["Content-Type"] = contentType;
            Data = data;
        }

        public StreamMimePart(string formName, string fileName) 
            : this(formName, fileName, File.OpenRead(fileName), "application/octet-stream") { }

        public StreamMimePart(string fileName) 
            : this(fileName, fileName, File.OpenRead(fileName), "application/octet-stream") { }
    }
}
