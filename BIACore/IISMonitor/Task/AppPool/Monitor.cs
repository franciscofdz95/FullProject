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
using System.ServiceProcess;

namespace IISMonitor.Task.AppPool
{
    class Monitor : BaseTask
    {
        public override TimeSpan Interval { get { return new TimeSpan(0, 0, 30); } set { } }

        public override void Run()
        {
            ServiceController controller = new ServiceController("W3SVC");
            if (controller.Status == ServiceControllerStatus.Running)
            {
                ServerManager iis = new ServerManager();
                ApplicationPoolCollection appPools = iis.ApplicationPools;

                for (int i = 0; i < appPools.Count; i++)
                {
                    DataInterface.UpdateApplicationPoolStatus(appPools[i]);
                }
            }
        }
    }
}