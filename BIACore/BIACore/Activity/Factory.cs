using Newtonsoft.Json;
using System.Web;

namespace BIACore.Activity
{
    internal class Factory
    {
        internal class ActivityEntryRemote
        {
            public string AppCode { get; set; }
            public string UserId { get; set; }

            public string Page { get; set; }
            public string Group { get; set; }
            public string Object { get; set; }

            public string IpAddress { get; set; }
            public string Browser { get; set; }
            public string Params { get; set; }
            //public Guid? SessionId { get; set; }
            //public string SecHash { get; set; }

            internal void Insert()
            {

                try
                {
                    System.Threading.Tasks.Task.Factory.StartNew((l) => {
                        Internal.Request.ActivityLog((ActivityEntryRemote)l);
                    }, this);
                    //Internal.Request.ActivityLog(this);
                }
                catch { }
            }
        }

        internal static void Insert(HttpRequest request, object data)
        {
            ActivityEntryRemote item = new ActivityEntryRemote()
            {
                AppCode = Settings.Config.AppCode,
                UserId = Web.CurrentContext.IsBIACoreApp() ? ActivityFactory.GetCachedActivityUserId() : Security.User._userId,
                Page = request.Path,
                Object = request.Path,
                IpAddress = request.UserHostAddress,
                Browser = request.UserAgent,
                //SessionId = HttpContext.Current.Request.Cookies[API.SESSION_COOKIE] != null ? HttpContext.Current.Request.Cookies[API.SESSION_COOKIE].Value : null,
                //SecHash = HttpContext.Current.Request.Cookies[API.SECHASH_COOKIE] != null ? HttpContext.Current.Request.Cookies[API.SECHASH_COOKIE].Value : null,
                Params = JsonConvert.SerializeObject(data)
            };
            item.Insert();
        }
    }
}
