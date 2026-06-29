using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

using System.Data;

using BIACore.Model;
using extjs = BIACore.Web.Model.ExtJS;

namespace BIASecurity.WebAPI.Model
{
    public class ConnectionSelect : extjs.Parameter
    {
        public string search { get; set; }
        private ConnectionSelect() { }

        public override DBParameter[] ToDBParameter()
        {
            List<DBParameter> args = new List<DBParameter>();

            if (!string.IsNullOrEmpty(search)) args.Add(new DBParameter("@search", DbType.AnsiString, search));

            return args.ToArray();
        }
    }
}
