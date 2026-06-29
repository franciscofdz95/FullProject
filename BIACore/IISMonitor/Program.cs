using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading;
using System.Threading.Tasks;

using System.ServiceProcess;

using BIACore.Log;
using BIACore.Agent;
using BIACore.Agent.Task;

namespace IISMonitor
{
    class Program
    {

        static void Main(string[] args)
        {
            if (System.Diagnostics.Debugger.IsAttached)
            {
                //Local Debugging run
                Task.AppPool.Monitor Monitor = new Task.AppPool.Monitor();
                Monitor.Run();
                Task.AppPool.InfoCollector InfoCollector = new Task.AppPool.InfoCollector();
                InfoCollector.Run();
                /*
                 * Task.AppPool.Interface Interface = new Task.AppPool.Interface();
                Interface.Run();
                */
            }
            else
            {
                if (BIACore.Settings.Config.Server.IndexOf("bia.inside.ups.com") > 0)
                {
                    //Production
                    TaskManager t = new TaskManager(new List<BaseTask>() {
                        new Task.AppPool.Monitor(),
                        new Task.AppPool.InfoCollector()/*,
                        new Task.AppPool.Interface()*/
                    });
                    t.Run(args);
                }
                else
                {
                    //Dev
                    TaskManager t = new TaskManager(new List<BaseTask>() {
                        new Task.AppPool.Monitor(),
                        new Task.AppPool.InfoCollector()/*,
                        new Task.AppPool.Interface()*/
                    });
                    t.Run(args);
                }
            }
        }
    }
}