using System;

namespace BIACore.ExceptionLog
{
    public static class ExceptionLog
    {
        [Obsolete("Use BIACore.Log.LogFactory.Exception")]
        public static void handle(Exception e)
        {
            BIACore.Log.LogFactory.Exception(e);
        }
    }
}
