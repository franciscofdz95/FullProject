namespace BIACore
{
    // <summary>
    // Static, centrally defined constants.
    // </summary>
    public static class API
    {
        public const string SESSION_COOKIE = "BIASID";
        public const string SECHASH_COOKIE = "BIACID";
        public const string EXPORTER_COOKIE = "EXPORTERSID";
        public const string LOCALHOST_TOKEN_QP = "lhToken";
        public const string LOCALHOST_TOKEN_COOKIE = "BIATID";
        public const string LOCALHOST_TOKENREMOVE_QP = "lhRemoveQuery";
        public const string TRANSACTION_ID_HEADER = "BIA-Transaction-Id";
        public const string EAM_HEADER = "SM_USER";

        internal const string LOG = "/api/log/event";
        internal const string ACTIVITY = "/api/log/activity";
        internal const string VERSION = "/api/log/version";
        internal const string EXPORT = "/api/log/export";
        internal const string CONNECTION = "/api/log/appconnection";
        internal const string FINGERPRINT_BYID = "/api/fingerprintvalue/getfingerprintbyid";
        internal const string FINGERPRINT_BYVALUE = "/api/fingerprintvalue/getfingerprintbyvalue";
        internal const string FINGERPRINT_USAGE_LOG = "/api/fingerprintvalue/fingerprintusagelog";
        internal const string WHITEBOARD_ADDVALUE = "/api/fingerprintvalue/addwhiteboardvalue";
        internal const string WHITEBOARD_BYID = "/api/fingerprintvalue/getwhiteboardbyid";
        internal const string HASHICORP_ENCRYPT = "/api/utility/encrypt";
        internal const string HASHICORP_DECRYPT = "/api/utility/decrypt";

        internal const string APPLICATION = "/api/application/application";
        internal const string APPLICATIONBASE = "/api/application/applicationbase";
        internal const string APPLICATION_CONNECTIONS = "/api/application/applicationconnections";
        internal const string APPLICATIONAZURE = "/api/application/azure";
        internal const string SESSION = "/api/session/session";
        internal const string SESSION_CLIENT = "/api/session/sessionclient";
        internal const string SESSION_SECURE_START = "/api/session/sessionsecurestart";
        internal const string USER = "/api/user/user";
        internal const string APRS_ROLES = "/api/user/aprsroles";
        internal const string USER_BYID = "/api/user/standaloneuser";
        internal const string USER_BYAZUREID = "/api/user/userazure";
        internal const string USER_STANDALONE = "/api/user/user";

        internal const string USER_LIST = "/api/application/userlist";
        //internal const string APPLICATION = "/api/application/application";
        //internal const string SESSION = "/api/security/session";
        //internal const string USER = "/api/security/user";
        //internal const string USER_STANDALONE = "/api/security/userbyid";

        //internal const string NOTIFY_EMAIL = "/api/notify/email";        

        internal const string UPLOAD_EXTENSION = "/api/upload/uploadextension";
        internal const string CODE_NAME = "/api/codename/codename";

        internal static string URL(string path)
        {
            return string.Format("https://{0}{1}{3}{2}",
                Settings.Config.ServerInternal,
                Settings.Config.BaseURL,
                path,
                path.Substring(0,1) != "/" ? "/" : "");
        }

        internal static string ExternalURL(string path)
        {
            return string.Format("{0}{2}{1}",
                Settings.Config.Server,
                path,
                Settings.Config.Server.Substring(Settings.Config.Server.Length - 1, 1) != "/" && path.Substring(0, 1) != "/" ? "/" : "");
        }
    }
}