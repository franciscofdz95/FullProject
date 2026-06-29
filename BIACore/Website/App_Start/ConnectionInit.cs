using System;
using System.Collections.Generic;
using System.Configuration;
using System.Linq;
using System.Web;
using System.Web.Script.Serialization;
using BIACore.Server.Controller;
using Microsoft.Web.Administration;

namespace BIACore.WebAPI
{
    internal static class ConnectionInit
    {
        internal static void InitializeConnections()
        {
            if (BIACore.Website.Properties.Settings.Default.DefaultSecurityConnection != null)
            {
                JavaScriptSerializer jss = new JavaScriptSerializer() { MaxJsonLength = 2147483647 };
                BIACore.Model.Connection securityConnection = jss.Deserialize<BIACore.Model.Connection>(Website.Properties.Settings.Default.DefaultSecurityConnection);

                BIACore.Provider.ConnectionStrings.AddConnection(securityConnection);
            }

            ApplicationController applicationController = new ApplicationController();
            List<Model.Connection> applicationConnections = (List<Model.Connection>)applicationController.ApplicationConnections_Post(new {
                AppCode = new { Value = BIACore.Settings.Config.AppCode }, Environment = new { Value = Settings.Config.BIAEnvironment }, LogSQL = new { Value = false }
            });

            foreach (Model.Connection con in applicationConnections) BIACore.Provider.ConnectionStrings.AddConnection(con);
        }
    }
}