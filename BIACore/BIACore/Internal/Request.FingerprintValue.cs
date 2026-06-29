using BIACore.Model;

namespace BIACore.Internal
{
    internal static partial class Request
    {
        internal static FingerprintValue FingerprintById(string FingerprintId)
        {
#if LocalTest
            return LocalRequest.FingerprintValueById(FingerprintId);
#else
            return Web.Client.Post<FingerprintValue>(API.URL(API.FINGERPRINT_BYID), new { FingerprintId = FingerprintId });
#endif
        }

        internal static FingerprintValue FingerprintByValue(string Value)
        {
#if LocalTest
            return LocalRequest.FingerprintValueByValue(Value);
#else
            //LogFactory.Message("FingerprintValue={0}", new object[] { Value });
            return Web.Client.Post<FingerprintValue>(API.URL(API.FINGERPRINT_BYVALUE), new { Value = Value });
#endif
        }
        internal static void FingerprintUsageLog(dynamic log)
        {
#if LocalTest
            LocalRequest.FingerprintUsageLog(log.FingerprintId, log.AppCode, log.UserId);
#else
            Web.Client.Post<dynamic>(API.URL(API.FINGERPRINT_USAGE_LOG), log);
#endif
        }

        internal static FingerprintValue AddWhiteboardValue(string Value)
        {
#if LocalTest
            return LocalRequest.FingerprintValueByValue(Value);
#else
            //LogFactory.Message("FingerprintValue={0}", new object[] { Value });
            return Web.Client.Post<FingerprintValue>(API.URL(API.WHITEBOARD_ADDVALUE), new { Value = Value });
#endif
        }
        internal static FingerprintValue WhiteboardById(string FingerprintId)
        {
#if LocalTest
            return LocalRequest.FingerprintValueById(FingerprintId);
#else
            return Web.Client.Post<FingerprintValue>(API.URL(API.WHITEBOARD_BYID), new { FingerprintId = FingerprintId });
#endif
        }
    }
}
