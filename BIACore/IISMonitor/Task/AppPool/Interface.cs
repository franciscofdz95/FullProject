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
    class Interface : BaseTask
    {
        public override TimeSpan Interval { get { return new TimeSpan(0, 5, 0); } set { } }

        public override void Run()
        {
            //Get app pool interaction records
            //loop through each one and send params to proper interaction function
            List<dynamic> appPoolInteractions = DataInterface.GetAppPoolInteractions();

            foreach (dynamic interaction in appPoolInteractions)
            {
                //Refresh (Stop -> Start) AppPool
                //Stop AppPool
                //Start AppPool
            }
        }
    }
}