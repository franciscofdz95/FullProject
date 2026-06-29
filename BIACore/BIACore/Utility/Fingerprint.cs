using BIACore.Model;

namespace BIACore.Utility
{
    public class Fingerprint
    {
        public static FingerprintValue GetFingerprintById(string FingerprintId)
        {
            return Internal.Request.FingerprintById(FingerprintId);
        }
        public static FingerprintValue GetFingerprintByValue(string Value)
        {
            //LogFactory.Message("FingerprintValue={0}", new object[] { Value });
            return Internal.Request.FingerprintByValue(Value);
        }
        public static void FingerprintUsageLog(string FingerprintId)
        {
            System.Threading.Tasks.Task.Factory.StartNew((l) => {
                Internal.Request.FingerprintUsageLog(l);
            }, new
            {
                FingerprintId = FingerprintId,
                AppCode = BIACore.Settings.Config.AppCode,
                UserId = BIACore.Security.Session.userId != null ? BIACore.Security.Session.userId : "Unknown"
            });
            //Internal.Request.FingerprintUsageLog(new
            //{
            //    FingerprintId = FingerprintId,
            //    AppCode = BIACore.Settings.Config.AppCode,
            //    UserId = BIACore.Security.Session.userId
            //});
        }
        public static FingerprintValue AddWhiteboardValue(string Value)
        {
            return Internal.Request.AddWhiteboardValue(Value);
        }
        public static FingerprintValue GetWhiteboardById(string FingerprintId)
        {
            return Internal.Request.WhiteboardById(FingerprintId);
        }
    }
}
