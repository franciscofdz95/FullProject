using BIACore.Provider;
using System;
using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;

namespace BIACore
{
    /// <summary>
    /// Another part of the BIACoreModule
    /// See also BIACoreModule.cs
    /// See also Log\BIACoreModule.cs
    /// In this section, we are concerned with
    /// 1) Handling security
    /// 2) Setting up c# user/session objects prior to application execution
    /// </summary>
    public partial class BIACoreModule
    {
        public void RefreshApplicationConnections(bool SkipRefresh = false)
        {
            if (Settings.Config.AppCode != "BIACore")
            {
                List<Model.Connection> applicationConnections = BIACore.Internal.Request.ApplicationConnections();
                if (applicationConnections != null)
                {
                    //ConnectionStrings.ClearConnectionStrings(); // We are doing add or update in the AddConnections method.
                    foreach (Model.Connection con in applicationConnections)
                        ConnectionStrings.AddConnection(con);
                }

                if (!SkipRefresh)
                {
                    Task.Factory.StartNew(() =>
                    {
                        //TODO: Determine the "correct" timeout for this cache.. Probably less than 10 minutes M.Erdmann 1/20/2020
                        Thread.Sleep(TimeSpan.FromMinutes(2));
                        RefreshApplicationConnections();
                    });
                }
            }
        }
    }
}
