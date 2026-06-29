using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Microsoft.Web.Administration;

using BIACore.Agent;
using BIACore.Agent.Task;

using BIACore.Model;
using BIACore.Provider;

namespace IISMonitor.Task.AppPool
{
    class InfoCollector : BaseTask
    {
        public override TimeSpan Interval { get { return new TimeSpan(0, 5, 0); } set { } }

        public override void Run()
        {
            ServerManager iis = new ServerManager();
            ApplicationPoolCollection appPools = iis.ApplicationPools;

            for (int i = 0; i < appPools.Count; i++)
            {
                DataInterface.UpsertApplicationPoolProperties(appPools[i]);
            }
            //
            //foreach (Site site in iis.Sites)
            //{
            //    foreach (Microsoft.Web.Administration.Application app in site.Applications)
            //    {
            //        DataInterface.UpsertApplication(app, site, iis);
            //    }
            //}
        }
    }
}