using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

using System.ServiceProcess;

using BIACore.Agent.Task;
using BIACore.Log;

namespace BIACore.Agent
{
    public class TaskManager
    {
        public List<BaseTask> Tasks { get; set; }

        public TaskManager(List<BaseTask> tasks)
        {
            Tasks = tasks;
        }

        public void Run(string[] args)
        {
            if (args.Length == 0)
            {
                // running as a service
                try
                {
                    //ServiceBase[] ServicesToRun = new ServiceBase[] { new TaskManager() };
                    ServiceBase.Run(new Service(Tasks));
                }
                catch (Exception e)
                {
                    LogFactory.Exception(e);
                }
            }
            else
            {
                switch (args[0])
                {
                    case "-console":
                        Console.WriteLine("Console starting");
                        new Service(Tasks).Run();
                        Console.WriteLine("Console completed");
                        break;

                    case "-i":
                    case "-install":
                        Console.WriteLine("Service Install starting");
                        Installer.Install();
                        Console.WriteLine("Service Install completed");
                        break;

                    case "-u":
                    case "-uninstall":
                        Console.WriteLine("Service Uninstall starting");
                        Installer.Uninstall();
                        Console.WriteLine("Service Uninstall completed");
                        break;

                    default:
                        Console.WriteLine("Unknown argument {0}", args[0]);
                        break;
                }
            }

        }
    }
}
