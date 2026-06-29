using System.Collections.Generic;
using static BIACore.Activity.Factory;
using static BIACore.Log.Factory;

namespace BIACore.Internal
{
    internal static partial class Request
    {
        internal static void LoginLog(Dictionary<string, object> log)
        {
#if LocalTest
            LocalRequest.LoginLog_InsertSQL(log);
#else
            Web.Client.Post<dynamic>(API.URL(API.ACTIVITY), log);
#endif
        }

        internal static void ActivityLog(ActivityEntryRemote log)
        {
#if LocalTest
            LocalRequest.ActivityLog_InsertSQL(log);
#else
            Web.Client.Post<dynamic>(API.URL(API.ACTIVITY), log);
#endif
        }
        internal static void ApplicationVersionLog(dynamic log)
        {
#if LocalTest
            LocalRequest.VersionLog_InsertSQL(log);
#else
            Web.Client.Post<dynamic>(API.URL(API.VERSION), log);
#endif
        }
        internal static void ApplicationConnectionLog(dynamic log)
        {
#if LocalTest
            LocalRequest.ConnectionLog_InsertSQL(log);
#else
            Web.Client.Post<dynamic>(API.URL(API.CONNECTION), log);
#endif
        }
        internal static void ExportLog(dynamic log)
        {
#if LocalTest
            LocalRequest.ExportLog_InsertSQL(log);
#else
            Web.Client.Post<dynamic>(API.URL(API.EXPORT), log);
#endif
        }
        internal static void ApplicationLog(LogEntryRemote log)
        {
#if LocalTest
            LocalRequest.ApplicationLog_InsertSQL(log);
#else
            Web.Client.Post<dynamic>(API.URL(API.LOG), log);
#endif
        }
    }
}
