using System;
using System.Collections.Generic;
using System.Linq;
using System.ServiceProcess;
using System.Text;

using System.Configuration.Install;
using System.Diagnostics;

using BIACore.Log;

namespace BIACore.Agent
{
    internal static class Installer
    {
        internal static string ServiceName { get { return Settings.Agent.ServiceName + Settings.Agent.Environment; } }

        internal static string DisplayName
        {
            get
            {
                return string.Format("BIA {0}{1}{2}",
                    Settings.Agent.DisplayName,
                    string.IsNullOrEmpty(Settings.Agent.Environment) ? "" : " ",
                    Settings.Agent.Environment);
            }
        }

        internal static void Install()
        {
            Console.WriteLine("Installing \"{2}\" as \"{1}\" ({0})", 
                ServiceName, 
                DisplayName,
                System.Reflection.Assembly.GetEntryAssembly().Location);

            InstallContext instContext = new InstallContext();
            instContext.Parameters.Add("assemblyPath", System.Reflection.Assembly.GetEntryAssembly().Location);

            ServiceProcessInstaller spi = new ServiceProcessInstaller();
            spi.Account = ServiceAccount.NetworkService;
            spi.Username = null;
            spi.Password = null;

            ServiceInstaller si = new ServiceInstaller();
            si.Context = instContext;

            si.ServiceName = ServiceName;
            si.DisplayName = DisplayName;
            si.Description = Settings.Agent.Description;
            si.Parent = spi;

            si.ServicesDependedOn = new string[] { string.Empty };
            si.StartType = ServiceStartMode.Automatic;

            //si.Committed += new InstallEventHandler(SetRecoveryOptions);

            si.Install(new System.Collections.Hashtable());

            SetRecoveryOptions();
        }

        private static void SetRecoveryOptions()
        {
            Console.WriteLine("Setting recovery options");
            int exitCode;
            using (var process = new Process())
            {
                var startInfo = process.StartInfo;
                startInfo.FileName = "sc";
                startInfo.WindowStyle = ProcessWindowStyle.Hidden;

                // tell Windows that the service should restart if it fails
                startInfo.Arguments = string.Format("failure \"{0}\" reset= 0 actions= restart/60000", ServiceName);

                process.Start();
                process.WaitForExit();

                exitCode = process.ExitCode;
            }

            if (exitCode != 0)
                Console.WriteLine("Unable to set recovery options: you must set service to restart on failure manually.");
        }

        internal static void Uninstall()
        {
            InstallContext instContext = new InstallContext();
            instContext.Parameters.Add("assemblyPath", System.Reflection.Assembly.GetEntryAssembly().Location);

            ServiceInstaller si = new ServiceInstaller();
            si.Context = instContext;
            si.ServiceName = ServiceName;

            si.Uninstall(null);
        }
    }
}
