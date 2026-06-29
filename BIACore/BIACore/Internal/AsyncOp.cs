using System;

using System.Threading;

namespace BIACore.Internal
{
    #region Asynchronus Operation
    /// <summary>
    /// This section is for saving the log entries to the database outside of the
    /// operating context. It acts as a local speed-up; these will end up getting
    /// queue'd and then fired all at once at the end of whatever operation is in
    /// progress.
    /// </summary>
    delegate void _AsyncOp();
    internal class AsyncOp
    {
        internal class AsyncOperation
        {
            internal readonly Delegate Function;
            internal readonly object[] Args;

            internal AsyncOperation(Delegate function, object[] args)
            {
                Function = function;
                Args = args;
            }
        }

        public static void FireAndForget(Delegate function, params object[] args)
        {
            ThreadPool.QueueUserWorkItem(execute, new AsyncOperation(function, args));
        }

        private static WaitCallback execute = new WaitCallback(ExecuteRequest);
        static void ExecuteRequest(object o)
        {
            AsyncOperation op = (AsyncOperation)o;
            op.Function.DynamicInvoke(op.Args);
        }
    }
    #endregion

}
