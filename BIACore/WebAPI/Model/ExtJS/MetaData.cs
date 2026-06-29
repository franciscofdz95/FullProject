using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Reflection;

namespace BIACore.Web.Model.ExtJS
{
    public class Field
    {
        [JsonProperty(PropertyName = "name")]
        public string Name { get; set; }
        [JsonProperty(PropertyName = "type")]
        public string Type { get; set; }
        //[JsonProperty(PropertyName = "useNull", NullValueHandling = NullValueHandling.Ignore)]
        //public bool? UseNull { get; set; }
        [JsonProperty(PropertyName = "dateFormat", NullValueHandling = NullValueHandling.Ignore)]
        public string DateFormat { get; set; }
        [JsonProperty(PropertyName = "allowNull", NullValueHandling = NullValueHandling.Ignore)]
        public bool? AllowNull { get; set; }

        public Field() { }
    }

    /// <summary>
    /// ExtJS supports automatically creating models with a 'metadata' attribute on result sets.
    /// This facilitates the 'metadata' transfer - And if you use BaseController, it's automatically
    /// added (which means not defining models 18 times!)
    /// </summary>
    public class MetaData
    {
        [JsonProperty(PropertyName = "fields")]
        public List<Field> Fields { get; set; }

        public MetaData(DataTable source):this(source,false) { }

        public MetaData(DataTable source, bool AllowNulls)
        {
            if (source == null) { Fields = null; return; }

            Fields = new List<Field>();
            // iterate over columns of source and add to fields.
            foreach (DataColumn dc in source.Columns)
            {
                Fields.Add(new Field()
                {
                    Name = dc.ColumnName,
                    Type = Typify(dc.DataType),
                    AllowNull = null,
                    //UseNull = Nullify(dc.DataType)
                    // until the projector can return a nullable, handle on client side.
                    DateFormat = Formatify(dc.DataType)
                });
                if (AllowNulls) Fields.Last().AllowNull = AllowNulls;
            }
        }

        public MetaData(Type source) : this(source, false) { }

        public MetaData(Type source, bool AllowNulls)
        {
            if (source == null) { Fields = null; return; }

            Fields = new List<Field>();
            // iterate over public properties of type?
            foreach (PropertyInfo p in source.GetProperties())
            {
                if (p.CanRead && p.GetCustomAttributes(typeof(JsonIgnoreAttribute), false).Length < 1)
                    Fields.Add(new Field()
                    {
                        Name = p.Name,
                        Type = Typify(p.PropertyType),
                        AllowNull = null,
                        DateFormat = Formatify(p.PropertyType)
                    });
                if (AllowNulls) Fields.Last().AllowNull = AllowNulls;
            }
        }

        public static string Typify(Type t)
        {
            if (t == null) return "auto";

            switch (t.ToString())
            {
                case "System.Int16":
                case "System.Int32":
                case "System.Int64":
                    return "int";

                case "System.Single":
                case "System.Double":
                case "System.Decimal":
                case "System.Float":
                    return "float";

                case "System.Char":
                case "System.String":
                    return "string";

                case "System.Boolean":
                    return "boolean";

                case "System.DateTime":
                    return "date";

                default:
                    return "auto";
            }
        }

        public static string Formatify(Type t)
        {
            if (t == null) return null;

            switch (t.ToString())
            {
                case "System.DateTime":
                    return "c";

                default:
                    return null;
            }
        }

        //public static bool? Nullify(Type t)
        //{
        //    if (t == null) return null;

        //    switch (t.ToString())
        //    {
        //        case "System.DateTime":
        //            return true;

        //        //case "System.Int16":
        //        //case "System.Int32":
        //        //case "System.Int64":
        //        //case "System.Single":
        //        //case "System.Double":
        //        //case "System.Decimal":
        //        //case "System.Float":
        //        //case "System.Char":
        //        //case "System.String":
        //        //case "System.Boolean":
        //        default:
        //            return null;
        //    }
        //}
    }
}
