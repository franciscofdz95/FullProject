using System;
using System.Collections.Generic;
using System.Data;
using Microsoft.Data.SqlClient;
using System.Data.SqlClient;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Keystone.DAL.Model
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
