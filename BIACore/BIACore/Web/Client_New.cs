//using System;
//using System.Collections.Generic;
//using System.Collections.Specialized;
//using System.Linq;
//using System.Text;
//using System.Net.Http;
//using System.Net.Http.Headers;

//using Newtonsoft.Json;

//using BIACore.Log;

//// this is the "new" method for performing http post and get operations
//// unfortunately, this requires System.Net.Http, which is not part of the core .Net client
//namespace BIACore.Web
//{
//    /// <summary>
//    /// Class for handling interactions from inside of c# to web servers.
//    /// This is necessary for the BIACoreModule to talk to the BIACore\2.0\
//    /// web services to find things like user and session information.
//    /// </summary>
//    public class _Client
//    {
//        private static HttpClientHandler _httpClientHandler = null;
//        private static HttpClient _httpClient = null;
//        internal static HttpClient client
//        {
//            get
//            {
//                if (null == _httpClient)
//                {
//                    // http://msdn.microsoft.com/en-us/library/system.net.servicepoint.aspx
//                    // force the HttpClient to only allow 2 outstanding connections at a time.
//                    // this (should) stop the thread pool from being clogged by us.
//                    // the idea is that we have 1 for security related calls, and while that 
//                    // (relatively long running operation) is pending, the log calls can still run.
//                    //System.Net.ServicePointManager.DefaultConnectionLimit = 2;
//                    _httpClientHandler = new HttpClientHandler();
//                    _httpClientHandler.UseProxy = Settings.Config.Proxy;
//                    _httpClient = new HttpClient(_httpClientHandler as HttpMessageHandler) { Timeout = new TimeSpan(0, 0, 15) };
//                    //_httpClient = new HttpClient() { Timeout = new TimeSpan(0, 0, 15) };
//                    client.DefaultRequestHeaders.Accept.Add(new MediaTypeWithQualityHeaderValue("application/json"));
//                }
//                return _httpClient;
//            }
//        }

//        private static HttpContent PostContent(object param)
//        {
//            return new StringContent(JsonConvert.SerializeObject(param), Encoding.UTF8, "application/json");
//        }

//        private static T ResponseContent<T>(HttpResponseMessage response)
//        {
//            //check content type before deserializing blindly.
//            return JsonConvert.DeserializeObject<T>(response.Content.ReadAsStringAsync().Result);
//        }

//        // Doesn't actually work yet. I think.
//        public static T Get<T>(string url, object param)
//        {
//            if (string.IsNullOrWhiteSpace(url)) return default(T);

//            try
//            {
//                Uri uri = new Uri(url);

//                NameValueCollection nvc = new NameValueCollection();
//                Type t = param.GetType();
//                foreach (System.Reflection.PropertyInfo p in t.GetProperties())
//                {
//                    if (p.CanRead)
//                    {
//                        nvc.Add(p.Name, p.GetValue(param, null).ToString());
//                    }
//                }

//                HttpResponseMessage response = client.GetAsync(url).Result;

//                if (!response.IsSuccessStatusCode)
//                    throw new HttpRequestException(string.Format("{0}: {1}{3}GET {2}",
//                        response.StatusCode,
//                        response.ReasonPhrase,
//                        url, Environment.NewLine));

//                return ResponseContent<T>(response);
//            }
//            catch (Exception e)
//            {
//                LogFactory.Exception(e);
//            }

//            return default(T);
//        }

//        public static T Post<T>(string url, object param)
//        {
//            if (string.IsNullOrWhiteSpace(url)) return default(T);

//            try
//            {
//                HttpResponseMessage response = client.PostAsync(url, PostContent(param)).Result;

//                if (!response.IsSuccessStatusCode)
//                    throw new HttpRequestException(string.Format("{0}: {1}{3}POST {2}",
//                        response.StatusCode,
//                        response.ReasonPhrase,
//                        url, Environment.NewLine));

//                return ResponseContent<T>(response);
//            }
//            catch (Exception e)
//            {
//                // TODO: this gets caught in an exception loop when the exception is due to the logging system to begin with.
//                //LogFactory.Exception(e);
//                throw;
//            }
//        }

//        public static void Post(string url, object param)
//        {
//            if (string.IsNullOrWhiteSpace(url)) return;

//            try
//            {
//                HttpResponseMessage response = client.PostAsync(url, PostContent(param)).Result;

//                if (!response.IsSuccessStatusCode)
//                    throw new HttpRequestException(string.Format("{0}: {1}{3}POST {2}",
//                        response.StatusCode,
//                        response.ReasonPhrase,
//                        url, Environment.NewLine));
//            }
//            catch (Exception e)
//            {
//                // TODO: this gets caught in an exception loop when the exception is due to the logging system to begin with.
//                //LogFactory.Exception(e);
//                throw;
//            }
//        }

//        public static void PostIgnoreResult(string url, object param)
//        {
//            if (string.IsNullOrWhiteSpace(url)) return;

//            try
//            {
//                client.PostAsync(url, PostContent(param));
//            }
//            catch { }
//        }
//    }
//}
