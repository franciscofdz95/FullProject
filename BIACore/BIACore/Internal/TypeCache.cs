using System;
using System.Collections.Generic;
using System.Linq;

namespace BIACore.Internal
{

    internal static class TypeCache
    {

        private readonly static object typeCacheLock = new object();

        private class TypeCacheItem
        {
            public Type Base { get; set; }
            public Dictionary<string, Type> Properties { get; set; }
            public Type Self { get; set; }

            public override bool Equals(object obj)
            {
                TypeCacheItem o = obj as TypeCacheItem;
                if (null == o) return false;

                if (Base != o.Base) return false;

                if (Properties.Count != o.Properties.Count) return false;

                return Properties.Count == Properties.Keys
                    .Where(k => o.Properties.ContainsKey(k) && Properties[k] == o.Properties[k])
                    .Count();
            }
        }

        private static List<TypeCacheItem> items = new List<TypeCacheItem>();

        internal static Type Get(Type baseType, Dictionary<string, Type> properties)
        {
            TypeCacheItem t = new TypeCacheItem()
            {
                Base = baseType,
                Properties = properties
            };

            lock (typeCacheLock)
            {
                // moved to for from foreach to (hopefully) avoid "Collection was modified" exception.
                // since the list will only ever grow and not shrink, this should be okay.
                for (int i = 0; i < items.Count; ++i)
                {
                    if (items[i] is TypeCacheItem && !object.ReferenceEquals(null, items[i]))
                    {
                        if (items[i].Equals(t)) return items[i].Self;
                    }
                }
            }
            return null;

        }

        internal static void Add(Type baseType, Dictionary<string, Type> properties, Type finalType)
        {
            TypeCacheItem t = new TypeCacheItem()
            {
                Base = baseType,
                Properties = properties,
                Self = finalType
            };
            lock (typeCacheLock)
            {
                items.Add(t);
            }
        }
    }
}
