using System;
using System.Web;

namespace BIACore.Web
{
    public class CurrentContext
    {
        public static string GetRequestOrigin()
        {
            if (HttpContext.Current.Request.Headers["Origin"] == null) return "";
            else return HttpContext.Current.Request.Headers["Origin"];
        }

        public static bool IsCrossDomain()
        {
            return GetRequestOrigin() == Settings.Config.Server;
        }

        public static string GetRequestContent()
        {
            HttpRequest request = HttpContext.Current.Request;
            // can't use stream operations because those close the input stream and prevent
            // later operations from using it.
            byte[] bytes = new byte[request.InputStream.Length];
            request.InputStream.Read(bytes, 0, bytes.Length);
            request.InputStream.Position = 0;
            return request.ContentEncoding.GetString(bytes).TrimEnd('\0');
        }

        public static bool IsLocalHost()
        {
            return Environment.MachineName.ToUpper().IndexOf("WKSP000") == 0;
        }

        public static bool IsBIACoreLocal()
        {
            return Environment.MachineName.ToUpper().IndexOf("WKSP0008202F") == 0;
        }

        public static bool IsBIACoreApp()
        {
            return Settings.Config.AppCode == "BIACore";
        }

        public static string GetSessionCookieValue()
        {
            string cookieValue = null;
            if (HttpContext.Current != null && HttpContext.Current.Request != null && HttpContext.Current.Request.Cookies != null
                && HttpContext.Current.Request.Cookies[API.SESSION_COOKIE] != null
                && !String.IsNullOrWhiteSpace(HttpContext.Current.Request.Cookies[API.SESSION_COOKIE].Value))
            {
                cookieValue = HttpContext.Current.Request.Cookies[API.SESSION_COOKIE].Value;
            }
            return cookieValue;
        }

        public static string GetLocalHostTokenCookieValue()
        {
            string cookieValue = "";
            if (HttpContext.Current != null && HttpContext.Current.Request != null && HttpContext.Current.Request.Cookies != null
                && HttpContext.Current.Request.Cookies[API.LOCALHOST_TOKEN_COOKIE] != null
                && !String.IsNullOrWhiteSpace(HttpContext.Current.Request.Cookies[API.LOCALHOST_TOKEN_COOKIE].Value))
            {
                cookieValue = HttpContext.Current.Request.Cookies[API.LOCALHOST_TOKEN_COOKIE].Value;
            }
            return cookieValue;
        }

        public static bool RequestIsAjax()
        {
            HttpRequest request = HttpContext.Current.Request;
            return (string.IsNullOrWhiteSpace(request.UserAgent) || request.Headers["X-Requested-With"] == "XMLHttpRequest");
        }

        public static Guid GetTransactionIdHeader()
        {
            string transId = "";
            Guid TransactionId = Guid.Empty;
            try
            {
                if (HttpContext.Current != null && HttpContext.Current.Request != null && HttpContext.Current.Request.Headers[API.TRANSACTION_ID_HEADER] != null)
                {
                    if (!Guid.TryParse(HttpContext.Current.Request.Headers[API.TRANSACTION_ID_HEADER].ToString(), out TransactionId)) TransactionId = Guid.Empty;
                }
            }
            catch (Exception ex) { }

            return TransactionId;
        }
    }
}
