using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Globalization;
using System.IO;
using System.Runtime.Serialization;
using System.Runtime.Serialization.Formatters.Binary;

namespace BIACore.Extensions
{
    public static class ObjectExtensions
    {
        public static T Clone<T>(this T source)
        {
            if (!typeof(T).IsSerializable)
            {
                throw new ArgumentException("The type must be serializable.", "source");
            }

            // Don't serialize a null object, simply return the default for that object
            if (Object.ReferenceEquals(source, null))
            {
                return default(T);
            }

            IFormatter formatter = new BinaryFormatter();
            Stream stream = new MemoryStream();
            using (stream)
            {
                formatter.Serialize(stream, source);
                stream.Seek(0, SeekOrigin.Begin);
                return (T)formatter.Deserialize(stream);
            }
        }

        public static Object ChangeType(this object value, Type type, CultureInfo format)
        {
            if (type == null) { throw new ArgumentNullException("conversionType"); }

            if (type.IsGenericType && type.GetGenericTypeDefinition().Equals(typeof(Nullable<>)))
            {
                //Pass a null value through without converting.
                if (value == null)
                {
                    return null;
                }
                // It's a nullable type, and not null, so that means it can be converted to its underlying type, so overwrite the passed-in conversion type with this underlying type    
                NullableConverter nullableConverter = new NullableConverter(type);
                type = nullableConverter.UnderlyingType;
            }
            // Now that we've guaranteed conversionType is something Convert.ChangeType can handle (i.e. not a nullable type), pass the call on to Convert.ChangeType  
            return Convert.ChangeType(value, type, format);
        }

        public static string ToDynamicString(this object value)
        {
            if (value == null) return string.Empty;

            Type t = value.GetType();
            List<string> nvp = new List<string>();

            foreach (System.Reflection.PropertyInfo p in t.GetProperties())
            {
                if (!p.CanRead) continue;
                nvp.Add(string.Format("{0}", p.GetValue(value, null)));
            }

            return string.Format("{0}", string.Join(",", nvp));
        }

        public static string ToLongString(this object value)
        {
            if (value == null) return string.Empty;

            Type t = value.GetType();
            List<string> nvp = new List<string>();

            foreach (System.Reflection.PropertyInfo p in t.GetProperties())
            {
                if (!p.CanRead) continue;

                //if (p.PropertyType != typeof(string) &&
                //    (p.PropertyType.GetInterface(typeof(IEnumerable).Name) != null ||
                //    p.PropertyType.GetInterface(typeof(IEnumerable<>).Name) != null))
                //{
                //    nvp.Add(string.Format("{0}={1}", p.Name, p.GetValue(value, null).ToLongString()));
                //}
                //else
                //{
                nvp.Add(string.Format("{0}={1}", p.Name, p.GetValue(value, null)));
                //}
            }

            return string.Format("{0}:({1})", t.Name, string.Join(",", nvp));
        }

        //public static string ToLongString(this IEnumerable value)
        //{
        //    if (value == null) return string.Empty;

        //    List<string> nvp = new List<string>();
        //    foreach (object item in value)
        //    {
        //        nvp.Add(item.ToLongString());
        //    }

        //    return string.Format("{0}:[{1}]", null, string.Join(",", nvp));
        //}
    }
}
