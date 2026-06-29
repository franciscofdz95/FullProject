using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace BIACore
{
    internal static class API
    {
        internal static string LIST = "api/MyReportsAgent/List";
        internal static string UPDATE = "api/MyReportsAgent/Update";
        internal static string UPLOAD = "api/MyReportsAgent/Upload";

        internal static string URL(string path)
        {
            return string.Format("https://{0}{1}{3}{2}",
                Settings.Config.Server,
                Settings.Config.BaseURL,
                path,
                path.Substring(0, 1) != "/" ? "/" : "");
        }
    }
}
