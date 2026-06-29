using System;
using System.Collections;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Web;

namespace BIACore.Server
{
    internal static class Cache
    {
        private static System.Web.Caching.Cache _cache { get; set; }

        public static int DEFAULT_CACHE_DURATION = 20;
        public static int EXTERNAL_CACHE_DURATION = 60;
        public static int LONG_CACHE_DURATION_MIN = 5;

        static Cache()
        {
            _cache = System.Web.HttpRuntime.Cache ?? new System.Web.Caching.Cache();
        }

        internal static object Get(string key)
        {
            return _cache.Get(key);
        }

        internal static T Get<T>(string key)
        {
            return (T)_cache.Get(key);
        }

        internal static void Set(string key, object value)
        {
            Set(key, value, System.DateTime.UtcNow.AddMinutes(Cache.LONG_CACHE_DURATION_MIN));
        }

        internal static void Set(string key, object value, DateTime expiration)
        {
            Remove(key);

            if (value != null)
            {
                _cache.Insert(key, value, null, expiration, System.Web.Caching.Cache.NoSlidingExpiration);
            }
        }

        internal static void Set(string key, object value, DateTime expiration, TimeSpan slidingExpiration)
        {
            Remove(key);

            if (value != null)
            {
                _cache.Insert(key, value, null, expiration, slidingExpiration);
            }
        }

        internal static void Remove(string key)
        {
            if (_cache.Get(key) != null)
            {
                _cache.Remove(key);
            }
        }

        public static void ClearSessionCache()
        {
            string SessionId = null;
            if (HttpContext.Current.Request.Cookies[API.SESSION_COOKIE] != null && HttpContext.Current.Request.Cookies[API.SESSION_COOKIE].Value != null)
                SessionId = HttpContext.Current.Request.Cookies[API.SESSION_COOKIE].Value;

            if (SessionId != null)
            {
                IDictionaryEnumerator CacheLooper = _cache.GetEnumerator();
                while (CacheLooper.MoveNext())
                {
                    if (CacheLooper.Key.ToString().IndexOf(SessionId) > -1) _cache.Remove(CacheLooper.Key.ToString());
                }
            }
        }
    }
}
