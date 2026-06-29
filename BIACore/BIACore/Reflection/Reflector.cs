using BIACore.Extensions;
using System;
using System.Globalization;
using System.Reflection;
using System.Reflection.Emit;

namespace BIACore.Reflection
{
    /// <summary>
    /// This class does the dynamic class generation for the Providers.
    /// (see GetTypeBuilder)
    /// 
    /// If you pass in a type T - do make sure it is public, otherwise
    /// the assembly won't be able to extend it.
    /// </summary>
    public class Reflector
    {
        public static class Bindings
        {
            public static BindingFlags Create = BindingFlags.CreateInstance | BindingFlags.Instance | BindingFlags.Public | BindingFlags.NonPublic;
            public static BindingFlags Get = BindingFlags.GetField | BindingFlags.GetProperty | BindingFlags.Instance | BindingFlags.Public | BindingFlags.NonPublic;
            public static BindingFlags GetStatic = BindingFlags.Static | BindingFlags.Public | BindingFlags.FlattenHierarchy;
            public static BindingFlags GetProperty = BindingFlags.Instance | BindingFlags.Public | BindingFlags.NonPublic;
            public static BindingFlags Call = BindingFlags.InvokeMethod | BindingFlags.Instance | BindingFlags.Public | BindingFlags.NonPublic;
            public static BindingFlags CallStatic = BindingFlags.InvokeMethod | BindingFlags.Instance | BindingFlags.Static | BindingFlags.Public | BindingFlags.NonPublic;
            public static BindingFlags Set = BindingFlags.SetField | BindingFlags.SetProperty | BindingFlags.Instance | BindingFlags.Public | BindingFlags.NonPublic;
        }

        public static object Default(Type t)
        {
            object o = null;

            if (t.Equals(typeof(System.Byte)))
            {
                o = default(System.Byte);
            }
            else if (t.Equals(typeof(System.Byte[])))
            {
                o = default(System.Byte[]);
            }
            else if (t.Equals(typeof(System.Boolean)))
            {
                o = default(System.Boolean);
            }
            else if (t.Equals(typeof(System.Char)))
            {
                o = default(System.Char);
            }
            else if (t.Equals(typeof(System.DateTime)))
            {
                o = default(System.DateTime);
            }
            else if (t.Equals(typeof(System.DateTimeOffset)))
            {
                o = default(System.DateTimeOffset);
            }
            else if (t.Equals(typeof(System.Decimal)))
            {
                o = default(System.Decimal);
            }
            else if (t.Equals(typeof(System.Double)))
            {
                o = default(System.Double);
            }
            else if (t.Equals(typeof(System.Guid)))
            {
                o = default(System.Guid);
            }
            else if (t.Equals(typeof(System.Int16)))
            {
                o = default(System.Int16);
            }
            else if (t.Equals(typeof(System.Int32)))
            {
                o = default(System.Int32);
            }
            else if (t.Equals(typeof(System.Int64)))
            {
                o = default(System.Int64);
            }
            else if (t.Equals(typeof(System.SByte)))
            {
                o = default(System.SByte);
            }
            else if (t.Equals(typeof(System.Single)))
            {
                o = default(System.Single);
            }
            else if (t.Equals(typeof(System.String)))
            {
                o = default(System.String);
            }
            else if (t.Equals(typeof(System.TimeSpan)))
            {
                o = default(System.TimeSpan);
            }
            else if (t.Equals(typeof(System.UInt16)))
            {
                o = default(System.UInt16);
            }
            else if (t.Equals(typeof(System.UInt32)))
            {
                o = default(System.UInt32);
            }
            else if (t.Equals(typeof(System.UInt64)))
            {
                o = default(System.UInt64);
            }

            return o;
        }

        public static object Create(Type t, params object[] args)
        {
            object instance = t.InvokeMember(t.Name,
                Bindings.Create,
                null, null, args);

            return instance;
        }

        #region Property Operations
        public static void CreateProperty(TypeBuilder tb, string propertyName, Type propertyType)
        {
            FieldBuilder fieldBuilder = tb.DefineField("_" + propertyName,
                                                        propertyType,
                                                        FieldAttributes.Private);
            PropertyBuilder propertyBuilder =
                tb.DefineProperty(
                    propertyName, PropertyAttributes.HasDefault, propertyType, null);
            MethodBuilder getPropMthdBldr =
                tb.DefineMethod("get_" + propertyName,
                    MethodAttributes.Public |
                    MethodAttributes.SpecialName |
                    MethodAttributes.HideBySig,
                    propertyType, Type.EmptyTypes);

            ILGenerator getIL = getPropMthdBldr.GetILGenerator();

            getIL.Emit(OpCodes.Ldarg_0);
            getIL.Emit(OpCodes.Ldfld, fieldBuilder);
            getIL.Emit(OpCodes.Ret);

            MethodBuilder setPropMthdBldr =
                tb.DefineMethod("set_" + propertyName,
                  MethodAttributes.Public |
                  MethodAttributes.SpecialName |
                  MethodAttributes.HideBySig,
                  null, new Type[] { propertyType });

            ILGenerator setIL = setPropMthdBldr.GetILGenerator();

            setIL.Emit(OpCodes.Ldarg_0);
            setIL.Emit(OpCodes.Ldarg_1);
            setIL.Emit(OpCodes.Stfld, fieldBuilder);
            setIL.Emit(OpCodes.Ret);

            propertyBuilder.SetGetMethod(getPropMthdBldr);
            propertyBuilder.SetSetMethod(setPropMthdBldr);
        }

        public static PropertyInfo GetProperty(object o, string name, BindingFlags flags)
        {
            PropertyInfo pi = null;
            try
            {
                pi = o.GetType().GetProperty(name, flags);
            }
            catch (AmbiguousMatchException)
            {
                flags = flags | BindingFlags.DeclaredOnly;
                pi = o.GetType().GetProperty(name, flags);
            }

            return pi;
        }

        // SetProperty
        #endregion
        public static TypeBuilder GetTypeBuilder(int code, Type parent)
        {
            AssemblyName an = new AssemblyName("TempAssembly" + code);
            AssemblyBuilder assemblyBuilder =
                AppDomain.CurrentDomain.DefineDynamicAssembly(
                    an, AssemblyBuilderAccess.Run);
            ModuleBuilder moduleBuilder = assemblyBuilder.DefineDynamicModule("MainModule");

            TypeBuilder tb = moduleBuilder.DefineType("TempType" + code,
                                TypeAttributes.Public |
                                TypeAttributes.Class |
                                TypeAttributes.AutoClass |
                                TypeAttributes.AnsiClass |
                                TypeAttributes.BeforeFieldInit |
                                TypeAttributes.AutoLayout,
                                parent);
            return tb;
        }

        #region Search
        private class SearchResult<T>
        {
            internal T Value;
            internal Exception Error;
        }

        private static SearchResult<T> SearchHierarchy<T>(Type type, string name, BindingFlags flags, Binder binder, object target, object[] args, SearchResult<T> result)
        {
            if (result == null) { result = new SearchResult<T>(); }

            try
            {
                result.Value = (T)type.InvokeMember(name, flags, binder, target, args);
            }
            catch (Exception ex)
            {
                result.Error = (result.Error == null) ? ex : new Exception(ex.Message, result.Error);
            }

            //Unable to find object so check the next level of hierarchy.
            if (result.Error is System.MissingMethodException || result.Error is System.MissingMemberException || result.Error is System.MissingFieldException)
            {
                if (type.BaseType != null && result.Value == null)
                {
                    Reflector.SearchHierarchy<T>(type.BaseType, name, flags, binder, target, args, result);
                }
            }

            if (result.Value == null && result.Error != null)
            {
                throw result.Error;
            }

            return result;
        }
        #endregion

        public static void Set(object instance, string name, object value)
        {
            try
            {
                Reflector.SearchHierarchy<object>(instance.GetType(), name,
                    Bindings.Set,
                    null, instance, new object[] { value }, null);
            }
            catch (Exception ex)
            {
                throw new Exception(string.Format("Unable to set {0} with value {1}:{2}.", name, value.GetType().Name, value), ex);
            }
        }

        public static T Get<T>(object instance, string name)
        {
            return (T)Reflector.Get(typeof(T), instance, name);
        }

        public static object Get(Type t, object instance, string name)
        {
            object typed = Get(instance, name);
            try
            {
                typed = typed.ChangeType(t, CultureInfo.InvariantCulture);
            }
            catch
            {
                //If we cannot convert just return what we have.
            }

            return typed;
        }

        public static object Get(object instance, string name)
        {
            Type t = instance.GetType();
            SearchResult<object> sresult = null;
            try
            {
                if (instance != null)
                {
                    sresult = Reflector.SearchHierarchy<object>(t, name,
                        Bindings.Get,
                        null, instance, null, null);
                }
                else
                {
                    PropertyInfo pi = t.GetProperty(name, Bindings.GetStatic);
                    if (pi != null)
                    {
                        sresult = new SearchResult<object>();
                        sresult.Value = pi.GetValue(null, null);
                    }
                }
            }
            catch (Exception ex)
            {
                throw new Exception(string.Format("Unable to get {0} from type {1}.", name, t.Name), ex);
            }

            if (sresult == null) { return null; }

            return sresult.Value;
        }
    }
}
