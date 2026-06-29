using System;
using System.ComponentModel;
using System.Web;

namespace BIACore.Web.Controls
{
    /// <summary>
    /// Base class for dynamically hosted ASPx controls.
    /// </summary>
    [ToolboxItem(false)]
    public class Resource : SimpleControl
    {
        #region Fields & Properties

        /// <summary>
        /// The path to the compressed/minified file for this resource.
        /// </summary>
        [Category("Config")]
        [Description("The path to the compressed/minified file for this resource.")]
        public string Path { get; set; }
        /// <summary>
        /// The path to the uncompressed (debug) file for this resource.
        /// </summary>
        [Category("Config")]
        [Description("The path to the uncompressed (debug) file for this resource.")]
        public string DebugPath { get; set; }

        /// <summary>
        /// When true this resource will always be cached regardless of webconfig.core.debug configuration.
        /// </summary>
        [Category("Config")]
        [Description("When true this resource will always be cached regardless of webconfig.core.debug configuration.")]
        public bool AlwaysCache { get; set; }

        [Category("Config")]
        [Description("When true this resource will be cached based on application compile date.")]
        private bool SelectiveCache { get; set; }

        public string Uri
        {
            get
            {
                if (string.IsNullOrWhiteSpace(DebugPath))
                {
                    DebugPath = Path;
                }

                string path = (Settings.Config.Debug) ? DebugPath : Path;

                if (string.IsNullOrWhiteSpace(path)) { throw new Exception(string.Format("Unable to resolve the resource path.")); }

                string server = Settings.Config.Server.ToLower();
                string schema = "https://";

                if (HttpContext.Current.Request.IsSecureConnection)
                {
                    server = server.Replace("http:", "https:");
                    schema = "https://";
                }
                else
                {
                    server = server.Replace("https:", "http:");
                }

                string cacheOff = (!AlwaysCache) ? "?_dc=" + DateTime.Now.Ticks : "";
                string uri = path + cacheOff;

                uri = uri.Replace("{server}", (uri.IndexOf("{server}") > -1 && uri.IndexOf("http") != 0 ? schema : "") + server);
                uri = uri.Replace("{baseurl}", Settings.Config.BaseURL + (uri.IndexOf("{baseurl}/") > -1 ? "" : "/"));

                return uri;
            }
        }

        #region Property Hiding
        [Browsable(false)]
        [EditorBrowsable(EditorBrowsableState.Never)]
        [DesignerSerializationVisibility(DesignerSerializationVisibility.Hidden)]
        public override string ID
        {
            get
            {
                return base.ID;
            }
            set
            {
                base.ID = value;
            }
        }
        #endregion

        #endregion

        public Resource()
        {
            Path = null;
            DebugPath = null;
            AlwaysCache = true;
        }
    }
}