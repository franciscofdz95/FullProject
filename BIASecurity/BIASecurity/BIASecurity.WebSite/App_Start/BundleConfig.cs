using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Optimization;

namespace BIASecurity.WebSite
{
    public class BundleConfig
    {
        public static void RegisterBundles(BundleCollection bundles)
        {
            bundles.Add(new StyleBundle("~/bundle/css")
                .IncludeDirectory("~/css", "*.css", true)
            );

            bundles.Add(new ScriptBundle("~/bundle/app")
                .IncludeDirectory("~/app", "*.js", true)
            );
        }
    }
}
