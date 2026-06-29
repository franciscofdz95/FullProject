using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading;

using System.ServiceProcess;

using BIACore.Agent.Task;
using BIACore.Log;

namespace BIACore.Agent
{
    internal class Service : ServiceBase
    {
        private DateTime Restart = DateTime.UtcNow.Date.AddDays(1); // restart at midnight
        private static TimeSpan Immediately = new TimeSpan(0);
        private static TimeSpan Interval = new TimeSpan(0, 0, 1);

        private Timer timer = null;

        internal Service(List<BaseTask> tasks)
        {
            if (Settings.Agent.RestartInterval < 1)
            {
                // technically, setting RestartInterval = 0 would result in "run once and exit" behavior.
                // but since the installer sets the service to restart on failure, and "exit" is via failure.
                // it would result in running "continuously" through restarts. Which is iffy at best.
                // anyway, long story short < 1 results in "run without restarts" mode.
                Restart = DateTime.MaxValue;
            }
            else
            {
                Restart = DateTime.UtcNow.Date.AddDays(Settings.Agent.RestartInterval);
            }
            Tasks = tasks;
            timer = new Timer(Execute);
        }

        internal List<BaseTask> Tasks { get; set; }

        private void Execute(object state)
        {
            timer.Change(Timeout.Infinite, Timeout.Infinite);
            DateTime nextRun = DateTime.UtcNow.Add(Interval);

            Run();

            // if our nextRun is after our restart time, go ahead and restart.
            if (Restart < nextRun)
            {
                LogFactory.Debug("Agent: restarting");
                Environment.Exit(1);
            }

            // garbage collect
            GC.Collect();
            GC.WaitForPendingFinalizers();

            // reschedule
            // immediately (overran our execution time slot)
            // or our interval - how long it took us to do our work
            timer.Change((nextRun < DateTime.UtcNow) ? Immediately : nextRun.Subtract(DateTime.UtcNow), Interval);
        }

        internal void Run()
        {
            if (Tasks == null) return;

            foreach (BaseTask task in Tasks)
            {
                task.Execute();
            }
        }

        #region ServiceBase overrides
        protected override void OnStart(string[] args)
        {
            base.OnStart(args);
            LogFactory.Debug("Agent: starting");
            timer.Change(Immediately, Interval);
        }

        protected override void OnStop()
        {
            LogFactory.Debug("Agent: stopping");
            timer.Change(Timeout.Infinite, Timeout.Infinite);
            base.OnStop();
        }

        protected override void OnPause()
        {
            LogFactory.Debug("Agent: pausing");
            base.OnPause();
            timer.Change(Timeout.Infinite, Timeout.Infinite);
        }
        #endregion
    }
}
