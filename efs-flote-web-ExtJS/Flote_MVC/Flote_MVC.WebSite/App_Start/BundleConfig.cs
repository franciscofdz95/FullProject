/* ====================================================================================================
NAME:			[JS File Registeration]
BEHAVIOR:		Registered all JS files for Flote Application.
_______________________________________________________________________________________________________
REVISION HISTORY
-------------------------------------------------------------------------------------------------------
Date			    Modified By			  Modifications
-------------------------------------------------------------------------------------------------------
07/26/2016        Sudhir Dandale		 Created.
 ======================================================================================================*/
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Optimization;

namespace Flote.WebSite.Website
{
    public static class BundleConfig
    {
        public static void RegisterBundles(BundleCollection bundles)
        {
            bundles.Add(new StyleBundle("~/bundle/css")
                .IncludeDirectory("~/css", "*.css", true)
            );

            bundles.Add(new ScriptBundle("~/bundle/App")
                .IncludeDirectory("~/App", "*.js", true)
            );
        }
    }
}
