using BIACore.Extensions;
using System;
using System.Collections.Generic;
using System.Reflection;

namespace BIACore.Utility
{
    public static class ObjectAccessors
    {
        public static bool CheckPropExists(dynamic obj, string property)
        {
            Type objType = obj.GetType();

            if (objType == typeof(Dictionary<string, object>)) return ((IDictionary<String, object>)obj).ContainsKey(property);
            else if (objType == typeof(Object) || objType.BaseType == typeof(Object))
            {
                PropertyInfo[] properties = objType.GetProperties();
                bool propFound = false;
                foreach (PropertyInfo prop in properties)
                {
                    if (prop.Name == property)
                    {
                        propFound = true;
                        break;
                    }
                }
                return propFound;
            }

            return objType.GetProperty(property) != null;
        }

        public static string GetPropValueString(object value)
        {
            if (value != null)
            {
                Type valType = value.GetType();
                MethodInfo[] functions = valType.GetMethods();

                if (valType.Name == "String") return (string)value;


                foreach (MethodInfo fnc in functions)
                {
                    if (fnc.Name == "ToString") return value.ToString();
                    if (fnc.Name == "ToDynamicString") return value.ToDynamicString();
                }
            }

            return null;
        }
    }
}
