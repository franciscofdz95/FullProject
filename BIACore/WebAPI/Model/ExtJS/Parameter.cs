using BIACore.Model;
using System.Collections.Generic;
using System.Data;
using System.Linq;

namespace BIACore.Web.Model.ExtJS
{
    /// <summary>
    /// Base class for an ExtJS store based data request.
    /// Automatically handles 'sort' and 'paging'.
    /// Need to add 'filter' and 'grouping' at some point.
    /// </summary>
    public class Parameter
    {
        public Sorter[] sort { get; set; }

        public int? start { get; set; }
        public int? limit { get; set; }

        public Parameter() { }

        public virtual DBParameter[] ToDBParameter()
        {
            List<DBParameter> args = new List<DBParameter>();

            if (null != start) args.Add(new DBParameter("@start", DbType.Int32, start.Value));
            if (null != limit) args.Add(new DBParameter("@limit", DbType.Int32, limit.Value));
            if (null != sort && sort.Length > 0) args.Add(new DBParameter("@sort", DbType.AnsiString, string.Join<Sorter>(",", sort)));

            return args.ToArray();
        }

        public virtual DBParameter[] ToDBParameterPush(DBParameter[] addOnArgs)
        {
            List<DBParameter> newArgs = new List<DBParameter>();
            DBParameter[] args = this.ToDBParameter();

            newArgs.AddRange(args.ToList<DBParameter>());

            newArgs.AddRange(addOnArgs.ToList<DBParameter>());

            return newArgs.ToArray();            
        }
    }
}
