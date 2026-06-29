using System;
using System.Globalization;
using System.Web;

namespace BIACore.Web.Optimization
{
    internal static class Resource
    {
        internal static IHtmlString RenderFormat(string format, string path, string debug, bool cache)
        {
            string value = (Settings.Config.Debug) ? debug : path;
            string server = Settings.Config.Server.ToLower();

            if (string.IsNullOrWhiteSpace(value))
            {
                throw new Exception(string.Format("Unable to resolve the resource path."));
            }

#if LocalText
            //To handle links to central library files for BIACore Localhost debugging
            if (Settings.Config.AppCode == "BIACore" && server.IndexOf("localhost:") > -1 && 
                value.Replace("{server}", "").Replace("{baseurl}", "").ToLower().IndexOf("/library/") == 0)
            {
                server = String.Format("https://bia{0}.inside.ups.com", Settings.Config.BIAEnvironment.ToLower().Replace("prod", ""));
            }
#endif
            if (HttpContext.Current.Request.IsSecureConnection)
            {
                server = server.Replace("http:", "https:");
            }
            else
            {//TODO: Review that all links are built with secure urls
                server = server.Replace("https:", "http:");
            }
#if !LocalTest
            value += (!cache) ? "?_dc=" + DateTime.Now.Ticks : "";
#endif
            value = value.Replace("{server}", (value.IndexOf("{server}") > -1 && value.IndexOf("http") != 0 ? "https://" : "") + server);
            value = value.Replace("{baseurl}", Settings.Config.BaseURL + (value.IndexOf("{baseurl}/") > -1 ? "" : "/"));

            return new HtmlString(
                string.Format(CultureInfo.InvariantCulture, format, value)
            );
        }
    }
}
