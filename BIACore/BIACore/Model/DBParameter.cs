using System.Data;
using System.Data.SqlClient;

namespace BIACore.Model
{
    public class DBParameter
    {
        public string Name { get; set; }
        public DbType Type { get; set; }
        public object Value { get; set; }

        private DBParameter() { }

        public DBParameter(string name, DbType type, object value)
        {
            Name = name;
            Type = type;
            // check if value is a string; set value to null if it's empty
            Value = value;
        }

        public override string ToString()
        {
            if (null == Value) return string.Format("{0} = null", Name);
            return string.Format("{0} = '{1}'", Name, Value);
        }

        public SqlParameter ToSQLParameter()
        {
            return new SqlParameter(Name, Type) { Value = Value };
        }
    }
}
