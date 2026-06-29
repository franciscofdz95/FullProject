using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.IO;
using System.Net;
using System.Text;
using System.Web;

// this is the "Legacy" method for performing http post and get operations.
// I've put this in place to drop the dependency on System.Net.Http in client applications.
namespace BIACore.Web
{
    public class Client
    {
        public static T Post<T>(string url, object param, bool includeSessionCookie = false)
        {
            if (string.IsNullOrWhiteSpace(url)) throw new WebException("URL cannot be empty");

            // serialize data
            byte[] data = Encoding.UTF8.GetBytes(JsonConvert.SerializeObject(param));

            string response = DoNonAsyncPost(includeSessionCookie ? url + "?" + API.SESSION_COOKIE + "=" + System.Web.HttpUtility.UrlEncode(Security.Session.sessionId.ToString()) : url, data);

            if (response != null) return JsonConvert.DeserializeObject<T>(response);
            else return JsonConvert.DeserializeObject<T>("");
        }
        public static string Post(string url, object param, bool includeSessionCookie = false)
        {
            if (string.IsNullOrWhiteSpace(url)) throw new WebException("URL cannot be empty");

            // serialize data
            byte[] data = Encoding.UTF8.GetBytes(JsonConvert.SerializeObject(param));

            return DoNonAsyncPost(includeSessionCookie ? url + "?" + API.SESSION_COOKIE + "=" + System.Web.HttpUtility.UrlEncode(Security.Session.sessionId.ToString()) : url, data);
        }

        [Obsolete]
        public static void Post(string url, object param)
        {
            if (string.IsNullOrWhiteSpace(url)) throw new WebException("URL cannot be empty");

            // serialize data
            byte[] data = Encoding.UTF8.GetBytes(JsonConvert.SerializeObject(param));

            if (CurrentContext.IsBIACoreLocal()) DoNonAsyncPost(url, data);
            else DoAsyncPost(url, data);
        }

        private static string DoNonAsyncPost(string url, byte[] data)
        {
            try
            {
                // build request
                if (url.IndexOf("http://") != 0 && url.IndexOf("https://") != 0)
                {
                    //url = "http" + (HttpContext.Current != null && HttpContext.Current.Request != null && !HttpContext.Current.Request.IsSecureConnection ? "" : "s") + "://" + url;
                    url = "https" + "://" + url;
                }

                //url = url.Replace("https://bia", "http://bia");

                //if (url.IndexOf(Settings.Config.Server + Settings.Config.BaseURL) > -1) ServicePointManager.SecurityProtocol = SecurityProtocolType.Tls;

                // This condition checks to see if the call is from the localhost, if yes sets the location from HTTPS to HTTP
                //if ( url.ToLower().Contains("https://localhost") )
                //if (url.IndexOf("https://" + Settings.Config.Server + Settings.Config.BaseURL) > -1 && BIACore.Web.CurrentContext.IsLocalHost() ) 
                //    url = url.Replace("https://", "http://");

                ServicePointManager.SecurityProtocol = SecurityProtocolType.Tls12; // | SecurityProtocolType.Tls11;

                HttpWebRequest request = (HttpWebRequest)WebRequest.Create(url);
                //request.AllowAutoRedirect = true; //Dangerous implementation, never implemented, but this is for notes. M.Erdmann
                request.Accept = "application/json; charset=UTF-8";
                request.ContentType = "application/json";
                request.ContentLength = data.Length;
                request.Method = "POST";
                request.Headers.Add("Origin", Web.CurrentContext.IsLocalHost() ? "http://localhost" : BIACore.Settings.Config.Server);
                request.Headers.Add("X-Requested-With", "XMLHttpRequest");
                request.Headers.Add(API.TRANSACTION_ID_HEADER, Log.LogFactory.TransactionId.ToString());
                if (!Settings.Config.Proxy) request.Proxy = null;
                if (request.RequestUri.Host.ToLower() == Settings.Config.ServerInternal.ToLower() && HttpContext.Current != null && HttpContext.Current.Request != null && HttpContext.Current.Request.Cookies[API.SESSION_COOKIE] != null)
                {
                    if (request.CookieContainer == null) request.CookieContainer = new CookieContainer();
                    HttpCookie cookie = HttpContext.Current.Request.Cookies[API.SESSION_COOKIE];
                    request.CookieContainer.Add(new Cookie()
                    {
                        Domain = Settings.Config.ServerInternal,
                        Expires = cookie.Expires,
                        HttpOnly = cookie.HttpOnly,
                        Name = cookie.Name,
                        Path = cookie.Path,
                        Secure = cookie.Secure,
                        Value = cookie.Value
                    });
                }                

                using (Stream stream = request.GetRequestStream())
                {
                    stream.Write(data, 0, data.Length);
                }

                HttpWebResponse response = null;
                try
                {
                    response = (HttpWebResponse)request.GetResponse();
                }
                catch (Exception ex)
                {
                    if (request.RequestUri.PathAndQuery.IndexOf(API.LOG) < 0 && request.RequestUri.PathAndQuery.IndexOf("/Config/Config") < 0)
                        Log.LogFactory.Error("Client.Post Error: {0}{1}{0}url: {2}", new object[] { Environment.NewLine, ex.Message, request.RequestUri.ToString() });
                    throw ex;
                }

                // validate we have a response type we are expecting
                if (response.StatusCode < HttpStatusCode.OK || response.StatusCode >= HttpStatusCode.MultipleChoices)
                    throw new WebException(string.Format("Unexpected Response code ({0}: {1}) for url {2}", response.StatusCode, response.StatusDescription, url));


                // grab that response!
                using (StreamReader stream = new StreamReader(response.GetResponseStream()))
                {
                    return stream.ReadToEnd();
                }
            }
            catch (Exception ex)
            {
                //Catch Exception
                throw new WebException(string.Format("Client.Post Error: {0}{1}{0}url: {2}{0}{3}", new object[] { Environment.NewLine, ex.Message, url, ex.StackTrace }));
            }

            return null;
        }

        public static void Upload(string url, string fileName, Stream file)
        {
            if (string.IsNullOrWhiteSpace(url)) throw new WebException("URL cannot be empty");

            List<MimePart> parts = new List<MimePart>();

            try
            {
                // build request
                if (url.IndexOf("http://") != 0 && url.IndexOf("https://") != 0)
                {
                    url = "https://" + url;
                }

                //if ( url.ToLower().Contains("://localhost") )
                //    url = url.Replace("https://", "http://");

                ServicePointManager.SecurityProtocol = SecurityProtocolType.Tls12; //| SecurityProtocolType.Tls11;

                // build request
                HttpWebRequest request = (HttpWebRequest)WebRequest.Create(url);
                request.Accept = "text/html, application/xhtml+xml, */*";
                request.Headers.Add("Origin", Web.CurrentContext.IsLocalHost() ? "http://localhost" : BIACore.Settings.Config.Server);
                request.Headers.Add("X-Requested-With", "XMLHttpRequest");
                request.Headers.Add(API.TRANSACTION_ID_HEADER, Log.LogFactory.TransactionId.ToString());

                if (!Settings.Config.Proxy) request.Proxy = null;
                if (request.RequestUri.Host.ToLower() == Settings.Config.ServerInternal.ToLower() && HttpContext.Current != null && HttpContext.Current.Request != null && HttpContext.Current.Request.Cookies[API.SESSION_COOKIE] != null)
                {
                    if (request.CookieContainer == null) request.CookieContainer = new CookieContainer();
                    HttpCookie cookie = HttpContext.Current.Request.Cookies[API.SESSION_COOKIE];
                    request.CookieContainer.Add(new Cookie()
                    {
                        Domain = Settings.Config.ServerInternal,
                        Expires = cookie.Expires,
                        HttpOnly = cookie.HttpOnly,
                        Name = cookie.Name,
                        Path = cookie.Path,
                        Secure = cookie.Secure,
                        Value = cookie.Value
                    });
                }

                parts.Add(new StreamMimePart("file0", fileName, file, "application/octet-stream"));

                string boundary = "----------" + DateTime.Now.Ticks.ToString("x");
                request.ContentType = "multipart/form-data; boundary=" + boundary;
                request.Method = "POST";

                long contentLength = 0;
                byte[] postfile = Encoding.UTF8.GetBytes("\r\n");
                byte[] footer = Encoding.UTF8.GetBytes("--" + boundary + "--\r\n");

                foreach (MimePart part in parts)
                {
                    contentLength += part.EncodeHeader(boundary);
                }
                request.ContentLength = contentLength + footer.Length;

                using (Stream s = request.GetRequestStream())
                {
                    foreach (MimePart part in parts)
                    {
                        s.Write(part.Header, 0, part.Header.Length);
                        part.Data.CopyTo(s);
                        part.Data.Dispose();
                        s.Write(postfile, 0, postfile.Length);
                    }
                    s.Write(footer, 0, footer.Length);
                }
                HttpWebResponse response = (HttpWebResponse)request.GetResponse();

                // validate we have a response type we are expecting
                if (response.StatusCode < HttpStatusCode.OK || response.StatusCode >= HttpStatusCode.MultipleChoices)
                    throw new WebException(string.Format("Unexpected Response code ({0}: {1}) for url {2}", response.StatusCode, response.StatusDescription, url));

                // gotta do this in order to "complete" the upload...
                using (StreamReader stream = new StreamReader(response.GetResponseStream())) { }
            }
            catch (System.UriFormatException fex)
            {
                foreach (MimePart part in parts)
                {
                    if (part.Data != null)
                        part.Data.Dispose();
                }
                throw new System.UriFormatException("Invalid URI: " + url, fex);
            }
            catch (Exception ex)
            {
                foreach (MimePart part in parts)
                {
                    if (part.Data != null)
                        part.Data.Dispose();
                }
                throw;
            }
        }

        [Obsolete]
        private static void DoAsyncPost(string url, byte[] data)
        {
            try
            {
                // build request
                if (url.IndexOf("http://") != 0 && url.IndexOf("https://") != 0)
                {
                    url = "https://" + url;
                }

                ServicePointManager.SecurityProtocol = SecurityProtocolType.Tls12; // | SecurityProtocolType.Tls11;

                HttpWebRequest request = (HttpWebRequest)WebRequest.Create(url);
                request.Accept = "application/json; charset=UTF-8";
                request.ContentType = "application/json";
                request.ContentLength = data.Length;
                request.Method = "POST";
                request.Headers.Add("Origin", Web.CurrentContext.IsLocalHost() ? "http://localhost" : BIACore.Settings.Config.Server);
                request.Headers.Add("X-Requested-With", "XMLHttpRequest");
                request.Headers.Add(API.TRANSACTION_ID_HEADER, Log.LogFactory.TransactionId.ToString());
                if (!Settings.Config.Proxy) request.Proxy = null;

                if (request.RequestUri.Host == Settings.Config.ServerInternal && HttpContext.Current != null && HttpContext.Current.Request != null && HttpContext.Current.Request.Cookies[API.SESSION_COOKIE] != null)
                {
                    if (request.CookieContainer == null) request.CookieContainer = new CookieContainer();
                    HttpCookie cookie = HttpContext.Current.Request.Cookies[API.SESSION_COOKIE];
                    request.CookieContainer.Add(new Cookie()
                    {
                        Expires = cookie.Expires,
                        HttpOnly = cookie.HttpOnly,
                        Name = cookie.Name,
                        Path = cookie.Path,
                        Secure = cookie.Secure,
                        Value = cookie.Value
                    });
                }

                request.BeginGetRequestStream(new AsyncCallback(GetRequestStreamCallback), new
                {
                    Data = data,
                    Request = request
                });
            }
            catch (Exception ex)
            {
                //Catch Exception
            }
        }

        [Obsolete]
        private static void GetRequestStreamCallback(IAsyncResult asyncResult)
        {
            dynamic state = asyncResult.AsyncState;
            HttpWebRequest request = (HttpWebRequest)state.Request;
            byte[] data = (byte[])state.Data;

            try
            {
                using (Stream stream = request.EndGetRequestStream(asyncResult))
                {
                    stream.Write(data, 0, data.Length);
                }
            }
            catch { }
            request.BeginGetResponse(new AsyncCallback(GetResponseCallback), request);
        }

        [Obsolete]
        private static void GetResponseCallback(IAsyncResult asyncResult)
        {
            try
            {
                HttpWebRequest request = (HttpWebRequest)asyncResult.AsyncState;
                using (HttpWebResponse response = (HttpWebResponse)request.EndGetResponse(asyncResult))
                {
                    // we don't actually do anything with this.
                }
            }
            catch { } // handles any errors quietly
        }
    }
}
