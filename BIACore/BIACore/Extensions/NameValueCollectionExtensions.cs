using System;
using System.Collections.Generic;
using System.Collections.Specialized;
using System.Web;

namespace BIACore.Extensions
{
    public static class HttpRequestExtensions
    {
        public static Dictionary<string, string> ToDictionary(this HttpCookieCollection c)
        {
            Dictionary<string, string> result = new Dictionary<string, string>(StringComparer.InvariantCultureIgnoreCase);

            foreach (string k in c.Keys)
            {
                if (k == null) continue;
                if (result.ContainsKey(k)) continue;
                result.Add(k, c.Get(k).Value);
            }

            return result;
        }

        public static Dictionary<string, string> ToDictionary(this NameValueCollection nvc)
        {
            Dictionary<string, string> result = new Dictionary<string, string>(StringComparer.InvariantCultureIgnoreCase);

            foreach (string k in nvc.Keys)
            {
                if (k == null) continue;
                result.Add(k, nvc[k].ToString());
            }

            return result;
        }
    }
}
