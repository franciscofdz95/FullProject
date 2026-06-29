using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Threading;

using System.ServiceProcess;

using BIACore.Log;
using BIACore.Agent;
using BIACore.Agent.Task;

namespace IISMonitor
{
    class ThreadController
    {
        private ManualResetEvent[] ServiceThreadsResetEvents;
        public ThreadController()
        {
            ServiceThreadsResetEvents = new ManualResetEvent[2];
        }
    }
}
