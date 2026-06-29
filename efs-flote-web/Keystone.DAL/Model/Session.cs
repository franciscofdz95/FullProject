using System;

namespace BIACore.Model
{
    public class Session
    {
        public string sessionId { get; set; }
        public string appCode { get; set; }

        public int appOnline { get; set; }
        public int status { get; set; }
        public string appOfflineMsg { get; set; }

        public string userId { get; set; }
        public string ad_id { get; set; }
        public string empId { get; set; }
        public string authenticatedId { get; set; }
        public string authenticated_ad_id { get; set; }

        [Obsolete("Item is no longer included in return data")]
        public DateTime modified { get; set; }

        [Obsolete("Item is no longer included in return data")]
        public int impersonate { get; set; }
        [Obsolete("Item is no longer included in return data")]
        public string msg { get; set; }
        //[Obsolete("Item is no longer included in return data")]
        public string detail { get; set; }
        [Obsolete("Item is no longer included in return data")]
        public int appTimeout { get; set; }
        [Obsolete("Item is no longer included in return data")]
        public int pollInterval { get; set; }
    }
}
