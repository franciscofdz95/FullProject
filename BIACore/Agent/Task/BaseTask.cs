using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

using BIACore.Log;

namespace BIACore.Agent.Task
{
    public abstract class BaseTask
    {
        internal DateTime NextRun = DateTime.MinValue;
        internal bool Running = false;

        public abstract TimeSpan Interval { get; set; }
        public virtual bool Daily { get; set; } = false;

        public BaseTask() { }

        public abstract void Run();

        public void Execute()
        {
            if (NextRun < DateTime.UtcNow && !Running)
            {
                DateTime start = DateTime.UtcNow;
                if (!Daily) NextRun = DateTime.UtcNow.Add(Interval);
                else NextRun = DateTime.MaxValue;
                Running = true;
                LogFactory.Debug("Agent: starting job {0}", this.GetType().Name);
                try
                {
                    Run();
                }
                catch (Exception e)
                {
                    LogFactory.Exception(e);
                }
                LogFactory.Debug("Agent: completed job {0} in {2}, rescheduling for {1}", this.GetType().Name, NextRun,
                    DateTime.UtcNow.Subtract(start).TotalMilliseconds);
                Running = false;
            }
        }
    }
}
