using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

using System.Reflection;
using System.Diagnostics;

using BIACore.Server.Model;

namespace BIACore.Server
{
    public static class LogFactory
    {
        private const string TRANSACTION_ID = "BIACore_TransactionId";

        // threadstatic makes this unique to each thread that's running it.
        // which basically means 1 per http thread
        [ThreadStatic]
        private static Guid _TransactionId = Guid.NewGuid();
        public static Guid TransactionId
        {
            get
            {
                if (HttpContext.Current == null) return _TransactionId;

                if (BIACore.Web.CurrentContext.GetTransactionIdHeader() != Guid.Empty)
                    HttpContext.Current.Items[TRANSACTION_ID] = BIACore.Web.CurrentContext.GetTransactionIdHeader();

                if (HttpContext.Current.Items[TRANSACTION_ID] == null)
                    HttpContext.Current.Items[TRANSACTION_ID] = Guid.NewGuid();

                return (Guid)HttpContext.Current.Items[TRANSACTION_ID];
            }
        }

        private static void Create(Log.LogLevel level, string Detail, string Event = null)
        {
            if (!Settings.Log.Enabled) return;

            if (string.IsNullOrWhiteSpace(Event))
            {
                int upMethods = 2;
                MethodBase caller = new StackTrace().GetFrame(upMethods).GetMethod();
                while (caller != null && caller.DeclaringType != null &&
                    (caller.DeclaringType.ToString() == "BIACore.Log.LogFactory"
                    || caller.DeclaringType.ToString() == "BIACore.Server.LogFactory"
                    || (caller.DeclaringType.ToString() == "BIACore.Web.GlobalExceptionFilter" && caller.Name == "OnException")
                    || (caller.DeclaringType.ToString() == "BIACore.BIACoreModule" && caller.Name == "Error")
                    ))
                {
                    upMethods++;
                    caller = new StackTrace().GetFrame(upMethods).GetMethod();
                }
                Event = (caller == null || caller.DeclaringType == null) ? string.Empty :
                     string.Format("{0}:{1}", caller.DeclaringType.ToString(), caller.Name);
            }

            LogEntry item = new LogEntry()
            {
                Level = level,
                TransactionId = TransactionId,
                Event = Event,
                Detail = Detail
            };
            item.Insert();
        }

        public static void Performance(string item, double duration)
        {
            // we want to always track server URI performance, so let's ignore Performance.
            if (!Settings.Log.Performance) return;
            Create(Log.LogLevel.Performance, string.Format("{0}", duration), item);
        }

        public static void Error(string message, params object[] args)
        {
            Create(Log.LogLevel.Error, string.Format(message, args));
        }

        public static void Message(string message, params object[] args)
        {
            Create(Log.LogLevel.Message, string.Format(message, args));
        }

        public static void Exception(Exception e)
        {
            Create(Log.LogLevel.Exception, string.Format("{0}: {1}{2}{3}",
                e.GetType().ToString(),
                e.Message,
                Environment.NewLine,
                e.StackTrace));

            if (e.InnerException != null) Exception(e.InnerException);
        }
    }
}