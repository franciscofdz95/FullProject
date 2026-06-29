using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Web;
using System.Web.Optimization;

namespace BIACore.WebAPI
{
    public class BundleConfig
    {
        public static void RegisterBundles(BundleCollection bundles)
        {
            bundles.Add(new StyleBundle("~/bundle/css")
                .IncludeDirectory("~/app/css", "*.css", true)
            );

            bundles.Add(new ScriptBundle("~/bundle/app")
                .IncludeDirectory("~/app/App", "*.js", true)
            );

            bundles.Add(new StyleBundle("~/Exporter/bundle/css")
                .IncludeDirectory("~/Exporter/app/css", "*.css", true)
            );

            bundles.Add(new ScriptBundle("~/Exporter/bundle/app")
                .IncludeDirectory("~/Exporter/app/App", "*.js", true)
            );

            if (Directory.Exists(HttpContext.Current.Server.MapPath("~/BIAExt")))
            {
                bundles.Add(new StyleBundle("~/biaext/css")
                    .IncludeDirectory("~/BIAExt", "*.css", true)
                );
                bundles.Add(new ScriptBundle("~/biaext/js")
                    .IncludeDirectory("~/BIAExt", "*.js", true)
                );
            }
        }
    }
}
