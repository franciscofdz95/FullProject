using System;
using System.Web;

namespace BIACore.Web.Optimization
{
    public static class Links
    {
        private static string _defaultTagFormat = @"<link rel=""stylesheet"" type=""text/css"" href=""{0}"" >" + Environment.NewLine;

        /// <summary>
        /// Embeds an html link resource in the webpage.
        /// Also replaces some "magic" strings with values determined at run time.
        /// {server} is replaced with the BIACore config "server" string.
        /// {baseurl} is replaced with the BIACore config "baseurl" string.
        /// </summary>
        /// <param name="path">Required - this is the default URI to use.</param>
        /// <param name="debug">Optional - this is the URI to use when in debug mode.
        /// If not specified, uses "path".</param>
        /// <param name="cache">Optional - adds a query string parameter (_dc=ticks) to prevent caching of this resource.</param>
        /// <returns></returns>
        public static IHtmlString Render(string path, string debug = null, bool cache = false)
        {
            return Resource.RenderFormat(_defaultTagFormat, path, string.IsNullOrWhiteSpace(debug) ? path : debug, cache);
        }
    }
}
