using System.Collections.Specialized;
using System.IO;
using System.Text;

namespace BIACore.Web
{
    public abstract class MimePart
    {
        public NameValueCollection Headers { get; set; }
        public byte[] Header { get; set; }
        public Stream Data { get; set; }

        public long EncodeHeader(string boundary)
        {
            StringBuilder sb = new StringBuilder();

            sb.Append("--");
            sb.Append(boundary);
            sb.AppendLine();
            foreach (string key in Headers.AllKeys)
            {
                sb.Append(key);
                sb.Append(": ");
                sb.AppendLine(Headers[key]);
            }
            sb.AppendLine();

            Header = Encoding.UTF8.GetBytes(sb.ToString());

            return Header.Length + Data.Length + 2;
        }
    }
}
