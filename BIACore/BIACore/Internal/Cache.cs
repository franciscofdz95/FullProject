using System;

namespace BIACore.Internal
{
    internal static class Cache
    {
        private static System.Web.Caching.Cache _cache { get; set; }

        public static int DEFAULT_CACHE_DURATION = 30;
        public static int LONG_CACHE_DURATION_MIN = 2;

        static Cache()
        {
            _cache = System.Web.HttpRuntime.Cache ?? new System.Web.Caching.Cache();
        }

        internal static int Count()
        {
            return _cache.Count;
        }

        internal static long EffectivePercentagePhysicalMemoryLimit()
        {
            return _cache.EffectivePercentagePhysicalMemoryLimit;
        }

        internal static long EffectivePrivateBytesLimit()
        {
            return _cache.EffectivePrivateBytesLimit;
        }

        internal static object Get(string key)
        {
            return _cache.Get(key);
        }

        internal static T Get<T>(string key)
        {
            return (T)_cache.Get(key);
        }

        internal static System.Collections.IDictionaryEnumerator GetEnumerator()
        {
            //cache contains secure information, do not want to make available in PROD
            if (Settings.Config.Debug)
                return _cache.GetEnumerator();
            else
                return null;
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
    }
}
