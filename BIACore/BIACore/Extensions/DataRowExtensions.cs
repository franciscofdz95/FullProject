using BIACore.Reflection;
using System;
using System.Collections.Generic;
using System.Data;
using System.IO;
using System.Reflection;
using System.Reflection.Emit;

namespace BIACore.Extensions
{
    public static class DataRowExtensions
    {
        /// <summary>
        /// Compares two values to see if they are equal. Also compares DBNULL.Value.
        /// Note: If your DataTable contains object fields, then you must extend this
        /// function to handle them in a meaningful way if you intend to group on them.
        /// </summary>
        /// <param name="A"></param>
        /// <param name="B"></param>
        /// <returns></returns>
        public static bool ColumnValuesEqual(this DataRow dr, object A, object B)
        {
            if (A == DBNull.Value && B == DBNull.Value) //  both are DBNull.Value
                return true;
            if (A == DBNull.Value || B == DBNull.Value) //  only one is DBNull.Value
                return false;
            return (A.Equals(B));  // value type standard comparison
        }

        public static void Default_Booleans(this DataRow dr, bool bDefault = false)
        {
            foreach (DataColumn DC in dr.Table.Columns)
            {
                if (DC.DataType == typeof(bool))
                {
                    if (dr[DC.ColumnName] == DBNull.Value)
                        dr[DC.ColumnName] = bDefault;
                }
            }
        }

        /// <summary>
        /// This read the column as a byte[] and writes it straight to a file via BinaryWriter
        /// </summary>
        /// <param name="DR"></param>
        /// <param name="sFieldName"></param>
        /// <param name="sFilename"></param>
        public static void ToFile(this DataRow DR, string sFieldName, string sFilename)
        {
            byte[] mFile = (byte[])DR[sFieldName];

            if (File.Exists(sFilename))
                File.Delete(sFilename);
            using (BinaryWriter BW = new BinaryWriter(File.Create(sFilename)))
            {
                BW.Write(mFile);
                BW.Close();
            }
        }

        public static void FromFile(this DataRow dr, string sFieldName, string sFilename)
        {
            /*
            byte[] buffer = null;
            using ( FileStream fileStream = new FileStream( sFilename, FileMode.Open, FileAccess.Read ) )
            {
                try
                {
                    int length = (int)fileStream.Length;
                    // get file length
                    buffer = new byte[ length ]; // create buffer
                    int count;
                    // actual number of bytes read
                    int sum = 0;
                    // total number of bytes read
                    // read until Read method returns 0 (end of the stream has been reached)
                    while ( ( count = fileStream.Read( buffer, sum, length - sum ) ) > 0 )
                        sum += count;
                    // sum is a buffer offset for next reading
                }
                finally
                {
                    fileStream.Close();
                }
            }
            */
            //dr[ sFieldName ] = Utility.FileToByteBuffer( sFilename );

        }

        public static void LoadFromTextFile(this DataRow DR, string sFiledName, string sFilename)
        {
            string sResult = "";
            using (StreamReader SR = new StreamReader(sFilename))
            {
                while (!SR.EndOfStream)
                    sResult += SR.ReadLine();
            }

            DR[sFiledName] = sResult;
        }

        public static void SaveToTextFile(this DataRow DR, string sFiledName, string sFilename)
        {
            using (StreamWriter w = File.AppendText(sFilename))
            {
                w.Write(DR.ToString(sFiledName));
                w.Flush();
                w.Close();
            }
        }

        /// <summary>
        /// Returns a character.  
        /// NOTE: This will alway return at least ' ', NOT ''
        /// </summary>
        /// <param name="sFieldName">Name of field to process</param>
        /// <returns></returns>
        public static char ToChar(this DataRow DR, string sFieldName)
        {
            string sResult = ToString(DR, sFieldName, "");
            if (sResult.Length > 0)
                return sResult[0];
            else
                return ' ';
        }

        public static string ToString(this DataRow DR, string sFieldname)
        {
            return ToString(DR, sFieldname, "");
        }

        public static string ToString(this DataRow DR, string sFieldname, string cMask)
        {
            if (DR.Table.Columns[sFieldname].DataType == System.Type.GetType("System.String"))
                return ToStringS(DR, sFieldname);

            if (DR.Table.Columns[sFieldname].DataType == System.Type.GetType("System.Guid"))
                return ToStringS(DR, sFieldname);

            if (DR.Table.Columns[sFieldname].DataType == System.Type.GetType("System.DateTime"))
                return ToStringDT(DR, sFieldname, cMask);

            if (DR.Table.Columns[sFieldname].DataType == System.Type.GetType("System.DateTimeOffset"))
                return ToStringDT(DR, sFieldname, cMask);

            if (DR.Table.Columns[sFieldname].DataType == System.Type.GetType("System.Int32"))
                return ToStringI(DR, sFieldname, cMask);
            if (DR.Table.Columns[sFieldname].DataType == System.Type.GetType("System.Int16"))
                return ToStringI(DR, sFieldname, cMask);
            if (DR.Table.Columns[sFieldname].DataType == System.Type.GetType("System.Int64"))
                return ToStringL(DR, sFieldname, cMask);

            if (DR.Table.Columns[sFieldname].DataType == System.Type.GetType("System.UInt16"))
                return ToStringI(DR, sFieldname, cMask);
            if (DR.Table.Columns[sFieldname].DataType == System.Type.GetType("System.UInt32"))
                return ToStringI(DR, sFieldname, cMask);
            if (DR.Table.Columns[sFieldname].DataType == System.Type.GetType("System.UInt64"))
                return ToStringI(DR, sFieldname, cMask);

            if (DR.Table.Columns[sFieldname].DataType == System.Type.GetType("System.Decimal"))
                return ToStringDec(DR, sFieldname, cMask);
            if (DR.Table.Columns[sFieldname].DataType == System.Type.GetType("System.Double"))
                return ToStringDouble(DR, sFieldname, cMask);

            return "?RowValue:UnknownType?";
        }

        public static string ToStringS(this DataRow DR, string sFieldname)
        {
            if (!DR.IsNull(sFieldname))
            {
                if (DR.Table.Columns[sFieldname].DataType == System.Type.GetType("System.Guid"))
                    return ((Guid)DR[sFieldname]).ToString();
                else
                    return (string)DR[sFieldname];
            }
            else
                return "";
        }


        public static string ToStringI(this DataRow DR, string sFieldname, string cMask)
        {
            if (!DR.IsNull(sFieldname))
            {
                return ((int)DR[sFieldname]).ToString(cMask);
            }
            else
            {
                int iReturn = 0;
                return iReturn.ToString(cMask);
            }
        }

        public static string ToStringL(this DataRow DR, string sFieldname, string cMask)
        {
            if (!DR.IsNull(sFieldname))
            {
                return ((long)DR[sFieldname]).ToString(cMask);
            }
            else
            {
                long iReturn = 0;
                return iReturn.ToString(cMask);
            }
        }

        public static long ToLong(this DataRow DR, string sFieldname)
        {
            if (!DR.IsNull(sFieldname))
                return ((long)DR[sFieldname]);
            else
                return 0;
        }

        public static int ToInteger(this DataRow DR, string sFieldname)
        {
            if (!DR.IsNull(sFieldname))
                return ((int)DR[sFieldname]);
            else
                return 0;
        }

        public static string ToStringDec(this DataRow DR, string sFieldname, string cMask)
        {
            if (!DR.IsNull(sFieldname))
                return ((decimal)DR[sFieldname]).ToString(cMask);
            else
            {
                decimal iReturn = 0;
                return iReturn.ToString(cMask);
            }
        }

        public static decimal ToDecimal(this DataRow DR, string sFieldname)
        {
            if (!DR.IsNull(sFieldname))
                return ((decimal)DR[sFieldname]);
            else
            {
                decimal iReturn = 0;
                return iReturn;
            }
        }

        public static string ToStringDouble(this DataRow DR, string sFieldname, string cMask)
        {
            if (!DR.IsNull(sFieldname))
                return ((double)DR[sFieldname]).ToString(cMask);
            else
            {
                double fReturn = 0;
                return fReturn.ToString(cMask);
            }
        }

        public static double ToDouble(this DataRow DR, string sFieldname)
        {
            if (!DR.IsNull(sFieldname))
                return (double)DR[sFieldname];
            else
            {
                double fReturn = 0;
                return fReturn;
            }
        }

        public static string ToStringDT(this DataRow DR, string sFieldname, string cDateFormat)
        {
            if (!DR.IsNull(sFieldname))
            {
                if (DR[sFieldname].GetType() == typeof(System.DateTime))
                    return ((DateTime)DR[sFieldname]).ToString(cDateFormat);
                else
                    return ((DateTimeOffset)DR[sFieldname]).ToString(cDateFormat);
            }
            else
                return "";
        }

        public static DateTime ToDateTime(this DataRow DR, string sFieldname, DateTime? dDefault = null)
        {
            if (!DR.IsNull(sFieldname))
            {
                if (DR[sFieldname].GetType() == typeof(System.DateTime))
                    return (DateTime)DR[sFieldname];
                else
                    return ((DateTimeOffset)DR[sFieldname]).Date;
            }
            else
            {
                if (dDefault != null)
                    return (DateTime)dDefault;
                else
                    return new DateTimeOffset(new DateTime(1980, 1, 1)).Date;
            }
        }

        public static DateTime ToDate(this DataRow DR, string sFieldname, DateTime? dDefault = null)
        {
            if (!DR.IsNull(sFieldname))
            {
                if (DR[sFieldname].GetType() == typeof(System.DateTime))
                    return ((DateTime)DR[sFieldname]).Date;
                else
                    return ((DateTimeOffset)DR[sFieldname]).Date;
            }
            else
            {
                if (dDefault != null)
                    return (DateTime)dDefault;
                else
                    return new DateTimeOffset(new DateTime(1980, 1, 1)).Date;
            }
        }

        public static bool ToBoolean(this DataRow DR, string cField)
        {
            if (!DR.IsNull(cField))
                return (bool)DR[cField];
            else
                return false;
        }

        public static Guid ToGuid(this DataRow DR, string sFieldname)
        {
            if (!DR.IsNull(sFieldname))
                return (Guid)DR[sFieldname];
            else
                return Guid.Empty;
        }

        /// <summary>
        /// Copys any fields that exist in both rows.  
        /// Does not copy primary key field(s).
        /// Does not write to readonly fields but will copy them to a destination if its not readonly.
        /// </summary>
        /// <param name="DRSource"></param>
        /// <param name="DRDestination"></param>
        /// <returns></returns>
        public static bool CopyTo(this DataRow DRSource, DataRow DRDestination)
        {
            DataColumn[] aPrimaryKey = DRSource.Table.PrimaryKey;

            foreach (DataColumn DC in DRSource.Table.Columns)
            {
                if (!aPrimaryKey.Contains(DC.ColumnName))
                {
                    if (DRDestination.Table.Columns.IndexOf(DC.ColumnName) >= 0)
                    {
                        if (!DRDestination.Table.Columns[DC.ColumnName].ReadOnly) // NOTE it will copy if the SOURCE is readonly but the target isn't
                        {
                            if (DRDestination.Table.Columns[DC.ColumnName].DataType == typeof(System.DateTime))
                            {
                                if (DRSource[DC.ColumnName].GetType() == typeof(System.DateTimeOffset))
                                    DRDestination[DC.ColumnName] = ((DateTimeOffset)DRSource[DC.ColumnName]).DateTime;
                                else
                                    DRDestination[DC.ColumnName] = DRSource[DC.ColumnName];
                            }
                            else if (DRSource.Table.Columns[DC.ColumnName].DataType == typeof(System.DateTimeOffset))
                            {
                                if (DRSource[DC.ColumnName].GetType() == typeof(System.DateTime))
                                    DRDestination[DC.ColumnName] = new DateTimeOffset((DateTime)DRSource[DC.ColumnName]);
                                else
                                    DRDestination[DC.ColumnName] = DRSource[DC.ColumnName];
                            }
                            else
                                DRDestination[DC.ColumnName] = DRSource[DC.ColumnName];
                        }
                    }
                }
            }

            return true;
        }

        public static Dictionary<string, object> ToDictionary(this DataRow drSource)
        {
            Dictionary<string, object> d = new Dictionary<string, object>();

            foreach (DataColumn DC in drSource.Table.Columns)
                d.Add(DC.ColumnName, drSource[DC.ColumnName]);

            return d;
        }

        private static void ObjectSetValue(DataRow dr, object oTarget, string sPropertyName, object oValue)
        {
            PropertyInfo PI = oTarget.GetType().GetProperty(sPropertyName);
            if (PI != null)
                PI.SetValue(dr, oValue, null);
        }

        private static object ObjectGetValue(object oSource, string sPropertyName)
        {
            PropertyInfo PI = oSource.GetType().GetProperty(sPropertyName);
            if (PI != null)
            {
                return oSource.GetType().GetProperty(sPropertyName).GetValue(oSource, null);
            }

            return null;
        }

        public static void ToObject(this DataRow dr, object oTarget)
        {
            foreach (DataColumn DC in dr.Table.Columns)
            {
                ObjectSetValue(dr, oTarget, DC.ColumnName, dr[DC.ColumnName]);
            }
        }

        public static void SaveObject(this DataRow dr, object oSource)
        {
            foreach (DataColumn DC in dr.Table.Columns)
            {
                object o = ObjectGetValue(oSource, DC.ColumnName);
                if (o != null)
                {
                    if (DC.DataType == typeof(DateTime))
                    {

                    }
                    else
                    {
                        dr[DC.ColumnName] = o;
                    }
                }
            }
        }

        #region Copied over from old Core
        public static T ToType<T>(this DataRow dr, bool allowNullable = false) where T : new()
        {
            // determine if we've already defined an extension of "dest" type
            string AnonType = "_anonType";
            Type t = dr.Table.ExtendedProperties[AnonType] as Type;

            if (t == null)
            {
                // if T is public, it can be extended.
                // use this feature to create a new extension of T that includes
                // every column in the DataRow.
                t = typeof(T);
                if (t.IsPublic && !t.IsSealed && t.GetCustomAttributes(typeof(NonExtendable), false).Length < 1)
                {
                    Dictionary<string, Type> properties = new Dictionary<string, Type>();
                    foreach (DataColumn dc in dr.Table.Columns)
                    {
                        properties.Add(dc.ColumnName, dc.DataType.IsValueType && !IsTypeNullable(dc.DataType) && allowNullable
                            ? typeof(Nullable<>).MakeGenericType(dc.DataType)
                            : dc.DataType
                        );

                    }

                    // check if we've already created this type
                    t = Internal.TypeCache.Get(typeof(T), properties);
                    if (t == null)
                    {
                        // we haven't, create it, define any extra properties in the row that are not already in the object.
                        int classId = Guid.NewGuid().ToString().GetHashCode();
                        TypeBuilder tb = Reflector.GetTypeBuilder(classId, typeof(T));
                        foreach (KeyValuePair<string,Type> prop in properties)
                        {
                            // if the property doesn't already exist on the object, add it.
                            if (tb.BaseType.GetProperty(prop.Key) == null)
                                Reflector.CreateProperty(tb, prop.Key, prop.Value);
                        }

                        t = tb.CreateType();
                        Internal.TypeCache.Add(typeof(T), properties, t);
                    }
                }
                // else T is not extendable. Continue.
                // saved for later, so everything in a DataTable has the same return type.
                dr.Table.ExtendedProperties[AnonType] = t;
            }

            object result = Reflector.Create(t);
            object value;
            foreach (DataColumn dc in dr.Table.Columns)
            {
                PropertyInfo ep = Reflector.GetProperty(result, dc.ColumnName, Reflector.Bindings.GetProperty | BindingFlags.IgnoreCase);

                // a non-extendable class with a property that isn't defined. move along.
                if (null == ep) continue;

                value = dr.IsNull(dc.ColumnName) && (!allowNullable || !IsTypeNullable(ep.PropertyType))
                    ? Reflector.Default(dc.DataType)
                    : dr.IsNull(dc.ColumnName) ? null : dr[dc.ColumnName];

                if (ep.PropertyType.IsEnum)
                {
                    value = Enum.ToObject(ep.PropertyType, value);
                }
                Reflector.Set(result, dc.ColumnName, value);
            }

            return (T)result;
        }

        public static DataRow CloneRow(this DataRow dr)
        {
            DataTable temp = dr.Table.Clone();
            temp.ImportRow(dr);
            return temp.Rows[0];
        }
        private static bool IsTypeNullable(Type type)
        {
            // Abort if no type supplied
            if (type == null)
                return false;

            // If this is not a value type, it is a reference type, so it is automatically nullable
            //  (NOTE: All forms of Nullable<T> are value types)
            if (!type.IsValueType)
                return true;

            // Report whether TypeToTest is a form of the Nullable<> type
            return type.IsGenericType && type.GetGenericTypeDefinition() == typeof(Nullable<>);
        }

        #endregion
    }
}
